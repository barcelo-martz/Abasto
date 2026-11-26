import type { ResultadoFarmacia } from "./types";

const BASE: ResultadoFarmacia[] = [
  {
    farmaciaId: "f1",
    nombre: "Farmacia Plaza",
    direccion: "Calle 23 e/ L y M, Vedado",
    municipioId: "",
    producto: "Dipirona 500 mg",
    cantidad: 120,
    nivelConfianza: "VERIFICADA",
    ultimaActualizacionEn: new Date(Date.now() - 36e5 * 5).toISOString(),
  },
  {
    farmaciaId: "f2",
    nombre: "Farmacia Central",
    direccion: "Calzada 10 de Octubre #123",
    municipioId: "",
    producto: "Dipirona 500 mg",
    cantidad: 30,
    nivelConfianza: "ESTIMADA",
    ultimaActualizacionEn: new Date(Date.now() - 36e5 * 96).toISOString(),
  },
  {
    farmaciaId: "f3",
    nombre: "Farmacia La Rampa",
    direccion: "Calle 23 y O, Vedado",
    municipioId: "",
    producto: "Dipirona 500 mg",
    cantidad: 8,
    nivelConfianza: "VERIFICADA",
    ultimaActualizacionEn: new Date(Date.now() - 36e5 * 20).toISOString(),
  },
];

export async function buscarDisponibilidad(params: {
  q: string;
  municipioId?: string;
}): Promise<ResultadoFarmacia[]> {
  // TODO: reemplazar por la llamada real a la API cuando exista el endpoint
  const q = params.q.toLowerCase();
  const ok = "dipirona".includes(q) || q.includes("dipir");
  return ok ? BASE : [];
}
