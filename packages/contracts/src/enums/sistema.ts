import { crearEnum } from "./crear-enum";

export const TipoParametro = crearEnum(["ENTERO", "DECIMAL", "TEXTO", "BOOLEANO"]);
export type TipoParametro = keyof typeof TipoParametro;
