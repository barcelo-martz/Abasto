using Abasto.Application.Common.Security;
using Abasto.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Farmacias;

public sealed record FarmaciaResumenDto(Guid Id, string Codigo, string Nombre, Guid MunicipioId, EstadoUnidad Estado);

public sealed record ListarFarmaciasVisiblesQuery : IRequest<List<FarmaciaResumenDto>>;

public sealed class ListarFarmaciasVisiblesHandler(AlcanceService alcance)
    : IRequestHandler<ListarFarmaciasVisiblesQuery, List<FarmaciaResumenDto>>
{
    public Task<List<FarmaciaResumenDto>> Handle(ListarFarmaciasVisiblesQuery q, CancellationToken ct) =>
        alcance.FarmaciasVisibles().AsNoTracking()
            .OrderBy(f => f.Nombre)
            .Select(f => new FarmaciaResumenDto(f.Id, f.Codigo, f.Nombre, f.MunicipioId, f.Estado))
            .ToListAsync(ct);
}
