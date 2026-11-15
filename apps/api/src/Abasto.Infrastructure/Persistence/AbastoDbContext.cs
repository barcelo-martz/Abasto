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
    public DbSet<CicloAbastecimiento> CiclosAbastecimiento => Set<CicloAbastecimiento>();
    public DbSet<Distribucion> Distribuciones => Set<Distribucion>();
    public DbSet<DistribucionDetalle> DistribucionesDetalle => Set<DistribucionDetalle>();
    public DbSet<Traslado> Traslados => Set<Traslado>();
    public DbSet<TrasladoDetalle> TrasladosDetalle => Set<TrasladoDetalle>();
    public DbSet<RemisionCronica> RemisionesCronicas => Set<RemisionCronica>();
    public DbSet<ListaMedicamentos> ListasMedicamentos => Set<ListaMedicamentos>();
    public DbSet<ListaMedicamentosItem> ListasMedicamentosItems => Set<ListaMedicamentosItem>();
    public DbSet<LecturaReceta> LecturasReceta => Set<LecturaReceta>();
    public DbSet<LecturaRecetaItem> LecturasRecetaItems => Set<LecturaRecetaItem>();
    public DbSet<SuscripcionAlerta> SuscripcionesAlerta => Set<SuscripcionAlerta>();
    public DbSet<Notificacion> Notificaciones => Set<Notificacion>();
    public DbSet<MensajeContacto> MensajesContacto => Set<MensajeContacto>();
    public DbSet<PlanRecorrido> PlanesRecorrido => Set<PlanRecorrido>();
    public DbSet<PlanRecorridoParada> PlanesRecorridoParadas => Set<PlanRecorridoParada>();
    public DbSet<Favorito> Favoritos => Set<Favorito>();
    public DbSet<Recordatorio> Recordatorios => Set<Recordatorio>();
    public DbSet<AlternativaProducto> AlternativasProducto => Set<AlternativaProducto>();
    public DbSet<BusquedaRegistro> BusquedasRegistro => Set<BusquedaRegistro>();
    public DbSet<PrediccionDisponibilidad> PrediccionesDisponibilidad => Set<PrediccionDisponibilidad>();
    public DbSet<AlertaTemprana> AlertasTempranas => Set<AlertaTemprana>();
    public DbSet<Anomalia> Anomalias => Set<Anomalia>();
    public DbSet<OperacionSync> OperacionesSync => Set<OperacionSync>();

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
