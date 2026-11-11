"use client";
import { Dialog } from "radix-ui";
import { useRef, useState, type ComponentProps, type PointerEvent } from "react";
import { cn } from "../../lib/cn";
import { overlayBackdropClass } from "./shared";

export const BottomSheet = Dialog.Root;
export const BottomSheetTrigger = Dialog.Trigger;
export const BottomSheetClose = Dialog.Close;

export interface BottomSheetContentProps extends ComponentProps<typeof Dialog.Content> {
  /** Permite cerrar arrastrando el handle hacia abajo (por defecto true). */
  draggable?: boolean;
  /** Distancia en px a partir de la cual se cierra (por defecto 96). */
  closeThreshold?: number;
  onClose?: () => void;
}

/** Hoja inferior móvil: radio superior 28px, handle 40x4. Debe usarse dentro de <BottomSheet>. */
export function BottomSheetContent({
  draggable = true,
  closeThreshold = 96,
  className,
  children,
  style,
  ...props
}: BottomSheetContentProps) {
  const [dy, setDy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function down(e: PointerEvent<HTMLDivElement>) {
    start.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    if (start.current == null) return;
    setDy(Math.max(0, e.clientY - start.current));
  }
  function up() {
    if (start.current == null) return;
    start.current = null;
    setDragging(false);
    if (dy > closeThreshold) closeRef.current?.click();
    setDy(0);
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={overlayBackdropClass} />
      <Dialog.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[90dvh] w-full max-w-[640px] flex-col rounded-t-4xl bg-surface-container-lowest",
          "px-space-md pb-space-lg pt-3 shadow-[0_-12px_32px_rgba(14,35,64,0.25)] outline-none animate-sheet-up pb-safe",
          className,
        )}
        style={{
          transform: dy ? `translateY(${dy}px)` : undefined,
          transition: dragging ? "none" : "transform 200ms var(--ease-out-soft)",
          ...style,
        }}
        {...props}
      >
        <div
          data-slot="handle"
          className={cn(
            "-mx-space-md -mt-3 flex shrink-0 justify-center pb-2 pt-3",
            draggable && "cursor-grab touch-none active:cursor-grabbing",
          )}
          onPointerDown={draggable ? down : undefined}
          onPointerMove={draggable ? move : undefined}
          onPointerUp={draggable ? up : undefined}
          onPointerCancel={draggable ? up : undefined}
        >
          <span aria-hidden className="h-1 w-10 rounded-full bg-outline-variant" />
        </div>
        <Dialog.Close ref={closeRef} className="sr-only" tabIndex={-1} aria-hidden>
          Cerrar
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function BottomSheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex shrink-0 items-center justify-between gap-space-sm pb-1", className)}
      {...props}
    />
  );
}

export function BottomSheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-space-xs", className)}
      {...props}
    />
  );
}

export function BottomSheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex shrink-0 flex-col gap-2 pt-space-xs", className)} {...props} />;
}

export function BottomSheetTitle({ className, ...props }: ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      className={cn("font-headline-sm text-headline-sm text-primary", className)}
      {...props}
    />
  );
}

export function BottomSheetDescription({
  className,
  ...props
}: ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      className={cn("font-body-sm text-body-sm text-on-surface-variant", className)}
      {...props}
    />
  );
}
