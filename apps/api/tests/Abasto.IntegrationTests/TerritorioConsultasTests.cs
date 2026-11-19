using Abasto.Application.Common.Excepciones;
using Abasto.Application.Features.Territory;
using Abasto.Infrastructure.Persistence.Seed;

namespace Abasto.IntegrationTests;

[Collection(BaseDatosColeccion.Nombre)]
public class TerritorioConsultasTests(BaseDatosFixture bd)
{
    [Fact]
    public async Task Lista_las_provincias_del_seed()
    {
        await using var db = bd.CrearContexto();

        var provincias = await new ListarProvinciasHandler(db).Handle(new ListarProvinciasQuery(), default);

        Assert.Contains(provincias, p => p.Nombre == "La Habana");
    }

    [Fact]
    public async Task Lista_los_municipios_de_una_provincia()
    {
        await using var db = bd.CrearContexto();
        var laHabana = TerritorioSeed.Provincias()[0].Id;

        var municipios = await new ListarMunicipiosHandler(db)
            .Handle(new ListarMunicipiosQuery(laHabana), default);

        Assert.Equal(TerritorioSeed.Municipios().Length, municipios.Count);
        Assert.All(municipios, m => Assert.Equal(laHabana, m.ProvinciaId));
    }

    [Fact]
    public async Task Una_provincia_inexistente_responde_no_encontrado()
    {
        await using var db = bd.CrearContexto();

        await Assert.ThrowsAsync<NoEncontradoException>(() =>
            new ListarMunicipiosHandler(db).Handle(new ListarMunicipiosQuery(Guid.NewGuid()), default));
    }
}
