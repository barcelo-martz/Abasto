"use client";
import { useEffect, useState, type ElementType, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Logo } from "../brand/logo";
import { LivePulse } from "../badge/live-pulse";
import { AppLink } from "../navigation/link";

export interface PortalNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface PortalHeaderProps {
  items: PortalNavItem[];
  /** over-hero: translúcido oscuro sobre el hero · scrolled: blanco sólido · auto: cambia con el scroll. */
  variant?: "over-hero" | "scrolled" | "auto";
  /** Px de scroll a partir del cual pasa a "scrolled" en modo auto. */
  threshold?: number;
  /** Selector de provincia (<TerritorySelector tone=…/>). */
  territory?: (tone: "light" | "dark") => ReactNode;
  /** Campana de notificaciones. */
  notifications?: (tone: "light" | "dark") => ReactNode;
  /** Usuario autenticado (<UserMenu/>) o botones de acceso. */
  account?: (tone: "light" | "dark") => ReactNode;
  onSearchClick?: () => void;
  showLive?: boolean;
  /** Menú móvil. */
  onMenuClick?: () => void;
  linkComponent?: ElementType;
  className?: string;
}

export function PortalHeader({
  items,
  variant = "auto",
  threshold = 24,
  territory,
  notifications,
  account,
  onSearchClick,
  showLive = true,
  onMenuClick,
  linkComponent,
  className,
}: PortalHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (variant !== "auto") return;
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [variant, threshold]);

  const solid = variant === "scrolled" || (variant === "auto" && scrolled);
  const tone = solid ? "light" : "dark";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-nav)] transition-all duration-300",
        solid
          ? "bg-surface-container-lowest/90 text-on-surface shadow-bar backdrop-blur-xl"
          : "bg-primary/40 text-on-primary backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-space-md px-margin-mobile md:px-margin lg:px-margin-desktop">
        <div className="flex items-center gap-space-md">
          <Logo variant={solid ? "color" : "glass"} size={32} />
          {territory?.(tone)}
        </div>
        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {items.map((i) => (
            <AppLink
              key={i.label}
              linkComponent={linkComponent}
              href={i.href}
              aria-current={i.active ? "page" : undefined}
              className={cn(
                "rounded-lg px-space-sm py-space-xs font-label-md text-label-md transition-colors",
                i.active
                  ? solid
                    ? "bg-surface-container-high font-bold text-primary"
                    : "bg-white/15 font-bold text-white"
                  : solid
                    ? "text-on-surface-variant hover:text-on-surface"
                    : "text-white/75 hover:text-white",
              )}
            >
              {i.label}
            </AppLink>
          ))}
        </nav>
        <div className="flex items-center gap-space-xs">
          {showLive && (
            <div className="hidden xl:block">
              <LivePulse label="Red en línea" />
            </div>
          )}
          <button
            type="button"
            onClick={onSearchClick}
            aria-label="Buscar (⌘K)"
            className={cn(
              "hidden h-9 items-center gap-2 rounded-full px-3 font-label-sm text-label-sm sm:flex",
              solid ? "bg-surface-container text-on-surface-variant" : "bg-white/10 text-white/80",
            )}
          >
            <Icon name="search" size={18} /> <kbd>⌘K</kbd>
          </button>
          {notifications?.(tone)}
          {account?.(tone)}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Abrir menú"
              className="flex h-11 w-11 items-center justify-center rounded-xl lg:hidden"
            >
              <Icon name="menu" size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
