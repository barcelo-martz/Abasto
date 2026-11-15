using Abasto.Domain.Common;
using Abasto.Domain.Entities;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Infrastructure.Persistence;

public class AbastoDbContext(DbContextOptions<AbastoDbContext> options) : DbContext(options)
{

    public DbSet<Provincia> Provincias => Set<Provincia>();
    public DbSet<Municipio> Municipios => Set<Municipio>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<TokenUsuario> TokensUsuario => Set<TokenUsuario>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Farmacia> Farmacias => Set<Farmacia>();
    public DbSet<HorarioFarmacia> HorariosFarmacia => Set<HorarioFarmacia>();
    public DbSet<Almacen> Almacenes => Set<Almacen>();
    public DbSet<UnidadSalud> UnidadesSalud => Set<UnidadSalud>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<PrincipioActivo> PrincipiosActivos => Set<PrincipioActivo>();
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<ProductoPrincipioActivo> ProductosPrincipiosActivos => Set<ProductoPrincipioActivo>();
    public DbSet<GuiaProducto> GuiasProducto => Set<GuiaProducto>();
    public DbSet<Inventario> Inventarios => Set<Inventario>();
    public DbSet<MovimientoInventario> MovimientosInventario => Set<MovimientoInventario>();
    public DbSet<ImportacionInventario> ImportacionesInventario => Set<ImportacionInventario>();
    public DbSet<ParametroSistema> ParametrosSistema => Set<ParametroSistema>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("postgis");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AbastoDbContext).Assembly);
        modelBuilder.UseSnakeUpperEnums();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var ahora = DateTime.UtcNow;

        foreach (var entrada in ChangeTracker.Entries<EntidadBase>())
        {
            if (entrada.State == EntityState.Added)
            {
                entrada.Entity.CreadoEn = ahora;
                entrada.Entity.ActualizadoEn = ahora;
            }
            else if (entrada.State == EntityState.Modified)
            {
                entrada.Entity.ActualizadoEn = ahora;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
