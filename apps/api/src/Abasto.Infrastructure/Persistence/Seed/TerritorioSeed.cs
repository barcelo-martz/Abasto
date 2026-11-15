using Abasto.Domain.Entities;

namespace Abasto.Infrastructure.Persistence.Seed;

public static class TerritorioSeed
{
    private static readonly DateTime Fecha = new(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc);
    private static readonly Guid LaHabanaId = new("10000000-0000-0000-0000-000000000001");

    private static readonly string[] NombresMunicipios =
    [
        "Playa", "Plaza de la Revolución", "Centro Habana", "La Habana Vieja", "Regla",
        "La Habana del Este", "Guanabacoa", "San Miguel del Padrón", "Diez de Octubre",
        "Cerro", "Marianao", "La Lisa", "Boyeros", "Arroyo Naranjo", "Cotorro",
    ];

    public static Provincia[] Provincias() =>
    [
        new() { Id = LaHabanaId, Nombre = "La Habana", Codigo = "LHA", CreadoEn = Fecha, ActualizadoEn = Fecha },
    ];

    public static Municipio[] Municipios() =>
        NombresMunicipios.Select((nombre, i) => new Municipio
        {
            Id = new Guid($"20000000-0000-0000-0000-{i + 1:D12}"),
            ProvinciaId = LaHabanaId,
            Nombre = nombre,
            Codigo = $"LHA-{i + 1:D2}",
            CreadoEn = Fecha,
            ActualizadoEn = Fecha,
        }).ToArray();
}
