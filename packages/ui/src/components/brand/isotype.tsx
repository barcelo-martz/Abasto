import type { SVGProps } from "react";
import { cn } from "../../lib/cn";

export type LogoVariant = "color" | "inverse" | "glass";

const PALETTE: Record<LogoVariant, { top: string; left: string; right: string; cross: string }> = {
  color: { top: "#2a5c99", left: "#1b3a5c", right: "#002444", cross: "#83d5cc" },
  inverse: { top: "#d2e4ff", left: "#abc9f2", right: "#87a4cc", cross: "#006a64" },
  glass: {
    top: "rgba(255,255,255,0.9)",
    left: "rgba(255,255,255,0.6)",
    right: "rgba(255,255,255,0.4)",
    cross: "#006a64",
  },
};

export interface IsotypeProps extends Omit<SVGProps<SVGSVGElement>, "variant"> {
  variant?: LogoVariant;
  /** Tamaño en px (cuadrado). */
  size?: number;
}

/** Isotipo: caja de suministros isométrica con cruz médica incrustada. */
export function Isotype({ variant = "color", size = 40, className, ...props }: IsotypeProps) {
  const c = PALETTE[variant];
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0", className)}
      {...props}
    >
      <polygon points="24,4 42,13 24,22 6,13" fill={c.top} />
      <polygon points="6,13 24,22 24,44 6,35" fill={c.left} />
      <polygon points="42,13 24,22 24,44 42,35" fill={c.right} />
      <g fill={c.cross}>
        <rect x="21.5" y="27" width="5" height="13" rx="1" transform="skewY(0)" />
        <rect x="17.5" y="31" width="13" height="5" rx="1" />
      </g>
    </svg>
  );
}
