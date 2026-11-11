"use client";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Icon } from "../icon";

type Item = number | "gap";

function range(page: number, count: number, sibling: number): Item[] {
  const total = sibling * 2 + 5;
  if (count <= total) return Array.from({ length: count }, (_, i) => i + 1);
  const left = Math.max(page - sibling, 2);
  const right = Math.min(page + sibling, count - 1);
  const items: Item[] = [1];
  if (left > 2) items.push("gap");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < count - 1) items.push("gap");
  items.push(count);
  return items;
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** numbered: píldoras numeradas · compact: "Pág. 1 de 46" para móvil. */
  variant?: "numbered" | "compact";
  siblingCount?: number;
  /** Para el resumen "1 - 4 de 184 ítems" (variante compact). */
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  variant = "numbered",
  siblingCount = 1,
  pageSize,
  totalItems,
  className,
}: PaginationProps) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;

  if (variant === "compact") {
    const from = pageSize ? (page - 1) * pageSize + 1 : undefined;
    const to = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined;
    return (
      <nav
        aria-label="Paginación"
        className={cn(
          "flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-sm shadow-card-sm",
          className,
        )}
      >
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 items-center gap-1 rounded-lg bg-surface-container px-3 font-label-sm text-label-sm text-primary transition-colors hover:bg-surface-container-high disabled:text-on-surface-variant disabled:opacity-40"
        >
          <Icon name="chevron_left" size={18} />
          Ant.
        </button>
        <div className="flex flex-col items-center">
          <span
            className="tabular font-numeric-data text-numeric-data font-semibold text-primary"
            aria-current="page"
          >
            Pág. {page} de {pageCount}
          </span>
          {from != null && to != null && totalItems != null && (
            <span className="font-label-sm text-[11px] text-outline">
              {from} - {to} de {totalItems} ítems
            </span>
          )}
        </div>
        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
          className="flex h-10 items-center gap-1 rounded-lg bg-surface-container px-3 font-label-sm text-label-sm text-primary transition-colors hover:bg-surface-container-high disabled:text-on-surface-variant disabled:opacity-40"
        >
          Sig.
          <Icon name="chevron_right" size={18} />
        </button>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Paginación"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <button
        type="button"
        aria-label="Página anterior"
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-card-sm transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <Icon name="chevron_left" size={20} />
      </button>
      {range(page, pageCount, siblingCount).map((it, i) =>
        it === "gap" ? (
          <span key={`g${i}`} aria-hidden className="w-6 text-center text-on-surface-variant">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-label={`Página ${it}`}
            aria-current={it === page ? "page" : undefined}
            onClick={() => onPageChange(it)}
            className={cn(
              "tabular flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-label-md text-label-md transition-all",
              it === page
                ? "bg-gradient-primary text-on-primary shadow-btn"
                : "bg-surface-container-lowest text-on-surface-variant shadow-card-sm hover:bg-surface-container hover:text-primary",
            )}
          >
            {it}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Página siguiente"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-card-sm transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <Icon name="chevron_right" size={20} />
      </button>
    </nav>
  );
}

export interface LoadMoreProps {
  shown: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

/** Botón progresivo "Cargar más" con indicador de avance. */
export function LoadMore({
  shown,
  total,
  onLoadMore,
  loading,
  label = "Cargar más",
  className,
}: LoadMoreProps) {
  const pct = total > 0 ? Math.min(100, Math.round((shown / total) * 100)) : 0;
  const done = shown >= total;
  return (
    <div className={cn("flex flex-col items-center gap-space-sm", className)}>
      <div className="flex w-full max-w-xs flex-col gap-1.5">
        <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span>
            Mostrando <span className="tabular font-bold text-primary">{shown}</span> de{" "}
            <span className="tabular">{total}</span>
          </span>
          <span className="tabular">{pct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="h-1.5 overflow-hidden rounded-full bg-surface-container-high"
        >
          <div
            className="h-full rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {done ? (
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Has llegado al final del listado
        </p>
      ) : (
        <Button
          variant="secondary"
          leadingIcon="expand_more"
          loading={loading}
          loadingText="Cargando…"
          onClick={onLoadMore}
        >
          {label}
        </Button>
      )}
    </div>
  );
}
