"use client";

import { RUTAS } from "@/config/routes";
import { obtenerMunicipios, PROVINCIAS } from "@/config/territory";
import { api } from "@/lib/api";
import {
  aRegistroRequest,
  esApiError,
  registroSchema,
  type RegistroInput,
} from "@abasto/contracts";
import {
  Alert,
  Button,
  Checkbox,
  Field,
  Icon,
  Input,
  Isotype,
  PasswordInput,
  Select,
} from "@abasto/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function RegistroPage() {
  const router = useRouter();
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errorTerminos, setErrorTerminos] = useState<string>();
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<RegistroInput>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      correo: "",
      contrasena: "",
      confirmarContrasena: "",
      provinciaId: "",
      municipioId: "",
    },
  });
  const provinciaId = useWatch({ control, name: "provinciaId" });
  const contrasena = useWatch({ control, name: "contrasena" });
  const confirmarContrasena = useWatch({ control, name: "confirmarContrasena" });
  const municipios = obtenerMunicipios(provinciaId);

  const registro = useMutation({
    mutationFn: (datos: RegistroInput) => api.auth.registro(aRegistroRequest(datos)),
    onSuccess: () => router.push(`${RUTAS.login}?registro=pendiente`),
    onError: (error) => {
      if (esApiError(error)) {
        for (const campo of [
          "nombres",
          "apellidos",
          "correo",
          "contrasena",
          "provinciaId",
          "municipioId",
        ] as (keyof RegistroInput)[]) {
          const mensaje = error.erroresPorCampo[campo]?.[0];
          if (mensaje) setError(campo, { type: "server", message: mensaje });
        }
        setErrorGeneral(error.message);
        return;
      }
      setErrorGeneral("No pudimos completar el registro. Inténtalo nuevamente.");
    },
  });

  function enviar(datos: RegistroInput) {
    setErrorGeneral(undefined);
    setErrorTerminos(undefined);

    if (!aceptaTerminos) {
      setErrorTerminos("Debes aceptar los términos y la política de protección de datos.");
      return;
    }

    clearErrors();
    registro.mutate(datos);
  }

  const tieneLongitud = contrasena.length >= 8;
  const tieneNumero = /[0-9]/.test(contrasena);
  const tieneMayuscula = /[A-Z]/.test(contrasena);
  const coincide = confirmarContrasena.length > 0 && contrasena === confirmarContrasena;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-margin-mobile py-3 md:px-margin lg:h-[calc(100dvh-1.5rem)] lg:px-margin-desktop lg:py-3">
      <div className="grid w-full grid-cols-1 items-stretch gap-space-lg lg:grid-cols-12 lg:gap-space-md">
        <section className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-surface-container-lowest p-space-md shadow-overlay md:p-space-lg lg:col-span-7 lg:p-space-lg">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl"
          />

          <div className="relative mb-space-sm">
            <div className="mb-2 inline-flex items-center gap-space-xs rounded-full bg-surface-container px-3 py-1">
              <Icon name="health_and_safety" size={16} className="text-secondary" />
              <span className="font-label-sm text-label-sm font-semibold text-primary">
                MINSAP · República de Cuba
              </span>
            </div>
            <h1 className="mb-0.5 font-headline-md text-headline-md font-extrabold text-primary">
              Crear cuenta ciudadana
            </h1>
            <p className="font-body-sm text-body-sm leading-snug text-on-surface-variant">
              Accede a la red nacional de disponibilidad y seguimiento de medicamentos.
            </p>
          </div>

          <form className="relative space-y-2.5" onSubmit={handleSubmit(enviar)} noValidate>
            {errorGeneral && (
              <Alert tone="error" title="No se pudo crear la cuenta" description={errorGeneral} />
            )}

            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
              <Field label="Nombres" required error={errors.nombres?.message}>
                <Input
                  {...register("nombres", {
                    onChange: () => {
                      setErrorGeneral(undefined);
                      clearErrors("nombres");
                    },
                  })}
                  leadingIcon="person"
                  placeholder="Ej. Claudia"
                  autoComplete="given-name"
                  state={errors.nombres ? "error" : "default"}
                />
              </Field>
              <Field label="Apellidos" required error={errors.apellidos?.message}>
                <Input
                  {...register("apellidos", {
                    onChange: () => {
                      setErrorGeneral(undefined);
                      clearErrors("apellidos");
                    },
                  })}
                  leadingIcon="badge"
                  placeholder="Ej. Pérez Mesa"
                  autoComplete="family-name"
                  state={errors.apellidos ? "error" : "default"}
                />
              </Field>
            </div>

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

            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
              <Field label="Provincia" required error={errors.provinciaId?.message}>
                <Controller
                  control={control}
                  name="provinciaId"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value);
                        clearErrors("provinciaId");
                        setValue("municipioId", "", { shouldDirty: true });
                        clearErrors("municipioId");
                      }}
                      onBlur={field.onBlur}
                      placeholder="Selecciona una provincia"
                      state={errors.provinciaId ? "error" : "default"}
                      options={PROVINCIAS.map((provincia) => ({
                        value: provincia.id,
                        label: provincia.nombre,
                        icon: "location_city",
                      }))}
                    />
                  )}
                />
              </Field>
              <Field label="Municipio" required error={errors.municipioId?.message}>
                <Controller
                  control={control}
                  name="municipioId"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value);
                        clearErrors("municipioId");
                      }}
                      onBlur={field.onBlur}
                      placeholder={
                        !provinciaId ? "Primero selecciona provincia" : "Selecciona un municipio"
                      }
                      disabled={!provinciaId}
                      state={errors.municipioId ? "error" : "default"}
                      options={municipios.map((municipio) => ({
                        value: municipio.id,
                        label: municipio.nombre,
                        icon: "pin_drop",
                      }))}
                    />
                  )}
                />
              </Field>
            </div>

            <Field label="Contraseña" required error={errors.contrasena?.message}>
              <PasswordInput
                {...register("contrasena", {
                  onChange: () => {
                    setErrorGeneral(undefined);
                    clearErrors("contrasena");
                  },
                })}
                leadingIcon="lock"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                state={errors.contrasena ? "error" : "default"}
              />
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {[tieneLongitud, tieneNumero, tieneMayuscula].map((activo, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full ${activo ? "bg-secondary" : "bg-surface-container-high"}`}
                  />
                ))}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1 font-label-sm text-label-sm text-on-surface-variant sm:grid-cols-3">
                <span className={tieneLongitud ? "text-secondary" : undefined}>
                  <Icon
                    name={tieneLongitud ? "check_circle" : "radio_button_unchecked"}
                    size={14}
                    className="mr-1 inline"
                  />
                  8 caracteres
                </span>
                <span className={tieneNumero ? "text-secondary" : undefined}>
                  <Icon
                    name={tieneNumero ? "check_circle" : "radio_button_unchecked"}
                    size={14}
                    className="mr-1 inline"
                  />
                  Número
                </span>
                <span className={tieneMayuscula ? "text-secondary" : undefined}>
                  <Icon
                    name={tieneMayuscula ? "check_circle" : "radio_button_unchecked"}
                    size={14}
                    className="mr-1 inline"
                  />
                  Mayúscula
                </span>
              </div>
            </Field>

            <Field
              label="Confirmar contraseña"
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
                leadingIcon="lock_reset"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                state={errors.confirmarContrasena ? "error" : coincide ? "success" : "default"}
              />
            </Field>

            <Checkbox
              checked={aceptaTerminos}
              onCheckedChange={(checked) => {
                const aceptado = checked === true;
                setAceptaTerminos(aceptado);
                if (aceptado) setErrorTerminos(undefined);
              }}
              className={errorTerminos ? "text-error" : undefined}
              label={
                <>
                  Acepto los{" "}
                  <Link href="#" className="font-semibold text-secondary hover:underline">
                    términos de uso
                  </Link>{" "}
                  y la política de protección de datos personales.
                </>
              }
            />
            {errorTerminos && (
              <p
                role="alert"
                className="flex items-center gap-1 font-label-sm text-label-sm text-error"
              >
                <Icon name="error" size={14} filled />
                {errorTerminos}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              variant="primary"
              fullWidth
              trailingIcon="arrow_forward"
              loading={registro.isPending}
              loadingText="Creando cuenta…"
            >
              Crear cuenta ciudadana
            </Button>

            <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
              ¿Ya tienes cuenta?{" "}
              <Link href={RUTAS.login} className="font-semibold text-secondary hover:text-primary">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </section>

        <aside className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#122A47] to-[#1B3A5C] p-space-md text-surface shadow-overlay lg:col-span-5 lg:p-space-lg">
          <div aria-hidden className="absolute inset-0 opacity-10">
            <Isotype
              size={480}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="relative space-y-space-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest/10 px-3.5 py-1.5 text-secondary-fixed">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-fixed" />
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                Beneficios ciudadanos
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md font-extrabold leading-snug text-surface-container-lowest">
              Tu acceso seguro al cuadro básico nacional
            </h2>
            {(
              [
                [
                  "notifications_active",
                  "Alertas en tiempo real",
                  "Recibe avisos cuando llegue tu medicamento.",
                ],
                [
                  "medication",
                  "Seguimiento de tratamientos",
                  "Organiza tus medicamentos y tratamientos continuos.",
                ],
                [
                  "map",
                  "Rutas farmacéuticas",
                  "Encuentra el recorrido más directo a farmacias con existencia.",
                ],
              ] as const
            ).map(([icon, title, description]) => (
              <div
                key={title}
                className="flex items-start gap-space-sm rounded-2xl bg-surface-container-lowest/10 p-space-md backdrop-blur-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/20 text-secondary-fixed">
                  <Icon name={icon} size={22} />
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold">{title}</h3>
                  <p className="mt-1 font-body-sm text-body-sm text-surface-container-high/80">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-space-xl flex items-center gap-2.5 pt-space-md text-surface-container-high/90">
            <Icon name="verified_user" size={20} className="shrink-0 text-secondary-fixed" />
            <p className="font-label-sm text-label-sm">
              Datos protegidos según la Ley No. 149 de Protección de Datos Personales.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
