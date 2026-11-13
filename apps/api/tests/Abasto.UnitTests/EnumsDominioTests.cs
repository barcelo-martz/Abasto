using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Abasto.UnitTests;

public class EnumsDominioTests
{
    public static IEnumerable<object[]> TiposEnum() =>
        typeof(RolUsuario).Assembly.GetTypes()
            .Where(t => t.IsEnum && t.Namespace == "Abasto.Domain.Enums")
            .Select(t => new object[] { t });

    [Theory]
    [MemberData(nameof(TiposEnum))]
    public void Cada_enum_viaja_y_vuelve_igual(Type tipo)
    {
        var convertidor = (ValueConverter)Activator.CreateInstance(
            typeof(SnakeUpperEnumConverter<>).MakeGenericType(tipo))!;
        var vistos = new HashSet<string>();

        foreach (var valor in Enum.GetValues(tipo))
        {
            var texto = (string)convertidor.ConvertToProvider(valor)!;

            Assert.Matches("^[A-Z]+(_[A-Z]+)*$", texto); // MAYUSCULAS_CON_GUION_BAJO
            Assert.True(vistos.Add(texto), $"Valor repetido en {tipo.Name}: {texto}");
            Assert.Equal(valor, convertidor.ConvertFromProvider(texto));
        }
    }
}