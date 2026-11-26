using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Domain.Rules;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NetTopologySuite.Geometries;

namespace Abasto.Infrastructure.Persistence.Seed;

public sealed class DatosDesarrolloSeeder(
    AbastoDbContext db, IContrasenaHasher hasher, TimeProvider reloj, IConfiguration config,
    ILogger<DatosDesarrolloSeeder> logger)
{
    private sealed record DefAlmacen(string Codigo, string Nombre, string Direccion);

    private sealed record DefFarmacia(
        string Codigo, string Nombre, int Municipio, string Almacen, string Direccion, double Lat, double Lng);

    private sealed record DefProducto(
        string Codigo, string Nombre, TipoProducto Tipo, string Categoria, FormaFarmaceutica? Forma,
        ViaAdministracion? Via, string? Concentracion, string? Presentacion, UnidadInventario Unidad,
        bool Receta, string? Principio, decimal? CantidadPrincipio, string? UnidadPrincipio,
        decimal Precio, string ParaQueSirve);

    private sealed record DefCuenta(
        string Correo, string Nombres, string Apellidos, RolUsuario Rol,
        string? Farmacia = null, string? Almacen = null, int? Municipio = null);

    private const string CategoriaInsumos = "Insumos médicos";

    private static readonly DefAlmacen[] DefAlmacenes =
    [
        new("AL-001", "Droguería Habana Centro (prueba)", "Calle Infanta 100, Plaza de la Revolución"),
        new("AL-002", "Droguería Habana Este (prueba)", "Calzada de Monte 500, Habana Vieja"),
    ];

    private static readonly DefFarmacia[] DefFarmacias =
    [
        new("F-001", "Farmacia Vedado 23 (prueba)", 1, "AL-001", "Calle 23 e/ L y M, Vedado", 23.1385, -82.3995),
        new("F-002", "Farmacia Vedado Línea (prueba)", 1, "AL-001", "Línea e/ 8 y 10, Vedado", 23.1310, -82.4040),
        new("F-003", "Farmacia Centro Habana (prueba)", 2, "AL-001", "Galiano e/ Neptuno y Concordia", 23.1370, -82.3640),
        new("F-004", "Farmacia Habana Vieja (prueba)", 3, "AL-002", "Obispo e/ Habana y Compostela", 23.1390, -82.3550),
        new("F-005", "Farmacia Miramar (prueba)", 0, "AL-002", "Calle 7ma e/ 24 y 26, Miramar", 23.1190, -82.4300),
    ];

    private static readonly string[] DefCategorias =
    [
        "Analgésicos y antipiréticos", "Antibióticos", "Antihipertensivos", "Antidiabéticos",
        "Respiratorio", "Antialérgicos", "Digestivo", CategoriaInsumos,
    ];

    private static readonly DefProducto[] DefProductos =
    [
        new("MED-0001", "Paracetamol", TipoProducto.Medicamento, "Analgésicos y antipiréticos",
            FormaFarmaceutica.Tableta, ViaAdministracion.Oral, "500 mg", "Blíster de 10 tabletas",
            UnidadInventario.Tableta, false, "Paracetamol", 500, "mg", 1.50m,
            "Se usa para aliviar el dolor leve a moderado y bajar la fiebre."),
        new("MED-0002", "Ibuprofeno", TipoProducto.Medicamento, "Analgésicos y antipiréticos",
            FormaFarmaceutica.Tableta, ViaAdministracion.Oral, "400 mg", "Blíster de 10 tabletas",
            UnidadInventario.Tableta, false, "Ibuprofeno", 400, "mg", 2.00m,
            "Se usa para aliviar el dolor y la inflamación."),
        new("MED-0003", "Amoxicilina", TipoProducto.Medicamento, "Antibióticos",
            FormaFarmaceutica.Capsula, ViaAdministracion.Oral, "500 mg", "Blíster de 10 cápsulas",
            UnidadInventario.Capsula, true, "Amoxicilina", 500, "mg", 6.00m,
            "Antibiótico para infecciones causadas por bacterias; siempre lo indica un médico."),
        new("MED-0004", "Enalapril", TipoProducto.Medicamento, "Antihipertensivos",
            FormaFarmaceutica.Tableta, ViaAdministracion.Oral, "10 mg", "Frasco de 30 tabletas",
            UnidadInventario.Frasco, true, "Enalapril", 10, "mg", 1.20m,
            "Se usa para tratar la presión arterial alta."),
        new("MED-0005", "Metformina", TipoProducto.Medicamento, "Antidiabéticos",
            FormaFarmaceutica.Tableta, ViaAdministracion.Oral, "500 mg", "Frasco de 30 tabletas",
            UnidadInventario.Frasco, true, "Metformina", 500, "mg", 1.80m,
            "Se usa para el control de la glucosa en la diabetes tipo 2."),
        new("MED-0006", "Salbutamol inhalador", TipoProducto.Medicamento, "Respiratorio",
            FormaFarmaceutica.Inhalador, ViaAdministracion.Inhalatoria, "100 mcg por dosis", "Inhalador de 200 dosis",
            UnidadInventario.Unidad, true, "Salbutamol", 100, "mcg", 35.00m,
            "Se usa para aliviar la dificultad para respirar en el asma."),
        new("MED-0007", "Loratadina", TipoProducto.Medicamento, "Antialérgicos",
            FormaFarmaceutica.Tableta, ViaAdministracion.Oral, "10 mg", "Blíster de 10 tabletas",
            UnidadInventario.Tableta, false, "Loratadina", 10, "mg", 1.00m,
            "Se usa para aliviar los síntomas de la alergia."),
        new("MED-0008", "Omeprazol", TipoProducto.Medicamento, "Digestivo",
            FormaFarmaceutica.Capsula, ViaAdministracion.Oral, "20 mg", "Blíster de 14 cápsulas",
            UnidadInventario.Capsula, false, "Omeprazol", 20, "mg", 2.50m,
            "Se usa para reducir la acidez del estómago."),
        new("MED-0009", "Paracetamol jarabe", TipoProducto.Medicamento, "Analgésicos y antipiréticos",
            FormaFarmaceutica.Jarabe, ViaAdministracion.Oral, "120 mg por 5 ml", "Frasco de 100 ml",
            UnidadInventario.Frasco, false, "Paracetamol", 120, "mg", 12.00m,
            "Se usa para aliviar el dolor leve y bajar la fiebre en niños."),
        new("INS-0001", "Termómetro digital", TipoProducto.Insumo, CategoriaInsumos,
            null, null, null, "Unidad", UnidadInventario.Unidad, false, null, null, null, 45.00m,
            "Sirve para medir la temperatura corporal."),
        new("INS-0002", "Jeringuilla desechable 5 ml", TipoProducto.Insumo, CategoriaInsumos,
            null, null, "5 ml", "Unidad", UnidadInventario.Unidad, false, null, null, null, 3.00m,
            "Se usa para administrar medicamentos inyectables, siempre indicados por un profesional."),
        new("INS-0003", "Gasa estéril", TipoProducto.Insumo, CategoriaInsumos,
            null, null, null, "Sobre de 10 unidades", UnidadInventario.Sobre, false, null, null, null, 2.50m,
            "Se usa para limpiar y cubrir heridas."),
    ];

    private static readonly DefCuenta[] DefCuentas =
    [
        new("supervisor1@abasto.cu", "Marta", "Delgado Pérez", RolUsuario.SupervisorMunicipal, Municipio: 1),
        new("supervisor2@abasto.cu", "Raúl", "Torres Vega", RolUsuario.SupervisorMunicipal, Municipio: 2),
        new("almacen1@abasto.cu", "Carlos", "Rivera Soto", RolUsuario.PersonalAlmacen, Almacen: "AL-001"),
        new("almacen2@abasto.cu", "Yaima", "Cruz Núñez", RolUsuario.PersonalAlmacen, Almacen: "AL-002"),
        new("farmacia1@abasto.cu", "Luisa", "Gómez Rey", RolUsuario.PersonalFarmacia, Farmacia: "F-001"),
        new("farmacia2@abasto.cu", "Pedro", "Hernández Lara", RolUsuario.PersonalFarmacia, Farmacia: "F-002"),
        new("farmacia3@abasto.cu", "Ana", "Morales Díaz", RolUsuario.PersonalFarmacia, Farmacia: "F-003"),
        new("farmacia4@abasto.cu", "Jorge", "Santos Peña", RolUsuario.PersonalFarmacia, Farmacia: "F-004"),
        new("ciudadano@abasto.cu", "Elena", "Martínez Ruiz", RolUsuario.Ciudadano, Municipio: 0),
    ];

    public async Task EjecutarAsync(CancellationToken ct = default)
    {
        var contrasena = config["Seed:ContrasenaCuentas"];
        if (string.IsNullOrWhiteSpace(contrasena))
        {
            logger.LogWarning("Seed:ContrasenaCuentas no está configurada: no se crean datos de desarrollo.");
            return;
        }

        var ahora = reloj.GetUtcNow().UtcDateTime;

        var almacenes = await AsegurarAlmacenes(ct);
        var farmacias = await AsegurarFarmacias(almacenes, ct);
        await AsegurarHorarios(farmacias, ct);
        var adminId = await AsegurarCuentas(contrasena, farmacias, almacenes, ct);
        var productos = await AsegurarCatalogo(ct);
        await AsegurarInventarios(farmacias, almacenes, productos, adminId, ahora, ct);

        logger.LogInformation("Datos de desarrollo listos: {Farmacias} farmacias, {Productos} productos.",
            DefFarmacias.Length, DefProductos.Length);
    }

    private async Task<Dictionary<string, Almacen>> AsegurarAlmacenes(CancellationToken ct)
    {
        var provinciaId = TerritorioSeed.Provincias()[0].Id;
        var existentes = await db.Almacenes.ToDictionaryAsync(a => a.Codigo, ct);

        foreach (var d in DefAlmacenes.Where(d => !existentes.ContainsKey(d.Codigo)))
        {
            var almacen = new Almacen
            {
                Codigo = d.Codigo, Nombre = d.Nombre, Direccion = d.Direccion,
                ProvinciaId = provinciaId, Estado = EstadoUnidad.Activa,
            };
            db.Almacenes.Add(almacen);
            existentes[d.Codigo] = almacen;
        }

        await db.SaveChangesAsync(ct);
        return existentes;
    }

    private async Task<Dictionary<string, Farmacia>> AsegurarFarmacias(
        Dictionary<string, Almacen> almacenes, CancellationToken ct)
    {
        var municipios = TerritorioSeed.Municipios();
        var existentes = await db.Farmacias.ToDictionaryAsync(f => f.Codigo, ct);

        foreach (var d in DefFarmacias.Where(d => !existentes.ContainsKey(d.Codigo)))
        {
            var farmacia = new Farmacia
            {
                Codigo = d.Codigo, Nombre = d.Nombre, Direccion = d.Direccion,
                MunicipioId = municipios[d.Municipio].Id,
                AlmacenId = almacenes[d.Almacen].Id,
                Ubicacion = new Point(d.Lng, d.Lat) { SRID = 4326 },
                TipoPropiedad = TipoPropiedadFarmacia.Estatal,
                Estado = EstadoUnidad.Activa,
                TieneConexionFija = false,
            };
            db.Farmacias.Add(farmacia);
            existentes[d.Codigo] = farmacia;
        }

        await db.SaveChangesAsync(ct);
        return existentes;
    }

    private async Task AsegurarHorarios(Dictionary<string, Farmacia> farmacias, CancellationToken ct)
    {
        var conHorario = (await db.HorariosFarmacia.Select(h => h.FarmaciaId).Distinct().ToListAsync(ct)).ToHashSet();

        foreach (var farmacia in farmacias.Values.Where(f => !conHorario.Contains(f.Id)))
        foreach (var dia in Enum.GetValues<DiaSemana>())
        {
            db.HorariosFarmacia.Add(dia switch
            {
                DiaSemana.Domingo => new HorarioFarmacia { FarmaciaId = farmacia.Id, DiaSemana = dia, Cerrado = true },
                DiaSemana.Sabado => Abierto(farmacia.Id, dia, new TimeOnly(8, 0), new TimeOnly(13, 0)),
                _ => Abierto(farmacia.Id, dia, new TimeOnly(8, 0), new TimeOnly(18, 0)),
            });
        }

        await db.SaveChangesAsync(ct);
    }

    private static HorarioFarmacia Abierto(Guid farmaciaId, DiaSemana dia, TimeOnly abre, TimeOnly cierra) =>
        new() { FarmaciaId = farmaciaId, DiaSemana = dia, AbreA = abre, CierraA = cierra, Cerrado = false };

    private async Task<Guid> AsegurarCuentas(
        string contrasena, Dictionary<string, Farmacia> farmacias, Dictionary<string, Almacen> almacenes,
        CancellationToken ct)
    {
        var municipios = TerritorioSeed.Municipios();
        var provinciaId = TerritorioSeed.Provincias()[0].Id;
        var existentes = (await db.Usuarios.Select(u => u.Correo).ToListAsync(ct)).ToHashSet();
        var hayAdmin = await db.Usuarios.AnyAsync(u => u.Rol == RolUsuario.Administrador, ct);
        var hash = hasher.Hash(contrasena);

        foreach (var c in DefCuentas.Where(c => !existentes.Contains(c.Correo)))
        {
            if (c.Rol == RolUsuario.Administrador && hayAdmin) continue;

            db.Usuarios.Add(new Usuario
            {
                Correo = c.Correo, ContrasenaHash = hash, Nombres = c.Nombres, Apellidos = c.Apellidos,
                Rol = c.Rol, Estado = EstadoUsuario.Activo,
                ProvinciaId = c.Rol is RolUsuario.Ciudadano or RolUsuario.SupervisorMunicipal ? provinciaId : null,
                MunicipioId = c.Municipio is { } m ? municipios[m].Id : null,
                FarmaciaId = c.Farmacia is { } f ? farmacias[f].Id : null,
                AlmacenId = c.Almacen is { } a ? almacenes[a].Id : null,
            });
        }

        await db.SaveChangesAsync(ct);
        return await db.Usuarios.Where(u => u.Rol == RolUsuario.Administrador).Select(u => u.Id).FirstAsync(ct);
    }

    private async Task<Dictionary<string, Producto>> AsegurarCatalogo(CancellationToken ct)
    {
        var categorias = await db.Categorias.Where(c => c.PadreId == null).ToDictionaryAsync(c => c.Nombre, ct);
        foreach (var nombre in DefCategorias.Where(n => !categorias.ContainsKey(n)))
        {
            var categoria = new Categoria
            {
                Nombre = nombre,
                TipoProducto = nombre == CategoriaInsumos ? TipoProducto.Insumo : TipoProducto.Medicamento,
            };
            db.Categorias.Add(categoria);
            categorias[nombre] = categoria;
        }

        var principios = await db.PrincipiosActivos.ToDictionaryAsync(p => p.Nombre, ct);
        var nuevosPrincipios = DefProductos.Select(p => p.Principio).OfType<string>().Distinct()
            .Where(n => !principios.ContainsKey(n));
        foreach (var nombre in nuevosPrincipios)
        {
            var principio = new PrincipioActivo { Nombre = nombre };
            db.PrincipiosActivos.Add(principio);
            principios[nombre] = principio;
        }

        var productos = await db.Productos.ToDictionaryAsync(p => p.Codigo, ct);
        foreach (var d in DefProductos.Where(d => !productos.ContainsKey(d.Codigo)))
        {
            var producto = new Producto
            {
                Codigo = d.Codigo, Nombre = d.Nombre, Tipo = d.Tipo, Categoria = categorias[d.Categoria],
                FormaFarmaceutica = d.Forma, ViaAdministracion = d.Via,
                Concentracion = d.Concentracion, Presentacion = d.Presentacion,
                UnidadInventario = d.Unidad, RequiereReceta = d.Receta, Activo = true,
                Guia = new GuiaProducto
                {
                    ParaQueSirve = d.ParaQueSirve,
                    Advertencias = "Consulte a un profesional de la salud antes de usarlo. Esta información es orientativa.",
                    Conservacion = "Conservar en un lugar fresco y seco, fuera del alcance de los niños.",
                    Fuente = "Datos de prueba",
                },
            };
            if (d.Principio is { } principioActivo)
            {
                producto.PrincipiosActivos.Add(new ProductoPrincipioActivo
                {
                    PrincipioActivo = principios[principioActivo],
                    Cantidad = d.CantidadPrincipio,
                    Unidad = d.UnidadPrincipio,
                });
            }

            db.Productos.Add(producto);
            productos[d.Codigo] = producto;
        }

        await db.SaveChangesAsync(ct);
        return productos;
    }

    private async Task AsegurarInventarios(
        Dictionary<string, Farmacia> farmacias, Dictionary<string, Almacen> almacenes,
        Dictionary<string, Producto> productos, Guid usuarioId, DateTime ahora, CancellationToken ct)
    {
        var existentes = (await db.Inventarios
                .Select(i => new { i.FarmaciaId, i.AlmacenId, i.ProductoId }).ToListAsync(ct))
            .Select(i => (Unidad: i.FarmaciaId ?? i.AlmacenId!.Value, i.ProductoId))
            .ToHashSet();

        for (var f = 0; f < DefFarmacias.Length; f++)
        for (var p = 0; p < DefProductos.Length; p++)
        {
            if ((f * 5 + p * 2) % 7 == 0) continue;

            var farmacia = farmacias[DefFarmacias[f].Codigo];
            var producto = productos[DefProductos[p].Codigo];
            if (existentes.Contains((farmacia.Id, producto.Id))) continue;

            var def = DefProductos[p];
            var maximo = def.Tipo == TipoProducto.Medicamento ? 200m : 50m;
            var minimo = maximo * 0.2m;
            var cantidad = ((f * 7 + p * 3) % 10) switch
            {
                <= 1 => 0m,                    
                <= 3 => Math.Round(minimo / 2), 
                _ => Math.Round(maximo * (0.4m + 0.1m * ((f + p) % 5))),
            };
            var horas = ((f + p) % 4) switch { 0 => 6, 1 => 30, 2 => 100, _ => 300 };

            AgregarInventario(farmacia.Id, null, producto, def.Precio, cantidad, minimo, maximo,
                ahora.AddHours(-horas), ahora, usuarioId);
        }

        foreach (var almacen in DefAlmacenes.Select(d => almacenes[d.Codigo]))
        foreach (var def in DefProductos)
        {
            var producto = productos[def.Codigo];
            if (existentes.Contains((almacen.Id, producto.Id))) continue;

            var maximo = def.Tipo == TipoProducto.Medicamento ? 1000m : 250m;
            AgregarInventario(null, almacen.Id, producto, Math.Round(def.Precio * 0.8m, 2), maximo * 0.8m, maximo * 0.2m,
                maximo, ahora.AddHours(-2), ahora, usuarioId);
        }

        await db.SaveChangesAsync(ct);
    }

    private void AgregarInventario(
        Guid? farmaciaId, Guid? almacenId, Producto producto, decimal precio, decimal cantidad,
        decimal minimo, decimal maximo, DateTime actualizado, DateTime ahora, Guid usuarioId)
    {
        var inventario = new Inventario
        {
            FarmaciaId = farmaciaId, AlmacenId = almacenId, ProductoId = producto.Id,
            Cantidad = cantidad, PrecioUnitario = precio, Minimo = minimo, Maximo = maximo,
            EstadoDisponibilidad = ReglasInventario.CalcularDisponibilidad(cantidad, minimo, maximo),
            NivelConfianza = ReglasInventario.CalcularConfianza(actualizado, ahora),
            OrigenDato = OrigenDato.Sistema,
            UltimaActualizacionEn = actualizado,
        };
        db.Inventarios.Add(inventario);

        if (cantidad <= 0) return;

        db.MovimientosInventario.Add(new MovimientoInventario
        {
            Inventario = inventario, Tipo = TipoMovimiento.CargaInicial,
            Cantidad = cantidad, CantidadAnterior = 0, CantidadPosterior = cantidad,
            PrecioUnitario = precio, MontoTotal = cantidad * precio,
            Motivo = "Carga inicial de datos de prueba", OrigenDato = OrigenDato.Sistema,
            UsuarioId = usuarioId, FechaOperacion = actualizado,
        });
    }
}