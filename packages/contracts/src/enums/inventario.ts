import { crearEnum } from "./crear-enum";

export const EstadoDisponibilidad = crearEnum([
  "DISPONIBLE",
  "BAJO_STOCK",
  "AGOTADO",
  "SIN_INFORMACION",
]);
export type EstadoDisponibilidad = keyof typeof EstadoDisponibilidad;

export const NivelConfianza = crearEnum(["VERIFICADA", "ESTIMADA", "DESACTUALIZADA"]);
export type NivelConfianza = keyof typeof NivelConfianza;

export const OrigenDato = crearEnum([
  "MANUAL",
  "ARCHIVO",
  "SINCRONIZACION",
  "TRASLADO",
  "DISTRIBUCION",
  "SISTEMA",
]);
export type OrigenDato = keyof typeof OrigenDato;

export const TipoMovimiento = crearEnum([
  "CARGA_INICIAL",
  "ENTRADA_DISTRIBUCION",
  "ENTRADA_TRASLADO",
  "SALIDA_TRASLADO",
  "SALIDA_DISPENSACION",
  "SALIDA_DISTRIBUCION",
  "AJUSTE_POSITIVO",
  "AJUSTE_NEGATIVO",
  "BAJA",
]);
export type TipoMovimiento = keyof typeof TipoMovimiento;

export const TipoReferenciaMovimiento = crearEnum([
  "DISTRIBUCION",
  "TRASLADO",
  "IMPORTACION",
  "SINCRONIZACION",
]);
export type TipoReferenciaMovimiento = keyof typeof TipoReferenciaMovimiento;

export const FormatoArchivo = crearEnum(["CSV", "XLSX"]);
export type FormatoArchivo = keyof typeof FormatoArchivo;

export const EstadoImportacion = crearEnum([
  "SUBIDA",
  "VALIDADA",
  "CON_ERRORES",
  "APLICADA",
  "FALLIDA",
]);
export type EstadoImportacion = keyof typeof EstadoImportacion;
