using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Application.Features.Auth.Dtos;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record LoginCommand(string Correo, string Contrasena, string? Ip, string? UserAgent)
    : IRequest<AuthRespuesta>;

public sealed class LoginValidator : AbstractValidator<LoginCommand>
{
    public LoginValidator()
    {
        RuleFor(x => x.Correo).NotEmpty().WithMessage("El correo es obligatorio.");
        RuleFor(x => x.Contrasena).NotEmpty().WithMessage("La contraseña es obligatoria.");
    }
}

public sealed class LoginHandler(
    IAbastoDbContext db, IContrasenaHasher hasher, EmisorSesion sesion, TimeProvider reloj)
    : IRequestHandler<LoginCommand, AuthRespuesta>
{
    private const string Credenciales = "Correo o contraseña incorrectos.";

    public async Task<AuthRespuesta> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var email = cmd.Correo.Trim().ToLowerInvariant();
        var ahora = reloj.GetUtcNow().UtcDateTime;
        var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Correo == email, ct);

        if (usuario is null)
        {
            hasher.Hash(cmd.Contrasena);
            throw new NoAutorizadoException(Credenciales);
        }

        if (usuario.BloqueadoHasta > ahora)
        {
            var minutos = (int)Math.Ceiling((usuario.BloqueadoHasta.Value - ahora).TotalMinutes);
            throw new CuentaBloqueadaException(
                $"Demasiados intentos fallidos. Intenta de nuevo en {minutos} minuto(s).");
        }

        var resultado = hasher.Verificar(usuario.ContrasenaHash, cmd.Contrasena);
        if (resultado == ResultadoVerificacion.Fallida)
        {
            var maximo = await db.ObtenerEnteroAsync("auth.maxIntentosFallidos", 5, ct);
            var minutosBloqueo = await db.ObtenerEnteroAsync("auth.minutosBloqueo", 15, ct);

            usuario.IntentosFallidos++;
            if (usuario.IntentosFallidos >= maximo)
            {
                usuario.BloqueadoHasta = ahora.AddMinutes(minutosBloqueo);
                usuario.IntentosFallidos = 0;
                db.AuditLogs.Add(new AuditLog
                {
                    UsuarioId = usuario.Id,
                    Accion = "CUENTA_BLOQUEADA",
                    Entidad = nameof(Usuario),
                    EntidadId = usuario.Id,
                });
            }
            await db.SaveChangesAsync(ct);
            throw new NoAutorizadoException(Credenciales);
        }

        switch (usuario.Estado)
        {
            case EstadoUsuario.PendienteVerificacion:
                throw new ProhibidoException("Debes verificar tu correo antes de iniciar sesión.");
            case EstadoUsuario.Bloqueado or EstadoUsuario.Inactivo:
                throw new ProhibidoException("Tu cuenta no está activa. Contacta al administrador.");
        }

        if (resultado == ResultadoVerificacion.CorrectaRequiereRehash)
            usuario.ContrasenaHash = hasher.Hash(cmd.Contrasena);

        usuario.IntentosFallidos = 0;
        usuario.BloqueadoHasta = null;
        usuario.UltimoAccesoEn = ahora;

        var respuesta = sesion.Emitir(usuario, cmd.Ip, cmd.UserAgent);
        await db.SaveChangesAsync(ct);
        return respuesta;
    }
}
