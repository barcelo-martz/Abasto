import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Nombre del símbolo de Material Symbols Outlined (p. ej. "local_pharmacy"). */
  name: string;
  /** Tamaño en px (por defecto 20). */
  size?: number;
  /** Relleno sólido (FILL 1). */
  filled?: boolean;
  /** Si se pasa, el icono es significativo y se anuncia a lectores de pantalla. */
  label?: string;
}

/**
 * Requiere cargar la fuente "Material Symbols Outlined" (ver README).
 */
export function Icon({ name, size = 20, filled, label, className, style, ...rest }: IconProps) {
  const s: CSSProperties = {
    fontSize: size,
    width: size,
    height: size,
    fontVariationSettings: filled ? "'FILL' 1" : undefined,
    ...style,
  };
  return (
    <span
      {...rest}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "material-symbols-outlined inline-flex shrink-0 select-none items-center justify-center leading-none",
        className,
      )}
      style={s}
    >
      {name}
    </span>
  );
}
