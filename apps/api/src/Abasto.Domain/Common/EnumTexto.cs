using System.Text.Json;

namespace Abasto.Domain.Common;

public static class EnumTexto
{
    public static string De<TEnum>(TEnum valor) where TEnum : struct, Enum =>
        JsonNamingPolicy.SnakeCaseUpper.ConvertName(valor.ToString());
}
