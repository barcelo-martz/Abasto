using System.Text.Json;

namespace Abasto.Domain.Common;

public static class EnumTexto
{
    public static string De<TEnum>(TEnum valor) where TEnum : struct, Enum =>
        JsonNamingPolicy.SnakeCaseUpper.ConvertName(valor.ToString());

    public static TEnum? Parsear<TEnum>(string? texto) where TEnum : struct, Enum
    {
        if (string.IsNullOrWhiteSpace(texto)) return null;
        foreach (var valor in Enum.GetValues<TEnum>())
            if (De(valor) == texto) return valor;
        return null;
    }
}
