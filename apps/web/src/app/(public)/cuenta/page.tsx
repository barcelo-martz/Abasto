"use client";

import { RUTAS } from "@/config/routes";
import { useSesion } from "@/lib/session";
import { Icon } from "@abasto/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CuentaPage() {
  const sesion = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (sesion === null) router.replace(RUTAS.login);
  }, [router, sesion]);

  if (sesion === undefined) {
    return (
      <main className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-4xl items-center justify-center px-margin-mobile">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
      </main>
    );
  }

  if (!sesion) return null;

  const nombre = `${sesion.usuario.nombres} ${sesion.usuario.apellidos}`.trim();
  return (
    <main className="mx-auto min-h-[calc(100dvh-8rem)] max-w-4xl px-margin-mobile py-space-xl md:px-margin">
      <section className="rounded-3xl bg-surface-container-lowest p-space-xl shadow-card">
        <div className="flex items-center gap-space-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="account_circle" size={36} />
          </div>
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Mi cuenta
            </p>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{nombre}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {sesion.usuario.correo}
            </p>
          </div>
        </div>
        <div className="mt-space-xl flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm text-on-surface-variant">
            Pagina en Progreso
          </h3>
        </div>
      </section>
    </main>
  );
}
