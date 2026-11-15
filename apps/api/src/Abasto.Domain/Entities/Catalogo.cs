using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class Categoria : EntidadBase
{
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public Guid? PadreId { get; set; }
    public TipoProducto? TipoProducto { get; set; }
    public Categoria? Padre { get; set; }
    public ICollection<Categoria> Hijas { get; set; } = [];
}

public class PrincipioActivo : EntidadBase
{
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
}

public class Producto : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public string Nombre { get; set; } = null!;
    public string? NombreComercial { get; set; }
    public TipoProducto Tipo { get; set; }
    public Guid CategoriaId { get; set; }
    public FormaFarmaceutica? FormaFarmaceutica { get; set; }
    public ViaAdministracion? ViaAdministracion { get; set; }
    public string? Concentracion { get; set; }
    public string? Presentacion { get; set; }
    public UnidadInventario UnidadInventario { get; set; }
    public bool RequiereReceta { get; set; }
    public bool Activo { get; set; } = true;

    public Categoria Categoria { get; set; } = null!;
    public GuiaProducto? Guia { get; set; }
    public ICollection<ProductoPrincipioActivo> PrincipiosActivos { get; set; } = [];
}

public class ProductoPrincipioActivo
{
    public Guid ProductoId { get; set; }
    public Guid PrincipioActivoId { get; set; }
    public decimal? Cantidad { get; set; }
    public string? Unidad { get; set; }
    public Producto Producto { get; set; } = null!;
    public PrincipioActivo PrincipioActivo { get; set; } = null!;
}

public class GuiaProducto : EntidadBase
{
    public Guid ProductoId { get; set; }
    public string ParaQueSirve { get; set; } = null!;
    public string? Descripcion { get; set; }
    public string? Advertencias { get; set; }
    public string? Conservacion { get; set; }
    public string? Fuente { get; set; }
    public Guid? RevisadoPorId { get; set; }
    public DateTime? RevisadoEn { get; set; }
    public Producto Producto { get; set; } = null!;
}
