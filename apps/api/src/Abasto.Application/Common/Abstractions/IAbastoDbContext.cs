using Abasto.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Common.Abstractions;

public interface IAbastoDbContext
{
    DbSet<Provincia> Provincias { get; }
    DbSet<Municipio> Municipios { get; }
    DbSet<Usuario> Usuarios { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<TokenUsuario> TokensUsuario { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<ParametroSistema> ParametrosSistema { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
