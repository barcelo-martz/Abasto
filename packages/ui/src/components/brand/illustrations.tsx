import type { SVGProps } from "react";
import { cn } from "../../lib/cn";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, className?: string) => ({
  viewBox: "0 0 120 120",
  width: size,
  height: size,
  "aria-hidden": true as const,
  className: cn("shrink-0", className),
});

export function SupplyBoxIllustration({ size = 120, className, ...p }: P) {
  return (
    <svg {...base(size, className)} {...p}>
      <ellipse cx="60" cy="104" rx="34" ry="7" fill="#1b3a5c" opacity=".12" />
      <polygon points="60,38 96,54 60,70 24,54" fill="#2a5c99" />
      <polygon points="24,54 60,70 60,104 24,88" fill="#1b3a5c" />
      <polygon points="96,54 60,70 60,104 96,88" fill="#002444" />
      <polygon points="24,54 14,40 50,28 60,38" fill="#436084" />
      <polygon points="96,54 106,40 70,28 60,38" fill="#abc9f2" />
      <g fill="#83d5cc">
        <rect x="56" y="12" width="8" height="22" rx="2" />
        <rect x="49" y="19" width="22" height="8" rx="2" />
      </g>
    </svg>
  );
}

export function CapsuleIllustration({ size = 120, className, ...p }: P) {
  return (
    <svg {...base(size, className)} {...p}>
      <ellipse cx="60" cy="100" rx="30" ry="6" fill="#1b3a5c" opacity=".12" />
      <g transform="rotate(-35 60 58)">
        <path d="M60 20h-14a18 18 0 0 0 0 36h14z" transform="translate(0 4)" fill="#1b3a5c" />
        <path d="M60 24h14a18 18 0 0 1 0 36H60z" fill="#006a64" />
        <rect x="36" y="30" width="22" height="5" rx="2.5" fill="#fff" opacity=".35" />
      </g>
    </svg>
  );
}

export function RadarPinIllustration({ size = 120, className, ...p }: P) {
  return (
    <svg {...base(size, className)} {...p}>
      <ellipse
        cx="60"
        cy="96"
        rx="44"
        ry="14"
        fill="none"
        stroke="#006a64"
        strokeOpacity=".15"
        strokeWidth="2"
      />
      <ellipse
        cx="60"
        cy="96"
        rx="30"
        ry="9"
        fill="none"
        stroke="#006a64"
        strokeOpacity=".3"
        strokeWidth="2"
      />
      <ellipse cx="60" cy="96" rx="14" ry="4" fill="#006a64" opacity=".35" />
      <path
        d="M60 14c-15 0-26 11-26 26 0 20 26 52 26 52s26-32 26-52c0-15-11-26-26-26z"
        fill="#002444"
      />
      <g fill="#83d5cc">
        <rect x="56" y="29" width="8" height="22" rx="2" />
        <rect x="49" y="36" width="22" height="8" rx="2" />
      </g>
    </svg>
  );
}

export function ShieldCrossIllustration({ size = 120, className, ...p }: P) {
  return (
    <svg {...base(size, className)} {...p}>
      <path d="M60 12 24 26v28c0 26 16 42 36 52 20-10 36-26 36-52V26z" fill="#1b3a5c" />
      <path d="M60 12v94c20-10 36-26 36-52V26z" fill="#002444" />
      <g fill="#83d5cc">
        <rect x="55" y="34" width="10" height="38" rx="2" />
        <rect x="41" y="48" width="38" height="10" rx="2" />
      </g>
    </svg>
  );
}
