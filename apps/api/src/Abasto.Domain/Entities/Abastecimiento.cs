using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class CicloAbastecimiento : EntidadBase
{
    public string Nombre { get; set; } = null!;
    public DateOnly FechaInicio { get; set; }
    public DateOnly FechaFin { get; set; }
    public EstadoCiclo Estado { get; set; }
}

public class Distribucion : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public Guid? CicloId { get; set; }
    public Guid AlmacenId { get; set; }
    public Guid FarmaciaId { get; set; }
    public EstadoDistribucion Estado { get; set; }
    public DateOnly? FechaPlanificada { get; set; }
    public DateTime? FechaEntrega { get; set; }
    public decimal MontoTotal { get; set; }
    public Guid RegistradaPorId { get; set; }
    public Guid? ConfirmadaPorId { get; set; }
    public string? Observaciones { get; set; }
    public ICollection<DistribucionDetalle> Detalles { get; set; } = [];
}

public class DistribucionDetalle : EntidadBase
{
    public Guid DistribucionId { get; set; }
    public Guid ProductoId { get; set; }
    public decimal CantidadEnviada { get; set; }
    public decimal? CantidadRecibida { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal MontoTotal { get; set; }
}

public class Traslado : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public Guid FarmaciaOrigenId { get; set; }
    public Guid FarmaciaDestinoId { get; set; }
    public EstadoTraslado Estado { get; set; }
    public string Motivo { get; set; } = null!;
    public Guid SolicitadoPorId { get; set; }
    public Guid? AprobadoPorId { get; set; }
    public DateTime? ResueltoEn { get; set; }
    public string? ComentarioResolucion { get; set; }
    public ICollection<TrasladoDetalle> Detalles { get; set; } = [];
}

public class TrasladoDetalle : EntidadBase
{
    public Guid TrasladoId { get; set; }
    public Guid ProductoId { get; set; }
    public decimal CantidadSolicitada { get; set; }
    public decimal? CantidadAprobada { get; set; }
    public decimal? CantidadRecibida { get; set; }
}

public class RemisionCronica : EntidadBase
{
    public string Codigo { get; set; } = null!;
    public Guid FarmaciaOrigenId { get; set; }
    public Guid FarmaciaDestinoId { get; set; }
    public Guid ProductoId { get; set; }
    public string CodigoReferencia { get; set; } = null!;
    public EstadoRemision Estado { get; set; }
    public DateOnly? VigenteHasta { get; set; }
    public Guid? AprobadaPorId { get; set; }
    public string? Motivo { get; set; }
}
