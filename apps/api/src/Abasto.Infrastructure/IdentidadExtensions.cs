using Abasto.Application.Common.Abstractions;
using Abasto.Infrastructure.Identity;
using Abasto.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Abasto.Infrastructure;

public static class IdentidadExtensions
{
    public static IServiceCollection AddIdentidad(this IServiceCollection services)
    {
        services.TryAddSingleton(TimeProvider.System);
        services.AddScoped<IAbastoDbContext>(sp => sp.GetRequiredService<AbastoDbContext>());
        services.AddSingleton<IContrasenaHasher, ContrasenaHasher>();
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IEmailSender, CorreoDesarrollo>();
        services.AddScoped<AdminSeeder>();
        return services;
    }
}
