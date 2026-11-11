import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  icon: string;
  /** Si existe, el FAB es extendido (pill con etiqueta). */
  label?: string;
  /** Ancla el FAB abajo a la derecha (por encima de la barra inferior móvil). */
  fixed?: boolean;
}

export function Fab({ icon, label, fixed, className, type = "button", ref, ...props }: FabProps) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label ?? props["aria-label"]}
      className={cn(
        "z-10 inline-flex cursor-pointer items-center bg-gradient-primary-h text-on-primary transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-95",
        label
          ? "gap-space-sm rounded-full py-space-md pl-space-md pr-space-lg font-headline-sm text-headline-sm shadow-float"
          : "h-14 w-14 justify-center rounded-full shadow-bulk",
        fixed && "fixed bottom-24 right-space-md md:bottom-8 md:right-8",
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={24} />
      {label && <span>{label}</span>}
    </button>
  );
}
