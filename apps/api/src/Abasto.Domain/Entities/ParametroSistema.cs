using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Domain.Entities;

public class ParametroSistema : EntidadBase
{
    public string Clave { get; set; } = null!;
    public string Valor { get; set; } = null!;
    public TipoParametro Tipo { get; set; }
    public string? Descripcion { get; set; }
    public Guid? ActualizadoPorId { get; set; }
}
