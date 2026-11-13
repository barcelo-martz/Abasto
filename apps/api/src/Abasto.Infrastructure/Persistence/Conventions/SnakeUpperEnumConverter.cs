using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Abasto.Infrastructure.Persistence.Conventions;

public sealed class SnakeUpperEnumConverter<TEnum>()
    : ValueConverter<TEnum, string>(valor => Texto(valor), texto => Mapa[texto])
    where TEnum : struct, Enum
{
    private static readonly Dictionary<string, TEnum> Mapa =
        Enum.GetValues<TEnum>().ToDictionary(Texto);

    private static string Texto(TEnum valor) =>
        JsonNamingPolicy.SnakeCaseUpper.ConvertName(valor.ToString());
}