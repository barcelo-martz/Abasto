"use client";
import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { fieldShell, type FieldState } from "./input";
import { useFieldContext } from "./field";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: ReactNode;
  icon?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  state?: FieldState;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Buscar…",
  emptyText = "Sin coincidencias",
  state,
  disabled,
  id,
  className,
}: ComboboxProps) {
  const f = useFieldContext();
  const listId = useId();
  const selected = options.find((o) => o.value === value);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const st: FieldState = state ?? (f?.invalid ? "error" : "default");
  const filtered = useMemo(
    () => (query ? options.filter((o) => norm(o.label).includes(norm(query))) : options),
    [options, query],
  );

  const pick = (o: ComboboxOption) => {
    onValueChange?.(o.value);
    setQuery("");
    setOpen(false);
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault();
      pick(filtered[active]);
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn(fieldShell({ state: st, disabled: !!(disabled ?? f?.disabled) }))}>
        <Icon name="search" className="ml-space-md text-outline" />
        <input
          id={id ?? f?.id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${listId}-${active}` : undefined}
          aria-describedby={f?.describedBy}
          disabled={disabled ?? f?.disabled}
          value={open ? query : (selected?.label ?? "")}
          placeholder={selected?.label ?? placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() =>
            setTimeout(() => {
              setOpen(false);
              setQuery("");
            }, 120)
          }
          onKeyDown={key}
          className="h-12 w-full min-w-0 border-0 bg-transparent px-space-sm font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        />
        {selected && (
          <button
            type="button"
            aria-label="Limpiar selección"
            onClick={() => onValueChange?.(null)}
            className="mr-1 flex h-9 w-9 items-center justify-center rounded-lg text-outline hover:text-primary"
          >
            <Icon name="close" size={18} />
          </button>
        )}
        <Icon
          name="expand_more"
          className={cn("mr-3 text-outline transition-transform", open && "rotate-180")}
        />
      </div>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-popover mt-2 max-h-64 animate-fade-in overflow-auto rounded-2xl bg-surface-container-lowest p-1.5 shadow-overlay"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">
              {emptyText}
            </li>
          )}
          {filtered.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.value === value}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(o);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                i === active && "bg-surface-container-low",
                o.value === value && "bg-secondary-container/30",
              )}
            >
              {o.icon && <Icon name={o.icon} size={20} className="text-secondary" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-label-md text-label-md text-on-surface">
                  {o.label}
                </span>
                {o.description && (
                  <span className="block truncate font-label-sm text-label-sm text-on-surface-variant">
                    {o.description}
                  </span>
                )}
              </span>
              {o.value === value && <Icon name="check" size={18} className="text-secondary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
