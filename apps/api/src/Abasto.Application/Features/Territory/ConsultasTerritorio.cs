using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Territory;

public sealed record ProvinciaDto(Guid Id, string Nombre, string Codigo);
public sealed record MunicipioDto(Guid Id, Guid ProvinciaId, string Nombre, string Codigo);

public sealed record ListarProvinciasQuery : IRequest<List<ProvinciaDto>>;

public sealed class ListarProvinciasHandler(IAbastoDbContext db)
    : IRequestHandler<ListarProvinciasQuery, List<ProvinciaDto>>
{
    public Task<List<ProvinciaDto>> Handle(ListarProvinciasQuery q, CancellationToken ct) =>
        db.Provincias.AsNoTracking()
            .OrderBy(p => p.Nombre)
            .Select(p => new ProvinciaDto(p.Id, p.Nombre, p.Codigo))
            .ToListAsync(ct);
}

public sealed record ListarMunicipiosQuery(Guid ProvinciaId) : IRequest<List<MunicipioDto>>;

public sealed class ListarMunicipiosHandler(IAbastoDbContext db)
    : IRequestHandler<ListarMunicipiosQuery, List<MunicipioDto>>
{
    public async Task<List<MunicipioDto>> Handle(ListarMunicipiosQuery q, CancellationToken ct)
    {
        if (!await db.Provincias.AnyAsync(p => p.Id == q.ProvinciaId, ct))
            throw new NoEncontradoException("La provincia no existe.");

        return await db.Municipios.AsNoTracking()
            .Where(m => m.ProvinciaId == q.ProvinciaId)
            .OrderBy(m => m.Nombre)
            .Select(m => new MunicipioDto(m.Id, m.ProvinciaId, m.Nombre, m.Codigo))
            .ToListAsync(ct);
    }
}
