"use client";
import type { ElementType } from "react";
import { Dialog } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Logo } from "../brand/logo";
import { AppLink } from "./link";
import type { TerritoryOption } from "./territory-selector";

export interface MobileSheetLink {
  label: string;
  description?: string;
  icon: string;
  href: string;
}

export interface MobileSheetEmergency {
  title: string;
  description: string;
  icon?: string;
  /** Texto del enlace de llamada, p. ej. "Llamar al 104". */
  actionLabel?: string;
  href?: string;
}

export interface MobileSheetMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: MobileSheetLink[];
  /** Búsqueda: controlada. Si no se pasa onSearchChange el campo es solo lectura y abre la paleta con onSearchClick. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSearchClick?: () => void;
  searchPlaceholder?: string;
  territory?: {
    options: TerritoryOption[];
    value: string;
    onValueChange: (v: string) => void;
    level?: "Provincia" | "Municipio";
  };
  emergency?: MobileSheetEmergency;
  linkComponent?: ElementType;
  className?: string;
}

/** Menú móvil a pantalla completa: búsqueda, territorio, enlaces con icono y tarjeta de emergencia. */
export function MobileSheetMenu({
  open,
  onOpenChange,
  links,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClick,
  searchPlaceholder = "Buscar medicamento o policlínico…",
  territory,
  emergency,
  linkComponent,
  className,
}: MobileSheetMenuProps) {
  const current = territory?.options.find((o) => o.value === territory.value);
  const level = territory?.level ?? "Provincia";
  const readOnly = !onSearchChange;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "pt-safe pb-safe fixed inset-0 z-[60] flex animate-fade-in flex-col bg-surface focus:outline-none",
            className,
          )}
        >
          <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
          <div className="flex h-16 shrink-0 items-center justify-between px-margin-mobile">
            <Logo size={32} />
            <Dialog.Close
              aria-label="Cerrar menú"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
            >
              <Icon name="close" size={24} />
            </Dialog.Close>
          </div>

          <div className="no-scrollbar flex-1 space-y-space-md overflow-y-auto px-margin-mobile pb-space-lg">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit?.(searchValue ?? "");
              }}
              className="relative"
            >
              <Icon
                name="search"
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary"
              />
              <input
                type="search"
                aria-label="Buscar"
                value={searchValue ?? ""}
                readOnly={readOnly}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onClick={readOnly ? onSearchClick : undefined}
                placeholder={searchPlaceholder}
                className="h-12 w-full rounded-xl bg-surface-container-low pl-12 pr-4 font-body-md text-body-md text-on-surface outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/40"
              />
            </form>

            {territory && (
              <label className="relative flex min-h-14 cursor-pointer items-center gap-space-sm rounded-xl bg-surface-container-lowest px-space-md py-space-xs shadow-card-sm focus-within:ring-2 focus-within:ring-secondary/40">
                <Icon name="location_on" size={22} className="text-secondary" />
                <span className="min-w-0 flex-1">
                  <span className="block font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant">
                    {level} actual
                  </span>
                  <span className="block truncate font-label-md text-label-md text-primary">
                    {current?.label ?? "Seleccionar"}
                  </span>
                </span>
                <Icon name="expand_more" size={20} className="text-outline" />
                <select
                  aria-label={level}
                  value={territory.value}
                  onChange={(e) => territory.onValueChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {territory.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <nav aria-label="Secciones" className="space-y-1">
              {links.map((l) => (
                <AppLink
                  key={l.href}
                  href={l.href}
                  linkComponent={linkComponent}
                  onClick={() => onOpenChange(false)}
                  className="flex min-h-14 items-center gap-space-sm rounded-xl px-space-xs py-space-xs transition-colors hover:bg-surface-container-low active:bg-surface-container"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container text-primary-container">
                    <Icon name={l.icon} size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-label-md text-label-md text-on-surface">
                      {l.label}
                    </span>
                    {l.description && (
                      <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">
                        {l.description}
                      </span>
                    )}
                  </span>
                  <Icon name="chevron_right" size={22} className="text-outline" />
                </AppLink>
              ))}
            </nav>

            {emergency && (
              <div className="rounded-2xl bg-error-container/50 p-space-md ring-1 ring-error/10">
                <div className="flex items-start gap-space-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-container text-error">
                    <Icon name={emergency.icon ?? "phone_in_talk"} size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-headline-sm text-headline-sm text-on-error-container">
                      {emergency.title}
                    </p>
                    <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                      {emergency.description}
                    </p>
                    {emergency.actionLabel && emergency.href && (
                      <a
                        href={emergency.href}
                        className="mt-space-sm inline-flex h-11 items-center gap-1.5 rounded-xl bg-error px-space-md font-label-md text-label-md text-on-error"
                      >
                        <Icon name="call" size={18} />
                        {emergency.actionLabel}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
