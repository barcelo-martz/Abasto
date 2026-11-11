"use client";
import type { ElementType, ReactNode } from "react";
import { Popover, Switch } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Button } from "../button";
import { AppLink } from "./link";

export interface UserMenuAction {
  label: string;
  icon: string;
  href: string;
}
export interface UserMenuPreference {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

export interface UserMenuProps {
  name: string;
  /** Rol o cargo: "Pacientes crónicos", "Dr. …". */
  subtitle?: string;
  verified?: boolean;
  actions?: UserMenuAction[];
  preferences?: UserMenuPreference[];
  onSignOut?: () => void;
  linkComponent?: ElementType;
  /** Tono del disparador. */
  tone?: "light" | "dark";
  trigger?: ReactNode;
}

const initials = (n: string) =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

export function UserMenu({
  name,
  subtitle,
  verified,
  actions = [],
  preferences = [],
  onSignOut,
  linkComponent,
  tone = "light",
  trigger,
}: UserMenuProps) {
  return (
    <Popover.Root>
      <Popover.Trigger aria-label="Menú de usuario" className="cursor-pointer rounded-full">
        {trigger ?? (
          <span
            className={cn(
              "flex h-9 items-center gap-2 rounded-full py-1 pl-1 pr-3",
              tone === "dark" ? "bg-white/10 text-on-primary" : "bg-surface-container text-primary",
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-label-sm text-label-sm text-on-primary">
              {initials(name)}
            </span>
            <span className="hidden max-w-28 truncate font-label-md text-label-md sm:inline">
              {name}
            </span>
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-[70] w-72 animate-modal-in overflow-hidden rounded-2xl bg-surface-container-lowest shadow-overlay"
        >
          <div className="flex items-center gap-3 bg-gradient-hero p-4 text-on-primary">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 font-headline-sm text-headline-sm">
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-headline-sm text-headline-sm">{name}</p>
              <p className="flex items-center gap-1 truncate font-label-sm text-label-sm text-on-primary-container">
                {verified && (
                  <Icon name="verified" size={14} filled className="text-secondary-fixed-dim" />
                )}
                {subtitle}
              </p>
            </div>
          </div>
          {actions.length > 0 && (
            <nav className="p-2" aria-label="Acciones rápidas">
              {actions.map((a) => (
                <AppLink
                  key={a.href}
                  href={a.href}
                  linkComponent={linkComponent}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <Icon name={a.icon} size={20} className="text-primary-container" />
                  {a.label}
                </AppLink>
              ))}
            </nav>
          )}
          {preferences.length > 0 && (
            <div className="space-y-1 bg-surface-container-low p-2">
              {preferences.map((p) => (
                <label
                  key={p.id}
                  className="flex min-h-11 cursor-pointer items-center justify-between rounded-lg px-3 font-label-md text-label-md text-on-surface"
                >
                  {p.label}
                  <Switch.Root
                    checked={p.checked}
                    onCheckedChange={p.onCheckedChange}
                    className="relative h-6 w-10 cursor-pointer rounded-full bg-outline-variant transition-colors data-[state=checked]:bg-secondary"
                  >
                    <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-card-sm transition-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                </label>
              ))}
            </div>
          )}
          <div className="p-2">
            <Button variant="danger-soft" fullWidth leadingIcon="logout" onClick={onSignOut}>
              Cerrar sesión
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
