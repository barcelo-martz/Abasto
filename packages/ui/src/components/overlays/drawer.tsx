"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { Dialog } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../button/icon-button";
import { overlayBackdropClass } from "./shared";

export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;
export const DrawerClose = Dialog.Close;

const drawerVariants = cva(
  "fixed inset-y-0 right-0 z-[60] flex h-full w-full flex-col bg-surface-container-lowest shadow-[-16px_0_40px_rgba(14,35,64,0.18)] outline-none animate-drawer-in",
  {
    variants: { size: { sm: "max-w-[380px]", md: "max-w-[460px]", lg: "max-w-[640px]" } },
    defaultVariants: { size: "md" },
  },
);

export interface DrawerContentProps
  extends ComponentProps<typeof Dialog.Content>, VariantProps<typeof drawerVariants> {}

/** Panel lateral derecho (slide-over). */
export function DrawerContent({ size, className, children, ...props }: DrawerContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={overlayBackdropClass} />
      <Dialog.Content className={cn(drawerVariants({ size }), className)} {...props}>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export interface DrawerHeaderProps {
  icon?: string;
  actions?: ReactNode;
  closable?: boolean;
  className?: string;
  children: ReactNode;
}

/** Cabecera fija (sticky) con botón de cerrar. */
export function DrawerHeader({
  icon,
  actions,
  closable = true,
  className,
  children,
}: DrawerHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex shrink-0 items-center gap-space-sm bg-surface-container-low p-space-lg",
        className,
      )}
    >
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
          <span aria-hidden className="material-symbols-outlined text-[20px]">
            {icon}
          </span>
        </span>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {actions}
      {closable && (
        <Dialog.Close asChild>
          <IconButton
            icon="chevron_right"
            variant="ghost"
            shape="square"
            aria-label="Cerrar panel"
          />
        </Dialog.Close>
      )}
    </div>
  );
}

export function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-space-md overflow-y-auto p-space-lg",
        className,
      )}
      {...props}
    />
  );
}

/** Pie fijo (sticky) con sombra superior. */
export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "sticky bottom-0 flex shrink-0 flex-col gap-2 bg-surface-container-lowest p-space-lg pb-safe shadow-bar-bottom",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn("font-headline-sm text-headline-sm text-primary", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      className={cn("tabular font-numeric-data text-numeric-data text-outline", className)}
      {...props}
    />
  );
}
