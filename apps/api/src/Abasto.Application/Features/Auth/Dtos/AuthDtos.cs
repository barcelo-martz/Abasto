using Abasto.Domain.Entities;
using Abasto.Domain.Enums;

namespace Abasto.Application.Features.Auth.Dtos;

public sealed record RegistroRequest(
    string Correo, string Contrasena, string Nombres, string Apellidos, Guid ProvinciaId, Guid MunicipioId);
public sealed record LoginRequest(string Correo, string Contrasena);
public sealed record VerificarCorreoRequest(string Token);
public sealed record RefreshRequest(string RefreshToken);

public sealed record RegistroRespuesta(Guid UsuarioId, bool RequiereVerificacion);

public sealed record UsuarioSesionDto(
    Guid Id, string Correo, string Nombres, string Apellidos, RolUsuario Rol,
    Guid? ProvinciaId, Guid? MunicipioId, Guid? FarmaciaId, Guid? AlmacenId)
{
    public static UsuarioSesionDto De(Usuario u) => new(
        u.Id, u.Correo, u.Nombres, u.Apellidos, u.Rol, u.ProvinciaId, u.MunicipioId, u.FarmaciaId, u.AlmacenId);
}

public sealed record AuthRespuesta(
    string AccessToken, DateTime AccessTokenExpiraEn, string RefreshToken, UsuarioSesionDto Usuario);
