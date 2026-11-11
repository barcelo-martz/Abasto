import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type RequestStatus =
  "pending" | "authorized" | "in_transit" | "received" | "rejected" | "cancelled";

const CFG: Record<
  RequestStatus,
  { label: string; sub: string; icon: string; box: string; icn: string; title: string }
> = {
  pending: {
    label: "Pendiente",
    sub: "En cola médica",
    icon: "schedule",
    box: "bg-surface-container-high",
    icn: "text-outline",
    title: "text-primary",
  },
  authorized: {
    label: "Autorizado",
    sub: "Firma digital",
    icon: "thumb_up",
    box: "bg-secondary-container/40",
    icn: "text-secondary",
    title: "text-secondary",
  },
  in_transit: {
    label: "En tránsito",
    sub: "Ruta provincial",
    icon: "local_shipping",
    box: "bg-info-container",
    icn: "text-primary-container",
    title: "text-primary",
  },
  received: {
    label: "Recibido",
    sub: "Listo en mostrador",
    icon: "inventory",
    box: "bg-success-container",
    icn: "text-success",
    title: "text-success",
  },
  rejected: {
    label: "Rechazado",
    sub: "Incompatibilidad",
    icon: "block",
    box: "bg-error-container/70",
    icn: "text-error",
    title: "text-error",
  },
  cancelled: {
    label: "Cancelado",
    sub: "Por paciente",
    icon: "cancel",
    box: "bg-surface-container",
    icn: "text-outline",
    title: "text-on-surface-variant",
  },
};

export interface RequestStatusChipProps {
  status: RequestStatus;
  /** "compact" = píldora; "card" = bloque con subtítulo (min 44px). */
  variant?: "compact" | "card";
  label?: string;
  subtitle?: string;
  className?: string;
}

export function RequestStatusChip({
  status,
  variant = "compact",
  label,
  subtitle,
  className,
}: RequestStatusChipProps) {
  const c = CFG[status];
  if (variant === "card") {
    return (
      <div className={cn("flex min-h-11 items-center gap-2 rounded-xl p-2.5", c.box, className)}>
        <Icon name={c.icon} size={18} className={c.icn} />
        <div className="flex flex-col">
          <span className={cn("font-headline-sm text-[12px] leading-4", c.title)}>
            {label ?? c.label}
          </span>
          <span className="font-label-sm text-[10px] text-on-surface-variant">
            {subtitle ?? c.sub}
          </span>
        </div>
      </div>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-label-sm",
        c.box,
        c.title,
        className,
      )}
    >
      <Icon name={c.icon} size={14} className={c.icn} />
      {label ?? c.label}
    </span>
  );
}
