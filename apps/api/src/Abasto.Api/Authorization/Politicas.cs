using Abasto.Domain.Common;
using Abasto.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace Abasto.Api.Authorization;

public static class Politicas
{
    public const string Administrador = "Administrador";
    public const string PersonalFarmacia = "PersonalFarmacia";
    public const string PersonalAlmacen = "PersonalAlmacen";
    public const string SupervisorMunicipal = "SupervisorMunicipal";
    public const string PersonalPanel = "PersonalPanel";
    public const string Ciudadano = "Ciudadano";

    public static void Registrar(AuthorizationOptions o)
    {
        var admin = EnumTexto.De(RolUsuario.Administrador);
        var farmacia = EnumTexto.De(RolUsuario.PersonalFarmacia);
        var almacen = EnumTexto.De(RolUsuario.PersonalAlmacen);
        var supervisor = EnumTexto.De(RolUsuario.SupervisorMunicipal);

        o.AddPolicy(Administrador, p => p.RequireRole(admin));
        o.AddPolicy(PersonalFarmacia, p => p.RequireRole(farmacia).RequireClaim("farmaciaId"));
        o.AddPolicy(PersonalAlmacen, p => p.RequireRole(almacen).RequireClaim("almacenId"));
        o.AddPolicy(SupervisorMunicipal, p => p.RequireRole(supervisor).RequireClaim("municipioId"));
        o.AddPolicy(PersonalPanel, p => p.RequireRole(admin, farmacia, almacen, supervisor));
        o.AddPolicy(Ciudadano, p => p.RequireRole(EnumTexto.De(RolUsuario.Ciudadano)));
    }
}
