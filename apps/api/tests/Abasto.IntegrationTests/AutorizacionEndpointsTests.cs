using System.Reflection;
using Abasto.Api.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;

namespace Abasto.IntegrationTests;

public class AutorizacionEndpointsTests
{
    [Fact]
    public void Todos_los_endpoints_declaran_su_politica()
    {
        var sinPolitica = new List<string>();

        var controladores = typeof(AuthController).Assembly.GetTypes()
            .Where(t => !t.IsAbstract && typeof(ControllerBase).IsAssignableFrom(t));

        foreach (var controlador in controladores)
            foreach (var metodo in controlador.GetMethods(
                        BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly))
            {
                if (!metodo.GetCustomAttributes<HttpMethodAttribute>().Any()) continue;

                var declara = metodo.IsDefined(typeof(AuthorizeAttribute), true)
                    || metodo.IsDefined(typeof(AllowAnonymousAttribute), true)
                    || controlador.IsDefined(typeof(AuthorizeAttribute), true);

                if (!declara) sinPolitica.Add($"{controlador.Name}.{metodo.Name}");
            }

        Assert.Empty(sinPolitica);
    }
}
