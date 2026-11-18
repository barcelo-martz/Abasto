using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Application.Common.Security;
using Abasto.Application.Features.Accounts;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Identity;
using Abasto.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace Abasto.IntegrationTests;

internal sealed class UsuarioFalso : ICurrentUser
{
    public bool EstaAutenticado => Rol is not null;
    public Guid? Id { get; init; } = Guid.NewGuid();
    public RolUsuario? Rol { get; init; }
    public Guid? ProvinciaId { get; init; }
    public Guid? MunicipioId { get; init; }
    public Guid? FarmaciaId { get; init; }
    public Guid? AlmacenId { get; init; }
}

[Collection(BaseDatosColeccion.Nombre)]
public class AlcanceFarmaciaTests(BaseDatosFixture bd)
{
    private static string S() => Guid.NewGuid().ToString("N")[..8];

    private static Farmacia NuevaFarmacia(string s, Guid municipioId, Guid? almacenId) => new()
    {
        Codigo = $"F-{s}",
        Nombre = $"Farmacia {s}",
        Direccion = "Calle 1",
        MunicipioId = municipioId,
        AlmacenId = almacenId,
        Ubicacion = new Point(-82.38, 23.13) { SRID = 4326 },
        TipoPropiedad = TipoPropiedadFarmacia.Estatal,
        Estado = EstadoUnidad.Activa,
    };

    private async Task<(Guid A, Guid B, Guid Almacen, Guid MunA)> Preparar()
    {
        var s = S();
        var munA = TerritorioSeed.Municipios()[0].Id;
        var munB = TerritorioSeed.Municipios()[1].Id;

        await using var db = bd.CrearContexto();
        var almacen = new Almacen
        {
            Codigo = $"AL-{s}",
            Nombre = $"Almacén {s}",
            Direccion = "Calle 2",
            ProvinciaId = TerritorioSeed.Provincias()[0].Id,
            Estado = EstadoUnidad.Activa,
        };
        var a = NuevaFarmacia($"{s}a", munA, almacen.Id);
        var b = NuevaFarmacia($"{s}b", munB, null);
        db.AddRange(almacen, a, b);
        await db.SaveChangesAsync();
        return (a.Id, b.Id, almacen.Id, munA);
    }

    private async Task<bool> Puede(UsuarioFalso usuario, AccionFarmacia accion, Guid farmaciaId)
    {
        await using var db = bd.CrearContexto();
        return await new AlcanceService(usuario, db).PuedeAsync(accion, farmaciaId, default);
    }

    [Fact]
    public async Task Personal_de_farmacia_solo_opera_sobre_su_farmacia()
    {
        var p = await Preparar();
        var u = new UsuarioFalso { Rol = RolUsuario.PersonalFarmacia, FarmaciaId = p.A };

        Assert.True(await Puede(u, AccionFarmacia.Ver, p.A));
        Assert.True(await Puede(u, AccionFarmacia.ModificarInventario, p.A));
        Assert.False(await Puede(u, AccionFarmacia.Ver, p.B));
        Assert.False(await Puede(u, AccionFarmacia.ModificarInventario, p.B));
        Assert.False(await Puede(u, AccionFarmacia.AjustarLimites, p.A));
    }

    [Fact]
    public async Task Supervisor_ve_y_ajusta_limites_solo_en_su_municipio()
    {
        var p = await Preparar();
        var u = new UsuarioFalso { Rol = RolUsuario.SupervisorMunicipal, MunicipioId = p.MunA };

        Assert.True(await Puede(u, AccionFarmacia.Ver, p.A));
        Assert.True(await Puede(u, AccionFarmacia.AjustarLimites, p.A));
        Assert.False(await Puede(u, AccionFarmacia.Ver, p.B));
        Assert.False(await Puede(u, AccionFarmacia.ModificarInventario, p.A));
    }

    [Fact]
    public async Task Personal_de_almacen_solo_ve_las_farmacias_que_abastece()
    {
        var p = await Preparar();
        var u = new UsuarioFalso { Rol = RolUsuario.PersonalAlmacen, AlmacenId = p.Almacen };

        Assert.True(await Puede(u, AccionFarmacia.Ver, p.A));
        Assert.False(await Puede(u, AccionFarmacia.Ver, p.B));
        Assert.False(await Puede(u, AccionFarmacia.ModificarInventario, p.A));
    }

    [Fact]
    public async Task Administrador_ve_todo_pero_no_modifica_inventarios()
    {
        var p = await Preparar();
        var u = new UsuarioFalso { Rol = RolUsuario.Administrador };

        Assert.True(await Puede(u, AccionFarmacia.Ver, p.A));
        Assert.True(await Puede(u, AccionFarmacia.Ver, p.B));
        Assert.True(await Puede(u, AccionFarmacia.EditarDatos, p.B));
        Assert.False(await Puede(u, AccionFarmacia.ModificarInventario, p.A));
    }

    [Fact]
    public async Task Ciudadano_y_anonimo_no_tienen_acceso_al_panel()
    {
        var p = await Preparar();

        Assert.False(await Puede(new UsuarioFalso { Rol = RolUsuario.Ciudadano }, AccionFarmacia.Ver, p.A));
        Assert.False(await Puede(new UsuarioFalso { Rol = null }, AccionFarmacia.Ver, p.A));
    }

    [Fact]
    public async Task El_listado_de_farmacias_visibles_respeta_el_alcance()
    {
        var p = await Preparar();
        var supervisor = new UsuarioFalso { Rol = RolUsuario.SupervisorMunicipal, MunicipioId = p.MunA };

        await using var db = bd.CrearContexto();
        var ids = await new AlcanceService(supervisor, db).FarmaciasVisibles()
            .Where(f => f.Id == p.A || f.Id == p.B).Select(f => f.Id).ToListAsync();

        Assert.Equal(new[] { p.A }, ids);
    }

    [Fact]
    public async Task El_administrador_crea_una_cuenta_de_farmacia_y_no_puede_duplicarla()
    {
        var p = await Preparar();
        var s = S();

        Guid adminId;
        await using (var db = bd.CrearContexto())
        {
            var adminReal = new Usuario
            {
                Correo = $"admin-{s}@abasto.cu", ContrasenaHash = "x", Nombres = "Admin", Apellidos = "Prueba",
                Rol = RolUsuario.Administrador, Estado = EstadoUsuario.Activo,
            };
            db.Usuarios.Add(adminReal);
            await db.SaveChangesAsync();
            adminId = adminReal.Id;
        }
        var admin = new UsuarioFalso { Id = adminId, Rol = RolUsuario.Administrador };

        async Task<UsuarioAdminDto> Crear(string correo)
        {
            await using var db = bd.CrearContexto();
            return await new CrearUsuarioPanelHandler(db, new ContrasenaHasher(), admin).Handle(
                new CrearUsuarioPanelCommand(correo, "Clave1234", "Luisa", "Gómez",
                    RolUsuario.PersonalFarmacia, p.A, null, null), default);
        }

        var creada = await Crear($"farmacia-{s}@abasto.cu");
        Assert.Equal(RolUsuario.PersonalFarmacia, creada.Rol);
        Assert.Equal(p.A, creada.FarmaciaId);
        Assert.Equal(EstadoUsuario.Activo, creada.Estado);

        await Assert.ThrowsAsync<ConflictoException>(() => Crear($"otra-{s}@abasto.cu"));
    }
}
