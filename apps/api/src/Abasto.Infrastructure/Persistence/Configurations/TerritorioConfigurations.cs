using Abasto.Domain.Entities;
using Abasto.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class ProvinciaConfiguration : IEntityTypeConfiguration<Provincia>
{
    public void Configure(EntityTypeBuilder<Provincia> b)
    {
        b.ToTable("provincias");
        b.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
        b.Property(x => x.Codigo).HasMaxLength(20).IsRequired();
        b.HasIndex(x => x.Nombre).IsUnique();
        b.HasIndex(x => x.Codigo).IsUnique();
        b.HasData(TerritorioSeed.Provincias());
    }
}

public class MunicipioConfiguration : IEntityTypeConfiguration<Municipio>
{
    public void Configure(EntityTypeBuilder<Municipio> b)
    {
        b.ToTable("municipios");
        b.Property(x => x.Nombre).HasMaxLength(100).IsRequired();
        b.Property(x => x.Codigo).HasMaxLength(20).IsRequired();
        b.HasOne(x => x.Provincia).WithMany(p => p.Municipios)
            .HasForeignKey(x => x.ProvinciaId).OnDelete(DeleteBehavior.Restrict);
        b.HasIndex(x => new { x.ProvinciaId, x.Nombre }).IsUnique();
        b.HasData(TerritorioSeed.Municipios());
    }
}
