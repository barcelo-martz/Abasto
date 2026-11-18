using System.Security.Claims;
using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Common;
using Abasto.Domain.Enums;

namespace Abasto.Api.Services;

public sealed class UsuarioActual(IHttpContextAccessor accesor) : ICurrentUser
{
    private ClaimsPrincipal? Principal => accesor.HttpContext?.User;

    public bool EstaAutenticado => Principal?.Identity?.IsAuthenticated == true;
    public Guid? Id => LeerGuid("sub");
    public RolUsuario? Rol => EnumTexto.Parsear<RolUsuario>(Principal?.FindFirst("rol")?.Value);
    public Guid? ProvinciaId => LeerGuid("provinciaId");
    public Guid? MunicipioId => LeerGuid("municipioId");
    public Guid? FarmaciaId => LeerGuid("farmaciaId");
    public Guid? AlmacenId => LeerGuid("almacenId");

    private Guid? LeerGuid(string claim) =>
        Guid.TryParse(Principal?.FindFirst(claim)?.Value, out var id) ? id : null;
}
