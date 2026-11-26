using Abasto.Application.Common.Abstractions;
using Abasto.Application.Common.Excepciones;
using Abasto.Application.Features.Auth;
using Abasto.Application.Features.Auth.Commands;
using Abasto.Application.Features.Auth.Dtos;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Identity;
using Abasto.Infrastructure.Persistence;
using Abasto.Infrastructure.Persistence.Seed;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Abasto.IntegrationTests;

internal sealed class CorreoFalso : IEmailSender
{
    public string? UltimoToken { get; private set; }
    public string? UltimoTokenRecuperacion { get; private set; }

    public Task EnviarVerificacionCorreoAsync(string correo, string nombre, string token, CancellationToken ct)
    {
        UltimoToken = token;
        return Task.CompletedTask;
    }

    public Task EnviarRecuperacionContrasenaAsync(
        string correo, string nombre, string token, CancellationToken ct)
    {
        UltimoTokenRecuperacion = token;
        return Task.CompletedTask;
    }
}

internal sealed class Escenario(AbastoDbContext db, CorreoFalso correo)
{
    private readonly ContrasenaHasher _hasher = new();
    private readonly JwtTokenService _tokens = new(
        Options.Create(new JwtOptions { Key = new string('k', 48) }), TimeProvider.System);

    private EmisorSesion Sesion => new(db, _tokens, TimeProvider.System);

    public Task<RegistroRespuesta> Registrar(string email, string clave) =>
        new RegistrarCiudadanoHandler(db, _hasher, _tokens, correo, TimeProvider.System).Handle(
            new RegistrarCiudadanoCommand(email, clave, "Ana", "Pérez",
                TerritorioSeed.Provincias()[0].Id, TerritorioSeed.Municipios()[0].Id), default);

    public Task Verificar(string token) =>
        new VerificarCorreoHandler(db, _tokens, TimeProvider.System).Handle(new VerificarCorreoCommand(token), default);

    public Task SolicitarRecuperacion(string email) =>
        new SolicitarRecuperacionContrasenaHandler(db, _tokens, correo, TimeProvider.System)
            .Handle(new SolicitarRecuperacionContrasenaCommand(email), default);

    public Task Restablecer(string token, string clave) =>
        new RestablecerContrasenaHandler(db, _tokens, _hasher, TimeProvider.System)
            .Handle(new RestablecerContrasenaCommand(token, clave), default);

    public Task<AuthRespuesta> Login(string email, string clave) =>
        new LoginHandler(db, _hasher, Sesion, TimeProvider.System)
            .Handle(new LoginCommand(email, clave, "127.0.0.1", "pruebas"), default);

    public Task<AuthRespuesta> Refrescar(string refresh) =>
        new RefrescarHandler(db, _tokens, Sesion, TimeProvider.System)
            .Handle(new RefrescarCommand(refresh, "127.0.0.1", "pruebas"), default);

    public Task Cerrar(string refresh) =>
        new CerrarSesionHandler(db, _tokens, TimeProvider.System).Handle(new CerrarSesionCommand(refresh), default);
}

[Collection(BaseDatosColeccion.Nombre)]
public class AuthFlujoTests(BaseDatosFixture bd)
{
    private const string Clave = "Clave1234";

    private static string NuevoCorreo() => $"ana-{Guid.NewGuid():N}@abasto.cu";

    private async Task Ejecutar(CorreoFalso correo, Func<Escenario, Task> accion)
    {
        await using var db = bd.CrearContexto();
        await accion(new Escenario(db, correo));
    }

    private async Task<T> Obtener<T>(CorreoFalso correo, Func<Escenario, Task<T>> accion)
    {
        await using var db = bd.CrearContexto();
        return await accion(new Escenario(db, correo));
    }

    private async Task<(string Email, CorreoFalso Correo)> RegistrarYVerificar()
    {
        var email = NuevoCorreo();
        var correo = new CorreoFalso();
        await Ejecutar(correo, e => e.Registrar(email, Clave));
        await Ejecutar(correo, e => e.Verificar(correo.UltimoToken!));
        return (email, correo);
    }

