import { RUTAS } from "@/config/routes";
import { cn, Icon } from "@abasto/ui";
import Link from "next/link";
import { SectionContainer } from "./section-container";

interface Item {
  icon: string;
  tone: string;
  eyebrow: string;
  title: string;
  text: string;
  href?: string;
}

const ITEMS: Item[] = [
  {
    icon: "mail",
    tone: "bg-primary",
    eyebrow: "¿Dudas o problemas?",
    title: "Contáctenos",
    text: "Escríbele al administrador del sistema",
    href: RUTAS.contacto,
  },
  {
    icon: "verified",
    tone: "bg-secondary",
    eyebrow: "Datos de las farmacias",
    title: "Etiquetas de confianza",
    text: "Aprende a leer cada resultado",
    href: RUTAS.etiquetas,
  },
  {
    icon: "lock",
    tone: "bg-primary-container",
    eyebrow: "Privacidad",
    title: "Sin datos del paciente",
    text: "Las recetas se procesan y no se conservan sin tu permiso",
  },
];

export function SupportStrip() {
  return (
    <section
      aria-label="Ayuda y confianza"
      className="w-full bg-surface-container-low py-space-xl mb-8"
    >
      <SectionContainer>
        <ul className="grid grid-cols-1 items-center gap-space-lg md:grid-cols-3">
          {ITEMS.map((it) => {
            const body = (
              <>
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white",
                    it.tone,
                  )}
                >
                  <Icon name={it.icon} size={24} />
                </div>
                <div>
                  <div className="font-label-sm text-label-sm font-bold uppercase text-on-surface-variant">
                    {it.eyebrow}
                  </div>
                  <div className="font-headline-sm text-headline-sm font-bold text-primary">
                    {it.title}
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant">{it.text}</div>
                </div>
              </>
            );
            return (
              <li key={it.title}>
                {it.href ? (
                  <Link
                    href={it.href}
                    className="flex items-center gap-space-md rounded-xl transition-opacity hover:opacity-80"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-space-md">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </SectionContainer>
    </section>
  );
}
