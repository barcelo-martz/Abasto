export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegistroRequest {
  correo: string;
  contrasena: string;
  nombres: string;
  apellidos: string;
  provinciaId: string;
  municipioId: string;
}

export interface VerificarCorreoRequest {
  token: string;
}

export interface SolicitarRecuperacionRequest {
  correo: string;
}

export interface RestablecerContrasenaRequest {
  token: string;
  contrasena: string;
}

export interface RefreshRequest {
  refreshToken: string;
}
