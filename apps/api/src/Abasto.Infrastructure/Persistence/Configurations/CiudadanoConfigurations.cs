using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class ListaMedicamentosConfiguration : IEntityTypeConfiguration<ListaMedicamentos>
{
    public void Configure(EntityTypeBuilder<ListaMedicamentos> b)
    {
        b.ToTable("listas_medicamentos");
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.HasMany(x => x.Items).WithOne().HasForeignKey(i => i.ListaId).OnDelete(DeleteBehavior.Cascade);
        b.Ref<ListaMedicamentos, Usuario>(nameof(ListaMedicamentos.UsuarioId));
        b.Ref<ListaMedicamentos, LecturaReceta>(nameof(ListaMedicamentos.OrigenRecetaId));
    }
}

public class ListaMedicamentosItemConfiguration : IEntityTypeConfiguration<ListaMedicamentosItem>
{
    public void Configure(EntityTypeBuilder<ListaMedicamentosItem> b)
    {
        b.ToTable("listas_medicamentos_items");
        b.Property(x => x.Nota).HasMaxLength(300);
        b.HasIndex(x => new { x.ListaId, x.ProductoId }).IsUnique();
        b.Ref<ListaMedicamentosItem, Producto>(nameof(ListaMedicamentosItem.ProductoId));
    }
}

public class LecturaRecetaConfiguration : IEntityTypeConfiguration<LecturaReceta>
{
    public void Configure(EntityTypeBuilder<LecturaReceta> b)
    {
        b.ToTable("lecturas_receta", t =>
        {
            t.CheckEnum(typeof(TipoDocumentoReceta), "lecturas_receta", "tipo_documento");
            t.CheckEnum(typeof(EstadoLectura), "lecturas_receta", "estado");
            t.HasCheckConstraint("ck_lecturas_receta_confianza",
                "confianza_global IS NULL OR confianza_global BETWEEN 0 AND 1");
        });
        b.Property(x => x.ImagenRef).HasMaxLength(250);
        b.Property(x => x.ProveedorOcr).HasMaxLength(100);
        b.Property(x => x.ConfianzaGlobal).HasPrecision(5, 4);
        b.HasIndex(x => x.ExpiraEn); // limpieza de lecturas vencidas
        b.HasMany(x => x.Items).WithOne().HasForeignKey(i => i.LecturaId).OnDelete(DeleteBehavior.Cascade);
        b.Ref<LecturaReceta, Usuario>(nameof(LecturaReceta.UsuarioId));
    }
}

public class LecturaRecetaItemConfiguration : IEntityTypeConfiguration<LecturaRecetaItem>
{
    public void Configure(EntityTypeBuilder<LecturaRecetaItem> b)
    {
        b.ToTable("lecturas_receta_items", t =>
            t.HasCheckConstraint("ck_lecturas_receta_items_confianza", "confianza IS NULL OR confianza BETWEEN 0 AND 1"));
        b.Property(x => x.TextoOriginal).HasMaxLength(300).IsRequired();
        b.Property(x => x.TextoEditado).HasMaxLength(300);
        b.Property(x => x.Confianza).HasPrecision(5, 4);
        b.Ref<LecturaRecetaItem, Producto>(nameof(LecturaRecetaItem.ProductoId));
    }
}

public class SuscripcionAlertaConfiguration : IEntityTypeConfiguration<SuscripcionAlerta>
{
    public void Configure(EntityTypeBuilder<SuscripcionAlerta> b)
    {
        b.ToTable("suscripciones_alerta");
        b.HasIndex(x => new { x.ProductoId, x.Activa }); // quién espera este producto
        b.HasIndex(x => x.UsuarioId);
        b.Ref<SuscripcionAlerta, Usuario>(nameof(SuscripcionAlerta.UsuarioId));
        b.Ref<SuscripcionAlerta, Producto>(nameof(SuscripcionAlerta.ProductoId));
        b.Ref<SuscripcionAlerta, Farmacia>(nameof(SuscripcionAlerta.FarmaciaId));
        b.Ref<SuscripcionAlerta, Municipio>(nameof(SuscripcionAlerta.MunicipioId));
    }
}

public class NotificacionConfiguration : IEntityTypeConfiguration<Notificacion>
{
    public void Configure(EntityTypeBuilder<Notificacion> b)
    {
        b.ToTable("notificaciones", t => t.CheckEnum(typeof(TipoNotificacion), "notificaciones", "tipo"));
        b.Property(x => x.Titulo).HasMaxLength(150).IsRequired();
        b.Property(x => x.Mensaje).HasMaxLength(500).IsRequired();
        b.Property(x => x.ReferenciaTipo).HasMaxLength(50);
        b.HasIndex(x => new { x.UsuarioId, x.Leida, x.CreadoEn });
        b.Ref<Notificacion, Usuario>(nameof(Notificacion.UsuarioId));
    }
}

