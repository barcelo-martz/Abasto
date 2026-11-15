using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Common.Abstractions;

public static class ParametrosExtensions
{
    public static async Task<int> ObtenerEnteroAsync(
        this IAbastoDbContext db, string clave, int defecto, CancellationToken ct)
    {
        var valor = await db.ParametrosSistema.AsNoTracking()
            .Where(p => p.Clave == clave).Select(p => p.Valor).FirstOrDefaultAsync(ct);
        return int.TryParse(valor, out var n) ? n : defecto;
    }
}
