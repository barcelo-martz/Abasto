import { RUTAS } from "@/config/routes";
import { buttonVariants, Icon, LinkCard } from "@abasto/ui";
import Link from "next/link";
import { SectionContainer } from "./section-container";
import { SectionHeading } from "./section-heading";

const GARANTIAS = [
  { icon: "edit_note", text: "Resultado siempre editable" },
  { icon: "event_available", text: "Detecta la vigencia de la receta" },
  { icon: "security", text: "No guardamos tu receta sin tu permiso" },
];

export function ServicesSection() {
  return (
    <section aria-labelledby="herramientas" className="w-full bg-surface py-space-3xl">
      <SectionContainer>
        <SectionHeading
          id="herramientas"
          large
          eyebrow="Herramientas"
          title="Todo lo que necesitas para resolver tu receta"
          className="mb-space-xl"
        />
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-space-xl text-on-primary shadow-raised lg:col-span-7">
            <div className="relative z-10 max-w-lg">
              <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-white/10 px-space-sm py-1 font-label-sm text-label-sm text-secondary-fixed">
                <Icon name="document_scanner" size={16} />
                <span>Lector de recetas</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-bold leading-tight text-white">
                Convierte la foto de tu receta en una lista
              </h3>
              <p className="mt-space-sm font-body-md text-body-md leading-relaxed text-surface-variant">
                Fotografía tu receta o tarjetón. Abasto reconoce los medicamentos, tú corriges lo
                que haga falta y te mostramos qué farmacias los tienen.
              </p>
              <div className="mt-space-xl flex flex-wrap items-center gap-space-md">
                <Link
                  href={RUTAS.receta}
                  className={buttonVariants({ variant: "clinical", size: "lg" })}
                >
                  <Icon name="add_photo_alternate" size={20} />
                  <span>Leer mi receta</span>
                </Link>
                <span className="font-label-sm text-label-sm text-primary-fixed-dim">
                  Sirve con una foto tomada desde el móvil
                </span>
              </div>
            </div>
            <ul className="relative z-10 mt-space-xl grid grid-cols-1 gap-space-md border-t border-white/10 pt-space-lg text-[13px] text-surface-variant sm:grid-cols-3">
              {GARANTIAS.map((g) => (
                <li key={g.text} className="flex items-center gap-space-xs">
                  <Icon name={g.icon} size={18} className="text-secondary-container" />
                  <span>{g.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <LinkCard
              eyebrow="Ahorra desplazamientos"
              title="Planificador de recorrido"
              description="¿Tienes varios medicamentos? Abasto propone el conjunto y el orden de farmacias que los cubre con el menor recorrido."
              icon="route"
              href={RUTAS.recorrido}
              linkLabel="Planificar mi recorrido"
              linkComponent={Link}
            />
            <LinkCard
              eyebrow="Cuando falta un producto"
              title="Alternativas por principio activo"
              description="Si no hay existencia, consulta otros productos con el mismo principio activo. Es solo información: consulta siempre a un profesional de la salud."
              icon="published_with_changes"
              href={RUTAS.guia}
              linkLabel="Ver la guía de medicamentos"
              linkComponent={Link}
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
