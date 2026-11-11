"use client";
import { useState, type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { cn } from "../../lib/cn";

export interface AppShellProps {
  /** <Sidebar/> (versión escritorio y, dentro del drawer, versión móvil). */
  sidebar: ReactNode;
  /** <Topbar onMenuClick=…/>: recibe la función para abrir el drawer móvil. */
  topbar: (openMenu: () => void) => ReactNode;
  children: ReactNode;
  /** Barra inferior móvil (<MobileTabBar/>). */
  bottomBar?: ReactNode;
  className?: string;
}

/** Estructura del back-office: sidebar fijo en escritorio, drawer en móvil, topbar y contenido con scroll. */
export function AppShell({ sidebar, topbar, children, bottomBar, className }: AppShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("flex h-dvh w-full bg-surface", className)}>
      <div className="hidden lg:flex">{sidebar}</div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-overlay)] animate-fade-in bg-[var(--overlay-backdrop)] backdrop-blur-[var(--overlay-blur)] lg:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-[var(--z-overlay)] animate-drawer-in shadow-overlay [animation-direction:normal] lg:hidden"
          >
            <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>
            {sidebar}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar(() => setOpen(true))}
        <main
          className={cn(
            "flex-1 overflow-y-auto px-margin-mobile py-space-lg lg:px-gutter-lg",
            bottomBar && "pb-24 lg:pb-space-lg",
          )}
        >
          {children}
        </main>
        {bottomBar}
      </div>
    </div>
  );
}
