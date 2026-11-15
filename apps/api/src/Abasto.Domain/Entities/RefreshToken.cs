using Abasto.Domain.Common;

namespace Abasto.Domain.Entities;

public class RefreshToken : EntidadInmutable
{
    public Guid UsuarioId { get; set; }
    public string TokenHash { get; set; } = null!;
    public DateTime ExpiraEn { get; set; }
    public DateTime? RevocadoEn { get; set; }
    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
    public Usuario Usuario { get; set; } = null!;
}
