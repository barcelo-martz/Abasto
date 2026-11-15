using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Configurations;

public class AlternativaProductoConfiguration : IEntityTypeConfiguration<AlternativaProducto>
{
    public void Configure(EntityTypeBuilder<AlternativaProducto> b)
    {
        b.ToTable("alternativas_producto", t =>
        {
            t.CheckEnum(typeof(EstadoValidacionAlternativa), "alternativas_producto", "estado_validacion");
            t.HasCheckConstraint("ck_alternativas_producto_distintos", "producto_id <> alternativa_id");
        });
        b.Property(x => x.Motivo).HasMaxLength(250);
        b.HasIndex(x => new { x.ProductoId, x.AlternativaId }).IsUnique();
        b.Ref<AlternativaProducto, Producto>(nameof(AlternativaProducto.ProductoId));
        b.Ref<AlternativaProducto, Producto>(nameof(AlternativaProducto.AlternativaId));
        b.Ref<AlternativaProducto, Usuario>(nameof(AlternativaProducto.ValidadoPorId));
    }
}

public class BusquedaRegistroConfiguration : IEntityTypeConfiguration<BusquedaRegistro>
{
    public void Configure(EntityTypeBuilder<BusquedaRegistro> b)
    {
        b.ToTable("busquedas_registro");
        b.Property(x => x.SesionHash).HasMaxLength(128);
        b.Property(x => x.TextoConsulta).HasMaxLength(200).IsRequired();
        b.HasIndex(x => x.CreadoEn);
        b.HasIndex(x => new { x.SinDisponibilidad, x.MunicipioId }); // demanda insatisfecha
        b.Ref<BusquedaRegistro, Usuario>(nameof(BusquedaRegistro.UsuarioId));
        b.Ref<BusquedaRegistro, Producto>(nameof(BusquedaRegistro.ProductoId));
        b.Ref<BusquedaRegistro, Municipio>(nameof(BusquedaRegistro.MunicipioId));
    }
}

public class PrediccionDisponibilidadConfiguration : IEntityTypeConfiguration<PrediccionDisponibilidad>
{
    public void Configure(EntityTypeBuilder<PrediccionDisponibilidad> b)
    {
        b.ToTable("predicciones_disponibilidad", t =>
            t.HasCheckConstraint("ck_predicciones_disponibilidad_probabilidad", "probabilidad BETWEEN 0 AND 1"));
        b.Property(x => x.Probabilidad).HasPrecision(5, 4);
        b.Property(x => x.DiasEstimadosAgotamiento).HasPrecision(10, 2);
        b.Property(x => x.Factores).HasColumnType("jsonb");
        b.Property(x => x.ModeloVersion).HasMaxLength(50).IsRequired();
        b.HasIndex(x => new { x.FarmaciaId, x.ProductoId, x.HorizonteDias }).IsUnique(); // caché por combinación
        b.Ref<PrediccionDisponibilidad, Farmacia>(nameof(PrediccionDisponibilidad.FarmaciaId));
        b.Ref<PrediccionDisponibilidad, Producto>(nameof(PrediccionDisponibilidad.ProductoId));
    }
}

public class AlertaTempranaConfiguration : IEntityTypeConfiguration<AlertaTemprana>
{
    public void Configure(EntityTypeBuilder<AlertaTemprana> b)
    {
        b.ToTable("alertas_tempranas", t =>
        {
            t.CheckEnum(typeof(TipoAlerta), "alertas_tempranas", "tipo");
            t.CheckEnum(typeof(SeveridadAlerta), "alertas_tempranas", "severidad");
            t.CheckEnum(typeof(EstadoAlerta), "alertas_tempranas", "estado");
        });
        b.Property(x => x.DiasEstimadosAgotamiento).HasPrecision(10, 2);
        b.HasIndex(x => new { x.FarmaciaId, x.Estado });
        b.Ref<AlertaTemprana, Farmacia>(nameof(AlertaTemprana.FarmaciaId));
        b.Ref<AlertaTemprana, Producto>(nameof(AlertaTemprana.ProductoId));
        b.Ref<AlertaTemprana, Usuario>(nameof(AlertaTemprana.ReconocidaPorId));
    }
}

public class AnomaliaConfiguration : IEntityTypeConfiguration<Anomalia>
{
    public void Configure(EntityTypeBuilder<Anomalia> b)
    {
        b.ToTable("anomalias", t =>
        {
            t.CheckEnum(typeof(TipoAnomalia), "anomalias", "tipo");
            t.CheckEnum(typeof(EstadoAnomalia), "anomalias", "estado");
        });
        b.Property(x => x.Puntuacion).HasPrecision(10, 4);
        b.Property(x => x.Descripcion).HasMaxLength(500).IsRequired();
        b.HasIndex(x => new { x.FarmaciaId, x.Estado });
        b.Ref<Anomalia, Farmacia>(nameof(Anomalia.FarmaciaId));
        b.Ref<Anomalia, Producto>(nameof(Anomalia.ProductoId));
        b.Ref<Anomalia, MovimientoInventario>(nameof(Anomalia.MovimientoId));
        b.Ref<Anomalia, Usuario>(nameof(Anomalia.RevisadaPorId));
    }
}

public class OperacionSyncConfiguration : IEntityTypeConfiguration<OperacionSync>
{
    public void Configure(EntityTypeBuilder<OperacionSync> b)
    {
        b.ToTable("operaciones_sync", t =>
        {
            t.CheckEnum(typeof(TipoOperacionSync), "operaciones_sync", "tipo");
            t.CheckEnum(typeof(EstadoOperacionSync), "operaciones_sync", "estado");
        });
        b.Property(x => x.Payload).HasColumnType("jsonb").IsRequired();
        b.Property(x => x.Error).HasMaxLength(500);
        b.HasIndex(x => x.IdCliente).IsUnique(); // idempotencia
        b.HasIndex(x => new { x.FarmaciaId, x.Estado });
        b.Ref<OperacionSync, Usuario>(nameof(OperacionSync.UsuarioId));
        b.Ref<OperacionSync, Farmacia>(nameof(OperacionSync.FarmaciaId));
    }
}
