using Abasto.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Abasto.Infrastructure.Persistence;

public sealed class AuditoriaFechasInterceptor : SaveChangesInterceptor
{
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData, InterceptionResult<int> result)
    {
        Aplicar(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        Aplicar(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private static void Aplicar(DbContext? contexto)
    {
        if (contexto is null) return;
        var ahora = DateTime.UtcNow;

        foreach (var entrada in contexto.ChangeTracker.Entries())
        {
            var nueva = entrada.State == EntityState.Added;
            var modificada = entrada.State == EntityState.Modified;

            if (nueva && entrada.Entity is EntidadInmutable creada)
                creada.CreadoEn = ahora;
            if ((nueva || modificada) && entrada.Entity is EntidadBase editable)
                editable.ActualizadoEn = ahora;
        }
    }
}
