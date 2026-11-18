using Abasto.Api.Authorization;
using Abasto.Application.Features.Accounts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Abasto.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Policy = Politicas.Administrador)]
public class AdminController(ISender mediador) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<UsuarioAdminDto>(StatusCodes.Status201Created)]
    public async Task<IActionResult> Crear(CrearUsuarioPanelRequest s, CancellationToken ct)
    {
        var usuario = await mediador.Send(new CrearUsuarioPanelCommand(
            s.Correo, s.ContrasenaTemporal, s.Nombres, s.Apellidos,
            s.Rol, s.FarmaciaId, s.AlmacenId, s.MunicipioId), ct);
        return StatusCode(StatusCodes.Status201Created, usuario);
    }
}
