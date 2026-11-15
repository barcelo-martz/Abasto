using Abasto.Domain.Common;
using Abasto.Domain.Enums;
using NetTopologySuite.Geometries;

namespace Abasto.Domain.Entities;

public class Farmacia : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public Guid MunicipioId { get; set; }
    public Guid? AlmacenId { get; set; }
    public string Direccion { get; set; } = null!;
    public Point Ubicacion { get; set; } = null!;
    public string? Telefono { get; set; }
    public TipoPropiedadFarmacia TipoPropiedad { get; set; }
    public EstadoUnidad Estado { get; set; }
    public bool TieneConexionFija { get; set; }

    public Municipio Municipio { get; set; } = null!;
    public Almacen? Almacen { get; set; }
    public ICollection<HorarioFarmacia> Horarios { get; set; } = [];
}

public class HorarioFarmacia : EntidadInmutable
{
    public Guid FarmaciaId { get; set; }
    public DiaSemana DiaSemana { get; set; }
    public TimeOnly? AbreA { get; set; }
    public TimeOnly? CierraA { get; set; }
    public bool Cerrado { get; set; }
    public Farmacia Farmacia { get; set; } = null!;
}

public class Almacen : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public Guid ProvinciaId { get; set; }
    public string Direccion { get; set; } = null!;
    public Point? Ubicacion { get; set; }
    public string? Telefono { get; set; }
    public EstadoUnidad Estado { get; set; }
    public Provincia Provincia { get; set; } = null!;
}

public class UnidadSalud : EntidadBase
{
    public string Nombre { get; set; } = null!;
    public TipoUnidadSalud Tipo { get; set; }
    public Guid MunicipioId { get; set; }
    public string? Direccion { get; set; }
    public string? Telefono { get; set; }
    public Point? Ubicacion { get; set; }
    public Municipio Municipio { get; set; } = null!;
}
