import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

/** Contenedor con scroll horizontal. Fila estándar de 56px. */
export function Table({
  className,
  containerClassName,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { containerClassName?: string }) {
  return (
    <div className={cn("relative w-full overflow-x-auto", containerClassName)}>
      <table
        className={cn("w-full border-collapse text-left font-body-sm text-body-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-20 bg-surface-container-low text-[11px] uppercase tracking-wider text-on-surface-variant shadow-[0_1px_0_rgba(195,198,207,0.4)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        "divide-y divide-surface-container-high bg-surface-container-lowest",
        className,
      )}
      {...props}
    />
  );
}

const rowVariants = cva(
  [
    "relative h-[var(--row-height)] transition-colors duration-150",
    // barra lateral de acento en la primera celda
    "[&>:first-child]:relative [&>:first-child]:before:absolute [&>:first-child]:before:inset-y-0 [&>:first-child]:before:left-0 [&>:first-child]:before:w-1.5 [&>:first-child]:before:bg-transparent [&>:first-child]:before:transition-colors [&>:first-child]:before:content-['']",
  ],
  {
    variants: {
      /** Estado semántico de la fila de inventario. */
      tone: {
        default: "hover:bg-surface-container-low/60 hover:[&>:first-child]:before:bg-secondary/60",
        low: "bg-low-container/40 hover:bg-low-container/70 [&>:first-child]:before:bg-low-dot",
        out: "bg-out-container/40 hover:bg-out-container/70 [&>:first-child]:before:bg-out-dot",
        /** Cadena de frío 2–8 °C. */
        cold: "bg-info-container/50 hover:bg-info-container [&>:first-child]:before:bg-primary-container",
      },
      selected: {
        true: "bg-surface-container-low [&>:first-child]:before:bg-secondary",
        false: "",
      },
    },
    defaultVariants: { tone: "default", selected: false },
  },
);

export interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement>, VariantProps<typeof rowVariants> {}

export function TableRow({ className, tone, selected, ...props }: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(rowVariants({ tone, selected }), className)}
      {...props}
    />
  );
}

export type SortDirection = "asc" | "desc" | null;

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "onClick"> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  /** Icono informativo junto al título (p. ej. "edit_note"). */
  hintIcon?: string;
  hintTitle?: string;
}

export function TableHead({
  className,
  children,
  sortable,
  sortDirection = null,
  onSort,
  hintIcon,
  hintTitle,
  ...props
}: TableHeadProps) {
  const active = sortDirection != null;
  return (
    <th
      scope="col"
      aria-sort={
        active
          ? sortDirection === "asc"
            ? "ascending"
            : "descending"
          : sortable
            ? "none"
            : undefined
      }
      className={cn("px-space-md py-space-md font-label-sm font-semibold", className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "group flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-primary",
            active ? "text-primary" : "text-on-surface-variant",
          )}
        >
          <span>{children}</span>
          <Icon
            name={
              sortDirection === "asc"
                ? "arrow_upward"
                : sortDirection === "desc"
                  ? "arrow_downward"
                  : "swap_vert"
            }
            size={16}
            className={cn(active ? "text-secondary" : "opacity-40 group-hover:opacity-100")}
          />
        </button>
      ) : (
        <span className="inline-flex items-center gap-1">
          {children}
          {hintIcon && (
            <Icon name={hintIcon} size={14} className="text-outline" title={hintTitle} />
          )}
        </span>
      )}
    </th>
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-space-md py-space-sm align-middle", className)} {...props} />;
}

/** Celda numérica alineada con cifras tabulares. */
export function TableNumberCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <TableCell
      className={cn(
        "tabular font-numeric-data text-numeric-data font-semibold text-primary",
        className,
      )}
      {...props}
    />
  );
}

export interface TableToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Buscador (izquierda). */
  search?: ReactNode;
  /** Selects de filtro. */
  filters?: ReactNode;
  /** CTAs a la derecha. */
  actions?: ReactNode;
  /** Chips de filtros activos (fila inferior). */
  activeFilters?: ReactNode;
}

export function TableToolbar({
  search,
  filters,
  actions,
  activeFilters,
  className,
  ...props
}: TableToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-space-sm p-space-md", className)} {...props}>
      <div className="flex flex-wrap items-center gap-space-sm">
        {search && <div className="min-w-[220px] flex-1">{search}</div>}
        {filters && <div className="flex flex-wrap items-center gap-space-xs">{filters}</div>}
        {actions && <div className="ml-auto flex items-center gap-space-xs">{actions}</div>}
      </div>
      {activeFilters && (
        <div className="flex flex-wrap items-center gap-space-xs">{activeFilters}</div>
      )}
    </div>
  );
}

/** Tarjeta blanca elevada que envuelve toolbar + tabla + paginación. */
export function TableCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-surface-container-lowest shadow-card",
        className,
      )}
      {...props}
    />
  );
}
