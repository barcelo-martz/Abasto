import { crearEnum } from "./crear-enum";

export const TipoDocumentoReceta = crearEnum(["RECETA", "TARJETON"]);
export type TipoDocumentoReceta = keyof typeof TipoDocumentoReceta;

export const EstadoLectura = crearEnum([
  "PENDIENTE",
  "PROCESADA",
  "EDITADA",
  "CONFIRMADA",
  "FALLIDA",
]);
export type EstadoLectura = keyof typeof EstadoLectura;

export const TipoNotificacion = crearEnum([
  "DISPONIBILIDAD_PRODUCTO",
  "ALERTA_RUPTURA",
  "TRASLADO_SOLICITADO",
  "TRASLADO_RESUELTO",
  "DISTRIBUCION_REGISTRADA",
  "ANOMALIA_DETECTADA",
  "MENSAJE_RESPONDIDO",
  "RECORDATORIO",
  "SISTEMA",
]);
export type TipoNotificacion = keyof typeof TipoNotificacion;

export const TipoFavorito = crearEnum(["PRODUCTO", "FARMACIA"]);
export type TipoFavorito = keyof typeof TipoFavorito;

export const TipoRecordatorio = crearEnum(["REPOSICION", "REPETIR_LISTA", "POSIBLE_FALTA"]);
export type TipoRecordatorio = keyof typeof TipoRecordatorio;

export const EstadoMensajeContacto = crearEnum(["NUEVO", "LEIDO", "RESPONDIDO", "ARCHIVADO"]);
export type EstadoMensajeContacto = keyof typeof EstadoMensajeContacto;
