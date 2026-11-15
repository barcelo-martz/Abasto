using Abasto.Domain.Entities;
using Abasto.Domain.Enums;

namespace Abasto.Infrastructure.Persistence.Seed;

public static class ParametrosSeed
{
    private static readonly DateTime Fecha = new(2026, 11, 1, 0, 0, 0, DateTimeKind.Utc);

    public static ParametroSistema[] Parametros() =>
    [
        P(1, "confianza.horasVerificada", "48", TipoParametro.Entero, "Horas máximas para que el dato de la farmacia sea VERIFICADA"),
        P(2, "confianza.horasDesactualizada", "168", TipoParametro.Entero, "Pasadas estas horas el dato pasa a DESACTUALIZADA"),
        P(3, "stock.minimoInicialPct", "20", TipoParametro.Entero, "Mínimo inicial como porcentaje del máximo"),
        P(4, "stock.umbralBajoPct", "20", TipoParametro.Entero, "BAJO_STOCK si no hay mínimo definido (porcentaje del máximo)"),
        P(5, "abastecimiento.cicloDias", "60", TipoParametro.Entero, "Duración del ciclo de abastecimiento"),
        P(6, "alertas.diasAnticipacion", "14", TipoParametro.Entero, "Días de anticipación de la alerta de ruptura"),
        P(7, "prediccion.horizonteDias", "14", TipoParametro.Entero, "Horizonte de la probabilidad de disponibilidad"),
        P(8, "prediccion.ventanaConsumoDias", "30", TipoParametro.Entero, "Ventana para calcular el ritmo de consumo"),
        P(9, "anomalias.umbralPuntuacion", "3", TipoParametro.Decimal, "Puntuación mínima para marcar una anomalía"),
        P(10, "receta.horasRetencion", "24", TipoParametro.Entero, "Retención del texto leído; la imagen se borra al procesar"),
        P(11, "auth.maxIntentosFallidos", "5", TipoParametro.Entero, "Intentos fallidos antes de bloquear la cuenta"),
        P(12, "auth.minutosBloqueo", "15", TipoParametro.Entero, "Duración del bloqueo de la cuenta"),
    ];

    private static ParametroSistema P(int n, string clave, string valor, TipoParametro tipo, string descripcion) => new()
    {
        Id = new Guid($"30000000-0000-0000-0000-{n:D12}"),
        Clave = clave,
        Valor = valor,
        Tipo = tipo,
        Descripcion = descripcion,
        CreadoEn = Fecha,
        ActualizadoEn = Fecha,
    };
}
