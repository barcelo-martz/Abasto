using Abasto.Domain.Enums;
using Abasto.Domain.Rules;

namespace Abasto.UnitTests;

public class ReglasInventarioTests
{
    [Theory]
    [InlineData(0, 20, 200, EstadoDisponibilidad.Agotado)]
    [InlineData(10, 20, 200, EstadoDisponibilidad.BajoStock)]
    [InlineData(20, 20, 200, EstadoDisponibilidad.BajoStock)]
    [InlineData(21, 20, 200, EstadoDisponibilidad.Disponible)]
    [InlineData(30, null, 200, EstadoDisponibilidad.BajoStock)]
    [InlineData(50, null, 200, EstadoDisponibilidad.Disponible)]
    [InlineData(5, null, null, EstadoDisponibilidad.Disponible)]
    public void Calcula_la_disponibilidad(int cantidad, int? minimo, int? maximo, EstadoDisponibilidad esperado) =>
        Assert.Equal(esperado, ReglasInventario.CalcularDisponibilidad(cantidad, minimo, maximo));

    [Theory]
    [InlineData(6, NivelConfianza.Verificada)]
    [InlineData(48, NivelConfianza.Verificada)]
    [InlineData(49, NivelConfianza.Estimada)]
    [InlineData(168, NivelConfianza.Estimada)]
    [InlineData(169, NivelConfianza.Desactualizada)]
    public void Calcula_la_confianza_por_antiguedad(int horas, NivelConfianza esperado)
    {
        var ahora = new DateTime(2026, 11, 20, 12, 0, 0, DateTimeKind.Utc);

        Assert.Equal(esperado, ReglasInventario.CalcularConfianza(ahora.AddHours(-horas), ahora));
    }
}