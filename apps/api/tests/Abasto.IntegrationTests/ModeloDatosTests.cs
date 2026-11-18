using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence;
using Abasto.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace Abasto.IntegrationTests;

public class BaseDatosFixture : IAsyncLifetime
{
    private static readonly Lazy<string> Conexion = new(ObtenerConexion);

    private static readonly Lazy<Task> Migracion = new(MigrarAsync);

    private static string ObtenerConexion()
    {
        var directa = Environment.GetEnvironmentVariable("ABASTO_TEST_DB");
        if (!string.IsNullOrWhiteSpace(directa)) return directa;

        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "infra", ".env")))
            dir = dir.Parent;
        if (dir is null)
            throw new InvalidOperationException("No encuentro infra/.env ni la variable ABASTO_TEST_DB.");

        var valores = File.ReadAllLines(Path.Combine(dir.FullName, "infra", ".env"))
            .Select(l => l.Trim())
            .Where(l => l.Length > 0 && !l.StartsWith('#') && l.Contains('='))
            .Select(l => l.Split('=', 2))
            .ToDictionary(p => p[0].Trim(), p => p[1].Trim().Trim('"'));

        string Valor(string clave, string defecto) => valores.TryGetValue(clave, out var v) ? v : defecto;

        return $"Host=localhost;Port={Valor("POSTGRES_PORT", "5432")};Database=abasto_test;" +
                $"Username={Valor("POSTGRES_USER", "postgres")};Password={Valor("POSTGRES_PASSWORD", "postgres")}";
    }

    public static AbastoDbContext Crear() => new(
    new DbContextOptionsBuilder<AbastoDbContext>()
        .UseNpgsql(Conexion.Value, o => o.UseNetTopologySuite())
        .UseSnakeCaseNamingConvention()
        .AddInterceptors(new AuditoriaFechasInterceptor())
        .Options);

    public AbastoDbContext CrearContexto() => Crear();

    private static async Task MigrarAsync()
    {
        await using var db = Crear();
        await db.Database.MigrateAsync();
    }

    public Task InitializeAsync() => Migracion.Value;

    public Task DisposeAsync() => Task.CompletedTask;
}

[Collection(BaseDatosColeccion.Nombre)]
public class ModeloDatosTests(BaseDatosFixture bd)
{
    private static string Sufijo() => Guid.NewGuid().ToString("N")[..8];

    [Fact]
    public void El_modelo_coincide_con_las_migraciones()
    {
        using var db = bd.CrearContexto();
        Assert.False(db.Database.HasPendingModelChanges());
    }

    [Fact]
    public async Task El_rol_se_guarda_como_texto_y_la_bd_exige_farmacia()
    {
        var s = Sufijo();
        await using var db = bd.CrearContexto();

        db.Usuarios.Add(new Usuario
        {
            Correo = $"sin-farmacia-{s}@abasto.cu",
            ContrasenaHash = "x",
            Nombres = "A",
            Apellidos = "B",
            Rol = RolUsuario.PersonalFarmacia,
            Estado = EstadoUsuario.Activo,
        });
        await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
        db.ChangeTracker.Clear();

        var ciudadano = new Usuario
        {
            Correo = $"ciudadano-{s}@abasto.cu",
            ContrasenaHash = "x",
            Nombres = "A",
            Apellidos = "B",
            Rol = RolUsuario.Ciudadano,
            Estado = EstadoUsuario.Activo,
        };
        db.Usuarios.Add(ciudadano);
        await db.SaveChangesAsync();

        var rol = await db.Database
            .SqlQuery<string>($"SELECT rol AS \"Value\" FROM usuarios WHERE id = {ciudadano.Id}")
            .SingleAsync();
        Assert.Equal("CIUDADANO", rol);
    }

    [Fact]
    public async Task Inventario_calcula_el_monto_y_exige_una_sola_unidad()
    {
        var s = Sufijo();
        await using var db = bd.CrearContexto();

        var producto = new Producto
        {
            Codigo = $"TEST-{s}",
            Nombre = "Paracetamol",
            Tipo = TipoProducto.Medicamento,
            Categoria = new Categoria { Nombre = $"Analgésicos {s}" },
            UnidadInventario = UnidadInventario.Tableta,
        };
        var farmacia = new Farmacia
        {
            Codigo = $"F-{s}",
            Nombre = "Farmacia de prueba",
            Direccion = "Calle 1",
            MunicipioId = TerritorioSeed.Municipios()[0].Id,
            Ubicacion = new Point(-82.38, 23.13) { SRID = 4326 },
            TipoPropiedad = TipoPropiedadFarmacia.Estatal,
            Estado = EstadoUnidad.Activa,
        };
        var inventario = new Inventario
        {
            Farmacia = farmacia,
            Producto = producto,
            Cantidad = 10,
            PrecioUnitario = 2.50m,
            EstadoDisponibilidad = EstadoDisponibilidad.Disponible,
            NivelConfianza = NivelConfianza.Verificada,
            OrigenDato = OrigenDato.Manual,
            UltimaActualizacionEn = DateTime.UtcNow,
        };
        db.Inventarios.Add(inventario);
        await db.SaveChangesAsync();
        Assert.Equal(25.00m, inventario.MontoTotal);

        db.Inventarios.Add(new Inventario
        {
            Producto = producto,
            Cantidad = 1,
            PrecioUnitario = 1,
            EstadoDisponibilidad = EstadoDisponibilidad.Disponible,
            NivelConfianza = NivelConfianza.Verificada,
            OrigenDato = OrigenDato.Manual,
            UltimaActualizacionEn = DateTime.UtcNow,
        });
        await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
    }
}
