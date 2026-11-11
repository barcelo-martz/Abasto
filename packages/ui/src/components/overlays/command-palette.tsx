"use client";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { overlayBackdropClass } from "./shared";

export type CommandTone = "avail" | "low" | "out" | "neutral";

export interface CommandItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: string;
  /** Pastilla de estado junto al título. */
  badge?: { label: string; tone?: CommandTone };
  /** Texto a la derecha (principal y secundario). */
  meta?: { primary: ReactNode; secondary?: ReactNode };
  onSelect?: () => void;
}

export interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

export interface CommandQuickAction {
  id: string;
  title: string;
  description?: string;
  icon: string;
  onSelect?: () => void;
}

export interface CommandFilter {
  id: string;
  label: ReactNode;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Atajo global ⌘K / Ctrl+K que alterna la paleta (por defecto true). */
  hotkey?: boolean;
  query?: string;
  onQueryChange?: (q: string) => void;
  placeholder?: string;
  filters?: CommandFilter[];
  activeFilter?: string;
  onFilterChange?: (id: string) => void;
  /** Resultados ya filtrados por quien consume el componente. */
  groups?: CommandGroup[];
  quickActionsLabel?: string;
  quickActions?: CommandQuickAction[];
  /** Se llama al elegir un resultado o acción (además de su onSelect). */
  onSelect?: (item: CommandItem | CommandQuickAction) => void;
  emptyMessage?: ReactNode;
  footerEnd?: ReactNode;
}

const tone: Record<CommandTone, { icon: string; pill: string; dot: string }> = {
  avail: {
    icon: "bg-avail-container text-secondary",
    pill: "bg-avail-container text-on-avail-container",
    dot: "bg-avail-dot",
  },
  low: {
    icon: "bg-low-container text-low-dot",
    pill: "bg-low-container text-on-low-container",
    dot: "bg-low-dot",
  },
  out: {
    icon: "bg-out-container text-out-dot",
    pill: "bg-out-container text-on-out-container",
    dot: "bg-out-dot",
  },
  neutral: {
    icon: "bg-surface-container text-primary",
    pill: "bg-surface-container text-on-surface-variant",
    dot: "bg-outline",
  },
};

type Entry = { key: string; run: () => void; ref: CommandItem | CommandQuickAction };

