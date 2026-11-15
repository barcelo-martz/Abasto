using System.Text.Json;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Conventions;

public static class EnumCheckExtensions
{
    public static void CheckEnum<TEntity>(
        this TableBuilder<TEntity> tabla, Type tipoEnum, string nombreTabla, string columna)
        where TEntity : class
    {
        var valores = string.Join(", ", Enum.GetNames(tipoEnum)
            .Select(n => $"'{JsonNamingPolicy.SnakeCaseUpper.ConvertName(n)}'"));
        tabla.HasCheckConstraint($"ck_{nombreTabla}_{columna}", $"{columna} IN ({valores})");
    }
}
