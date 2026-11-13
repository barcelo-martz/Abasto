namespace Abasto.Domain.Enums;

public enum TipoDocumentoReceta { Receta, Tarjeton }
public enum EstadoLectura { Pendiente, Procesada, Editada, Confirmada, Fallida }
public enum TipoNotificacion
{
    DisponibilidadProducto, AlertaRuptura, TrasladoSolicitado, TrasladoResuelto,
    DistribucionRegistrada, AnomaliaDetectada, MensajeRespondido, Recordatorio, Sistema
}
public enum TipoFavorito { Producto, Farmacia }
public enum TipoRecordatorio { Reposicion, RepetirLista, PosibleFalta }
public enum EstadoMensajeContacto { Nuevo, Leido, Respondido, Archivado }