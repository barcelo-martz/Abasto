"use client";

import { RUTAS } from "@/config/routes";
import { guardarSesion } from "@/features/auth/session";
import { api } from "@/lib/api";
import { esApiError, loginSchema, RolUsuario, type LoginInput } from "@abasto/contracts";
import { Alert, Button, Checkbox, Field, Icon, Input, Isotype, PasswordInput } from "@abasto/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";

const AREA_POR_ROL = {
  PERSONAL_FARMACIA: RUTAS.farmacia,
  PERSONAL_ALMACEN: RUTAS.almacen,
  SUPERVISOR_MUNICIPAL: RUTAS.supervisor,
  ADMINISTRADOR: RUTAS.admin,
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const [recordar, setRecordar] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: "", contrasena: "" },
  });

  async function enviar(datos: LoginInput) {
    setErrorGeneral(undefined);
    clearErrors();
    try {
      const respuesta = await api.auth.login(datos);

      if (respuesta.usuario.rol === RolUsuario.CIUDADANO) {
        setErrorGeneral("Esta cuenta pertenece al portal ciudadano y no puede acceder al panel.");
        return;
      }

      const area = AREA_POR_ROL[respuesta.usuario.rol];
      if (!area) {
        setErrorGeneral("Tu rol no tiene un área de gestión asignada.");
        return;
      }

      guardarSesion(
        {
          accessToken: respuesta.accessToken,
          refreshToken: respuesta.refreshToken,
          usuario: respuesta.usuario,
        },
        recordar,
      );
      router.push(area);
      router.refresh();
    } catch (error) {
      if (esApiError(error)) {
        for (const campo of ["correo", "contrasena"] as (keyof LoginInput)[]) {
          const mensaje = error.erroresPorCampo[campo]?.[0];
          if (mensaje) setError(campo, { type: "server", message: mensaje });
        }
        setErrorGeneral(error.message);
      } else {
        setErrorGeneral("No pudimos conectar con la API. Inténtalo nuevamente.");
      }
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#17375b_0%,#08121f_55%,#050b12_100%)] p-space-md text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.03] [background-size:32px_32px]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0e2139]/90 p-space-lg shadow-2xl backdrop-blur-xl md:p-space-xl">
        <div className="mb-space-lg flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <Isotype className="h-8 w-8 text-primary" />
            <div>
              <p className="font-headline-sm text-headline-sm font-bold">Abasto</p>
              <p className="font-label-sm text-label-sm text-slate-300">
                MINSAP · Gestión sanitaria
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 font-label-sm text-label-sm text-secondary-fixed">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-fixed" />
            Seguro
          </div>
        </div>

        <div className="mb-space-lg">
          <h1 className="font-headline-lg text-headline-lg font-extrabold">Panel de gestión</h1>
          <p className="mt-1 font-body-md text-body-md text-slate-300">
            Inicia sesión con una cuenta institucional.
          </p>
        </div>

        {errorGeneral && (
          <Alert
            tone="error"
            title="No se pudo ingresar"
            description={errorGeneral}
            className="mb-space-md"
          />
        )}

        <form className="space-y-space-md" onSubmit={handleSubmit(enviar)} noValidate>
          <Field
            label="Correo institucional"
            labelClassName="text-slate-200"
            required
            error={errors.correo?.message}
          >
            <Input
              {...register("correo", {
                onChange: () => {
                  setErrorGeneral(undefined);
                  clearErrors("correo");
                },
              })}
              type="email"
              leadingIcon="alternate_email"
              placeholder="usuario@minsap.cu"
              autoComplete="username"
              state={errors.correo ? "error" : "default"}
            />
          </Field>

          <Field
            label="Contraseña"
            labelClassName="text-slate-200"
            required
            error={errors.contrasena?.message}
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

          <div className="-mt-2 flex justify-end">
            <Link
              href={new URL(
                "/recuperar",
                process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000",
              ).toString()}
              className="font-label-sm text-label-sm font-semibold text-secondary-fixed hover:text-white"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Checkbox
            checked={recordar}
            onCheckedChange={(checked) => setRecordar(checked === true)}
            label={<span className="text-slate-300">Recordar estación de trabajo</span>}
            className="text-on-primary"
          />

          <Button
            type="submit"
            size="lg"
            variant="clinical"
            fullWidth
            leadingIcon="login"
            loading={isSubmitting}
            loadingText="Validando acceso…"
          >
            Ingresar al sistema
          </Button>
        </form>

        <div className="mt-space-lg text-center">
          <Link
            href={process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000"}
            className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary-fixed hover:text-white"
          >
            Ir al portal ciudadano
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
