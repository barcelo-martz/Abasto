using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Abasto.Infrastructure.Persistence.Conventions;

public static class RelacionesExtensions
{
    public static void Ref<TEntidad, TPrincipal>(
        this EntityTypeBuilder<TEntidad> b, string propiedadFk,
        DeleteBehavior borrado = DeleteBehavior.Restrict)
        where TEntidad : class where TPrincipal : class =>
        b.HasOne<TPrincipal>().WithMany().HasForeignKey(propiedadFk).OnDelete(borrado);
}
