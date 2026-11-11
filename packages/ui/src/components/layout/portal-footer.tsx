import type { ElementType } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { AppLink } from "../navigation/link";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface PortalFooterProps {
  columns?: FooterColumn[];
  contactEmail?: string;
  version?: string;
  linkComponent?: ElementType;
  className?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Marco normativo",
    links: [
      { label: "Resolución Ministerial 23/2023", href: "#" },
      { label: "Control de Suministros CECMED", href: "#" },
      { label: "Reglamento Farmacéutico Nacional", href: "#" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Términos y privacidad", href: "#" },
      { label: "Mesa de ayuda", href: "#" },
      { label: "Farmacias de turno", href: "#" },
    ],
  },
];

/** Footer institucional del portal público. */
export function PortalFooter({
  columns = DEFAULT_COLUMNS,
  contactEmail = "soporte.abasto@minsap.gob.cu",
  version = "v3.4.1",
  linkComponent,
  className,
}: PortalFooterProps) {
  return (
    <footer className={cn("w-full bg-surface-container-low py-space-2xl", className)}>
      <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin lg:px-margin-desktop">
        <div className="grid gap-space-xl md:grid-cols-[1.4fr_repeat(2,1fr)]">
          <div className="flex items-start gap-space-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary">
              <Icon name="local_pharmacy" size={20} />
            </span>
            <div>
              <p className="font-headline-sm text-headline-sm text-primary">
                Abasto · Infraestructura Digital de Salud
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ministerio de Salud Pública (MINSAP) • República de Cuba
              </p>
            </div>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline">
                {c.title}
              </h2>
              <ul className="flex flex-col gap-1.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <AppLink
                      linkComponent={linkComponent}
                      href={l.href}
                      className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      {l.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-space-xl flex flex-col items-center justify-between gap-space-sm pt-space-md font-label-sm text-label-sm text-outline sm:flex-row">
          <p>
            © {new Date().getFullYear()} Abasto · Sistema de consulta de disponibilidad de
            medicamentos.
          </p>
          <p className="font-numeric-data text-numeric-data">
            {contactEmail} · {version}
          </p>
        </div>
      </div>
    </footer>
  );
}
