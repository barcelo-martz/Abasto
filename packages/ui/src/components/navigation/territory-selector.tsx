"use client";
import { useMemo, useState } from "react";
import { Popover } from "radix-ui";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface TerritoryOption {
  value: string;
  label: string;
  description?: string;
}

export interface TerritorySelectorProps {
  options: TerritoryOption[];
  value: string;
  onValueChange: (value: string) => void;
  /** Etiqueta del nivel: "Provincia" | "Municipio". */
  level?: "Provincia" | "Municipio";
  /** Fondo oscuro (PortalHeader over-hero). */
  tone?: "light" | "dark";
  className?: string;
}

export function TerritorySelector({
  options,
  value,
  onValueChange,
  level = "Provincia",
  tone = "light",
  className,
}: TerritorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = options.find((o) => o.value === value);
  const list = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase())),
    [options, q],
  );
  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQ("");
      }}
    >
      <Popover.Trigger
        aria-label={`${level}: ${current?.label ?? "seleccionar"}`}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 font-label-md text-label-md transition-colors",
          tone === "dark"
            ? "bg-white/10 text-on-primary hover:bg-white/20"
            : "bg-surface-container text-primary hover:bg-surface-container-high",
          className,
        )}
      >
        <Icon name="location_on" size={18} />
        <span className="max-w-32 truncate">{current?.label ?? level}</span>
        <Icon
          name="expand_more"
          size={18}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-[70] w-72 animate-modal-in rounded-2xl bg-surface-container-lowest p-2 shadow-overlay"
        >
          <p className="px-3 pb-1 pt-2 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            {level}
          </p>
          <div className="relative px-1 pb-2">
            <Icon
              name="search"
              size={18}
              className="absolute left-4 top-1/2 -translate-y-[60%] text-outline"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Buscar ${level.toLowerCase()}…`}
              aria-label={`Buscar ${level.toLowerCase()}`}
              className="h-10 w-full rounded-lg bg-surface-container-low pl-9 pr-3 font-body-sm text-body-sm outline-none placeholder:text-outline focus:ring-2 focus:ring-secondary/40"
            />
          </div>
          <ul role="listbox" aria-label={level} className="no-scrollbar max-h-64 overflow-y-auto">
            {list.length === 0 && (
              <li className="px-3 py-4 text-center font-body-sm text-body-sm text-on-surface-variant">
                Sin resultados
              </li>
            )}
            {list.map((o) => {
              const sel = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={sel}>
                  <button
                    type="button"
                    onClick={() => {
                      onValueChange(o.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-left transition-colors hover:bg-surface-container-low",
                      sel && "bg-secondary-container/40",
                    )}
                  >
                    <span>
                      <span
                        className={cn(
                          "block font-label-md text-label-md",
                          sel ? "text-secondary" : "text-on-surface",
                        )}
                      >
                        {o.label}
                      </span>
                      {o.description && (
                        <span className="block font-label-sm text-[11px] text-on-surface-variant">
                          {o.description}
                        </span>
                      )}
                    </span>
                    {sel && <Icon name="check" size={18} className="text-secondary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
