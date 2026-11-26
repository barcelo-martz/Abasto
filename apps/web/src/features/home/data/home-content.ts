import { RUTAS } from "@/config/routes";
import { obtenerMunicipios, PROVINCIAS } from "@/config/territory";
import type {
  FeaturedMedicine,
  HomeStat,
  HomeStep,
  TerritorioOpcion,
  TrustCriterion,
} from "../types";

/**
 * Contenido del Inicio.
 * ⚠️ Los datos marcados DEMO son de muestra: se reemplazan por llamadas a la API
 * (estadísticas, medicamentos destacados, municipios) cuando existan los endpoints.
 */

export const BUSQUEDAS_FRECUENTES = [
  "Dipirona 500 mg",
  "Amoxicilina",
  "Enalapril 20 mg",
  "Paracetamol",
  "Salbutamol",
] as const;

/** DEMO: municipios de La Habana. */
export const TERRITORIOS_DEMO: TerritorioOpcion[] = [
  { value: "", label: "Todos los municipios" },
  ...obtenerMunicipios(PROVINCIAS[0]?.id ?? "").map((municipio) => ({
    value: municipio.id,
    label: municipio.nombre,
  })),
];

/** DEMO */
export const ESTADISTICAS_DEMO: HomeStat[] = [
  {
    id: "red",
    label: "Red de farmacias",
    value: "184",
    unit: "farmacias con inventario en Abasto",
    icon: "storefront",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    value: "624",
    unit: "medicamentos e insumos con guía informativa",
    icon: "fact_check",
  },
  {
    id: "consultas",
    label: "Consultas",
    value: "87 420",
    unit: "búsquedas realizadas hoy",
    icon: "query_stats",
  },
  {
    id: "frescura",
    label: "Actualización",
    value: "4 min",
    unit: "desde la última sincronización de una farmacia",
    icon: "timer",
  },
];

export const PASOS: HomeStep[] = [
  {
    id: "buscar",
    title: "Busca o fotografía tu receta",
    description:
      "Escribe el nombre comercial, el genérico o el principio activo. También puedes subir la foto de tu receta: el sistema extrae la lista y tú la corriges antes de buscar.",
    footnote: "El resultado de la lectura siempre es editable",
    footnoteIcon: "document_scanner",
    hover: "primary",
  },
  {
    id: "comprobar",
    title: "Comprueba la existencia y su confianza",
    description:
      "Cada resultado muestra qué farmacias tienen el producto, cuándo se actualizó el dato y una etiqueta que te dice cuánto confiar en él.",
    footnote: "Fecha de última actualización a la vista",
    footnoteIcon: "sync_saved_locally",
    hover: "secondary",
  },
  {
    id: "recorrido",
    title: "Elige la farmacia y planifica tu recorrido",
    description:
      "Consulta dirección, horario y contacto de cada farmacia en el mapa. Si necesitas varios productos, el planificador propone el recorrido más corto.",
    footnote: "Recorrido con varias farmacias",
    footnoteIcon: "route",
    hover: "container",
  },
];

/** DEMO: vendrá de la API (productos más consultados con su disponibilidad). */
export const MEDICAMENTOS_DESTACADOS_DEMO: FeaturedMedicine[] = [
  {
    id: "amoxicilina-500",
    code: "L-0428",
    name: "Amoxicilina 500 mg",
    presentation: "Cápsulas x 24",
    availability: { status: "available", label: "Disponible en 14 farmacias" },
    details: [
      { label: "Principio activo", value: "Amoxicilina trihidrato" },
      { label: "Dispensación", value: "Con receta médica" },
    ],
    price: "$4.80 CUP",
    ctaLabel: "Localizar",
    href: `${RUTAS.buscar}?q=Amoxicilina`,
  },
  {
    id: "enalapril-20",
    code: "L-9812",
    name: "Enalapril 20 mg",
    presentation: "Comprimidos x 20",
    availability: { status: "low", label: "Pocas existencias" },
    controlled: "Regulado por tarjetón",
    details: [
      { label: "Principio activo", value: "Maleato de enalapril" },
      { label: "Control", value: "Crónico / hipertensión" },
    ],
    price: "$1.60 CUP",
    ctaLabel: "Localizar",
    href: `${RUTAS.buscar}?q=Enalapril`,
  },
  {
    id: "salbutamol-100",
    code: "L-3341",
    name: "Salbutamol 100 mcg",
    presentation: "Aerosol, 200 dosis",
    availability: { status: "low", label: "Disponibilidad moderada" },
    details: [
      { label: "Vía", value: "Inhalatoria" },
      { label: "Dispensación", value: "Tarjetón de asma" },
    ],
    price: "$3.00 CUP",
    ctaLabel: "Localizar",
    href: `${RUTAS.buscar}?q=Salbutamol`,
  },
  {
    id: "dipirona-500",
    code: "L-5520",
    name: "Dipirona 500 mg",
    presentation: "Tabletas x 10",
    availability: { status: "available", label: "Alta disponibilidad" },
    details: [
      { label: "Principio activo", value: "Metamizol sódico" },
      { label: "Dispensación", value: "Venta abierta" },
    ],
    price: "$1.00 CUP",
    ctaLabel: "Localizar",
    href: `${RUTAS.buscar}?q=Dipirona`,
  },
];

export const CRITERIOS_CONFIANZA: TrustCriterion[] = [
  {
    id: "verified",
    title: "Verificada",
    description:
      "La propia farmacia confirmó la existencia dentro del plazo de frescura que define el sistema.",
    footnote: "Alta confianza para ir a la farmacia",
    footnoteIcon: "check_circle",
  },
  {
    id: "estimated",
    title: "Estimada",
    description:
      "Pasó el plazo de frescura. Abasto calcula la probabilidad a partir del historial y del ritmo de consumo de esa farmacia.",
    footnote: "Conviene confirmar por teléfono",
    footnoteIcon: "info",
  },
  {
    id: "stale",
    title: "Sin información reciente",
    description:
      "La farmacia lleva mucho tiempo sin actualizar su inventario. El dato se muestra solo con una advertencia.",
    footnote: "No lo tomes como referencia",
    footnoteIcon: "history_toggle_off",
  },
];
