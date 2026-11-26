import type { Availability } from "@abasto/ui";

export interface TerritorioOpcion {
  /** "" = todos los municipios. Más adelante será el id (uuid) del municipio. */
  value: string;
  label: string;
}

export interface HomeStat {
  id: string;
  label: string;
  value: string;
  /** Texto bajo la cifra. */
  unit: string;
  icon: string;
}

export interface HomeStep {
  id: string;
  title: string;
  description: string;
  footnote: string;
  footnoteIcon: string;
  /** Color del número al pasar el cursor. */
  hover: "primary" | "secondary" | "container";
}

export interface FeaturedMedicine {
  id: string;
  code: string;
  name: string;
  presentation: string;
  availability: { status: Availability; label: string };
  /** Marca de dispensación controlada (p. ej. tarjetón). */
  controlled?: string;
  details: { label: string; value: string }[];
  price?: string;
  ctaLabel: string;
  href: string;
}

export interface TrustCriterion {
  id: "verified" | "estimated" | "stale";
  title: string;
  description: string;
  footnote: string;
  footnoteIcon: string;
}
