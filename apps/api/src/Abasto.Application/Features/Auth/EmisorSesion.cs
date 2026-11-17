using Abasto.Application.Common.Abstractions;
using Abasto.Application.Features.Auth.Dtos;
using Abasto.Domain.Entities;

namespace Abasto.Application.Features.Auth;

public sealed class EmisorSesion(IAbastoDbContext db, ITokenService tokens, TimeProvider reloj)
{
    public AuthRespuesta Emitir(Usuario usuario, string? ip, string? userAgent)
    {
        var acceso = tokens.GenerarAccessToken(usuario);
        var refresh = tokens.GenerarTokenOpaco();

        db.RefreshTokens.Add(new RefreshToken
        {
            UsuarioId = usuario.Id,
            TokenHash = refresh.Hash,
            ExpiraEn = reloj.GetUtcNow().UtcDateTime + tokens.DuracionRefresh,
            Ip = Recortar(ip, 45),
            UserAgent = Recortar(userAgent, 300),
        });

        return new AuthRespuesta(acceso.Valor, acceso.ExpiraEn, refresh.Valor, UsuarioSesionDto.De(usuario));
    }

    private static string? Recortar(string? texto, int max) =>
        texto is null ? null : texto.Length <= max ? texto : texto[..max];
}
