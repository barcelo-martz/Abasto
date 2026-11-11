import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** Carpeta clínica con lupa y signo de pregunta (sin resultados). */
export function EmptySearchIllustration(props: P) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden {...props}>
      <ellipse cx="80" cy="60" rx="64" ry="46" fill="#9CEEE6" opacity=".35" />
      <path
        d="M32 40a6 6 0 0 1 6-6h28l8 9h48a6 6 0 0 1 6 6v46a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V40Z"
        fill="#1B3A5C"
      />
      <rect x="42" y="50" width="76" height="46" rx="4" fill="#fff" />
      <path d="M52 62h38M52 72h26" stroke="#C3C6CF" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M32 58a6 6 0 0 1 6-6h84a6 6 0 0 1 6 6v36a6 6 0 0 1-6 6H38a6 6 0 0 1-6-6V58Z"
        fill="#002444"
        opacity=".92"
      />
      <circle cx="104" cy="74" r="18" fill="#E6EEFF" stroke="#006A64" strokeWidth="5" />
      <path d="m117 87 13 13" stroke="#006A64" strokeWidth="7" strokeLinecap="round" />
      <path
        d="M99.5 69.5a5 5 0 1 1 7 4.6c-1.4.7-2 1.500-2 3"
        stroke="#002444"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="104.500" cy="83" r="1.800" fill="#002444" />
    </svg>
  );
}

/** Escudo con check (sin alertas sanitarias). */
export function EmptySafeIllustration(props: P) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden {...props}>
      <ellipse cx="80" cy="62" rx="62" ry="46" fill="#9CEEE6" opacity=".35" />
      <path d="M80 14 120 28v30c0 25-17 42-40 50-23-8-40-25-40-50V28l40-14Z" fill="#006A64" />
      <path d="M80 22 112 33v25c0 20-13 34-32 41-19-7-32-21-32-41V33l32-11Z" fill="#0A6F68" />
      <path
        d="m62 61 13 13 24-26"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 30l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6ZM132 78l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z"
        fill="#83D5CC"
      />
      <path
        d="M30 96c10-4 14-12 14-20M130 98c-9-3-13-10-13-18"
        stroke="#1E8E5A"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}

/** Libro de registro con línea punteada y badge "+" (sin dispensaciones). */
export function EmptyLedgerIllustration(props: P) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden {...props}>
      <ellipse cx="80" cy="64" rx="64" ry="44" fill="#D2E4FF" opacity=".5" />
      <rect x="34" y="22" width="92" height="80" rx="8" fill="#1B3A5C" />
      <rect
        x="42"
        y="18"
        width="84"
        height="80"
        rx="8"
        fill="#fff"
        stroke="#C3C6CF"
        strokeWidth="2"
      />
      <rect x="42" y="18" width="12" height="80" rx="4" fill="#002444" />
      {[38, 54, 70, 86].map((y) => (
        <path
          key={y}
          d="M64 38H114"
          transform={`translate(0 ${y - 38})`}
          stroke="#C3C6CF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="2 7"
        />
      ))}
      <circle cx="116" cy="90" r="16" fill="#006A64" />
      <path d="M116 82v16M108 90h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
