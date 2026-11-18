using Abasto.Api.Authorization;
using Abasto.Application.Features.Farmacias;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Abasto.Api.Controllers;

[ApiController]
[Route("api/panel/pharmacy")]
[Authorize(Policy = Politicas.PersonalPanel)]
public class PharmacyController(ISender mediador) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<List<FarmaciaResumenDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(CancellationToken ct) =>
        Ok(await mediador.Send(new ListarFarmaciasVisiblesQuery(), ct));
}
