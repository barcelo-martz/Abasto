import { cn, MedicineCard } from "@abasto/ui";
import Link from "next/link";
import type { FeaturedMedicine } from "../types";

export function FeaturedMedicineCard({
  medicine: m,
  className,
}: {
  medicine: FeaturedMedicine;
  className?: string;
}) {
  return (
    <MedicineCard
      variant={m.availability.status}
      name={m.name}
      presentation={m.presentation}
      code={m.code}
      controlled={m.controlled}
      details={m.details}
      price={m.price}
      availabilityLabel={m.availability.label}
      ctaLabel={m.ctaLabel}
      ctaHref={m.href}
      linkComponent={Link}
      className={cn("h-full", className)}
    />
  );
}
