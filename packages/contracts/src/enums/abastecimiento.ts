import { crearEnum } from "./crear-enum";

export const EstadoCiclo = crearEnum(["PLANIFICADO", "ABIERTO", "CERRADO"]);
export type EstadoCiclo = keyof typeof EstadoCiclo;

export const EstadoDistribucion = crearEnum([
  "PLANIFICADA",
  "EN_TRANSITO",
  "ENTREGADA",
  "CONFIRMADA",
  "CANCELADA",
]);
export type EstadoDistribucion = keyof typeof EstadoDistribucion;

export const EstadoTraslado = crearEnum([
  "SOLICITADO",
  "APROBADO",
  "RECHAZADO",
  "EN_TRANSITO",
  "RECIBIDO",
  "CANCELADO",
]);
export type EstadoTraslado = keyof typeof EstadoTraslado;

export const EstadoRemision = crearEnum([
  "SOLICITADA",
  "APROBADA",
  "RECHAZADA",
  "ATENDIDA",
  "VENCIDA",
]);
export type EstadoRemision = keyof typeof EstadoRemision;
