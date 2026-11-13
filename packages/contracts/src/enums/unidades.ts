import { crearEnum } from "./crear-enum";

export const EstadoUnidad = crearEnum(["ACTIVA", "INACTIVA", "CERRADA_TEMPORALMENTE"]);
export type EstadoUnidad = keyof typeof EstadoUnidad;

export const TipoPropiedadFarmacia = crearEnum(["ESTATAL", "PRIVADA"]);
export type TipoPropiedadFarmacia = keyof typeof TipoPropiedadFarmacia;

export const TipoUnidadSalud = crearEnum(["POLICLINICO", "HOSPITAL", "CONSULTORIO", "OTRO"]);
export type TipoUnidadSalud = keyof typeof TipoUnidadSalud;

export const DiaSemana = crearEnum([
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
]);
export type DiaSemana = keyof typeof DiaSemana;
