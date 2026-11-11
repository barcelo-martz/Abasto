"use client";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface ButtonGroupItem {
  value: string;
  label: string;
  icon?: string;
}

interface Base {
  items: ButtonGroupItem[];
  className?: string;
  "aria-label"?: string;
}
export type ButtonGroupProps =
  | (Base & { type?: "single"; value: string; onValueChange: (v: string) => void })
  | (Base & { type: "multiple"; value: string[]; onValueChange: (v: string[]) => void });

export function ButtonGroup(props: ButtonGroupProps) {
  const { items, className } = props;
  const isOn = (v: string) =>
    props.type === "multiple" ? props.value.includes(v) : props.value === v;
  const toggle = (v: string) => {
    if (props.type === "multiple") {
      props.onValueChange(
        props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v],
      );
    } else props.onValueChange(v);
  };
  return (
    <div
      role="group"
      aria-label={props["aria-label"]}
      className={cn("inline-flex gap-1", className)}
    >
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          aria-pressed={isOn(it.value)}
          onClick={() => toggle(it.value)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-lg px-space-md py-2 font-label-md text-label-md transition-all",
            isOn(it.value)
              ? "bg-surface-container-lowest text-primary shadow-card-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          {it.icon && <Icon name={it.icon} size={18} />}
          {it.label}
        </button>
      ))}
    </div>
  );
}
