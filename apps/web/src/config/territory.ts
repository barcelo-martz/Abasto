export interface MunicipioTerritorial {
  id: string;
  provinciaId: string;
  nombre: string;
  codigo: string;
}

export interface ProvinciaTerritorial {
  id: string;
  nombre: string;
  codigo: string;
  municipios: MunicipioTerritorial[];
}

const LA_HABANA_ID = "10000000-0000-0000-0000-000000000001";

const MUNICIPIOS_LA_HABANA = [
  "Playa",
  "Plaza de la Revolución",
  "Centro Habana",
  "La Habana Vieja",
  "Regla",
  "La Habana del Este",
  "Guanabacoa",
  "San Miguel del Padrón",
  "Diez de Octubre",
  "Cerro",
  "Marianao",
  "La Lisa",
  "Boyeros",
  "Arroyo Naranjo",
  "Cotorro",
] as const;

export const MUNICIPIOS_POR_PROVINCIA: ProvinciaTerritorial[] = [
  {
    id: LA_HABANA_ID,
    nombre: "La Habana",
    codigo: "LHA",
    municipios: MUNICIPIOS_LA_HABANA.map((nombre, index) => ({
      id: `20000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
      provinciaId: LA_HABANA_ID,
      nombre,
      codigo: `LHA-${String(index + 1).padStart(2, "0")}`,
    })),
  },
];

export const PROVINCIAS = MUNICIPIOS_POR_PROVINCIA.map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ municipios: _, ...provincia }) => provincia,
);

export function obtenerMunicipios(provinciaId: string): MunicipioTerritorial[] {
  return (
    MUNICIPIOS_POR_PROVINCIA.find((provincia) => provincia.id === provinciaId)?.municipios ?? []
  );
}
