using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;
using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Common;
using Abasto.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Abasto.Infrastructure.Identity;

public sealed class JwtTokenService(IOptions<JwtOptions> opciones, TimeProvider reloj) : ITokenService
{
    private readonly JwtOptions _o = opciones.Value;

    public TimeSpan DuracionRefresh => TimeSpan.FromDays(_o.RefreshTokenDias);

    public TokenAcceso GenerarAccessToken(Usuario u)
    {
        var ahora = reloj.GetUtcNow().UtcDateTime;
        var expira = ahora.AddMinutes(_o.AccessTokenMinutos);

        var claims = new Dictionary<string, object>
        {
            [JwtRegisteredClaimNames.Sub] = u.Id.ToString(),
            [JwtRegisteredClaimNames.Email] = u.Correo,
            ["nombre"] = $"{u.Nombres} {u.Apellidos}",
            ["rol"] = EnumTexto.De(u.Rol),
        };
        if (u.ProvinciaId is { } provincia) claims["provinciaId"] = provincia.ToString();
        if (u.MunicipioId is { } municipio) claims["municipioId"] = municipio.ToString();
        if (u.FarmaciaId is { } farmacia) claims["farmaciaId"] = farmacia.ToString();
        if (u.AlmacenId is { } almacen) claims["almacenId"] = almacen.ToString();

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = _o.Issuer,
            Audience = _o.Audience,
            Claims = claims,
            NotBefore = ahora,
            Expires = expira,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_o.Key)), SecurityAlgorithms.HmacSha256),
        };

        return new TokenAcceso(new JsonWebTokenHandler().CreateToken(descriptor), expira);
    }

    public TokenOpaco GenerarTokenOpaco()
    {
        var valor = Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(48));
        return new TokenOpaco(valor, Hash(valor));
    }

    public string Hash(string valor) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(valor)));
}
