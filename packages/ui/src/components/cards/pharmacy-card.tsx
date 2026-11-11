import type { HTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { FILL, statusFromCoverage } from "./stock-bar";

export interface MiniMapProps {
  /** Posición del marcador en el viewBox 0-120 x 0-72. */
  pin?: { x: number; y: number };
  /** Posición del usuario (opcional). */
  user?: { x: number; y: number };
  className?: string;
}

/** Mini mapa vectorial decorativo (sin dependencias de teselas). */
export function MiniMap({ pin = { x: 70, y: 34 }, user, className }: MiniMapProps) {
  return (
    <svg
      viewBox="0 0 120 72"
      role="img"
      aria-label="Ubicación aproximada"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
    >
      <rect width="120" height="72" fill="var(--color-surface-container-low)" />
      <path
        d="M0 58 C20 50 34 66 56 56 S100 40 120 48 V72 H0Z"
        fill="var(--color-primary-fixed)"
        opacity="0.7"
      />
      <rect
        x="8"
        y="8"
        width="26"
        height="16"
        rx="3"
        fill="var(--color-secondary-container)"
        opacity="0.6"
      />
      <g
        stroke="var(--color-surface-container-lowest)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M-4 30 L124 22" />
        <path d="M44 -4 L52 76" />
        <path d="M86 -4 L78 76" strokeWidth="3" />
      </g>
      <g stroke="var(--color-outline-variant)" strokeWidth="0.6" fill="none" opacity="0.8">
        <path d="M-4 30 L124 22" strokeDasharray="3 3" />
        <path d="M44 -4 L52 76" strokeDasharray="3 3" />
      </g>
      {user && (
        <circle
          cx={user.x}
          cy={user.y}
          r="4"
          fill="var(--color-primary)"
          stroke="#fff"
          strokeWidth="1.5"
        />
      )}
      <g transform={`translate(${pin.x} ${pin.y})`}>
        <ellipse cx="0" cy="1" rx="5" ry="1.8" fill="var(--color-primary)" opacity="0.2" />
        <path
          d="M0 0 C-7 -9 -8 -13 -8 -16 A8 8 0 1 1 8 -16 C8 -13 7 -9 0 0Z"
          fill="var(--color-secondary)"
        />
        <circle cx="0" cy="-16" r="3" fill="#fff" />
      </g>
    </svg>
  );
}

export interface PharmacyCardProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  name: string;
  address: string;
  /** Distancia en km. */
  distanceKm: number;
  open?: boolean;
  hours?: string;
  phone?: string;
  /** % del inventario solicitado que esta farmacia puede cubrir. */
  match: number;
  matchLabel?: string;
  pin?: MiniMapProps["pin"];
  onDirections?: () => void;
  onCall?: () => void;
  onViewStock?: () => void;
  ref?: Ref<HTMLElement>;
}

export function PharmacyCard({
  name,
  address,
  distanceKm,
  open,
  hours,
  phone,
  match,
  matchLabel = "Coincidencia de inventario",
  pin,
  onDirections,
  onCall,
  onViewStock,
  className,
  ref,
  ...props
}: PharmacyCardProps) {
  const pct = Math.max(0, Math.min(100, Math.round(match)));
  const st = statusFromCoverage(pct, { critical: 25, low: 60 });
  const dist =
    distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
  const act =
    "inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl font-label-md text-label-md transition-all active:scale-[0.98]";
  return (
    <article
      ref={ref}
      className={cn(
        "flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-card",
        className,
      )}
      {...props}
    >
      <div className="relative h-28">
        <MiniMap pin={pin} />
        <span className="absolute right-space-xs top-space-xs inline-flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 font-label-sm text-label-sm text-primary shadow-card-sm backdrop-blur-md">
          <Icon name="near_me" size={14} className="text-secondary" />
          <span className="tabular">{dist}</span>
        </span>
      </div>
      <div className="flex flex-col gap-space-sm p-space-md">
        <div className="flex items-start justify-between gap-space-xs">
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">{name}</h3>
            <p className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <Icon name="location_on" size={16} className="shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          </div>
          {open != null && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-label-sm",
                open
                  ? "bg-avail-container text-on-avail-container"
                  : "bg-out-container text-on-out-container",
              )}
            >
              <span
                aria-hidden
                className={cn("h-1.5 w-1.5 rounded-full", open ? "bg-avail-dot" : "bg-out-dot")}
              />
              {open ? "Abierta" : "Cerrada"}
            </span>
          )}
        </div>
        {(hours || phone) && (
          <ul className="flex flex-wrap gap-x-space-md gap-y-1 font-label-sm text-label-sm text-on-surface-variant">
            {hours && (
              <li className="flex items-center gap-1">
                <Icon name="schedule" size={16} />
                {hours}
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-1">
                <Icon name="call" size={16} />
                {phone}
              </li>
            )}
          </ul>
        )}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-surface-variant">{matchLabel}</span>
            <span className="tabular font-numeric-data text-numeric-data font-bold text-primary">
              {pct}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={matchLabel}
            className="h-2 w-full overflow-hidden rounded-full bg-surface-container"
          >
            <div
              className={cn("h-full rounded-full transition-all duration-300", FILL[st])}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-space-xs">
          <button
            type="button"
            onClick={onDirections}
            className={cn(
              act,
              "bg-gradient-clinical text-on-secondary shadow-card-sm hover:shadow-card",
            )}
          >
            <Icon name="directions" size={18} />
            Cómo llegar
          </button>
          {phone && (
            <button
              type="button"
              onClick={onCall}
              aria-label={`Llamar a ${name}`}
              className={cn(
                act,
                "flex-none w-11 bg-surface-container text-primary hover:bg-surface-container-high",
              )}
            >
              <Icon name="call" size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={onViewStock}
            className={cn(act, "bg-surface-container text-primary hover:bg-surface-container-high")}
          >
            <Icon name="inventory_2" size={18} />
            Ver stock
          </button>
        </div>
      </div>
    </article>
  );
}
