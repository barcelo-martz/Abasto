using Abasto.Application.Common.Abstractions;
using Abasto.Domain.Entities;
using Abasto.Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record VerificarCorreoCommand(string Token) : IRequest;

public sealed class VerificarCorreoValidator : AbstractValidator<VerificarCorreoCommand>
{
    public VerificarCorreoValidator() =>
        RuleFor(x => x.Token).NotEmpty().WithMessage("Falta el código de verificación.");
}

public sealed class VerificarCorreoHandler(IAbastoDbContext db, ITokenService tokens, TimeProvider reloj)
    : IRequestHandler<VerificarCorreoCommand>
{
    public async Task Handle(VerificarCorreoCommand cmd, CancellationToken ct)
    {
        var hash = tokens.Hash(cmd.Token);
        var ahora = reloj.GetUtcNow().UtcDateTime;

        var registro = await db.TokensUsuario.Include(t => t.Usuario)
            .FirstOrDefaultAsync(t => t.TokenHash == hash && t.Tipo == TipoTokenUsuario.VerificacionCorreo, ct);

        if (registro is null || registro.UsadoEn is not null || registro.ExpiraEn <= ahora)
            throw new ValidationException([new ValidationFailure("token", "El enlace no es válido o ya caducó.")]);

        registro.UsadoEn = ahora;
        if (registro.Usuario.Estado == EstadoUsuario.PendienteVerificacion)
            registro.Usuario.Estado = EstadoUsuario.Activo;

        db.AuditLogs.Add(new AuditLog
        {
            UsuarioId = registro.UsuarioId,
            Accion = "CORREO_VERIFICADO",
            Entidad = nameof(Usuario),
            EntidadId = registro.UsuarioId,
        });
        await db.SaveChangesAsync(ct);
    }
}
