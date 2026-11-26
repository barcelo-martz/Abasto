"use client";

import { RUTAS } from "@/config/routes";
import { api } from "@/lib/api";
import { esApiError, solicitarRecuperacionSchema } from "@abasto/contracts";
import { Alert, Button, Field, Icon, Input } from "@abasto/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function RecuperarContrasenaPage() {
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(solicitarRecuperacionSchema),
    defaultValues: { correo: "" },
  });

  const recuperar = useMutation({
    mutationFn: (email: string) => api.auth.solicitarRecuperacion({ correo: email }),
    onError: (error) => {
      if (esApiError(error)) {
        const correoError = error.erroresPorCampo.correo?.[0];
        if (correoError) setError("correo", { type: "server", message: correoError });
        setErrorGeneral(correoError ? undefined : error.message);
        return;
      }
      setErrorGeneral("No pudimos procesar la solicitud. Inténtalo nuevamente.");
    },
  });

  function enviar(datos: { correo: string }) {
    setErrorGeneral(undefined);
    clearErrors();
    recuperar.mutate(datos.correo.trim());
  }

  return (
    <main className="flex min-h-[calc(100dvh-1.5rem)] flex-1 items-center justify-center px-margin-mobile py-space-xl md:px-margin lg:px-margin-desktop">
      <section className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-space-md shadow-overlay sm:p-space-lg">
        <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-secondary">
          <Icon name="lock_reset" size={26} />
        </div>
        <p className="mb-2 inline-flex items-center gap-2 font-label-sm text-label-sm font-semibold uppercase tracking-wide text-secondary">
          <Icon name="verified_user" size={16} />
          Recuperación segura
        </p>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
          Escribe el correo asociado a tu cuenta. Te enviaremos un enlace de un solo uso, válido
          durante 15 minutos.
        </p>

        {errorGeneral && (
          <Alert
            tone="error"
            title="No se pudo enviar la solicitud"
            description={errorGeneral}
            className="mt-space-md"
          />
        )}

        {recuperar.isSuccess ? (
          <div className="mt-space-md space-y-4">
            <Alert
              tone="success"
              title="Revisa tu correo"
              description="Si existe una cuenta asociada a esa dirección, recibirás instrucciones para restablecer la contraseña."
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              En desarrollo, el enlace aparece en los logs de la API. Si no recibes el mensaje,
              revisa también la carpeta de correo no deseado.
            </p>
            <Button variant="tonal" fullWidth onClick={() => recuperar.reset()}>
              Usar otro correo
            </Button>
          </div>
        ) : (
          <form className="mt-space-md space-y-4" onSubmit={handleSubmit(enviar)} noValidate>
            <Field label="Correo electrónico" required error={errors.correo?.message}>
              <Input
                {...register("correo", {
                  onChange: () => {
                    setErrorGeneral(undefined);
                    clearErrors("correo");
                  },
                })}
                type="email"
                leadingIcon="alternate_email"
                placeholder="usuario@correo.com"
                autoComplete="email"
                state={errors.correo ? "error" : "default"}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              fullWidth
              leadingIcon="mail"
              loading={recuperar.isPending}
              loadingText="Enviando solicitud…"
            >
              Enviar enlace de recuperación
            </Button>
          </form>
        )}

        <div className="mt-space-lg border-t border-outline-variant/50 pt-space-md text-center">
          <Link
            href={RUTAS.login}
            className="inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-primary hover:text-secondary"
          >
            <Icon name="arrow_back" size={18} />
            Volver al inicio de sesión
          </Link>
        </div>
      </section>
    </main>
  );
}
