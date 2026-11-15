using Abasto.Domain.Entities;

namespace Abasto.Application.Common.Abstractions;

public sealed record TokenAcceso(string Valor, DateTime ExpiraEn);
public sealed record TokenOpaco(string Valor, string Hash);

public interface ITokenService
{
    TimeSpan DuracionRefresh { get; }
    TokenAcceso GenerarAccessToken(Usuario usuario);
    TokenOpaco GenerarTokenOpaco();
    string Hash(string valor);
}
