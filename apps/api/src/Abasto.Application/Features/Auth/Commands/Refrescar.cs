using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Application.Features.Auth.Dtos;
using Abasto.Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record RefrescarCommand(string RefreshToken, string? Ip, string? UserAgent) : IRequest<AuthRespuesta>;

public sealed class RefrescarValidator : AbstractValidator<RefrescarCommand>
{
    public RefrescarValidator() => RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("Falta el token de sesión.");
}

public sealed class RefrescarHandler(IAbastoDbContext db, ITokenService tokens, EmisorSesion sesion, TimeProvider reloj)
    : IRequestHandler<RefrescarCommand, AuthRespuesta>
{
    private const string SesionInvalida = "La sesión no es válida. Inicia sesión de nuevo.";

    public async Task<AuthRespuesta> Handle(RefrescarCommand cmd, CancellationToken ct)
    {
        var hash = tokens.Hash(cmd.RefreshToken);
        var ahora = reloj.GetUtcNow().UtcDateTime;

        var actual = await db.RefreshTokens.Include(r => r.Usuario)
            .FirstOrDefaultAsync(r => r.TokenHash == hash, ct);
        if (actual is null) throw new NoAutorizadoException(SesionInvalida);

        if (actual.RevocadoEn is not null)
        {
            var activos = await db.RefreshTokens
                .Where(r => r.UsuarioId == actual.UsuarioId && r.RevocadoEn == null).ToListAsync(ct);
            foreach (var r in activos) r.RevocadoEn = ahora;
            await db.SaveChangesAsync(ct);
            throw new NoAutorizadoException(SesionInvalida);
        }

        if (actual.ExpiraEn <= ahora || actual.Usuario.Estado != EstadoUsuario.Activo)
            throw new NoAutorizadoException(SesionInvalida);

        actual.RevocadoEn = ahora;
        var respuesta = sesion.Emitir(actual.Usuario, cmd.Ip, cmd.UserAgent);
        await db.SaveChangesAsync(ct);
        return respuesta;
    }
}
