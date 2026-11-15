using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
{
    public void Configure(EntityTypeBuilder<Categoria> b)
    {
        b.ToTable("categorias");
        b.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
        b.Property(x => x.Descripcion).HasMaxLength(500);
        b.HasIndex(x => new { x.PadreId, x.Nombre }).IsUnique();
        b.HasOne(x => x.Padre).WithMany(c => c.Hijas).HasForeignKey(x => x.PadreId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class PrincipioActivoConfiguration : IEntityTypeConfiguration<PrincipioActivo>
{
    public void Configure(EntityTypeBuilder<PrincipioActivo> b)
    {
        b.ToTable("principios_activos");
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.Property(x => x.Descripcion).HasMaxLength(500);
        b.HasIndex(x => x.Nombre).IsUnique();
    }
}

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> b)
    {
        b.ToTable("productos", t =>
        {
            t.CheckEnum(typeof(TipoProducto), "productos", "tipo");
            t.CheckEnum(typeof(UnidadInventario), "productos", "unidad_inventario");
        });
        b.Property(x => x.Codigo).HasMaxLength(50).IsRequired();
        b.Property(x => x.Nombre).HasMaxLength(200).IsRequired();
        b.Property(x => x.NombreComercial).HasMaxLength(200);
        b.Property(x => x.Concentracion).HasMaxLength(100);
        b.Property(x => x.Presentacion).HasMaxLength(150);
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasIndex(x => x.Nombre);
        b.HasOne(x => x.Categoria).WithMany().HasForeignKey(x => x.CategoriaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ProductoPrincipioActivoConfiguration : IEntityTypeConfiguration<ProductoPrincipioActivo>
{
    public void Configure(EntityTypeBuilder<ProductoPrincipioActivo> b)
    {
        b.ToTable("productos_principios_activos");
        b.HasKey(x => new { x.ProductoId, x.PrincipioActivoId });
        b.Property(x => x.Cantidad).HasPrecision(14, 3);
        b.Property(x => x.Unidad).HasMaxLength(20);
        b.HasOne(x => x.Producto).WithMany(p => p.PrincipiosActivos).HasForeignKey(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasOne(x => x.PrincipioActivo).WithMany().HasForeignKey(x => x.PrincipioActivoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class GuiaProductoConfiguration : IEntityTypeConfiguration<GuiaProducto>
{
    public void Configure(EntityTypeBuilder<GuiaProducto> b)
    {
        b.ToTable("guias_producto");
        b.Property(x => x.ParaQueSirve).IsRequired();
        b.Property(x => x.Fuente).HasMaxLength(250);
        b.HasIndex(x => x.ProductoId).IsUnique();
        b.HasOne(x => x.Producto).WithOne(p => p.Guia).HasForeignKey<GuiaProducto>(x => x.ProductoId)
            .OnDelete(DeleteBehavior.Cascade);
        b.HasOne<Usuario>().WithMany().HasForeignKey(x => x.RevisadoPorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
