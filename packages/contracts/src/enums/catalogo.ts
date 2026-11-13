import { crearEnum } from "./crear-enum";

export const TipoProducto = crearEnum(["MEDICAMENTO", "INSUMO"]);
export type TipoProducto = keyof typeof TipoProducto;

export const FormaFarmaceutica = crearEnum([
  "TABLETA",
  "CAPSULA",
  "JARABE",
  "SUSPENSION",
  "SOLUCION",
  "INYECTABLE",
  "CREMA",
  "UNGUENTO",
  "GOTAS",
  "INHALADOR",
  "SUPOSITORIO",
  "PARCHE",
  "OTRA",
]);
export type FormaFarmaceutica = keyof typeof FormaFarmaceutica;

export const ViaAdministracion = crearEnum([
  "ORAL",
  "SUBLINGUAL",
  "TOPICA",
  "INHALATORIA",
  "OFTALMICA",
  "OTICA",
  "NASAL",
  "RECTAL",
  "PARENTERAL",
  "OTRA",
]);
export type ViaAdministracion = keyof typeof ViaAdministracion;

export const UnidadInventario = crearEnum([
  "UNIDAD",
  "TABLETA",
  "CAPSULA",
  "FRASCO",
  "TUBO",
  "AMPOLLETA",
  "SOBRE",
  "CAJA",
  "BLISTER",
]);
export type UnidadInventario = keyof typeof UnidadInventario;

export const EstadoValidacionAlternativa = crearEnum(["SUGERIDA", "VALIDADA", "RECHAZADA"]);
export type EstadoValidacionAlternativa = keyof typeof EstadoValidacionAlternativa;
