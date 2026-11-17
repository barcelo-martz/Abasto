namespace Abasto.IntegrationTests;

[CollectionDefinition(Nombre)]
public class BaseDatosColeccion : ICollectionFixture<BaseDatosFixture>
{
    public const string Nombre = "BaseDatos";
}