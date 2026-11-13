using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Abasto.Infrastructure.Persistence.Conventions;

public static class EnumConventionExtensions
{
    public static ModelBuilder UseSnakeUpperEnums(this ModelBuilder modelBuilder)
    {
        foreach (var entidad in modelBuilder.Model.GetEntityTypes())
        foreach (var propiedad in entidad.GetProperties())
        {
            var tipo = Nullable.GetUnderlyingType(propiedad.ClrType) ?? propiedad.ClrType;
            if (!tipo.IsEnum) continue;

            var convertidor = typeof(SnakeUpperEnumConverter<>).MakeGenericType(tipo);
            propiedad.SetValueConverter((ValueConverter)Activator.CreateInstance(convertidor)!);
        }

        return modelBuilder;
    }
}