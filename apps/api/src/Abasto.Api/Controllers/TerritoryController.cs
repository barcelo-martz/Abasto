using Abasto.Application.Features.Territory;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Abasto.Api.Controllers;

[ApiController]
[Route("api/provinces")]
public class TerritoryController(ISender mediador) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    [ResponseCache(Duration = 3600)]
    [ProducesResponseType<List<ProvinciaDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Provincias(CancellationToken ct) =>
        Ok(await mediador.Send(new ListarProvinciasQuery(), ct));

    [AllowAnonymous]
    [HttpGet("{provinciaId:guid}/municipalities")]
    [ResponseCache(Duration = 3600)]
    [ProducesResponseType<List<MunicipioDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Municipios(Guid provinciaId, CancellationToken ct) =>
        Ok(await mediador.Send(new ListarMunicipiosQuery(provinciaId), ct));
}
