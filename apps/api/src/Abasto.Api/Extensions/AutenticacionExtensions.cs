using System.Text;
using Abasto.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Abasto.Api.Extensions;

public static class AutenticacionExtensions
{
    public static IServiceCollection AddAutenticacionJwt(this IServiceCollection services, IConfiguration config)
    {
        services.AddOptions<JwtOptions>()
            .Bind(config.GetSection(JwtOptions.Seccion))
            .Validate(o => o.Key.Length >= 32, "Jwt:Key debe tener al menos 32 caracteres.")
            .ValidateOnStart();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme)
            .Configure<IOptions<JwtOptions>>((opciones, jwt) =>
            {
                var j = jwt.Value;
                opciones.MapInboundClaims = false;
                opciones.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = j.Issuer,
                    ValidateAudience = true,
                    ValidAudience = j.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30),
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(j.Key)),
                    NameClaimType = "sub",
                    RoleClaimType = "rol",
                };
            });
        services.AddAuthorization();
        return services;
    }
}
