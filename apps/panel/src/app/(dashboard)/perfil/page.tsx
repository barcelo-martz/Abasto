"use client";

import { obtenerSesion } from "@/features/auth/session";
import { Icon } from "@abasto/ui";

export default function PerfilPage() {
  const sesion = obtenerSesion();
  if (!sesion) return null;

  const nombre = `${sesion.usuario.nombres} ${sesion.usuario.apellidos}`.trim();

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-surface-container-lowest p-space-xl shadow-card">
      <div className="flex items-center gap-space-md">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="person" size={32} />
        </span>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
            Perfil institucional
          </p>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">{nombre}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {sesion.usuario.correo}
          </p>
        </div>
      </div>
      <dl className="mt-space-xl grid grid-cols-1 gap-space-md rounded-xl bg-surface-container-low p-space-md sm:grid-cols-2">
        <div>
          <dt className="font-label-sm text-label-sm text-on-surface-variant">Rol</dt>
          <dd className="mt-1 font-label-md text-label-md text-on-surface">{sesion.usuario.rol}</dd>
        </div>
        <div>
          <dt className="font-label-sm text-label-sm text-on-surface-variant">Usuario</dt>
          <dd className="mt-1 font-label-md text-label-md text-on-surface">{sesion.usuario.id}</dd>
        </div>
      </dl>
    </section>
  );
}
