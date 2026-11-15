using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class InventarioConfiguration : IEntityTypeConfiguration<Inventario>
{
    public void Configure(EntityTypeBuilder<Inventario> b)
    {
        b.ToTable("inventarios", t =>
        {
            t.CheckEnum(typeof(EstadoDisponibilidad), "inventarios", "estado_disponibilidad");
            t.CheckEnum(typeof(NivelConfianza), "inventarios", "nivel_confianza");
            t.CheckEnum(typeof(OrigenDato), "inventarios", "origen_dato");
            t.HasCheckConstraint("ck_inventarios_una_unidad", "num_nonnulls(farmacia_id, almacen_id) = 1");
            t.HasCheckConstraint("ck_inventarios_cantidad", "cantidad >= 0");
            t.HasCheckConstraint("ck_inventarios_precio", "precio_unitario >= 0");
        });

        b.Property(x => x.Cantidad).HasPrecision(14, 2);
        b.Property(x => x.PrecioUnitario).HasPrecision(14, 2);
        b.Property(x => x.Minimo).HasPrecision(14, 2);
        b.Property(x => x.Maximo).HasPrecision(14, 2);
        b.Property(x => x.MontoTotal).HasPrecision(14, 2)
            .HasComputedColumnSql("cantidad * precio_unitario", stored: true);

        // Un producto una sola vez por unidad
        b.HasIndex(x => new { x.FarmaciaId, x.ProductoId }).IsUnique().HasFilter("farmacia_id IS NOT NULL");
        b.HasIndex(x => new { x.AlmacenId, x.ProductoId }).IsUnique().HasFilter("almacen_id IS NOT NULL");
        b.HasIndex(x => x.ProductoId);

        b.HasOne(x => x.Farmacia).WithMany().HasForeignKey(x => x.FarmaciaId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Almacen).WithMany().HasForeignKey(x => x.AlmacenId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Producto).WithMany().HasForeignKey(x => x.ProductoId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne<Usuario>().WithMany().HasForeignKey(x => x.ActualizadoPorId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class MovimientoInventarioConfiguration : IEntityTypeConfiguration<MovimientoInventario>
{
    public void Configure(EntityTypeBuilder<MovimientoInventario> b)
    {
        b.ToTable("movimientos_inventario", t =>
        {
            t.CheckEnum(typeof(TipoMovimiento), "movimientos_inventario", "tipo");
            t.CheckEnum(typeof(OrigenDato), "movimientos_inventario", "origen_dato");
            t.HasCheckConstraint("ck_movimientos_inventario_cantidad", "cantidad > 0");
        });

        b.Property(x => x.Cantidad).HasPrecision(14, 2);
        b.Property(x => x.CantidadAnterior).HasPrecision(14, 2);
        b.Property(x => x.CantidadPosterior).HasPrecision(14, 2);
        b.Property(x => x.PrecioUnitario).HasPrecision(14, 2);
        b.Property(x => x.MontoTotal).HasPrecision(14, 2);
        b.Property(x => x.Motivo).HasMaxLength(300);

        b.HasIndex(x => new { x.InventarioId, x.FechaOperacion });
        b.HasIndex(x => x.IdCliente).IsUnique().HasFilter("id_cliente IS NOT NULL");

        b.HasOne(x => x.Inventario).WithMany(i => i.Movimientos).HasForeignKey(x => x.InventarioId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne<Usuario>().WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class ImportacionInventarioConfiguration : IEntityTypeConfiguration<ImportacionInventario>
{
    public void Configure(EntityTypeBuilder<ImportacionInventario> b)
    {
        b.ToTable("importaciones_inventario", t =>
        {
            t.CheckEnum(typeof(FormatoArchivo), "importaciones_inventario", "formato");
            t.CheckEnum(typeof(EstadoImportacion), "importaciones_inventario", "estado");
            t.HasCheckConstraint("ck_importaciones_inventario_una_unidad", "num_nonnulls(farmacia_id, almacen_id) = 1");
        });

        b.Property(x => x.NombreArchivo).HasMaxLength(255).IsRequired();
        b.Property(x => x.Errores).HasColumnType("jsonb");

        b.HasOne<Farmacia>().WithMany().HasForeignKey(x => x.FarmaciaId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne<Almacen>().WithMany().HasForeignKey(x => x.AlmacenId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne<Usuario>().WithMany().HasForeignKey(x => x.UsuarioId).OnDelete(DeleteBehavior.Restrict);
    }
}
