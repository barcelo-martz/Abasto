import { crearEnum } from "./crear-enum";

export const RolUsuario = crearEnum([
  "CIUDADANO",
  "PERSONAL_FARMACIA",
  "PERSONAL_ALMACEN",
  "SUPERVISOR_MUNICIPAL",
  "ADMINISTRADOR",
]);
export type RolUsuario = keyof typeof RolUsuario;

export const EstadoUsuario = crearEnum([
  "PENDIENTE_VERIFICACION",
  "ACTIVO",
  "BLOQUEADO",
  "INACTIVO",
]);
export type EstadoUsuario = keyof typeof EstadoUsuario;

export const TipoTokenUsuario = crearEnum(["VERIFICACION_CORREO", "RECUPERACION_CONTRASENA"]);
export type TipoTokenUsuario = keyof typeof TipoTokenUsuario;
