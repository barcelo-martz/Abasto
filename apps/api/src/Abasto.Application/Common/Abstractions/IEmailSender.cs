namespace Abasto.Application.Common.Abstractions;

public interface IEmailSender
{
    Task EnviarVerificacionCorreoAsync(string correo, string nombre, string token, CancellationToken ct);
}
