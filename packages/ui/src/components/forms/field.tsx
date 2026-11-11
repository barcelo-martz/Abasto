"use client";
import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

interface FieldCtx {
  id: string;
  describedBy?: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}
const Ctx = createContext<FieldCtx | null>(null);
/** Devuelve el contexto del Field padre (o null si el control se usa solo). */
export const useFieldContext = () => useContext(Ctx);

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Contenido a la derecha de la etiqueta (p. ej. contador "0/280"). */
  labelAside?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  disabled,
  labelAside,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [errId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <Ctx.Provider
      value={{ id, describedBy, invalid: !!error, disabled: !!disabled, required: !!required }}
    >
      <div className={cn("flex w-full flex-col", className)}>
        {(label || labelAside) && (
          <label
            htmlFor={id}
            className="mb-1.5 flex items-center justify-between font-label-md text-label-md text-on-surface"
          >
            <span>
              {label}
              {required && (
                <span aria-hidden className="ml-0.5 text-error">
                  *
                </span>
              )}
            </span>
            {labelAside && (
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {labelAside}
              </span>
            )}
          </label>
        )}
        {children}
        {error ? (
          <p
            id={errId}
            role="alert"
            className="mt-1.5 flex items-center gap-1 font-label-sm text-label-sm text-error"
          >
            <Icon name="error" size={14} filled /> {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 font-body-sm text-body-sm text-on-surface-variant">
            {hint}
          </p>
        ) : null}
      </div>
    </Ctx.Provider>
  );
}
