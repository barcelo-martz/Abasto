"use client";
import { Select as S } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { fieldShell, type FieldState } from "./input";
import { useFieldContext } from "./field";

export interface SelectOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  state?: FieldState;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
}

export function Select({
  options,
  placeholder = "Seleccionar…",
  state,
  disabled,
  id,
  className,
  ...root
}: SelectProps) {
  const f = useFieldContext();
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const dis = disabled ?? f?.disabled;
  return (
    <S.Root disabled={dis} {...root}>
      <S.Trigger
        id={id ?? f?.id}
        aria-describedby={f?.describedBy}
        aria-invalid={st === "error" || undefined}
        className={cn(
          fieldShell({ state: st, disabled: !!dis }),
          "h-12 cursor-pointer justify-between px-space-md text-left font-body-md text-body-md font-medium text-primary data-[placeholder]:font-normal data-[placeholder]:text-outline",
          className,
        )}
      >
        <S.Value placeholder={placeholder} />
        <S.Icon asChild>
          <Icon name="expand_more" className="text-outline" />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Content
          position="popper"
          sideOffset={6}
          className="z-popover max-h-72 w-[var(--radix-select-trigger-width)] animate-fade-in overflow-hidden rounded-2xl bg-surface-container-lowest p-1.5 shadow-overlay"
        >
          <S.Viewport>
            {options.map((o) => (
              <S.Item
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-surface-container-low data-[state=checked]:bg-secondary-container/30"
              >
                {o.icon && <Icon name={o.icon} size={20} className="text-secondary" />}
                <span className="min-w-0 flex-1">
                  <S.ItemText>{o.label}</S.ItemText>
                  {o.description && (
                    <span className="block truncate font-label-sm text-label-sm text-on-surface-variant">
                      {o.description}
                    </span>
                  )}
                </span>
                <S.ItemIndicator>
                  <Icon name="check" size={18} className="text-secondary" />
                </S.ItemIndicator>
              </S.Item>
            ))}
          </S.Viewport>
        </S.Content>
      </S.Portal>
    </S.Root>
  );
}
