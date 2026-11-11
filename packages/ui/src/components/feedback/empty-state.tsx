import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  EmptyLedgerIllustration,
  EmptySafeIllustration,
  EmptySearchIllustration,
} from "./illustrations";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** "search" sin resultados · "safe" sin alertas · "ledger" sin registros · o tu propio nodo. */
  illustration?: "search" | "safe" | "ledger" | ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  illustration = "search",
  title,
  description,
  action,
  compact,
  className,
  ...props
}: EmptyStateProps) {
  const art =
    illustration === "search" ? (
      <EmptySearchIllustration />
    ) : illustration === "safe" ? (
      <EmptySafeIllustration />
    ) : illustration === "ledger" ? (
      <EmptyLedgerIllustration />
    ) : (
      illustration
    );
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "p-space-lg" : "p-space-2xl",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mb-space-md [&>svg]:h-full [&>svg]:w-full",
          compact ? "h-24 w-32" : "h-32 w-44",
        )}
      >
        {art}
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm font-body-sm text-body-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-space-md">{action}</div>}
    </div>
  );
}
