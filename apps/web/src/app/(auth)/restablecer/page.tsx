"use client";

import { RUTAS } from "@/config/routes";
import { api } from "@/lib/api";
import { esApiError, restablecerContrasenaSchema } from "@abasto/contracts";
import { Alert, Button, Field, Icon, PasswordInput } from "@abasto/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerContrasenaPageContent />
    </Suspense>
  );
}

function RestablecerContrasenaPageContent() {
  const token = useSearchParams().get("token") ?? "";
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(restablecerContrasenaSchema),
    defaultValues: { token, contrasena: "", confirmarContrasena: "" },
  });

  useEffect(() => {
    setValue("token", token);
  }, [setValue, token]);

  const restablecer = useMutation({
    mutationFn: (nuevaContrasena: string) =>
      api.auth.restablecerContrasena({ token, contrasena: nuevaContrasena }),
    onError: (error) => {
      if (esApiError(error)) {
        setErrorGeneral(error.message);
        return;
      }
      setErrorGeneral(
        "No pudimos cambiar la contraseña. Solicita un nuevo enlace e inténtalo otra vez.",
      );
    },
  });

  function enviar(datos: { token: string; contrasena: string; confirmarContrasena: string }) {
    setErrorGeneral(undefined);
    clearErrors();
    restablecer.mutate(datos.contrasena);
  }

  return (
    <main className="flex min-h-[calc(100dvh-1.5rem)] flex-1 items-center justify-center px-margin-mobile py-space-xl md:px-margin lg:px-margin-desktop">
      <section className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-space-md shadow-overlay sm:p-space-lg">
        <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary">
          <Icon name="lock_reset" size={26} />
        </div>
        <p className="mb-2 inline-flex items-center gap-2 font-label-sm text-label-sm font-semibold uppercase tracking-wide text-secondary">
          <Icon name="encrypted" size={16} />
          Acceso protegido
        </p>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
          Restablecer contraseña
        </h1>
        <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
          Elige una contraseña nueva. Debe tener al menos 8 caracteres, una letra y un número.
        </p>

        {errorGeneral && (
          <div className="mt-space-md space-y-3">
            <Alert
              tone="error"
              title="No se pudo restablecer la contraseña"
              description={errorGeneral}
            />
            <Button asChild variant="tonal" fullWidth leadingIcon="refresh">
              <Link href={RUTAS.recuperar}>Solicitar un enlace nuevo</Link>
            </Button>
          </div>
        )}

        {restablecer.isSuccess ? (
          <div className="mt-space-md space-y-4">
            <Alert
              tone="success"
              title="Contraseña actualizada"
              description="Ya puedes iniciar sesión con tu nueva contraseña."
            />
            <Button asChild size="lg" variant="primary" fullWidth leadingIcon="login">
              <Link href={RUTAS.login}>Ir al inicio de sesión</Link>
            </Button>
          </div>
        ) : !token ? (
          <div className="mt-space-md space-y-4">
            <Alert
              tone="error"
              title="Enlace incompleto"
              description="Este enlace no incluye un token de recuperación. Solicita uno nuevo para continuar."
            />
            <Button asChild variant="primary" fullWidth leadingIcon="refresh">
              <Link href={RUTAS.recuperar}>Solicitar otro enlace</Link>
            </Button>
          </div>
        ) : (
          <form className="mt-space-md space-y-4" onSubmit={handleSubmit(enviar)} noValidate>
            <Field label="Nueva contraseña" required error={errors.contrasena?.message}>
              <PasswordInput
                {...register("contrasena", {
                  onChange: () => {
                    setErrorGeneral(undefined);
                    clearErrors("contrasena");
                  },
                })}
                leadingIcon="lock"
                placeholder="Escribe una contraseña nueva"
                autoComplete="new-password"
                state={errors.contrasena ? "error" : "default"}
              />
            </Field>
            <Field
              label="Confirma la nueva contraseña"
              required
              error={errors.confirmarContrasena?.message}
            >
              <PasswordInput
                {...register("confirmarContrasena", {
                  onChange: () => {
                    setErrorGeneral(undefined);
                    clearErrors("confirmarContrasena");
                  },
                })}
                leadingIcon="password"
                placeholder="Repite la contraseña nueva"
                autoComplete="new-password"
                state={errors.confirmarContrasena ? "error" : "default"}
              />
            </Field>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              fullWidth
              leadingIcon="key"
              loading={restablecer.isPending}
              loadingText="Actualizando contraseña…"
            >
              Guardar nueva contraseña
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
