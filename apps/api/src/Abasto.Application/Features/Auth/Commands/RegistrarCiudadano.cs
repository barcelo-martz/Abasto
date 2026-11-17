using Abasto.Application.Common.Abstractions;
using Abasto.Application.Features.Auth.Dtos;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record RegistrarCiudadanoCommand(
    string Correo, string Contrasena, string Nombres, string Apellidos, Guid ProvinciaId, Guid MunicipioId)
    : IRequest<RegistroRespuesta>;

public sealed class RegistrarCiudadanoValidator : AbstractValidator<RegistrarCiudadanoCommand>
{
    public RegistrarCiudadanoValidator()
    {
        RuleFor(x => x.Correo).NotEmpty().WithMessage("El correo es obligatorio.")
            .EmailAddress().WithMessage("Escribe un correo válido.")
            .MaximumLength(254).WithMessage("El correo es demasiado largo.");
        RuleFor(x => x.Contrasena).NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.")
            .MaximumLength(100).WithMessage("La contraseña es demasiado larga.")
            .Matches(@"\p{L}").WithMessage("La contraseña debe incluir al menos una letra.")
            .Matches(@"[0-9]").WithMessage("La contraseña debe incluir al menos un número.");
        RuleFor(x => x.Nombres).NotEmpty().WithMessage("Los nombres son obligatorios.").MaximumLength(100);
        RuleFor(x => x.Apellidos).NotEmpty().WithMessage("Los apellidos son obligatorios.").MaximumLength(100);
        RuleFor(x => x.ProvinciaId).NotEmpty().WithMessage("Selecciona una provincia.");
        RuleFor(x => x.MunicipioId).NotEmpty().WithMessage("Selecciona un municipio.");
    }
}

public sealed class RegistrarCiudadanoHandler(
    IAbastoDbContext db, IContrasenaHasher hasher, ITokenService tokens, IEmailSender correo, TimeProvider reloj)
    : IRequestHandler<RegistrarCiudadanoCommand, RegistroRespuesta>
{
    public async Task<RegistroRespuesta> Handle(RegistrarCiudadanoCommand cmd, CancellationToken ct)
    {
        var email = cmd.Correo.Trim().ToLowerInvariant();

        if (await db.Usuarios.AnyAsync(u => u.Correo == email, ct))
            throw new Common.Excepciones.ConflictoException("Ya existe una cuenta con ese correo.");

        var municipioValido = await db.Municipios
            .AnyAsync(m => m.Id == cmd.MunicipioId && m.ProvinciaId == cmd.ProvinciaId, ct);
        if (!municipioValido)
            throw new ValidationException([new ValidationFailure(nameof(cmd.MunicipioId),
                "El municipio no pertenece a la provincia seleccionada.")]);

        var ahora = reloj.GetUtcNow().UtcDateTime;
        var usuario = new Usuario
        {
            Correo = email,
            ContrasenaHash = hasher.Hash(cmd.Contrasena),
            Nombres = cmd.Nombres.Trim(),
            Apellidos = cmd.Apellidos.Trim(),
            Rol = RolUsuario.Ciudadano,
            Estado = EstadoUsuario.PendienteVerificacion,
            ProvinciaId = cmd.ProvinciaId,
            MunicipioId = cmd.MunicipioId,
        };
        var token = tokens.GenerarTokenOpaco();

        db.Usuarios.Add(usuario);
        db.TokensUsuario.Add(new TokenUsuario
        {
            UsuarioId = usuario.Id,
            Tipo = TipoTokenUsuario.VerificacionCorreo,
            TokenHash = token.Hash,
            ExpiraEn = ahora.AddHours(24),
        });
        db.AuditLogs.Add(new AuditLog
        {
            UsuarioId = usuario.Id,
            Accion = "USUARIO_REGISTRADO",
            Entidad = nameof(Usuario),
            EntidadId = usuario.Id,
        });
        await db.SaveChangesAsync(ct);

        await correo.EnviarVerificacionCorreoAsync(usuario.Correo, usuario.Nombres, token.Valor, ct);
        return new RegistroRespuesta(usuario.Id, RequiereVerificacion: true);
    }
}
