using Abasto.Domain.Common;
using Abasto.Domain.Enums;
using NetTopologySuite.Geometries;

namespace Abasto.Domain.Entities;

public class ListaMedicamentos : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public string Nombre { get; set; } = null!;
    public Guid? OrigenRecetaId { get; set; }
    public ICollection<ListaMedicamentosItem> Items { get; set; } = [];
}

public class ListaMedicamentosItem : EntidadBase
{
    public Guid ListaId { get; set; }
    public Guid ProductoId { get; set; }
    public int? Cantidad { get; set; }
    public string? Nota { get; set; }
}

public class LecturaReceta : EntidadBase
{
    public Guid? UsuarioId { get; set; }
    public TipoDocumentoReceta TipoDocumento { get; set; }
    public string? ImagenRef { get; set; }
    public string? TextoCrudo { get; set; }
    public string? ProveedorOcr { get; set; }
    public EstadoLectura Estado { get; set; }
    public decimal? ConfianzaGlobal { get; set; }
    public DateTime ExpiraEn { get; set; }
    public ICollection<LecturaRecetaItem> Items { get; set; } = [];
}

public class LecturaRecetaItem : EntidadBase
{
    public Guid LecturaId { get; set; }
    public string TextoOriginal { get; set; } = null!;
    public string? TextoEditado { get; set; }
    public Guid? ProductoId { get; set; }
    public int? Cantidad { get; set; }
    public decimal? Confianza { get; set; }
    public bool Confirmado { get; set; }
}

public class SuscripcionAlerta : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public Guid ProductoId { get; set; }
    public Guid? FarmaciaId { get; set; }
    public Guid? MunicipioId { get; set; }
    public bool Activa { get; set; } = true;
    public DateTime? UltimaNotificacionEn { get; set; }
}

public class Notificacion : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public TipoNotificacion Tipo { get; set; }
    public string Titulo { get; set; } = null!;
    public string Mensaje { get; set; } = null!;
    public string? ReferenciaTipo { get; set; }
    public Guid? ReferenciaId { get; set; }
    public bool Leida { get; set; }
    public DateTime? LeidaEn { get; set; }
}

public class MensajeContacto : EntidadBase
{
    public Guid? UsuarioId { get; set; }
    public string Nombre { get; set; } = null!;
    public string Correo { get; set; } = null!;
    public string Asunto { get; set; } = null!;
    public string Mensaje { get; set; } = null!;
    public EstadoMensajeContacto Estado { get; set; }
    public string? Respuesta { get; set; }
    public Guid? RespondidoPorId { get; set; }
    public DateTime? RespondidoEn { get; set; }
}

public class PlanRecorrido : EntidadBase
{
    public Guid? UsuarioId { get; set; }
    public Point Origen { get; set; } = null!;
    public Guid? ListaId { get; set; }
    public decimal? DistanciaTotalKm { get; set; }
    public int? TiempoEstimadoMin { get; set; }
    public decimal? CubrePct { get; set; }
    public ICollection<PlanRecorridoParada> Paradas { get; set; } = [];
}

public class PlanRecorridoParada : EntidadBase
{
    public Guid PlanId { get; set; }
    public int Orden { get; set; }
    public Guid FarmaciaId { get; set; }
    public decimal? DistanciaDesdeAnteriorKm { get; set; }
    public Guid[]? ProductosIds { get; set; }
}

public class Favorito : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public TipoFavorito Tipo { get; set; }
    public Guid? ProductoId { get; set; }
    public Guid? FarmaciaId { get; set; }
}

public class Recordatorio : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public TipoRecordatorio Tipo { get; set; }
    public Guid? ProductoId { get; set; }
    public Guid? ListaId { get; set; }
    public DateTime ProgramadoPara { get; set; }
    public int? FrecuenciaDias { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime? UltimoDisparoEn { get; set; }
}
