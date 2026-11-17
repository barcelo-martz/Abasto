namespace Abasto.Infrastructure.Identity;

public sealed class JwtOptions
{
    public const string Seccion = "Jwt";
    public string Issuer { get; set; } = "abasto-api";
    public string Audience { get; set; } = "abasto";
    public string Key { get; set; } = "";
    public int AccessTokenMinutos { get; set; } = 15;
    public int RefreshTokenDias { get; set; } = 7;
}
