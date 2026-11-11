export type ChartTone = "primary" | "secondary" | "warning" | "error" | "info" | "neutral";

/** Variables CSS de los tokens para usar en atributos SVG (fill/stroke). */
export const toneVar: Record<ChartTone, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
  info: "var(--color-primary-fixed-dim)",
  neutral: "var(--color-outline-variant)",
};

export function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}
