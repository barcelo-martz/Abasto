using System.Runtime.CompilerServices;

namespace Abasto.IntegrationTests;

internal static class ConfiguracionPruebas
{
    [ModuleInitializer]
    internal static void Iniciar() =>
        Environment.SetEnvironmentVariable("Jwt__Key", "clave-solo-para-pruebas-0123456789-abcdefghij");
}
