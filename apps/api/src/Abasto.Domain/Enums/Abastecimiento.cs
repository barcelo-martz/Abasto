namespace Abasto.Domain.Enums;

public enum EstadoCiclo { Planificado, Abierto, Cerrado }
public enum EstadoDistribucion { Planificada, EnTransito, Entregada, Confirmada, Cancelada }
public enum EstadoTraslado { Solicitado, Aprobado, Rechazado, EnTransito, Recibido, Cancelado }
public enum EstadoRemision { Solicitada, Aprobada, Rechazada, Atendida, Vencida }