import { z } from "zod";

export const TAMANO_PAGINA_POR_DEFECTO = 20;
export const TAMANO_PAGINA_MAXIMO = 100;

export const direccionOrdenSchema = z.enum(["asc", "desc"]);

export type DireccionOrden = z.infer<typeof direccionOrdenSchema>;

export interface ParametrosListado {
  pagina?: number;
  tamanoPagina?: number;
  ordenarPor?: string;
  direccion?: DireccionOrden;
  busqueda?: string;
}

export interface Pagina<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export function paginaSchema<T extends z.ZodType>(item: T) {
  return z
    .object({
      items: z.array(item),
      total: z.number().int().nonnegative(),
      pagina: z.number().int().positive(),
      tamanoPagina: z.number().int().positive().max(TAMANO_PAGINA_MAXIMO),
      totalPaginas: z.number().int().nonnegative(),
    })
    .superRefine((pagina, ctx) => {
      const esperadas = Math.ceil(pagina.total / pagina.tamanoPagina);

      if (pagina.totalPaginas !== esperadas) {
        ctx.addIssue({
          code: "custom",
          path: ["totalPaginas"],
          message: "El total de páginas no coincide con el total de elementos.",
        });
      }

      if (pagina.items.length > pagina.tamanoPagina) {
        ctx.addIssue({
          code: "custom",
          path: ["items"],
          message: "La cantidad de elementos supera el tamaño de página.",
        });
      }
    });
}

export function parametrosListadoSchema() {
  return z.object({
    pagina: z.number().int().positive().optional(),
    tamanoPagina: z.number().int().positive().max(TAMANO_PAGINA_MAXIMO).optional(),
    ordenarPor: z.string().trim().min(1).optional(),
    direccion: direccionOrdenSchema.optional(),
    busqueda: z.string().trim().optional(),
  });
}
