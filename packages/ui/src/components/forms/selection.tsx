"use client";
import { cva } from "class-variance-authority";
import { Checkbox as C, RadioGroup as R, Switch as Sw } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { useFieldContext } from "./field";

/* ------------------------------ Checkbox ------------------------------ */
export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  id?: string;
  name?: string;
  "aria-label"?: string;
  className?: string;
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const f = useFieldContext();
  const cid = id ?? f?.id;
  const box = (
    <C.Root
      id={cid}
      {...props}
      className={cn(
        "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface-container-lowest text-on-secondary shadow-ring-primary ring-1 ring-outline-variant transition-colors",
        "data-[state=checked]:bg-secondary data-[state=checked]:ring-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:ring-secondary",
        "disabled:cursor-not-allowed disabled:opacity-40",
        !label && className,
      )}
    >
      <C.Indicator>
        {props.checked === "indeterminate" ? (
          <Icon name="remove" size={18} />
        ) : (
          <Icon name="check" size={18} />
        )}
      </C.Indicator>
    </C.Root>
  );
  if (!label) return box;
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-space-sm",
        props.disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {box}
      <span className="flex flex-col">
        <span className="font-label-md text-label-md text-on-surface">{label}</span>
        {description && (
          <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
        )}
      </span>
    </label>
  );
}

/* ------------------------------ Radio ------------------------------ */
export function RadioGroup({ className, ...props }: ComponentProps<typeof R.Root>) {
  return <R.Root className={cn("flex flex-col gap-2", className)} {...props} />;
}

const radioRow = cva(
  "group flex cursor-pointer items-start gap-space-sm transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        /** Opción tipo tarjeta/pill (p. ej. temperatura 2-8°C / ambiente). */
        pill: "items-center rounded-xl bg-surface-container-lowest p-3 shadow-card-sm ring-1 ring-transparent data-[state=checked]:bg-secondary-container/30 data-[state=checked]:ring-secondary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface RadioItemProps extends Omit<ComponentProps<typeof R.Item>, "children"> {
  label: ReactNode;
  description?: ReactNode;
  icon?: string;
  variant?: "default" | "pill";
}

export function RadioItem({
  label,
  description,
  icon,
  variant = "default",
  className,
  id,
  ...props
}: RadioItemProps) {
  return (
    <label className="contents">
      <R.Item id={id} {...props} className={cn(radioRow({ variant }), className)}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest ring-1 ring-outline-variant group-data-[state=checked]:ring-2 group-data-[state=checked]:ring-secondary">
          <R.Indicator className="h-3 w-3 rounded-full bg-secondary" />
        </span>
        {icon && <Icon name={icon} size={20} className="text-secondary" />}
        <span className="flex flex-col text-left">
          <span className="font-label-md text-label-md text-on-surface">{label}</span>
          {description && (
            <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
          )}
        </span>
      </R.Item>
    </label>
  );
}

/* ------------------------------ Switch ------------------------------ */
export interface SwitchProps extends Omit<ComponentProps<typeof Sw.Root>, "children"> {
  label?: ReactNode;
  description?: ReactNode;
}

export function Switch({ label, description, className, ...props }: SwitchProps) {
  const el = (
    <Sw.Root
      {...props}
      className={cn(
        "relative h-7 w-12 shrink-0 cursor-pointer rounded-full bg-outline-variant transition-colors data-[state=checked]:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
        !label && className,
      )}
    >
      <Sw.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-surface-container-lowest shadow-card-sm transition-transform data-[state=checked]:translate-x-6" />
    </Sw.Root>
  );
  if (!label) return el;
  return (
    <label
      className={cn("flex cursor-pointer items-center justify-between gap-space-md", className)}
    >
      <span className="flex flex-col">
        <span className="font-label-md text-label-md text-on-surface">{label}</span>
        {description && (
          <span className="font-body-sm text-body-sm text-on-surface-variant">{description}</span>
        )}
      </span>
      {el}
    </label>
  );
}
