"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { Dialog } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../button/icon-button";
import { overlayBackdropClass } from "./shared";

export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

const modalContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[60] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
    "overflow-hidden rounded-3xl bg-surface-container-lowest shadow-overlay outline-none",
  ],
  {
    variants: {
      size: { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" },
    },
    defaultVariants: { size: "md" },
  },
);

export interface ModalContentProps
  extends ComponentProps<typeof Dialog.Content>, VariantProps<typeof modalContentVariants> {
  /** Clase extra para el backdrop. */
  overlayClassName?: string;
}

/**
 * Contenido del modal con backdrop difuminado. Radix aporta focus trap, Esc y aria-modal.
 * El contenedor centra con translate; el keyframe animate-modal-in se aplica a un
 * envoltorio interno para no pisar el transform de centrado.
 */
export function ModalContent({
  size,
  className,
  overlayClassName,
  children,
  ...props
}: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={cn(overlayBackdropClass, overlayClassName)} />
      <Dialog.Content className={cn(modalContentVariants({ size }), className)} {...props}>
        <div className="flex min-h-0 flex-1 animate-modal-in flex-col">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export interface ModalHeaderProps {
  /** Icono Material Symbol dentro de un cuadro navy. */
  icon?: string;
  /** Contenido a la derecha (badge, etc.) antes del botón cerrar. */
  actions?: ReactNode;
  /** Botón X de cerrar (por defecto true). */
  closable?: boolean;
  className?: string;
  children: ReactNode;
}

export function ModalHeader({
  icon,
  actions,
  closable = true,
  className,
  children,
}: ModalHeaderProps) {
  return (
    <div
      className={cn("flex items-start gap-space-sm px-space-xl pb-space-sm pt-space-xl", className)}
    >
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
          <span aria-hidden className="material-symbols-outlined text-[22px]">
            {icon}
          </span>
        </span>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {actions}
      {closable && (
        <Dialog.Close asChild>
          <IconButton icon="close" variant="ghost" size="sm" shape="square" aria-label="Cerrar" />
        </Dialog.Close>
      )}
    </div>
  );
}

export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-space-xl py-space-sm", className)}
      {...props}
    />
  );
}

export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-space-sm bg-surface-container-low px-space-xl py-space-md",
        className,
      )}
      {...props}
    />
  );
}

export function ModalTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn("font-headline-sm text-headline-sm text-primary", className)}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      className={cn("mt-0.5 font-body-sm text-body-sm text-on-surface-variant", className)}
      {...props}
    />
  );
}
