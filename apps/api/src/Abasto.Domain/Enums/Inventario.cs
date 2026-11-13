namespace Abasto.Domain.Enums;

public enum EstadoDisponibilidad { Disponible, BajoStock, Agotado, SinInformacion }
public enum NivelConfianza { Verificada, Estimada, Desactualizada }
public enum OrigenDato { Manual, Archivo, Sincronizacion, Traslado, Distribucion, Sistema }
public enum TipoMovimiento
{
    CargaInicial, EntradaDistribucion, EntradaTraslado, SalidaTraslado,
    SalidaDispensacion, SalidaDistribucion, AjustePositivo, AjusteNegativo, Baja
}
public enum TipoReferenciaMovimiento { Distribucion, Traslado, Importacion, Sincronizacion }
public enum FormatoArchivo { Csv, Xlsx }
public enum EstadoImportacion { Subida, Validada, ConErrores, Aplicada, Fallida }