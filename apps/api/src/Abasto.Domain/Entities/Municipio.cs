using Abasto.Domain.Common;

namespace Abasto.Domain.Entities;

public class Municipio : EntidadBase
{
    public Guid ProvinciaId { get; set; }
    public string Nombre { get; set; } = null!;
    public string Codigo { get; set; } = null!;
    public Provincia Provincia { get; set; } = null!;
}
