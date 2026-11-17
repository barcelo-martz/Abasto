// AdminSeeder.cs
using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using Abasto.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Abasto.Infrastructure.Identity;

public sealed class AdminSeeder(
    AbastoDbContext db, IContrasenaHasher hasher, IConfiguration config, ILogger<AdminSeeder> logger)
{
    public async Task EjecutarAsync(CancellationToken ct = default)
    {
        var correo = config["Admin:Correo"]?.Trim().ToLowerInvariant();
        var contrasena = config["Admin:Contrasena"];
        if (string.IsNullOrWhiteSpace(correo) || string.IsNullOrWhiteSpace(contrasena)) return;
        if (await db.Usuarios.AnyAsync(u => u.Rol == RolUsuario.Administrador, ct)) return;

        db.Usuarios.Add(new Usuario
        {
            Correo = correo,
            ContrasenaHash = hasher.Hash(contrasena),
            Nombres = config["Admin:Nombres"] ?? "Administrador",
            Apellidos = config["Admin:Apellidos"] ?? "del sistema",
            Rol = RolUsuario.Administrador,
            Estado = EstadoUsuario.Activo,
        });
        await db.SaveChangesAsync(ct);
        logger.LogInformation("Administrador inicial creado: {Correo}", correo);
    }
}
