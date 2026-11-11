"use client";
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface SearchSuggestion {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  icon?: string;
}

export interface SearchHeroProps {
  value: string;
  onValueChange: (v: string) => void;
  onSubmit?: (v: string) => void;
  suggestions?: SearchSuggestion[];
  onSelect?: (s: SearchSuggestion) => void;
  placeholder?: string;
  buttonLabel?: string;
  loading?: boolean;
  className?: string;
}

/** Buscador universal de fármacos y suministros (pill grande con sugerencias). */
export function SearchHero({
  value,
  onValueChange,
  onSubmit,
  suggestions = [],
  onSelect,
  placeholder = "Buscar medicamento, principio activo o insumo…",
  buttonLabel = "Buscar",
  loading,
  className,
}: SearchHeroProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const show = open && suggestions.length > 0;

  const key = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % Math.max(1, suggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Enter") {
      const s = suggestions[active];
      if (show && s) {
        e.preventDefault();
        onSelect?.(s);
        setOpen(false);
      }
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
          onSubmit?.(value);
        }}
        className="flex items-center gap-2 rounded-full bg-surface-container-lowest p-2 shadow-raised focus-within:ring-2 focus-within:ring-secondary"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <Icon name="search" size={22} />
        </span>
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label="Buscar"
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            onValueChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={key}
          className="h-11 min-w-0 flex-1 appearance-none border-0 bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => {
              onValueChange("");
              setOpen(false);
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-outline hover:bg-surface-container hover:text-primary"
          >
            <Icon name="close" size={20} />
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gradient-primary px-space-lg font-label-md text-label-md text-on-primary shadow-btn transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : (
            <Icon name="search" size={18} />
          )}
          <span className="hidden sm:inline">{buttonLabel}</span>
        </button>
      </form>
      {show && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-2 top-full z-popover mt-2 max-h-80 animate-fade-in overflow-auto rounded-2xl bg-surface-container-lowest p-1.5 shadow-overlay"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.(s);
                setOpen(false);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                i === active ? "bg-surface-container-low" : "",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container/40 text-secondary">
                <Icon name={s.icon ?? "medication"} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-headline-sm text-headline-sm text-on-surface">
                  {s.title}
                </span>
                {s.subtitle && (
                  <span className="block truncate font-body-sm text-body-sm text-on-surface-variant">
                    {s.subtitle}
                  </span>
                )}
              </span>
              {s.meta && (
                <span className="shrink-0 font-label-sm text-label-sm text-outline">{s.meta}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
