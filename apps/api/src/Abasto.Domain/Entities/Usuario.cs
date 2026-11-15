using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class Usuario : EntidadBase
{
    public string Correo { get; set; } = null!;
    public string ContrasenaHash { get; set; } = null!;
    public string Nombres { get; set; } = null!;
    public string Apellidos { get; set; } = null!;
    public string? Telefono { get; set; }
    public RolUsuario Rol { get; set; }
    public EstadoUsuario Estado { get; set; }
    public Guid? ProvinciaId { get; set; }
    public Guid? MunicipioId { get; set; }
    public string? Direccion { get; set; }
    public string? CarnetIdentidad { get; set; }
    public Guid? FarmaciaId { get; set; }
    public Guid? AlmacenId { get; set; }
    public DateTime? UltimoAccesoEn { get; set; }
    public int IntentosFallidos { get; set; }
    public DateTime? BloqueadoHasta { get; set; }

    public Provincia? Provincia { get; set; }
    public Municipio? Municipio { get; set; }
    public Farmacia? Farmacia { get; set; }
    public Almacen? Almacen { get; set; }
}
