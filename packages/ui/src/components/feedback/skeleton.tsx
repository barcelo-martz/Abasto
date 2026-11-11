import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn("skeleton rounded-md", className)} {...props} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/5" : "w-full")} />
      ))}
    </div>
  );
}

/** Tarjeta de medicamento / ficha en carga (CLS = 0). */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={cn(
        "flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-space-sm">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-3/5" />
          <Skeleton className="h-2.5 w-2/5" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTableRows({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div role="status" aria-label="Cargando tabla" className={cn("flex flex-col", className)}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex h-14 items-center gap-space-md px-space-md">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} className={cn("h-3", c === 0 ? "w-1/4" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}
