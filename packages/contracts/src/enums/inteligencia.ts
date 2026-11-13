import { crearEnum } from "./crear-enum";

export const TipoAlerta = crearEnum([
  "RUPTURA_INMINENTE",
  "DESABASTECIMIENTO_PROYECTADO",
  "SOBRESTOCK",
]);
export type TipoAlerta = keyof typeof TipoAlerta;

export const SeveridadAlerta = crearEnum(["BAJA", "MEDIA", "ALTA", "CRITICA"]);
export type SeveridadAlerta = keyof typeof SeveridadAlerta;

export const EstadoAlerta = crearEnum(["ABIERTA", "RECONOCIDA", "RESUELTA", "DESCARTADA"]);
export type EstadoAlerta = keyof typeof EstadoAlerta;

export const TipoAnomalia = crearEnum([
  "CONSUMO_ATIPICO",
  "AJUSTE_SOSPECHOSO",
  "ACTUALIZACION_INCONSISTENTE",
  "PRECIO_FUERA_DE_RANGO",
]);
export type TipoAnomalia = keyof typeof TipoAnomalia;

export const EstadoAnomalia = crearEnum(["NUEVA", "EN_REVISION", "CONFIRMADA", "FALSO_POSITIVO"]);
export type EstadoAnomalia = keyof typeof EstadoAnomalia;

export const TipoOperacionSync = crearEnum([
  "ACTUALIZAR_STOCK",
  "REGISTRAR_DISPENSACION",
  "REGISTRAR_AJUSTE",
]);
export type TipoOperacionSync = keyof typeof TipoOperacionSync;

export const EstadoOperacionSync = crearEnum(["PENDIENTE", "APLICADA", "CONFLICTO", "RECHAZADA"]);
export type EstadoOperacionSync = keyof typeof EstadoOperacionSync;
