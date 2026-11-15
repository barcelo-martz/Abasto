using Abasto.Application.Common.Abstractions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Abasto.Application.Features.Auth.Commands;

public sealed record CerrarSesionCommand(string RefreshToken) : IRequest;

public sealed class CerrarSesionValidator : AbstractValidator<CerrarSesionCommand>
{
    public CerrarSesionValidator() => RuleFor(x => x.RefreshToken).NotEmpty().WithMessage("Falta el token de sesión.");
}

public sealed class CerrarSesionHandler(IAbastoDbContext db, ITokenService tokens, TimeProvider reloj)
    : IRequestHandler<CerrarSesionCommand>
{
    public async Task Handle(CerrarSesionCommand cmd, CancellationToken ct)
    {
        var hash = tokens.Hash(cmd.RefreshToken);
        var registro = await db.RefreshTokens.FirstOrDefaultAsync(r => r.TokenHash == hash, ct);

        if (registro is { RevocadoEn: null })
        {
            registro.RevocadoEn = reloj.GetUtcNow().UtcDateTime;
            await db.SaveChangesAsync(ct);
        }
    }
}
