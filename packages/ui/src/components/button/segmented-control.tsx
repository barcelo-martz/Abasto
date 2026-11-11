"use client";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface SegmentedItem<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  "aria-label"?: string;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  items,
  value,
  onValueChange,
  className,
  ...aria
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={aria["aria-label"]}
      className={cn("flex gap-1 rounded-xl bg-surface-container p-1", className)}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onValueChange(it.value)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-space-xs py-2 text-center font-label-md text-label-md transition-all duration-200",
              active
                ? "bg-surface-container-lowest font-bold text-primary shadow-card-sm"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            {it.icon && <Icon name={it.icon} size={18} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
