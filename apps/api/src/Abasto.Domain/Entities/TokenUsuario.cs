using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class TokenUsuario : EntidadBase
{
    public Guid UsuarioId { get; set; }
    public TipoTokenUsuario Tipo { get; set; }
    public string TokenHash { get; set; } = null!;
    public DateTime ExpiraEn { get; set; }
    public DateTime? UsadoEn { get; set; }
    public Usuario Usuario { get; set; } = null!;
}
