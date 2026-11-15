using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Abasto.Infrastructure.Persistence.Seed;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class ParametroSistemaConfiguration : IEntityTypeConfiguration<ParametroSistema>
{
    public void Configure(EntityTypeBuilder<ParametroSistema> b)
    {
        b.ToTable("parametros_sistema", t => t.CheckEnum(typeof(TipoParametro), "parametros_sistema", "tipo"));
        b.Property(x => x.Clave).HasMaxLength(100).IsRequired();
        b.Property(x => x.Valor).HasMaxLength(500).IsRequired();
        b.Property(x => x.Descripcion).HasMaxLength(300);
        b.HasIndex(x => x.Clave).IsUnique();
        b.HasOne<Usuario>().WithMany().HasForeignKey(x => x.ActualizadoPorId).OnDelete(DeleteBehavior.Restrict);
        b.HasData(ParametrosSeed.Parametros());
    }
}
