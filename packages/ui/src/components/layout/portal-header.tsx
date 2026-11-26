"use client";
import { useEffect, useId, useState, type ElementType, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Logo } from "../brand/logo";
import { Icon } from "../icon";
import { AppLink } from "../navigation/link";

export interface PortalNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface PortalHeaderProps {
  items: PortalNavItem[];
  /** Ruta a la que dirige el logo. */
  logoHref?: string;
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
  onSearchSubmit?: (query: string) => void;
  showLive?: boolean;
  /** Menú móvil. */
  onMenuClick?: () => void;
  linkComponent?: ElementType;
  className?: string;
}

export function PortalHeader({
  items,
  logoHref = "/",
  variant = "auto",
  threshold = 24,
  territory,
  notifications,
  account,
  onSearchClick,
  onSearchSubmit,
  onMenuClick,
  linkComponent,
  className,
}: PortalHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchId = useId();
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
          <AppLink
            linkComponent={linkComponent}
            href={logoHref}
            aria-label="Ir al inicio"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Logo variant={solid ? "color" : "glass"} size={32} />
          </AppLink>
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
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const query = searchQuery.trim();
              if (!query) {
                onSearchClick?.();
                return;
              }
              onSearchSubmit?.(query);
            }}
            className={cn(
              "group flex h-9 w-9 items-center rounded-full transition-[width,background-color] duration-200",
              "focus-within:w-52 hover:w-52",
              solid ? "bg-surface-container text-on-surface-variant" : "bg-white/10 text-white/80",
            )}
          >
            <label
              htmlFor={searchId}
              className="flex h-9 min-w-9 cursor-pointer items-center justify-center"
              aria-label="Buscar"
            >
              <Icon name="search" size={18} />
            </label>
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar medicamento"
              aria-label="Buscar medicamento"
              className="h-9 w-0 min-w-0 flex-1 bg-transparent pr-0 text-sm opacity-0 outline-none transition-[width,opacity,padding] duration-200 placeholder:text-inherit placeholder:opacity-70 group-hover:w-40 group-hover:pr-3 group-hover:opacity-100 group-focus-within:w-40 group-focus-within:pr-3 group-focus-within:opacity-100"
            />
            <button type="submit" className="sr-only">
              Buscar
            </button>
          </form>
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
