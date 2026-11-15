using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class AlternativaProducto : EntidadBase
{
    public Guid ProductoId { get; set; }
    public Guid AlternativaId { get; set; }
    public string? Motivo { get; set; }
    public EstadoValidacionAlternativa EstadoValidacion { get; set; }
    public Guid? ValidadoPorId { get; set; }
    public DateTime? ValidadoEn { get; set; }
}

public class BusquedaRegistro : EntidadInmutable
{
    public Guid? UsuarioId { get; set; }
    public string? SesionHash { get; set; }
    public string TextoConsulta { get; set; } = null!;
    public Guid? ProductoId { get; set; }
    public Guid? MunicipioId { get; set; }
    public int Resultados { get; set; }
    public bool SinDisponibilidad { get; set; }
}

public class PrediccionDisponibilidad : EntidadBase
{
    public Guid FarmaciaId { get; set; }
    public Guid ProductoId { get; set; }
    public decimal Probabilidad { get; set; }
    public int HorizonteDias { get; set; }
    public decimal? DiasEstimadosAgotamiento { get; set; }
    public string? Factores { get; set; }
    public string ModeloVersion { get; set; } = null!;
    public DateTime CalculadoEn { get; set; }
}

public class AlertaTemprana : EntidadBase
{
    public Guid FarmaciaId { get; set; }
    public Guid ProductoId { get; set; }
    public TipoAlerta Tipo { get; set; }
    public SeveridadAlerta Severidad { get; set; }
    public decimal? DiasEstimadosAgotamiento { get; set; }
    public EstadoAlerta Estado { get; set; }
    public Guid? ReconocidaPorId { get; set; }
    public DateTime? ResueltaEn { get; set; }
}

public class Anomalia : EntidadBase
{
    public Guid FarmaciaId { get; set; }
    public Guid? ProductoId { get; set; }
    public Guid? MovimientoId { get; set; }
    public TipoAnomalia Tipo { get; set; }
    public decimal Puntuacion { get; set; }
    public string Descripcion { get; set; } = null!;
    public EstadoAnomalia Estado { get; set; }
    public Guid? RevisadaPorId { get; set; }
}

public class OperacionSync : EntidadBase
{
    public Guid IdCliente { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid FarmaciaId { get; set; }
    public TipoOperacionSync Tipo { get; set; }
    public string Payload { get; set; } = null!;
    public DateTime CreadaEnCliente { get; set; }
    public EstadoOperacionSync Estado { get; set; }
    public string? Error { get; set; }
    public DateTime? ProcesadaEn { get; set; }
}
