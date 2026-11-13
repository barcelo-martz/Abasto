namespace Abasto.Domain.Enums;

public enum TipoAlerta { RupturaInminente, DesabastecimientoProyectado, Sobrestock }
public enum SeveridadAlerta { Baja, Media, Alta, Critica }
public enum EstadoAlerta { Abierta, Reconocida, Resuelta, Descartada }
public enum TipoAnomalia { ConsumoAtipico, AjusteSospechoso, ActualizacionInconsistente, PrecioFueraDeRango }
public enum EstadoAnomalia { Nueva, EnRevision, Confirmada, FalsoPositivo }
public enum TipoOperacionSync { ActualizarStock, RegistrarDispensacion, RegistrarAjuste }
public enum EstadoOperacionSync { Pendiente, Aplicada, Conflicto, Rechazada }