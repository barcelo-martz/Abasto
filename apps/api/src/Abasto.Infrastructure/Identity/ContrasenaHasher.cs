
using Abasto.Application.Common.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace Abasto.Infrastructure.Identity;

public sealed class ContrasenaHasher : IContrasenaHasher
{
    private static readonly object Contexto = new();
    private readonly PasswordHasher<object> _hasher = new();

    public string Hash(string contrasena) => _hasher.HashPassword(Contexto, contrasena);

    public ResultadoVerificacion Verificar(string hash, string contrasena) =>
        _hasher.VerifyHashedPassword(Contexto, hash, contrasena) switch
        {
            PasswordVerificationResult.Success => ResultadoVerificacion.Correcta,
            PasswordVerificationResult.SuccessRehashNeeded => ResultadoVerificacion.CorrectaRequiereRehash,
            _ => ResultadoVerificacion.Fallida,
        };
}
