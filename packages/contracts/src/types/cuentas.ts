import type { RolUsuario } from "../enums";

export interface CrearUsuarioPanelRequest {
  correo: string;
  contrasenaTemporal: string;
  nombres: string;
  apellidos: string;
  rol: RolUsuario;
  farmaciaId?: string | null;
  almacenId?: string | null;
  municipioId?: string | null;
}
