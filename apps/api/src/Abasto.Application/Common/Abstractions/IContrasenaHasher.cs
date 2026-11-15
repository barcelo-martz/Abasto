namespace Abasto.Application.Common.Abstractions;

public enum ResultadoVerificacion { Fallida, Correcta, CorrectaRequiereRehash }

public interface IContrasenaHasher
{
    string Hash(string contrasena);
    ResultadoVerificacion Verificar(string hash, string contrasena);
}
