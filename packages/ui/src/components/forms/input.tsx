"use client";
import { cva } from "class-variance-authority";
import { useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { useFieldContext } from "./field";

export type FieldState = "default" | "error" | "success";

/** Contenedor visual compartido por todos los controles de texto. */
export const fieldShell = cva(
  "flex w-full items-center overflow-hidden rounded-xl bg-surface-container-lowest shadow-card-sm transition-shadow",
  {
    variants: {
      state: {
        default: "focus-within:ring-2 focus-within:ring-secondary",
        error: "ring-2 ring-error",
        success: "ring-1 ring-avail-dot focus-within:ring-2",
      },
      size: { md: "min-h-12", lg: "min-h-14" },
      disabled: {
        true: "pointer-events-none bg-surface-container-low opacity-60 shadow-none",
        false: "",
      },
    },
    defaultVariants: { state: "default", size: "md", disabled: false },
  },
);

export const inputBase =
  "w-full min-w-0 bg-transparent border-0 px-space-md text-on-surface placeholder:text-outline focus:outline-none font-body-md text-body-md disabled:cursor-not-allowed";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  ref?: Ref<HTMLInputElement>;
  size?: "md" | "lg";
  state?: FieldState;
  /** Icono líder en cuadro teal (Material Symbol). */
  leadingIcon?: string;
  /** Adorno al inicio (prefijo, etc.). */
  leading?: ReactNode;
  /** Adorno al final (botón, unidad…). */
  trailing?: ReactNode;
  /** Etiqueta flotante integrada (usa placeholder invisible). */
  floatingLabel?: string;
  wrapperClassName?: string;
}

export function Input({
  size = "md",
  state,
  leadingIcon,
  leading,
  trailing,
  floatingLabel,
  className,
  wrapperClassName,
  id,
  disabled,
  required,
  placeholder,
  ref,
  ...props
}: InputProps) {
  const f = useFieldContext();
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const isDisabled = disabled ?? f?.disabled;
  const inputId = id ?? f?.id;
  const floating = !!floatingLabel;
  return (
    <div
      className={cn(
        fieldShell({ state: st, size: floating ? "lg" : size, disabled: !!isDisabled }),
        wrapperClassName,
      )}
    >
      {leading}
      {leadingIcon && (
        <span className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-on-secondary">
          <Icon name={leadingIcon} size={20} />
        </span>
      )}
      <div className="relative flex-1">
        <input
          ref={ref}
          id={inputId}
          disabled={isDisabled}
          required={required ?? f?.required}
          aria-invalid={st === "error" || undefined}
          aria-describedby={f?.describedBy}
          placeholder={floating ? " " : placeholder}
          className={cn(
            inputBase,
            floating && "peer h-14 pb-1 pt-4",
            !floating && "h-12",
            className,
          )}
          {...props}
        />
        {floating && (
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute left-space-md top-2 font-label-sm text-label-sm text-outline transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:font-body-md peer-placeholder-shown:text-body-md peer-focus:top-2 peer-focus:font-label-sm peer-focus:text-label-sm peer-focus:text-secondary"
          >
            {floatingLabel}
          </label>
        )}
      </div>
      {st === "success" && !trailing && (
        <Icon name="check_circle" filled size={20} className="mr-3 text-avail-dot" />
      )}
      {st === "error" && !trailing && (
        <Icon name="error" filled size={20} className="mr-3 text-error" />
      )}
      {trailing}
    </div>
  );
}

export function PasswordInput(props: Omit<InputProps, "type" | "trailing">) {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      autoComplete={props.autoComplete ?? "current-password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-outline hover:text-primary"
        >
          <Icon name={show ? "visibility_off" : "visibility"} size={20} />
        </button>
      }
    />
  );
}

export interface PhoneInputProps extends Omit<InputProps, "type" | "leadingIcon" | "leading"> {
  /** Prefijo nacional (Cuba +53). */
  prefix?: string;
}
export function PhoneInput({ prefix = "+53", className, ...props }: PhoneInputProps) {
  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      className={cn("tabular pl-space-sm font-numeric-data text-numeric-data", className)}
      leading={
        <span className="flex h-12 shrink-0 items-center gap-1 bg-surface-container-low px-space-sm font-numeric-data text-numeric-data font-semibold text-primary">
          <Icon name="call" size={16} /> {prefix}
        </span>
      }
    />
  );
}

/** Código de lote / CECMED: monoespaciado, mayúsculas. */
export function CodeInput({ className, ...props }: Omit<InputProps, "type">) {
  return (
    <Input
      {...props}
      autoCapitalize="characters"
      spellCheck={false}
      className={cn("font-mono text-numeric-data uppercase tracking-wide", className)}
    />
  );
}
