using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Identity;
using Abasto.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;

namespace Abasto.IntegrationTests;

[Collection(BaseDatosColeccion.Nombre)]
public class DatosDesarrolloSeederTests(BaseDatosFixture bd)
{
    private const string Clave = "Prueba1234";
    private static readonly string[] Farmacias = ["F-001", "F-002", "F-003", "F-004", "F-005"];
    private static readonly string[] CuentasFarmacia =
        ["farmacia1@abasto.cu", "farmacia2@abasto.cu", "farmacia3@abasto.cu", "farmacia4@abasto.cu"];

    private async Task Ejecutar()
    {
        await using var db = bd.CrearContexto();
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Admin:Correo"] = "admin@abasto.cu",
                ["Admin:Contrasena"] = Clave,
                ["Seed:ContrasenaCuentas"] = Clave,
            })
            .Build();

        await new AdminSeeder(db, new ContrasenaHasher(), config, NullLogger<AdminSeeder>.Instance)
            .EjecutarAsync();
        await new DatosDesarrolloSeeder(db, new ContrasenaHasher(), TimeProvider.System, config,
            NullLogger<DatosDesarrolloSeeder>.Instance).EjecutarAsync();
    }

    [Fact]
    public async Task Es_idempotente_y_crea_farmacias_y_cuentas_por_rol()
    {
        await Ejecutar();
        await Ejecutar();

        await using var db = bd.CrearContexto();
        Assert.Equal(5, await db.Farmacias.CountAsync(f => Farmacias.Contains(f.Codigo)));
        Assert.Equal(4, await db.Usuarios.CountAsync(u => CuentasFarmacia.Contains(u.Correo)));
        Assert.True(await db.Usuarios.AnyAsync(u => u.Correo == "supervisor1@abasto.cu"));
        Assert.True(await db.Usuarios.AnyAsync(u => u.Correo == "almacen1@abasto.cu"));
    }

    [Fact]
    public async Task Las_cuentas_de_prueba_usan_la_contrasena_configurada()
    {
        await Ejecutar();

        await using var db = bd.CrearContexto();
        var cuenta = await db.Usuarios.SingleAsync(u => u.Correo == "farmacia1@abasto.cu");

        Assert.Equal(ResultadoVerificacion.Correcta, new ContrasenaHasher().Verificar(cuenta.ContrasenaHash, Clave));
        Assert.Equal(EstadoUsuario.Activo, cuenta.Estado);
    }

    [Fact]
    public async Task El_inventario_cubre_todos_los_estados_y_etiquetas()
    {
        await Ejecutar();

        await using var db = bd.CrearContexto();
        var inventario = db.Inventarios.Where(i => i.Farmacia != null && Farmacias.Contains(i.Farmacia.Codigo));

        Assert.Equal(3, await inventario.Select(i => i.EstadoDisponibilidad).Distinct().CountAsync());
        Assert.Equal(3, await inventario.Select(i => i.NivelConfianza).Distinct().CountAsync());
    }
}