using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Common.Security;

public enum AccionFarmacia { Ver, ModificarInventario, AjustarLimites, EditarDatos }

public sealed class AlcanceService(ICurrentUser usuario, IAbastoDbContext db)
{
    public IQueryable<Farmacia> FarmaciasVisibles() => usuario.Rol switch
    {
        RolUsuario.Administrador => db.Farmacias,
        RolUsuario.SupervisorMunicipal => db.Farmacias.Where(f => f.MunicipioId == usuario.MunicipioId),
        RolUsuario.PersonalFarmacia => db.Farmacias.Where(f => f.Id == usuario.FarmaciaId),
        RolUsuario.PersonalAlmacen => db.Farmacias.Where(f => f.AlmacenId == usuario.AlmacenId),
        _ => db.Farmacias.Where(_ => false),
    };

    public async Task<bool> PuedeAsync(AccionFarmacia accion, Guid farmaciaId, CancellationToken ct)
    {
        switch (usuario.Rol)
        {
            case RolUsuario.Administrador:
                return accion is AccionFarmacia.Ver or AccionFarmacia.EditarDatos;

            case RolUsuario.PersonalFarmacia:
                return usuario.FarmaciaId == farmaciaId
                    && (accion is AccionFarmacia.Ver or AccionFarmacia.ModificarInventario or AccionFarmacia.EditarDatos);

            case RolUsuario.SupervisorMunicipal:
                if (accion is not (AccionFarmacia.Ver or AccionFarmacia.AjustarLimites) || usuario.MunicipioId is null)
                    return false;
                return await db.Farmacias.AnyAsync(
                    f => f.Id == farmaciaId && f.MunicipioId == usuario.MunicipioId, ct);

            case RolUsuario.PersonalAlmacen:
                if (accion != AccionFarmacia.Ver || usuario.AlmacenId is null) return false;
                return await db.Farmacias.AnyAsync(
                    f => f.Id == farmaciaId && f.AlmacenId == usuario.AlmacenId, ct);

            default:
                return false;
        }
    }

    public async Task AsegurarAsync(AccionFarmacia accion, Guid farmaciaId, CancellationToken ct)
    {
        if (!await PuedeAsync(accion, farmaciaId, ct))
            throw new ProhibidoException("No tienes permiso para esta operación sobre la farmacia.");
    }

    public bool PuedeAccederAlmacen(Guid almacenId) =>
        usuario.Rol == RolUsuario.Administrador
        || (usuario.Rol == RolUsuario.PersonalAlmacen && usuario.AlmacenId == almacenId);
}
