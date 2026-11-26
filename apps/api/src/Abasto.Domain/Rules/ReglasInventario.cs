using Abasto.Domain.Enums;

namespace Abasto.Domain.Rules;

public static class ReglasInventario
{
    /// Agotado si no hay existencia. Bajo stock si está en el mínimo o por debajo; si no hay mínimo,
    /// se usa un porcentaje del máximo (parámetro stock.umbralBajoPct).
    public static EstadoDisponibilidad CalcularDisponibilidad(
        decimal cantidad, decimal? minimo, decimal? maximo, int umbralBajoPct = 20)
    {
        if (cantidad <= 0) return EstadoDisponibilidad.Agotado;

        decimal? umbral = minimo ?? (maximo is { } m ? m * umbralBajoPct / 100m : null);
        return umbral is { } u && cantidad <= u
            ? EstadoDisponibilidad.BajoStock
            : EstadoDisponibilidad.Disponible;
    }

    /// Verificada hasta horasVerificada, Estimada hasta horasDesactualizada y Desactualizada después
    /// (parámetros confianza.horasVerificada y confianza.horasDesactualizada).
    public static NivelConfianza CalcularConfianza(
        DateTime ultimaActualizacionEn, DateTime ahora, int horasVerificada = 48, int horasDesactualizada = 168)
    {
        var horas = (ahora - ultimaActualizacionEn).TotalHours;
        return horas <= horasVerificada ? NivelConfianza.Verificada
            : horas <= horasDesactualizada ? NivelConfianza.Estimada
            : NivelConfianza.Desactualizada;
    }
}