using Abasto.Domain.Common;

namespace Abasto.Domain.Entities;

public class Provincia : EntidadBase
{
    public string Nombre { get; set; } = null!;
    public string Codigo { get; set; } = null!;
    public ICollection<Municipio> Municipios { get; set; } = [];
}
