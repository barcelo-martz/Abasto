export interface ResultadoFarmacia {
  farmaciaId: string;
  nombre: string;
  direccion: string;
  municipioId: string;
  producto: string;
  cantidad: number;
  nivelConfianza: "VERIFICADA" | "ESTIMADA";
  ultimaActualizacionEn: string; // ISO 8601
}
