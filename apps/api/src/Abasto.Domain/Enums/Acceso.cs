namespace Abasto.Domain.Enums;

public enum RolUsuario { Ciudadano, PersonalFarmacia, PersonalAlmacen, SupervisorMunicipal, Administrador }
public enum EstadoUsuario { PendienteVerificacion, Activo, Bloqueado, Inactivo }
public enum TipoTokenUsuario { VerificacionCorreo, RecuperacionContrasena }