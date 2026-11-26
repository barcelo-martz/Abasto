import { RUTAS } from "@/config/routes";
import { Button } from "@abasto/ui";
import Link from "next/link";
import type { FeaturedMedicine } from "../types";
import { FeaturedMedicineCard } from "./featured-medicine-card";
import { SectionContainer } from "./section-container";
import { SectionHeading } from "./section-heading";

export interface FeaturedMedicinesSectionProps {
  medicines: FeaturedMedicine[];
  /** Total del catálogo, para el enlace «Ver catálogo completo». */
  catalogCount?: number;
}

export function FeaturedMedicinesSection({
  medicines,
  catalogCount,
}: FeaturedMedicinesSectionProps) {
  return (
    <section aria-labelledby="destacados" className="w-full bg-surface-container-low py-space-2xl">
      <SectionContainer>
        <div className="mb-space-xl flex flex-col items-start justify-between gap-space-md sm:flex-row sm:items-end">
          <SectionHeading
            id="destacados"
            eyebrow="Más consultados"
            title="Medicamentos con alta consulta"
          />

          <Button variant={"ghost"} arrow>
            <Link href={RUTAS.guia}>
              Ver la guía de medicamentos{catalogCount ? ` (${catalogCount})` : ""}
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {medicines.map((m) => (
            <li key={m.id} className="flex">
              <FeaturedMedicineCard medicine={m} className="w-full" />
            </li>
          ))}
        </ul>
      </SectionContainer>
    </section>
  );
}
