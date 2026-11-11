import type { AnchorHTMLAttributes, ElementType, ReactNode } from "react";

export interface LinkLikeProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Componente de enlace del router (p. ej. next/link). Por defecto <a>. */
  linkComponent?: ElementType;
  children?: ReactNode;
}

/** Enlace agnóstico del router: pasa `linkComponent={Link}` desde la app. */
export function AppLink({ linkComponent: As = "a", ...props }: LinkLikeProps) {
  return <As {...props} />;
}
