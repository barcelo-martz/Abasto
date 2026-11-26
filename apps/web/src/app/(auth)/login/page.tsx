"use client";

import { RUTAS } from "@/config/routes";
import { api } from "@/lib/api";
import { emitirCambioSesion } from "@/lib/session";
import { esApiError, loginSchema, type LoginInput } from "@abasto/contracts";
import { Alert, Button, Checkbox, Field, Icon, Input, Isotype, PasswordInput } from "@abasto/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registroPendiente = searchParams.get("registro") === "pendiente";
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const [recordar, setRecordar] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", contrasena: "" },
  });

  const login = useMutation({
    mutationFn: (datos: LoginInput) => api.auth.login(datos),
    onSuccess: (respuesta) => {
      const storage = recordar ? localStorage : sessionStorage;
      localStorage.removeItem("abasto.accessToken");
      localStorage.removeItem("abasto.refreshToken");
      localStorage.removeItem("abasto.usuario");
      sessionStorage.removeItem("abasto.accessToken");
      sessionStorage.removeItem("abasto.refreshToken");
      sessionStorage.removeItem("abasto.usuario");
      storage.setItem("abasto.accessToken", respuesta.accessToken);
      storage.setItem("abasto.refreshToken", respuesta.refreshToken);
      storage.setItem("abasto.usuario", JSON.stringify(respuesta.usuario));
      emitirCambioSesion();
      router.push(RUTAS.inicio);
      router.refresh();
    },
    onError: (error) => {
      if (esApiError(error)) {
        for (const campo of ["correo", "contrasena"] as (keyof LoginInput)[]) {
          const mensaje = error.erroresPorCampo[campo]?.[0];
          if (mensaje) setError(campo, { type: "server", message: mensaje });
        }
        setErrorGeneral(error.message);
        return;
      }
      setErrorGeneral("No pudimos iniciar sesión. Inténtalo nuevamente.");
    },
  });

  function enviar(datos: LoginInput) {
    setErrorGeneral(undefined);
    clearErrors();
    login.mutate(datos);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-7xl flex-1 px-margin-mobile py-3 md:px-margin lg:px-margin-desktop">
      <div className="grid w-full grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12 lg:gap-space-md">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-surface-container-lowest p-space-md shadow-overlay md:p-space-lg lg:col-span-7 lg:p-space-lg">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl"
          />

          <div className="relative mx-auto w-full max-w-xl">
            <div className="mb-space-sm">
              <div className="mb-2 inline-flex items-center gap-space-xs rounded-full bg-surface-container px-3 py-1">
                <Icon name="health_and_safety" size={16} className="text-secondary" />
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  MINSAP · República de Cuba
                </span>
              </div>
              <h1 className="mb-1 font-headline-md text-headline-md font-extrabold text-on-surface">
                Bienvenido de nuevo
              </h1>
              <p className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
                Accede para consultar medicamentos y gestionar tus recetas.
              </p>
            </div>

            {errorGeneral && (
              <Alert
                tone="error"
                title="No se pudo iniciar sesión"
                description={errorGeneral}
                className="mb-space-sm"
              />
            )}
            {registroPendiente && !errorGeneral && (
              <Alert
                tone="info"
                title="Verifica tu correo"
                description="La cuenta se creó correctamente. En desarrollo, busca el enlace de verificación en los logs de la API."
                className="mb-space-sm"
              />
            )}

            <form className="space-y-2.5" onSubmit={handleSubmit(enviar)} noValidate>
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
                  placeholder="usuario@infomed.cu"
                  autoComplete="email"
                  state={errors.correo ? "error" : "default"}
                />
              </Field>

              <Field
                label="Contraseña"
                required
                error={errors.contrasena?.message}
                labelAside={
                  <Link
                    href={RUTAS.recuperar}
                    className="font-semibold text-secondary hover:text-primary"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                }
              >
                <PasswordInput
                  {...register("contrasena", {
                    onChange: () => {
                      setErrorGeneral(undefined);
                      clearErrors("contrasena");
                    },
                  })}
                  leadingIcon="lock"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  state={errors.contrasena ? "error" : "default"}
                />
              </Field>

              <div className="flex items-center justify-between">
                <Checkbox
                  checked={recordar}
                  onCheckedChange={(checked) => setRecordar(checked === true)}
                  label="Recordar sesión"
                />
                <span className="hidden items-center gap-1 font-label-sm text-label-sm text-on-surface-variant sm:flex">
                  <Icon name="lock" size={14} className="text-secondary" />
                  Conexión segura
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="primary"
                fullWidth
                leadingIcon="login"
                loading={login.isPending}
                loadingText="Iniciando sesión…"
              >
                Iniciar sesión
              </Button>
            </form>

            <div className="relative my-space-md flex items-center">
              <div className="h-px w-full bg-outline-variant/60" />
              <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest px-3 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                o continúa sin cuenta
              </span>
            </div>

            <Button asChild variant="tonal" size="lg" fullWidth>
              <Link href={RUTAS.buscar}>
                <Icon name="search" size={20} className="text-secondary" />
                Consultar medicamentos como invitado
              </Link>
            </Button>

            <p className="mt-space-md text-center font-body-sm text-body-sm text-on-surface-variant">
              ¿Aún no tienes cuenta?{" "}
              <Link
                href={RUTAS.registro}
                className="font-semibold text-primary hover:text-secondary"
              >
                Crear cuenta ciudadana
              </Link>
            </p>
            <div className="mt-space-lg border-t border-outline-variant/50 pt-space-md text-center">
              <Link
                href={RUTAS.inicio}
                className="inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-primary hover:text-secondary"
              >
                <Icon name="arrow_back" size={18} />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </section>

        <aside className="relative hidden flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#071526] via-primary to-[#0f2e4e] p-space-lg text-on-primary shadow-overlay lg:col-span-5 lg:flex lg:p-space-lg">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03] [background-size:24px_24px] [background-image:radial-gradient(#ffffff_1px,transparent_1px)]"
          />
          <div className="relative flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary-fixed" />
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim">
              Red sanitaria nacional
            </span>
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-space-md flex h-52 w-52 items-center justify-center rounded-full bg-white/40 ring-1 ring-white/20 backdrop-blur-xl">
              <Isotype size={400} className="text-on-primary" />
            </div>
            <h2 className="max-w-md font-headline-lg text-headline-lg font-extrabold leading-tight">
              Acceso seguro a tu información farmacéutica
            </h2>
            <p className="mt-space-sm max-w-md font-body-md text-body-md text-surface-variant">
              Consulta disponibilidad, sigue tratamientos y organiza tus recetas desde una sola
              cuenta.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-surface-container-high/90">
            <Icon name="verified_user" size={20} className="text-secondary-fixed" />
            <span className="font-label-sm text-label-sm">Acceso protegido · MINSAP / CECMED</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
