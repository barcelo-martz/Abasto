"use client";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { useFieldContext } from "./field";

export interface NumberStepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: string;
}

export function NumberStepper({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
  disabled,
  id,
  className,
  ...rest
}: NumberStepperProps) {
  const f = useFieldContext();
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const set = (n: number) => {
    const c = Math.min(max, Math.max(min, n));
    setInner(c);
    onChange?.(c);
  };
  const btn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors select-none disabled:opacity-40";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-card-sm focus-within:ring-2 focus-within:ring-secondary",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Disminuir"
        disabled={disabled || v <= min}
        onClick={() => set(v - step)}
        className={cn(btn, "bg-surface-container text-primary active:bg-surface-container-high")}
      >
        <Icon name="remove" />
      </button>
      <div className="flex min-w-[64px] items-baseline justify-center gap-1 px-1">
        <input
          id={id ?? f?.id}
          type="number"
          inputMode="numeric"
          value={v}
          min={min}
          max={Number.isFinite(max) ? max : undefined}
          step={step}
          disabled={disabled ?? f?.disabled}
          aria-describedby={f?.describedBy}
          aria-label={rest["aria-label"]}
          onChange={(e) => set(Number(e.target.value) || 0)}
          className="tabular w-16 appearance-none border-0 bg-transparent text-center font-headline-md text-headline-md text-primary [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {unit && (
          <span className="font-label-sm text-label-sm text-on-surface-variant">{unit}</span>
        )}
      </div>
      <button
        type="button"
        aria-label="Aumentar"
        disabled={disabled || v >= max}
        onClick={() => set(v + step)}
        className={cn(btn, "bg-secondary text-on-secondary active:brightness-95")}
      >
        <Icon name="add" />
      </button>
    </div>
  );
}
