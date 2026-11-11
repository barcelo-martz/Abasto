"use client";
import { DropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface SplitButtonItem {
  label: string;
  icon?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  children: ReactNode;
  leadingIcon?: string;
  onClick?: () => void;
  items: SplitButtonItem[];
  menuLabel?: string;
  className?: string;
}

export function SplitButton({
  children,
  leadingIcon,
  onClick,
  items,
  menuLabel = "Más acciones",
  className,
}: SplitButtonProps) {
  return (
    <div className={cn("inline-flex", className)}>
      <button
        type="button"
        onClick={onClick}
        className="flex cursor-pointer items-center gap-2 rounded-l-xl bg-primary px-space-md py-2.5 font-label-md text-label-md text-on-primary transition-colors hover:bg-primary-container"
      >
        {leadingIcon && <Icon name={leadingIcon} size={18} />}
        {children}
      </button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          aria-label={menuLabel}
          className="flex cursor-pointer items-center justify-center rounded-r-xl bg-primary-container px-2.5 text-on-primary transition-colors hover:bg-primary"
        >
          <Icon name="expand_more" size={20} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-[70] min-w-52 animate-fade-in rounded-xl bg-surface-container-lowest p-1.5 shadow-overlay"
          >
            {items.map((it) => (
              <DropdownMenu.Item
                key={it.label}
                disabled={it.disabled}
                onSelect={it.onSelect}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-space-sm py-2 font-label-md text-label-md text-on-surface outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-container"
              >
                {it.icon && <Icon name={it.icon} size={18} className="text-secondary" />}
                {it.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
