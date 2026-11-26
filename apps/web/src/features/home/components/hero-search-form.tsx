"use client";

import { RUTAS } from "@/config/routes";
import { buttonVariants, cn, Icon, Select } from "@abasto/ui";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useId } from "react";
import type { TerritorioOpcion } from "../types";

export interface HeroSearchFormProps {
  territorios: TerritorioOpcion[];
  className?: string;
}

/** Barra de búsqueda grande del Inicio: producto + territorio. Lleva a /buscar?q=…&municipio=… */
export function HeroSearchForm({ territorios, className }: HeroSearchFormProps) {
  const router = useRouter();
  const idProducto = useId();
  const idTerritorio = useId();
  const { register, control, handleSubmit } = useForm({
    defaultValues: { consulta: "", territorio: territorios[0]?.value ?? "" },
  });

  function buscar(datos: { consulta: string; territorio: string }) {
    const params = new URLSearchParams();
    if (datos.consulta.trim()) params.set("q", datos.consulta.trim());
    if (datos.territorio) params.set("municipio", datos.territorio);
    const query = params.toString();
    router.push(query ? `${RUTAS.buscar}?${query}` : RUTAS.buscar);
  }

  return (
    <form
      role="search"
      aria-label="Buscar medicamentos"
      onSubmit={handleSubmit(buscar)}
      className={cn(
        "relative z-20 rounded-2xl bg-white/[0.09] p-space-xs shadow-[0_20px_50px_rgba(0,18,36,0.45)] backdrop-blur-xl sm:p-space-sm",
        className,
      )}
    >
      <div className="grid grid-cols-1 items-center gap-space-xs rounded-xl bg-white/95 p-space-xs shadow-inner sm:grid-cols-12 sm:p-2">
        <div className="flex items-center gap-space-xs rounded-lg px-space-sm py-space-xs focus-within:ring-2 focus-within:ring-secondary sm:col-span-6">
          <Icon name="medication" size={22} className="text-secondary" />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={idProducto}
              className="block font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Medicamento o principio activo
            </label>
            <input
              {...register("consulta")}
              id={idProducto}
              type="search"
              placeholder="Escribe un medicamento o principio activo…"
              autoComplete="off"
              className="w-full truncate bg-transparent font-label-md text-label-md font-semibold text-primary outline-none placeholder:text-outline/70"
            />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-space-xs rounded-lg px-space-sm py-space-xs sm:col-span-4 sm:border-l sm:border-outline-variant/40">
          <Icon name="location_on" size={22} className="text-on-surface-variant" />
          <div className="min-w-0 flex-1">
            <label
              htmlFor={idTerritorio}
              className="block font-label-sm text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Territorio
            </label>
            <Controller
              control={control}
              name="territorio"
              render={({ field }) => (
                <Select
                  id={idTerritorio}
                  ref={field.ref}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Todos los municipios"
                  options={territorios.map((territorio) => ({
                    value: territorio.value,
                    label: territorio.label,
                    icon: territorio.value ? "location_on" : "map",
                  }))}
                  className="-ml-2 h-10 min-h-10 w-[calc(100%+0.5rem)] rounded-lg bg-transparent px-2 shadow-none focus-within:ring-0 font-label-md text-label-md font-semibold text-primary"
                />
              )}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className={buttonVariants({ variant: "clinical", size: "lg", fullWidth: true })}
          >
            <span>Buscar</span>
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}
