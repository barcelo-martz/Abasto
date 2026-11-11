"use client";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface FilterChipProps {
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  children: ReactNode;
  className?: string;
}

/** Chip de filtro seleccionable (h-11 = 44px táctil) con check animado. */
export function FilterChip({ selected, onSelectedChange, children, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelectedChange(!selected)}
      className={cn(
        "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-label-md text-label-md shadow-card-sm transition-all active:scale-95",
        selected
          ? "bg-secondary-container/50 text-secondary"
          : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container",
        className,
      )}
    >
      <Icon
        name="check"
        size={16}
        className={cn(
          "transition-all duration-200",
          selected ? "w-4 scale-100 opacity-100" : "w-0 scale-0 opacity-0",
        )}
      />
      <span>{children}</span>
    </button>
  );
}

export interface RemovableChipProps {
  children: ReactNode;
  onRemove: () => void;
  className?: string;
}

export function RemovableChip({ children, onRemove, className }: RemovableChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-container-low py-1 pl-3 pr-1 font-label-sm text-label-sm text-primary",
        className,
      )}
    >
      <span>{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Quitar ${typeof children === "string" ? children : "filtro"}`}
        className="ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-error"
      >
        <Icon name="close" size={16} />
      </button>
    </span>
  );
}

export interface ActiveFilterChipProps {
  children: ReactNode;
  tone?: "primary" | "clinical" | "neutral";
  onRemove?: () => void;
  className?: string;
}

/** Chip h-8 de la barra de filtros activos. */
export function ActiveFilterChip({
  children,
  tone = "neutral",
  onRemove,
  className,
}: ActiveFilterChipProps) {
  const tones = {
    primary: "bg-primary-container text-on-primary",
    clinical: "bg-secondary-container text-on-secondary-container",
    neutral: "bg-surface-container-lowest text-on-surface shadow-card-sm",
  } as const;
  return (
    <button
      type="button"
      onClick={onRemove}
      className={cn(
        "flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full pl-3 pr-2 font-label-sm text-label-sm transition-all active:scale-95",
        tones[tone],
        className,
      )}
    >
      {tone !== "primary" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-secondary" />}
      <span>{children}</span>
      {onRemove && <Icon name="close" size={16} className="opacity-80" />}
    </button>
  );
}

export interface CategoryTagProps {
  icon: string;
  children: ReactNode;
  tone?: "default" | "cold" | "controlled";
  className?: string;
}

export function CategoryTag({ icon, children, tone = "default", className }: CategoryTagProps) {
  const t = {
    default: ["bg-surface-container-low text-on-surface", "text-secondary"],
    cold: ["bg-surface-container-low text-on-surface", "text-secondary"],
    controlled: ["bg-error-container/30 text-error", "text-error"],
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg p-2 font-label-md text-label-md",
        t[0],
        className,
      )}
    >
      <Icon name={icon} size={18} className={t[1]} />
      {children}
    </span>
  );
}
