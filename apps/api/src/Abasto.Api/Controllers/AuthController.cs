using Abasto.Application.Features.Auth.Commands;
using Abasto.Application.Features.Auth.Dtos;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Abasto.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ISender mediador) : ControllerBase
{
    private string? Ip => HttpContext.Connection.RemoteIpAddress?.ToString();
    private string? UserAgent => Request.Headers.UserAgent.ToString();

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType<RegistroRespuesta>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Registro([FromBody] RegistroRequest solicitud, CancellationToken ct)
    {
        var respuesta = await mediador.Send(new RegistrarCiudadanoCommand(
            solicitud.Correo, solicitud.Contrasena, solicitud.Nombres, solicitud.Apellidos,
            solicitud.ProvinciaId, solicitud.MunicipioId), ct);
        return StatusCode(StatusCodes.Status201Created, respuesta);
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerificarCorreo([FromBody] VerificarCorreoRequest solicitud, CancellationToken ct)
    {
        await mediador.Send(new VerificarCorreoCommand(solicitud.Token), ct);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType<AuthRespuesta>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginRequest solicitud, CancellationToken ct) =>
        Ok(await mediador.Send(new LoginCommand(solicitud.Correo, solicitud.Contrasena, Ip, UserAgent), ct));

    [AllowAnonymous]
    [HttpPost("refresh")]
    [ProducesResponseType<AuthRespuesta>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest solicitud, CancellationToken ct) =>
        Ok(await mediador.Send(new RefrescarCommand(solicitud.RefreshToken, Ip, UserAgent), ct));

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshRequest solicitud, CancellationToken ct)
    {
        await mediador.Send(new CerrarSesionCommand(solicitud.RefreshToken), ct);
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new
    {
        id = User.FindFirst("sub")?.Value,
        correo = User.FindFirst("email")?.Value,
        rol = User.FindFirst("rol")?.Value,
        farmaciaId = User.FindFirst("farmaciaId")?.Value,
        almacenId = User.FindFirst("almacenId")?.Value,
        municipioId = User.FindFirst("municipioId")?.Value,
    });
}
