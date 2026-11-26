"use client";

import {
  obtenerMunicipios,
  PROVINCIAS,
  type MunicipioTerritorial,
  type ProvinciaTerritorial,
} from "@/config/territory";

export function useProvincias(): { data: ProvinciaTerritorial[] } {
  return {
    data: PROVINCIAS.map((provincia) => ({
      ...provincia,
      municipios: obtenerMunicipios(provincia.id),
    })),
  };
}

export function useMunicipios(provinciaId?: string): { data: MunicipioTerritorial[] } {
  return { data: provinciaId ? obtenerMunicipios(provinciaId) : [] };
}
