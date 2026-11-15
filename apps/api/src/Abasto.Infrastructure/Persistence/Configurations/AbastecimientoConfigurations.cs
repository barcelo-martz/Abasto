using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class CicloAbastecimientoConfiguration : IEntityTypeConfiguration<CicloAbastecimiento>
{
    public void Configure(EntityTypeBuilder<CicloAbastecimiento> b)
    {
        b.ToTable("ciclos_abastecimiento", t =>
        {
            t.CheckEnum(typeof(EstadoCiclo), "ciclos_abastecimiento", "estado");
            t.HasCheckConstraint("ck_ciclos_abastecimiento_fechas", "fecha_fin >= fecha_inicio");
        });
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
    }
}

public class DistribucionConfiguration : IEntityTypeConfiguration<Distribucion>
{
    public void Configure(EntityTypeBuilder<Distribucion> b)
    {
        b.ToTable("distribuciones", t => t.CheckEnum(typeof(EstadoDistribucion), "distribuciones", "estado"));
        b.Property(x => x.Codigo).HasMaxLength(30).IsRequired();
        b.Property(x => x.MontoTotal).HasPrecision(14, 2);
        b.Property(x => x.Observaciones).HasMaxLength(500);
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasMany(x => x.Detalles).WithOne().HasForeignKey(d => d.DistribucionId)
            .OnDelete(DeleteBehavior.Cascade);
        b.Ref<Distribucion, CicloAbastecimiento>(nameof(Distribucion.CicloId));
        b.Ref<Distribucion, Almacen>(nameof(Distribucion.AlmacenId));
        b.Ref<Distribucion, Farmacia>(nameof(Distribucion.FarmaciaId));
        b.Ref<Distribucion, Usuario>(nameof(Distribucion.RegistradaPorId));
        b.Ref<Distribucion, Usuario>(nameof(Distribucion.ConfirmadaPorId));
    }
}

public class DistribucionDetalleConfiguration : IEntityTypeConfiguration<DistribucionDetalle>
{
    public void Configure(EntityTypeBuilder<DistribucionDetalle> b)
    {
        b.ToTable("distribuciones_detalle");
        b.Property(x => x.CantidadEnviada).HasPrecision(14, 2);
        b.Property(x => x.CantidadRecibida).HasPrecision(14, 2);
        b.Property(x => x.PrecioUnitario).HasPrecision(14, 2);
        b.Property(x => x.MontoTotal).HasPrecision(14, 2);
        b.HasIndex(x => new { x.DistribucionId, x.ProductoId }).IsUnique();
        b.Ref<DistribucionDetalle, Producto>(nameof(DistribucionDetalle.ProductoId));
    }
}

public class TrasladoConfiguration : IEntityTypeConfiguration<Traslado>
{
    public void Configure(EntityTypeBuilder<Traslado> b)
    {
        b.ToTable("traslados", t =>
        {
            t.CheckEnum(typeof(EstadoTraslado), "traslados", "estado");
            t.HasCheckConstraint("ck_traslados_origen_destino", "farmacia_origen_id <> farmacia_destino_id");
        });
        b.Property(x => x.Codigo).HasMaxLength(30).IsRequired();
        b.Property(x => x.Motivo).HasMaxLength(300).IsRequired();
        b.Property(x => x.ComentarioResolucion).HasMaxLength(500);
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasMany(x => x.Detalles).WithOne().HasForeignKey(d => d.TrasladoId)
            .OnDelete(DeleteBehavior.Cascade);
        b.Ref<Traslado, Farmacia>(nameof(Traslado.FarmaciaOrigenId));
        b.Ref<Traslado, Farmacia>(nameof(Traslado.FarmaciaDestinoId));
        b.Ref<Traslado, Usuario>(nameof(Traslado.SolicitadoPorId));
        b.Ref<Traslado, Usuario>(nameof(Traslado.AprobadoPorId));
    }
}

public class TrasladoDetalleConfiguration : IEntityTypeConfiguration<TrasladoDetalle>
{
    public void Configure(EntityTypeBuilder<TrasladoDetalle> b)
    {
        b.ToTable("traslados_detalle");
        b.Property(x => x.CantidadSolicitada).HasPrecision(14, 2);
        b.Property(x => x.CantidadAprobada).HasPrecision(14, 2);
        b.Property(x => x.CantidadRecibida).HasPrecision(14, 2);
        b.HasIndex(x => new { x.TrasladoId, x.ProductoId }).IsUnique();
        b.Ref<TrasladoDetalle, Producto>(nameof(TrasladoDetalle.ProductoId));
    }
}

public class RemisionCronicaConfiguration : IEntityTypeConfiguration<RemisionCronica>
{
    public void Configure(EntityTypeBuilder<RemisionCronica> b)
    {
        b.ToTable("remisiones_cronicas", t =>
        {
            t.CheckEnum(typeof(EstadoRemision), "remisiones_cronicas", "estado");
            t.HasCheckConstraint("ck_remisiones_cronicas_origen_destino", "farmacia_origen_id <> farmacia_destino_id");
        });
        b.Property(x => x.Codigo).HasMaxLength(30).IsRequired();
        b.Property(x => x.CodigoReferencia).HasMaxLength(50).IsRequired();
        b.Property(x => x.Motivo).HasMaxLength(300);
        b.HasIndex(x => x.Codigo).IsUnique();
        b.Ref<RemisionCronica, Farmacia>(nameof(RemisionCronica.FarmaciaOrigenId));
        b.Ref<RemisionCronica, Farmacia>(nameof(RemisionCronica.FarmaciaDestinoId));
        b.Ref<RemisionCronica, Producto>(nameof(RemisionCronica.ProductoId));
        b.Ref<RemisionCronica, Usuario>(nameof(RemisionCronica.AprobadaPorId));
    }
}
