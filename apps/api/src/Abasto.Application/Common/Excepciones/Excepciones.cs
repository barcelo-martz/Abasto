namespace Abasto.Application.Common.Excepciones;

public abstract class AplicacionException : Exception
{
    protected AplicacionException(string mensaje, int estado, string titulo) : base(mensaje)
    {
        Estado = estado;
        Titulo = titulo;
    }

    public int Estado { get; }
    public string Titulo { get; }
}

public sealed class ConflictoException(string mensaje) : AplicacionException(mensaje, 409, "Conflicto");
public sealed class NoAutorizadoException(string mensaje) : AplicacionException(mensaje, 401, "No autorizado");
public sealed class ProhibidoException(string mensaje) : AplicacionException(mensaje, 403, "Acceso denegado");
public sealed class CuentaBloqueadaException(string mensaje) : AplicacionException(mensaje, 423, "Cuenta bloqueada");