export function CommandPalette({
  open,
  onOpenChange,
  hotkey = true,
  query: queryProp,
  onQueryChange,
  placeholder = "Buscar fármacos, lotes o policlínicos...",
  filters,
  activeFilter,
  onFilterChange,
  groups = [],
  quickActionsLabel = "Acciones rápidas",
  quickActions = [],
  onSelect,
  emptyMessage = "Sin resultados para tu búsqueda.",
  footerEnd,
}: CommandPaletteProps) {
  const [inner, setInner] = useState("");
  const query = queryProp ?? inner;
  const setQuery = (q: string) => (onQueryChange ? onQueryChange(q) : setInner(q));
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hotkey) return;
    const h = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [hotkey, open, onOpenChange]);

  const pick = (it: CommandItem | CommandQuickAction) => {
    it.onSelect?.();
    onSelect?.(it);
    onOpenChange(false);
  };

  const entries = useMemo<Entry[]>(
    () => [
      ...groups.flatMap((g) =>
        g.items.map((it) => ({ key: `r:${it.id}`, run: () => pick(it), ref: it })),
      ),
      ...quickActions.map((a) => ({ key: `a:${a.id}`, run: () => pick(a), ref: a })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, quickActions, onSelect],
  );

  useEffect(() => {
    // Reset navigation when the available results change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [groups, query]);
  useEffect(() => {
    if (!open) {
      // Clear uncontrolled input when the palette closes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInner("");
    }
  }, [open]);
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onKeyDown(e: KeyboardEvent) {
    if (!entries.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % entries.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + entries.length) % entries.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      entries[active]?.run();
    }
  }

  const idx = (key: string) => entries.findIndex((en) => en.key === key);
  const activeId = entries[active] ? `cmd-${entries[active].key}` : undefined;
  const hasResults = groups.some((g) => g.items.length > 0);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayBackdropClass} />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[8dvh] z-[60] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 outline-none sm:top-[12dvh]"
        >
          <div className="flex max-h-[80dvh] animate-modal-in flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-float">
            <VisuallyHidden.Root>
              <Dialog.Title>Paleta de comandos</Dialog.Title>
            </VisuallyHidden.Root>

            <div className="flex items-center gap-3 p-4 sm:p-5">
              <Icon name="search" size={24} className="text-secondary" />
              <input
                autoFocus
                role="combobox"
                aria-expanded
                aria-controls="cmd-listbox"
                aria-activedescendant={activeId}
                aria-label="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent font-headline-sm text-headline-sm font-medium text-primary placeholder:text-outline focus:outline-none"
              />
              <Dialog.Close className="cursor-pointer rounded-lg bg-surface-container-high px-2 py-1 font-numeric-data text-label-sm text-on-surface-variant">
                ESC
              </Dialog.Close>
            </div>

            {filters && filters.length > 0 && (
              <div
                role="group"
                aria-label="Filtros"
                className="no-scrollbar flex items-center gap-2 overflow-x-auto bg-surface-container-low px-5 py-2.5"
              >
                {filters.map((f) => {
                  const on = f.id === activeFilter;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => onFilterChange?.(f.id)}
                      className={cn(
                        "shrink-0 cursor-pointer rounded-full px-3 py-1 font-label-sm text-label-sm transition-colors",
                        on
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest text-on-surface shadow-card-sm hover:bg-surface-container",
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              ref={listRef}
              id="cmd-listbox"
              role="listbox"
              aria-label="Resultados"
              className="flex-1 space-y-6 overflow-y-auto p-5"
            >
              {!hasResults && quickActions.length === 0 && (
                <p className="py-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
                  {emptyMessage}
                </p>
              )}

              {groups.map(
                (g) =>
                  g.items.length > 0 && (
                    <div key={g.id} role="group" aria-label={g.label} className="space-y-2">
                      <span className="block font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">
                        {g.label}
                      </span>
                      {g.items.map((it) => {
                        const key = `r:${it.id}`;
                        const on = idx(key) === active;
                        const t = tone[it.badge?.tone ?? "neutral"];
                        return (
                          <div
                            key={it.id}
                            id={`cmd-${key}`}
                            role="option"
                            aria-selected={on}
                            data-active={on}
                            onMouseMove={() => setActive(idx(key))}
                            onClick={() => pick(it)}
                            className={cn(
                              "flex cursor-pointer items-center justify-between gap-4 rounded-xl p-3 shadow-card-sm transition-colors",
                              on
                                ? "bg-surface-container-low ring-2 ring-secondary/40"
                                : "bg-surface-container-lowest",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {it.icon && (
                                <span
                                  className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                    t.icon,
                                  )}
                                >
                                  <Icon name={it.icon} />
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-body-md text-body-md font-bold text-primary">
                                    {it.title}
                                  </span>
                                  {it.badge && (
                                    <span
                                      className={cn(
                                        "flex items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-[11px]",
                                        t.pill,
                                      )}
                                    >
                                      <span
                                        aria-hidden
                                        className={cn("h-1.5 w-1.5 rounded-full", t.dot)}
                                      />
                                      {it.badge.label}
                                    </span>
                                  )}
                                </div>
                                {it.description && (
                                  <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                                    {it.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {it.meta && (
                              <div className="hidden shrink-0 flex-col items-end text-right sm:flex">
                                <span className="font-numeric-data text-body-sm font-bold text-primary">
                                  {it.meta.primary}
                                </span>
                                {it.meta.secondary && (
                                  <span className="font-label-sm text-label-sm text-outline">
                                    {it.meta.secondary}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ),
              )}

              {quickActions.length > 0 && (
                <div role="group" aria-label={quickActionsLabel} className="space-y-2">
                  <span className="block font-label-sm text-[11px] font-bold uppercase tracking-wider text-outline">
                    {quickActionsLabel}
                  </span>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {quickActions.map((a) => {
                      const key = `a:${a.id}`;
                      const on = idx(key) === active;
                      return (
                        <div
                          key={a.id}
                          id={`cmd-${key}`}
                          role="option"
                          aria-selected={on}
                          data-active={on}
                          onMouseMove={() => setActive(idx(key))}
                          onClick={() => pick(a)}
                          className={cn(
                            "flex cursor-pointer flex-col gap-2 rounded-xl p-3.5 shadow-card-sm transition-colors",
                            on
                              ? "bg-surface-container-high ring-2 ring-secondary/40"
                              : "bg-surface-container-lowest",
                          )}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-avail-container text-secondary">
                            <Icon name={a.icon} size={18} />
                          </span>
                          <div>
                            <h4 className="font-label-md text-label-md font-bold text-primary">
                              {a.title}
                            </h4>
                            {a.description && (
                              <p className="text-[12px] leading-tight text-on-surface-variant">
                                {a.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low px-5 py-3 font-label-sm text-label-sm text-outline">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd> Navegar
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>↵</Kbd> Seleccionar
                </span>
                <span className="flex items-center gap-1.5">
                  <Kbd>ESC</Kbd> Cerrar
                </span>
              </div>
              {footerEnd && <span className="font-semibold text-secondary">{footerEnd}</span>}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded bg-surface-container-lowest px-1 py-0.5 font-numeric-data shadow-card-sm">
      {children}
    </kbd>
  );
}
