using Abasto.Application.Common.Abstractions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Abasto.Infrastructure.Identity;

public sealed class CorreoDesarrollo(ILogger<CorreoDesarrollo> logger, IConfiguration config) : IEmailSender
{
    public Task EnviarVerificacionCorreoAsync(string correo, string nombre, string token, CancellationToken ct)
    {
        var web = config["Frontend:WebUrl"] ?? "http://localhost:3000";
        logger.LogInformation("Verificación de correo para {Correo}: {Web}/verificar-correo?token={Token}",
            correo, web, token);
        return Task.CompletedTask;
    }

    public Task EnviarRecuperacionContrasenaAsync(string correo, string nombre, string token, CancellationToken ct)
    {
        var web = config["Frontend:WebUrl"] ?? "http://localhost:3000";
        logger.LogInformation("Recuperación de contraseña para {Correo}: {Web}/restablecer?token={Token}",
            correo, web, token);
        return Task.CompletedTask;
    }
}
