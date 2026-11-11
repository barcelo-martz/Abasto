import type { ElementType } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { AppLink } from "./link";

export interface MobileTabItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  /** Punto de aviso (true) o contador. */
  badge?: boolean | number;
}

export interface MobileTabBarProps {
  /** 4 ítems recomendados. */
  items: MobileTabItem[];
  linkComponent?: ElementType;
  /** fixed (por defecto) o static para previsualizar dentro de un marco. */
  position?: "fixed" | "static";
  className?: string;
}

function Dot({ badge }: { badge?: boolean | number }) {
  if (!badge) return null;
  return typeof badge === "number" ? (
    <span className="tabular absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-on-tertiary-container px-1 font-numeric-data text-[10px] font-bold leading-none text-white">
      {badge > 9 ? "9+" : badge}
    </span>
  ) : (
    <span aria-hidden className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-error" />
  );
}

/** Barra inferior de 4 pestañas con área táctil de 44px y safe-area. */
export function MobileTabBar({
  items,
  linkComponent,
  position = "fixed",
  className,
}: MobileTabBarProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        "pb-safe z-50 w-full bg-surface/85 shadow-bar-bottom backdrop-blur-xl",
        position === "fixed" ? "fixed inset-x-0 bottom-0" : "relative",
        className,
      )}
    >
      <ul className="flex h-16 items-center justify-around px-space-xs">
        {items.map((it) => (
          <li key={it.href}>
            <AppLink
              href={it.href}
              linkComponent={linkComponent}
              aria-current={it.active ? "page" : undefined}
              className={cn(
                "flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 transition-colors",
                it.active
                  ? "font-bold text-secondary"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              <span className="relative">
                <Icon name={it.icon} size={24} filled={it.active} />
                <Dot badge={it.badge} />
              </span>
              <span className="font-label-sm text-[11px] leading-none">{it.label}</span>
            </AppLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface FloatingPillItem extends MobileTabItem {
  /** Acción central destacada (p. ej. escanear receta): solo icono, botón circular. */
  primary?: boolean;
}

export interface FloatingPillTabBarProps {
  items: FloatingPillItem[];
  linkComponent?: ElementType;
  position?: "fixed" | "static";
  className?: string;
}

/** Píldora flotante inferior con acción central; ideal para uso con una mano. */
export function FloatingPillTabBar({
  items,
  linkComponent,
  position = "fixed",
  className,
}: FloatingPillTabBarProps) {
  return (
    <div
      className={cn(
        "pb-safe pointer-events-none z-50 flex w-full justify-center px-space-md pb-space-sm",
        position === "fixed" ? "fixed inset-x-0 bottom-0" : "relative",
        className,
      )}
    >
      <nav
        aria-label="Navegación principal"
        className="pointer-events-auto w-full max-w-sm rounded-full bg-surface-container-lowest/90 px-space-xs shadow-float ring-1 ring-outline-variant/30 backdrop-blur-xl"
      >
        <ul className="flex h-16 items-center justify-between">
          {items.map((it) =>
            it.primary ? (
              <li key={it.href} className="-mt-6">
                <AppLink
                  href={it.href}
                  linkComponent={linkComponent}
                  aria-label={it.label}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-on-primary shadow-bulk ring-4 ring-surface transition-transform active:scale-95"
                >
                  <Icon name={it.icon} size={28} />
                </AppLink>
              </li>
            ) : (
              <li key={it.href}>
                <AppLink
                  href={it.href}
                  linkComponent={linkComponent}
                  aria-current={it.active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1 transition-colors",
                    it.active
                      ? "font-bold text-secondary"
                      : "text-on-surface-variant hover:text-primary",
                  )}
                >
                  <span className="relative">
                    <Icon name={it.icon} size={24} filled={it.active} />
                    <Dot badge={it.badge} />
                  </span>
                  <span className="font-label-sm text-[10px] leading-none">{it.label}</span>
                </AppLink>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}
