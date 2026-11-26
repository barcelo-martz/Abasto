using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record SolicitarRecuperacionContrasenaCommand(string Correo) : IRequest;

public sealed class SolicitarRecuperacionContrasenaValidator
    : AbstractValidator<SolicitarRecuperacionContrasenaCommand>
{
    public SolicitarRecuperacionContrasenaValidator()
    {
        RuleFor(x => x.Correo).NotEmpty().WithMessage("El correo es obligatorio.")
            .EmailAddress().WithMessage("Escribe un correo válido.")
            .MaximumLength(254).WithMessage("El correo es demasiado largo.");
    }
}

public sealed class SolicitarRecuperacionContrasenaHandler(
    IAbastoDbContext db, ITokenService tokens, IEmailSender correo, TimeProvider reloj)
    : IRequestHandler<SolicitarRecuperacionContrasenaCommand>
{
    public async Task Handle(SolicitarRecuperacionContrasenaCommand cmd, CancellationToken ct)
    {
        var email = cmd.Correo.Trim().ToLowerInvariant();
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == email, ct);
        if (usuario is null)
            return;

        var ahora = reloj.GetUtcNow().UtcDateTime;
        var anteriores = await db.TokensUsuario
            .Where(t => t.UsuarioId == usuario.Id
                && t.Tipo == TipoTokenUsuario.RecuperacionContrasena
                && t.UsadoEn == null)
            .ToListAsync(ct);
        foreach (var tokenAnterior in anteriores)
            tokenAnterior.UsadoEn = ahora;

        var token = tokens.GenerarTokenOpaco();
        db.TokensUsuario.Add(new TokenUsuario
        {
            UsuarioId = usuario.Id,
            Tipo = TipoTokenUsuario.RecuperacionContrasena,
            TokenHash = token.Hash,
            ExpiraEn = ahora.AddMinutes(15),
        });
        await db.SaveChangesAsync(ct);
        await correo.EnviarRecuperacionContrasenaAsync(
            usuario.Correo, usuario.Nombres, token.Valor, ct);
    }
}

public sealed record RestablecerContrasenaCommand(string Token, string Contrasena) : IRequest;

public sealed class RestablecerContrasenaValidator : AbstractValidator<RestablecerContrasenaCommand>
{
    public RestablecerContrasenaValidator()
    {
        RuleFor(x => x.Token).NotEmpty().WithMessage("El enlace de recuperación no es válido.");
        RuleFor(x => x.Contrasena).NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres.")
            .MaximumLength(50).WithMessage("La contraseña es demasiado larga.")
            .Matches(@"\p{L}").WithMessage("La contraseña debe incluir al menos una letra.")
            .Matches(@"[0-9]").WithMessage("La contraseña debe incluir al menos un número.");
    }
}

public sealed class RestablecerContrasenaHandler(
    IAbastoDbContext db, ITokenService tokens, IContrasenaHasher hasher, TimeProvider reloj)
    : IRequestHandler<RestablecerContrasenaCommand>
{
    public async Task Handle(RestablecerContrasenaCommand cmd, CancellationToken ct)
    {
        var ahora = reloj.GetUtcNow().UtcDateTime;
        var registro = await db.TokensUsuario.Include(t => t.Usuario)
            .FirstOrDefaultAsync(t => t.TokenHash == tokens.Hash(cmd.Token)
                && t.Tipo == TipoTokenUsuario.RecuperacionContrasena, ct);

        if (registro is null || registro.UsadoEn is not null || registro.ExpiraEn <= ahora)
            throw new ValidationException([
                new ValidationFailure("token", "El enlace no es válido o ya caducó. Solicita uno nuevo.")
            ]);

        registro.UsadoEn = ahora;
        registro.Usuario.ContrasenaHash = hasher.Hash(cmd.Contrasena);
        registro.Usuario.IntentosFallidos = 0;
        registro.Usuario.BloqueadoHasta = null;

        var otrosTokens = await db.TokensUsuario
            .Where(t => t.UsuarioId == registro.UsuarioId
                && t.Tipo == TipoTokenUsuario.RecuperacionContrasena
                && t.UsadoEn == null
                && t.Id != registro.Id)
            .ToListAsync(ct);
        foreach (var token in otrosTokens)
            token.UsadoEn = ahora;

        var sesionesActivas = await db.RefreshTokens
            .Where(r => r.UsuarioId == registro.UsuarioId && r.RevocadoEn == null)
            .ToListAsync(ct);
        foreach (var sesion in sesionesActivas)
            sesion.RevocadoEn = ahora;

        db.AuditLogs.Add(new AuditLog
        {
            UsuarioId = registro.UsuarioId,
            Accion = "CONTRASENA_RESTABLECIDA",
            Entidad = nameof(Usuario),
            EntidadId = registro.UsuarioId,
        });
        await db.SaveChangesAsync(ct);
    }
}
