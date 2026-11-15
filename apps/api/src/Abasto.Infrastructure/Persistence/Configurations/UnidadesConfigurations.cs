using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class FarmaciaConfiguration : IEntityTypeConfiguration<Farmacia>
{
    public void Configure(EntityTypeBuilder<Farmacia> b)
    {
        b.ToTable("farmacias", t =>
        {
            t.CheckEnum(typeof(TipoPropiedadFarmacia), "farmacias", "tipo_propiedad");
            t.CheckEnum(typeof(EstadoUnidad), "farmacias", "estado");
        });
        b.Property(x => x.Codigo).HasMaxLength(30).IsRequired();
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.Property(x => x.Direccion).HasMaxLength(250).IsRequired();
        b.Property(x => x.Telefono).HasMaxLength(30);
        b.Property(x => x.Ubicacion).HasColumnType("geography(Point,4326)").IsRequired();
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasIndex(x => x.Ubicacion).HasMethod("gist");
        b.HasIndex(x => x.MunicipioId);
        b.HasOne(x => x.Municipio).WithMany().HasForeignKey(x => x.MunicipioId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Almacen).WithMany().HasForeignKey(x => x.AlmacenId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class HorarioFarmaciaConfiguration : IEntityTypeConfiguration<HorarioFarmacia>
{
    public void Configure(EntityTypeBuilder<HorarioFarmacia> b)
    {
        b.ToTable("horarios_farmacia", t =>
        {
            t.CheckEnum(typeof(DiaSemana), "horarios_farmacia", "dia_semana");
            t.HasCheckConstraint("ck_horarios_farmacia_horas",
                "cerrado OR (abre_a IS NOT NULL AND cierra_a IS NOT NULL)");
        });
        b.HasIndex(x => new { x.FarmaciaId, x.DiaSemana }).IsUnique();
        b.HasOne(x => x.Farmacia).WithMany(f => f.Horarios).HasForeignKey(x => x.FarmaciaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class AlmacenConfiguration : IEntityTypeConfiguration<Almacen>
{
    public void Configure(EntityTypeBuilder<Almacen> b)
    {
        b.ToTable("almacenes", t => t.CheckEnum(typeof(EstadoUnidad), "almacenes", "estado"));
        b.Property(x => x.Codigo).HasMaxLength(30).IsRequired();
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.Property(x => x.Direccion).HasMaxLength(250).IsRequired();
        b.Property(x => x.Telefono).HasMaxLength(30);
        b.Property(x => x.Ubicacion).HasColumnType("geography(Point,4326)");
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasOne(x => x.Provincia).WithMany().HasForeignKey(x => x.ProvinciaId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class UnidadSaludConfiguration : IEntityTypeConfiguration<UnidadSalud>
{
    public void Configure(EntityTypeBuilder<UnidadSalud> b)
    {
        b.ToTable("unidades_salud", t => t.CheckEnum(typeof(TipoUnidadSalud), "unidades_salud", "tipo"));
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.Property(x => x.Direccion).HasMaxLength(250);
        b.Property(x => x.Telefono).HasMaxLength(30);
        b.Property(x => x.Ubicacion).HasColumnType("geography(Point,4326)");
        b.HasOne(x => x.Municipio).WithMany().HasForeignKey(x => x.MunicipioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
