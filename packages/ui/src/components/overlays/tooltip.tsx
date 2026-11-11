"use client";
import { Tooltip as T } from "radix-ui";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "../../lib/cn";

export function TooltipProvider({
  delayDuration = 200,
  ...props
}: ComponentProps<typeof T.Provider>) {
  return <T.Provider delayDuration={delayDuration} {...props} />;
}

export interface TooltipProps {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  /** Elemento disparador (se le añade aria-describedby automáticamente). */
  children: ReactElement;
}

/** Tooltip oscuro (inverse-surface). Útil sin envolver: incluye su propio Provider. */
export function Tooltip({
  content,
  side = "top",
  align = "center",
  delayDuration,
  className,
  children,
  ...root
}: TooltipProps) {
  return (
    <T.Provider delayDuration={delayDuration ?? 200}>
      <T.Root delayDuration={delayDuration} {...root}>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            side={side}
            align={align}
            sideOffset={8}
            collisionPadding={8}
            className={cn(
              "z-[70] max-w-[260px] rounded-lg bg-inverse-surface px-3 py-1.5 text-center font-label-sm text-label-sm text-inverse-on-surface shadow-raised animate-fade-in",
              className,
            )}
          >
            {content}
            <T.Arrow width={10} height={5} className="fill-inverse-surface" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
