namespace Abasto.Domain.Common;

public abstract class EntidadInmutable
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public DateTime CreadoEn { get; set; }
}

public abstract class EntidadBase : EntidadInmutable
{
    public DateTime ActualizadoEn { get; set; }
}
