import type { HTMLAttributes } from "react";
import { cn } from "@abasto/ui";

/** Ancho máximo y márgenes laterales comunes a todas las secciones. */
export function SectionContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-margin-mobile md:px-margin lg:px-margin-desktop",
        className,
      )}
      {...props}
    />
  );
}
