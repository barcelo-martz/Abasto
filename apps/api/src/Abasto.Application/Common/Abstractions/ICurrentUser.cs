using Abasto.Domain.Enums;

namespace Abasto.Application.Common.Abstractions;

public interface ICurrentUser
{
    bool EstaAutenticado { get; }
    Guid? Id { get; }
    RolUsuario? Rol { get; }
    Guid? ProvinciaId { get; }
    Guid? MunicipioId { get; }
    Guid? FarmaciaId { get; }
    Guid? AlmacenId { get; }
}