    [Fact]
    public async Task Registro_verificacion_login_y_refresh_con_rotacion()
    {
        var email = NuevoCorreo();
        var correo = new CorreoFalso();

        await Ejecutar(correo, e => e.Registrar(email, Clave));
        Assert.NotNull(correo.UltimoToken);

        await Assert.ThrowsAsync<ProhibidoException>(() => Ejecutar(correo, e => e.Login(email, Clave)));

        await Ejecutar(correo, e => e.Verificar(correo.UltimoToken!));
        var sesion = await Obtener(correo, e => e.Login(email, Clave));
        Assert.Equal(RolUsuario.Ciudadano, sesion.Usuario.Rol);
        Assert.False(string.IsNullOrEmpty(sesion.AccessToken));

        var nueva = await Obtener(correo, e => e.Refrescar(sesion.RefreshToken));
        Assert.NotEqual(sesion.RefreshToken, nueva.RefreshToken);

        await Assert.ThrowsAsync<NoAutorizadoException>(() => Ejecutar(correo, e => e.Refrescar(sesion.RefreshToken)));
        await Assert.ThrowsAsync<NoAutorizadoException>(() => Ejecutar(correo, e => e.Refrescar(nueva.RefreshToken)));
    }

    [Fact]
    public async Task Logout_invalida_el_refresh_token()
    {
        var (email, correo) = await RegistrarYVerificar();
        var sesion = await Obtener(correo, e => e.Login(email, Clave));

        await Ejecutar(correo, e => e.Cerrar(sesion.RefreshToken));
        await Ejecutar(correo, e => e.Cerrar(sesion.RefreshToken));

        await Assert.ThrowsAsync<NoAutorizadoException>(() => Ejecutar(correo, e => e.Refrescar(sesion.RefreshToken)));
    }

    [Fact]
    public async Task Tras_varios_intentos_fallidos_la_cuenta_se_bloquea()
    {
        var (email, correo) = await RegistrarYVerificar();

        for (var i = 0; i < 5; i++)
            await Assert.ThrowsAsync<NoAutorizadoException>(() => Ejecutar(correo, e => e.Login(email, "incorrecta1")));

        await Assert.ThrowsAsync<CuentaBloqueadaException>(() => Ejecutar(correo, e => e.Login(email, Clave)));
    }

    [Fact]
    public async Task No_se_puede_registrar_dos_veces_el_mismo_correo()
    {
        var email = NuevoCorreo();
        var correo = new CorreoFalso();

        await Ejecutar(correo, e => e.Registrar(email, Clave));
        await Assert.ThrowsAsync<ConflictoException>(() => Ejecutar(correo, e => e.Registrar(email, Clave)));
    }

    [Fact]
    public async Task Recuperacion_actualiza_contrasena_y_el_token_es_de_un_solo_uso()
    {
        var (email, correo) = await RegistrarYVerificar();
        const string nuevaClave = "NuevaClave567";
        var sesionAnterior = await Obtener(correo, e => e.Login(email, Clave));

        await Ejecutar(correo, e => e.SolicitarRecuperacion(email));
        Assert.NotNull(correo.UltimoTokenRecuperacion);
        await Ejecutar(correo, e => e.Restablecer(correo.UltimoTokenRecuperacion!, nuevaClave));
        await Assert.ThrowsAsync<ValidationException>(() =>
            Ejecutar(correo, e => e.Restablecer(correo.UltimoTokenRecuperacion!, "OtraClave789")));
        await Assert.ThrowsAsync<NoAutorizadoException>(() =>
            Obtener(correo, e => e.Refrescar(sesionAnterior.RefreshToken)));

        var sesion = await Obtener(correo, e => e.Login(email, nuevaClave));
        Assert.Equal(RolUsuario.Ciudadano, sesion.Usuario.Rol);
    }

    [Fact]
    public async Task Solicitar_recuperacion_no_revela_si_el_correo_existe()
    {
        var correo = new CorreoFalso();
        await Ejecutar(correo, e => e.SolicitarRecuperacion(NuevoCorreo()));

        Assert.Null(correo.UltimoTokenRecuperacion);
    }
}
