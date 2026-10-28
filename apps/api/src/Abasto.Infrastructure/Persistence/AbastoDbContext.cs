using Microsoft.EntityFrameworkCore;

namespace Abasto.Infrastructure.Persistence;

public class AbastoDbContext(DbContextOptions<AbastoDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AbastoDbContext).Assembly);
    }
}