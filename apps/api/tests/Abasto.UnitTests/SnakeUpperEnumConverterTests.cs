using Abasto.Infrastructure.Persistence.Conventions;

namespace Abasto.UnitTests;

public class SnakeUpperEnumConverterTests
{
    public enum RolPrueba { Ciudadano, PersonalFarmacia, SupervisorMunicipal }

    [Theory]
    [InlineData(RolPrueba.Ciudadano, "CIUDADANO")]
    [InlineData(RolPrueba.PersonalFarmacia, "PERSONAL_FARMACIA")]
    [InlineData(RolPrueba.SupervisorMunicipal, "SUPERVISOR_MUNICIPAL")]
    public void Convierte_en_ambos_sentidos(RolPrueba valor, string texto)
    {
        var convertidor = new SnakeUpperEnumConverter<RolPrueba>();

        Assert.Equal(texto, convertidor.ConvertToProvider(valor));
        Assert.Equal(valor, convertidor.ConvertFromProvider(texto));
    }
}