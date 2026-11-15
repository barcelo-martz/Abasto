using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> b)
    {
        b.ToTable("usuarios", t =>
        {
            t.CheckEnum(typeof(RolUsuario), "usuarios", "rol");
            t.CheckEnum(typeof(EstadoUsuario), "usuarios", "estado");
            t.HasCheckConstraint("ck_usuarios_farmacia_requerida",
                "rol <> 'PERSONAL_FARMACIA' OR farmacia_id IS NOT NULL");
            t.HasCheckConstraint("ck_usuarios_almacen_requerido",
                "rol <> 'PERSONAL_ALMACEN' OR almacen_id IS NOT NULL");
            t.HasCheckConstraint("ck_usuarios_municipio_requerido",
                "rol <> 'SUPERVISOR_MUNICIPAL' OR municipio_id IS NOT NULL");
        });

        b.Property(x => x.Correo).HasMaxLength(254).IsRequired();
        b.Property(x => x.ContrasenaHash).HasMaxLength(255).IsRequired();
        b.Property(x => x.Nombres).HasMaxLength(100).IsRequired();
        b.Property(x => x.Apellidos).HasMaxLength(100).IsRequired();
        b.Property(x => x.Telefono).HasMaxLength(30);
        b.Property(x => x.Direccion).HasMaxLength(250);
        b.Property(x => x.CarnetIdentidad).HasMaxLength(20);
        b.Property(x => x.IntentosFallidos).HasDefaultValue(0);
        b.HasIndex(x => x.Correo).IsUnique();
        b.HasIndex(x => x.FarmaciaId).IsUnique().HasFilter("rol = 'PERSONAL_FARMACIA'");

        b.HasOne(x => x.Provincia).WithMany().HasForeignKey(x => x.ProvinciaId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Municipio).WithMany().HasForeignKey(x => x.MunicipioId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Farmacia).WithMany().HasForeignKey(x => x.FarmaciaId)
            .OnDelete(DeleteBehavior.Restrict);
        b.HasOne(x => x.Almacen).WithMany().HasForeignKey(x => x.AlmacenId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> b)
    {
        b.ToTable("refresh_tokens");
        b.Property(x => x.TokenHash).HasMaxLength(128).IsRequired();
        b.Property(x => x.Ip).HasMaxLength(45);
        b.Property(x => x.UserAgent).HasMaxLength(300);
        b.HasIndex(x => x.TokenHash).IsUnique();
        b.HasIndex(x => x.UsuarioId);
        b.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class TokenUsuarioConfiguration : IEntityTypeConfiguration<TokenUsuario>
{
    public void Configure(EntityTypeBuilder<TokenUsuario> b)
    {
        b.ToTable("tokens_usuario", t => t.CheckEnum(typeof(TipoTokenUsuario), "tokens_usuario", "tipo"));
        b.Property(x => x.TokenHash).HasMaxLength(128).IsRequired();
        b.HasIndex(x => x.TokenHash).IsUnique();
        b.HasIndex(x => x.UsuarioId);
        b.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> b)
    {
        b.ToTable("audit_logs");
        b.Property(x => x.Accion).HasMaxLength(100).IsRequired();
        b.Property(x => x.Entidad).HasMaxLength(100).IsRequired();
        b.Property(x => x.DatosAnteriores).HasColumnType("jsonb");
        b.Property(x => x.DatosNuevos).HasColumnType("jsonb");
        b.Property(x => x.Ip).HasMaxLength(45);
        b.HasIndex(x => new { x.Entidad, x.EntidadId });
        b.HasIndex(x => x.UsuarioId);
        b.HasIndex(x => x.CreadoEn);
        b.HasOne(x => x.Usuario).WithMany().HasForeignKey(x => x.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
