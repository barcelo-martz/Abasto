import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type Role = "administrator" | "supervisor" | "warehouse" | "pharmacy" | "citizen";

const CFG: Record<Role, { label: string; icon: string; cls: string }> = {
  administrator: {
    label: "Administrador",
    icon: "admin_panel_settings",
    cls: "bg-gradient-primary-h text-on-primary",
  },
  supervisor: {
    label: "Supervisor",
    icon: "policy",
    cls: "bg-gradient-to-r from-secondary to-[#0e5c56] text-on-secondary",
  },
  warehouse: { label: "Almacén", icon: "warehouse", cls: "bg-gradient-subtle text-white" },
  pharmacy: {
    label: "Farmacia",
    icon: "local_pharmacy",
    cls: "bg-secondary-container text-on-secondary-container",
  },
  citizen: { label: "Ciudadano", icon: "person", cls: "bg-surface-container text-on-surface" },
};

export interface RoleBadgeProps {
  role: Role;
  label?: string;
  className?: string;
}

export function RoleBadge({ role, label, className }: RoleBadgeProps) {
  const c = CFG[role];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-label-md text-label-md shadow-card-sm",
        c.cls,
        className,
      )}
    >
      <Icon name={c.icon} size={16} />
      {label ?? c.label}
    </span>
  );
}
