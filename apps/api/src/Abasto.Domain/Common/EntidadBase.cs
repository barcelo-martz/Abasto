namespace Abasto.Domain.Common;

public abstract class EntidadBase
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreadoEn { get; set; }
    public DateTime ActualizadoEn { get; set; }
}