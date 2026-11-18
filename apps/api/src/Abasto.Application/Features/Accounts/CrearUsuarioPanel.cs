using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Accounts;

public sealed record CrearUsuarioPanelRequest(
    string Correo, string ContrasenaTemporal, string Nombres, string Apellidos,
    RolUsuario Rol, Guid? FarmaciaId, Guid? AlmacenId, Guid? MunicipioId);

public sealed record UsuarioAdminDto(
    Guid Id, string Correo, string Nombres, string Apellidos, RolUsuario Rol, EstadoUsuario Estado,
    Guid? FarmaciaId, Guid? AlmacenId, Guid? MunicipioId);

public sealed record CrearUsuarioPanelCommand(
    string Correo, string ContrasenaTemporal, string Nombres, string Apellidos,
    RolUsuario Rol, Guid? FarmaciaId, Guid? AlmacenId, Guid? MunicipioId) : IRequest<UsuarioAdminDto>;

public sealed class CrearUsuarioPanelValidator : AbstractValidator<CrearUsuarioPanelCommand>
{
    public CrearUsuarioPanelValidator()
    {
        RuleFor(x => x.Correo).NotEmpty().EmailAddress().MaximumLength(254)
            .WithMessage("Escribe un correo válido.");
        RuleFor(x => x.ContrasenaTemporal).NotEmpty().MinimumLength(8).MaximumLength(100)
            .Matches(@"\p{L}").Matches(@"[0-9]")
            .WithMessage("La contraseña debe tener al menos 8 caracteres, con letras y números.");
        RuleFor(x => x.Nombres).NotEmpty().MaximumLength(100).WithMessage("Los nombres son obligatorios.");
        RuleFor(x => x.Apellidos).NotEmpty().MaximumLength(100).WithMessage("Los apellidos son obligatorios.");
        RuleFor(x => x.Rol).Must(r => r != RolUsuario.Ciudadano)
            .WithMessage("Aquí solo se crean cuentas del panel.");

        RuleFor(x => x.FarmaciaId).NotNull().When(x => x.Rol == RolUsuario.PersonalFarmacia)
            .WithMessage("Indica la farmacia de esta cuenta.");
        RuleFor(x => x.FarmaciaId).Null().When(x => x.Rol != RolUsuario.PersonalFarmacia)
            .WithMessage("Solo las cuentas de farmacia llevan farmacia.");
        RuleFor(x => x.AlmacenId).NotNull().When(x => x.Rol == RolUsuario.PersonalAlmacen)
            .WithMessage("Indica el almacén de esta cuenta.");
        RuleFor(x => x.AlmacenId).Null().When(x => x.Rol != RolUsuario.PersonalAlmacen)
            .WithMessage("Solo las cuentas de almacén llevan almacén.");
        RuleFor(x => x.MunicipioId).NotNull().When(x => x.Rol == RolUsuario.SupervisorMunicipal)
            .WithMessage("Indica el municipio que supervisa.");
        RuleFor(x => x.MunicipioId).Null().When(x => x.Rol != RolUsuario.SupervisorMunicipal)
            .WithMessage("Solo los supervisores llevan municipio.");
    }
}

public sealed class CrearUsuarioPanelHandler(IAbastoDbContext db, IContrasenaHasher hasher, ICurrentUser actual)
    : IRequestHandler<CrearUsuarioPanelCommand, UsuarioAdminDto>
{
    public async Task<UsuarioAdminDto> Handle(CrearUsuarioPanelCommand cmd, CancellationToken ct)
    {
        var email = cmd.Correo.Trim().ToLowerInvariant();
        if (await db.Usuarios.AnyAsync(u => u.Correo == email, ct))
            throw new ConflictoException("Ya existe una cuenta con ese correo.");

        switch (cmd.Rol)
        {
            case RolUsuario.PersonalFarmacia:
                if (!await db.Farmacias.AnyAsync(f => f.Id == cmd.FarmaciaId, ct))
                    throw Invalido("farmaciaId", "La farmacia no existe.");
                if (await db.Usuarios.AnyAsync(
                        u => u.Rol == RolUsuario.PersonalFarmacia && u.FarmaciaId == cmd.FarmaciaId, ct))
                    throw new ConflictoException("Esa farmacia ya tiene una cuenta de personal.");
                break;
            case RolUsuario.PersonalAlmacen:
                if (!await db.Almacenes.AnyAsync(a => a.Id == cmd.AlmacenId, ct))
                    throw Invalido("almacenId", "El almacén no existe.");
                break;
            case RolUsuario.SupervisorMunicipal:
                if (!await db.Municipios.AnyAsync(m => m.Id == cmd.MunicipioId, ct))
                    throw Invalido("municipioId", "El municipio no existe.");
                break;
        }

        var usuario = new Usuario
        {
            Correo = email,
            ContrasenaHash = hasher.Hash(cmd.ContrasenaTemporal),
            Nombres = cmd.Nombres.Trim(),
            Apellidos = cmd.Apellidos.Trim(),
            Rol = cmd.Rol,
            Estado = EstadoUsuario.Activo,
            FarmaciaId = cmd.FarmaciaId,
            AlmacenId = cmd.AlmacenId,
            MunicipioId = cmd.MunicipioId,
        };
        db.Usuarios.Add(usuario);
        db.AuditLogs.Add(new AuditLog
        {
            UsuarioId = actual.Id,
            Accion = "USUARIO_CREADO_POR_ADMIN",
            Entidad = nameof(Usuario),
            EntidadId = usuario.Id,
        });
        await db.SaveChangesAsync(ct);

        return new UsuarioAdminDto(usuario.Id, usuario.Correo, usuario.Nombres, usuario.Apellidos,
            usuario.Rol, usuario.Estado, usuario.FarmaciaId, usuario.AlmacenId, usuario.MunicipioId);
    }

    private static ValidationException Invalido(string campo, string mensaje) =>
        new([new ValidationFailure(campo, mensaje)]);
}
