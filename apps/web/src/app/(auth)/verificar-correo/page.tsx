"use client";

import { RUTAS } from "@/config/routes";
import { api } from "@/lib/api";
import { Alert, Button, Spinner } from "@abasto/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerificarCorreoPage() {
  return (
    <Suspense fallback={null}>
      <VerificarCorreoPageContent />
    </Suspense>
  );
}

function VerificarCorreoPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [estado, setEstado] = useState<"cargando" | "verificado" | "error">(
    token ? "cargando" : "error",
  );
  const [mensaje, setMensaje] = useState(
    token ? "" : "Falta el token de verificación en el enlace.",
  );

  useEffect(() => {
    if (!token) return;
    let activo = true;

    api.auth
      .verificarCorreo({ token })
      .then(() => {
        if (activo) setEstado("verificado");
      })
      .catch((error) => {
        if (!activo) return;
        setMensaje(error instanceof Error ? error.message : "El enlace no es válido o ya caducó.");
        setEstado("error");
      });

    return () => {
      activo = false;
    };
  }, [token]);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-lg items-center px-margin-mobile py-space-lg">
      <section className="w-full rounded-3xl bg-surface-container-lowest p-space-xl shadow-overlay">
        {estado === "cargando" && (
          <div className="flex flex-col items-center gap-space-sm text-center">
            <Spinner />
            <h1 className="font-headline-md text-headline-md text-primary">
              Verificando tu correo…
            </h1>
          </div>
        )}
        {estado === "verificado" && (
          <Alert
            tone="success"
            title="Correo verificado"
            description="Ya puedes iniciar sesión con tu cuenta."
            actions={
              <Button asChild size="sm">
                <Link href={RUTAS.login}>Iniciar sesión</Link>
              </Button>
            }
          />
        )}
        {estado === "error" && (
          <Alert
            tone="error"
            title="No se pudo verificar el correo"
            description={mensaje}
            actions={
              <Button asChild variant="tonal" size="sm">
                <Link href={RUTAS.login}>Volver al inicio de sesión</Link>
              </Button>
            }
          />
        )}
      </section>
    </main>
  );
}
