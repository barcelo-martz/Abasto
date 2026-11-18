using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.UnitTests;

public class EnumTextoTests
{
    [Theory]
    [InlineData("PERSONAL_FARMACIA", RolUsuario.PersonalFarmacia)]
    [InlineData("CIUDADANO", RolUsuario.Ciudadano)]
    public void Parsea_el_valor_externo(string texto, RolUsuario esperado) =>
        Assert.Equal(esperado, EnumTexto.Parsear<RolUsuario>(texto));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("NO_EXISTE")]
    public void Devuelve_null_si_no_lo_reconoce(string? texto) =>
        Assert.Null(EnumTexto.Parsear<RolUsuario>(texto));
}
