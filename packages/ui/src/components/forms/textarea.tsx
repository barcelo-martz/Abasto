"use client";
import { useState, type Ref, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { fieldShell, type FieldState } from "./input";
import { useFieldContext } from "./field";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  state?: FieldState;
  /** Muestra contador "n/maxLength" cuando hay maxLength. */
  showCounter?: boolean;
}

export function Textarea({
  state,
  showCounter = true,
  maxLength,
  className,
  id,
  onChange,
  value,
  defaultValue,
  disabled,
  ref,
  rows = 4,
  ...props
}: TextareaProps) {
  const f = useFieldContext();
  const [len, setLen] = useState(String(value ?? defaultValue ?? "").length);
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const current = value !== undefined ? String(value).length : len;
  const near = maxLength ? current >= maxLength * 0.9 : false;
  return (
    <div
      className={cn(
        fieldShell({ state: st, disabled: !!(disabled ?? f?.disabled) }),
        "flex-col items-stretch",
      )}
    >
      <textarea
        ref={ref}
        id={id ?? f?.id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled ?? f?.disabled}
        aria-invalid={st === "error" || undefined}
        aria-describedby={f?.describedBy}
        onChange={(e) => {
          setLen(e.target.value.length);
          onChange?.(e);
        }}
        className={cn(
          "w-full resize-none border-0 bg-transparent px-space-md pt-3 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none",
          className,
        )}
        {...props}
      />
      {maxLength && showCounter && (
        <span
          className={cn(
            "tabular self-end px-space-md pb-2 font-label-sm text-label-sm",
            near ? "text-error" : "text-outline",
          )}
          aria-live="polite"
        >
          {current}/{maxLength}
        </span>
      )}
    </div>
  );
}
