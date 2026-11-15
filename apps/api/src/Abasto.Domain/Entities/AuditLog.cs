using Abasto.Domain.Common;

namespace Abasto.Domain.Entities;

public class AuditLog : EntidadInmutable
{
    public Guid? UsuarioId { get; set; }
    public string Accion { get; set; } = null!;
    public string Entidad { get; set; } = null!;
    public Guid? EntidadId { get; set; }
    public string? DatosAnteriores { get; set; }
    public string? DatosNuevos { get; set; }
    public string? Ip { get; set; }
    public Usuario? Usuario { get; set; }
}
