"use client";
import { Popover as P } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverAnchor = P.Anchor;
export const PopoverClose = P.Close;

export function PopoverContent({
  className,
  sideOffset = 8,
  align = "start",
  children,
  ...props
}: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-[70] w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-container-lowest p-space-md shadow-overlay outline-none animate-fade-in",
          className,
        )}
        {...props}
      >
        {children}
      </P.Content>
    </P.Portal>
  );
}
