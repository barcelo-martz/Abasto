using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class Inventario : EntidadBase
{
    public Guid? FarmaciaId { get; set; }
    public Guid? AlmacenId { get; set; }
    public Guid ProductoId { get; set; }
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal MontoTotal { get; private set; }
    public decimal? Minimo { get; set; }
    public decimal? Maximo { get; set; }
    public EstadoDisponibilidad EstadoDisponibilidad { get; set; }
    public NivelConfianza NivelConfianza { get; set; }
    public OrigenDato OrigenDato { get; set; }
    public DateTime UltimaActualizacionEn { get; set; }
    public Guid? ActualizadoPorId { get; set; }

    public Farmacia? Farmacia { get; set; }
    public Almacen? Almacen { get; set; }
    public Producto Producto { get; set; } = null!;
    public ICollection<MovimientoInventario> Movimientos { get; set; } = [];
}

public class MovimientoInventario : EntidadInmutable
{
    public Guid InventarioId { get; set; }
    public TipoMovimiento Tipo { get; set; }
    public decimal Cantidad { get; set; }
    public decimal CantidadAnterior { get; set; }
    public decimal CantidadPosterior { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal MontoTotal { get; set; }
    public string? Motivo { get; set; }
    public TipoReferenciaMovimiento? ReferenciaTipo { get; set; }
    public Guid? ReferenciaId { get; set; }
    public OrigenDato OrigenDato { get; set; }
    public Guid? IdCliente { get; set; }
    public Guid UsuarioId { get; set; }
    public DateTime FechaOperacion { get; set; }
    public Inventario Inventario { get; set; } = null!;
}

public class ImportacionInventario : EntidadBase
{
    public Guid? FarmaciaId { get; set; }
    public Guid? AlmacenId { get; set; }
    public Guid UsuarioId { get; set; }
    public string NombreArchivo { get; set; } = null!;
    public FormatoArchivo Formato { get; set; }
    public EstadoImportacion Estado { get; set; }
    public int TotalFilas { get; set; }
    public int FilasValidas { get; set; }
    public int FilasConError { get; set; }
    public string? Errores { get; set; }
    public DateTime? AplicadaEn { get; set; }
}
