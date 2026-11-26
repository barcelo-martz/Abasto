import type { ReactNode } from "react";
import { cn } from "@abasto/ui";

export interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** El título lleva el tamaño grande (headline-xl) en escritorio. */
  large?: boolean;
  id?: string;
  className?: string;
}

/** Etiqueta + título + descripción: se repite en casi todas las secciones. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  large,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col items-start",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <span className="mb-space-xs inline-block rounded-full bg-secondary-container/40 px-space-sm py-1 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-secondary-container">
        {eyebrow}
      </span>
      <h2
        id={id}
        className={cn(
          "font-headline-lg text-headline-lg font-bold text-primary",
          large && "md:font-headline-xl md:text-headline-xl",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
    </div>
  );
}