public class MensajeContactoConfiguration : IEntityTypeConfiguration<MensajeContacto>
{
    public void Configure(EntityTypeBuilder<MensajeContacto> b)
    {
        b.ToTable("mensajes_contacto", t => t.CheckEnum(typeof(EstadoMensajeContacto), "mensajes_contacto", "estado"));
        b.Property(x => x.Nombre).HasMaxLength(150).IsRequired();
        b.Property(x => x.Correo).HasMaxLength(254).IsRequired();
        b.Property(x => x.Asunto).HasMaxLength(200).IsRequired();
        b.Property(x => x.Mensaje).IsRequired();
        b.HasIndex(x => x.Estado);
        b.Ref<MensajeContacto, Usuario>(nameof(MensajeContacto.UsuarioId));
        b.Ref<MensajeContacto, Usuario>(nameof(MensajeContacto.RespondidoPorId));
    }
}

public class PlanRecorridoConfiguration : IEntityTypeConfiguration<PlanRecorrido>
{
    public void Configure(EntityTypeBuilder<PlanRecorrido> b)
    {
        b.ToTable("planes_recorrido");
        b.Property(x => x.Origen).HasColumnType("geography(Point,4326)").IsRequired();
        b.Property(x => x.DistanciaTotalKm).HasPrecision(10, 2);
        b.Property(x => x.CubrePct).HasPrecision(5, 2);
        b.HasMany(x => x.Paradas).WithOne().HasForeignKey(p => p.PlanId).OnDelete(DeleteBehavior.Cascade);
        b.Ref<PlanRecorrido, Usuario>(nameof(PlanRecorrido.UsuarioId));
        b.Ref<PlanRecorrido, ListaMedicamentos>(nameof(PlanRecorrido.ListaId));
    }
}

public class PlanRecorridoParadaConfiguration : IEntityTypeConfiguration<PlanRecorridoParada>
{
    public void Configure(EntityTypeBuilder<PlanRecorridoParada> b)
    {
        b.ToTable("planes_recorrido_paradas");
        b.Property(x => x.DistanciaDesdeAnteriorKm).HasPrecision(10, 2);
        b.Property(x => x.ProductosIds).HasColumnType("uuid[]");
        b.HasIndex(x => new { x.PlanId, x.Orden }).IsUnique();
        b.Ref<PlanRecorridoParada, Farmacia>(nameof(PlanRecorridoParada.FarmaciaId));
    }
}

public class FavoritoConfiguration : IEntityTypeConfiguration<Favorito>
{
    public void Configure(EntityTypeBuilder<Favorito> b)
    {
        b.ToTable("favoritos", t =>
        {
            t.CheckEnum(typeof(TipoFavorito), "favoritos", "tipo");
            t.HasCheckConstraint("ck_favoritos_objetivo",
                "(tipo = 'PRODUCTO' AND producto_id IS NOT NULL AND farmacia_id IS NULL) OR " +
                "(tipo = 'FARMACIA' AND farmacia_id IS NOT NULL AND producto_id IS NULL)");
        });
        b.HasIndex(x => new { x.UsuarioId, x.ProductoId }).IsUnique().HasFilter("producto_id IS NOT NULL");
        b.HasIndex(x => new { x.UsuarioId, x.FarmaciaId }).IsUnique().HasFilter("farmacia_id IS NOT NULL");
        b.Ref<Favorito, Usuario>(nameof(Favorito.UsuarioId));
        b.Ref<Favorito, Producto>(nameof(Favorito.ProductoId));
        b.Ref<Favorito, Farmacia>(nameof(Favorito.FarmaciaId));
    }
}

public class RecordatorioConfiguration : IEntityTypeConfiguration<Recordatorio>
{
    public void Configure(EntityTypeBuilder<Recordatorio> b)
    {
        b.ToTable("recordatorios", t =>
        {
            t.CheckEnum(typeof(TipoRecordatorio), "recordatorios", "tipo");
            t.HasCheckConstraint("ck_recordatorios_frecuencia", "frecuencia_dias IS NULL OR frecuencia_dias > 0");
        });
        b.HasIndex(x => new { x.Activo, x.ProgramadoPara }); // recordatorios por disparar
        b.Ref<Recordatorio, Usuario>(nameof(Recordatorio.UsuarioId));
        b.Ref<Recordatorio, Producto>(nameof(Recordatorio.ProductoId));
        b.Ref<Recordatorio, ListaMedicamentos>(nameof(Recordatorio.ListaId));
    }
}
