import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadFileRowProps {
  name: string;
  status: UploadStatus;
  /** Tamaño ya formateado ("3.4 MB"). */
  size?: string;
  /** Detalle bajo el nombre (nodo destino, cuño, motivo del error…). */
  detail?: ReactNode;
  /** 0-100, solo en "uploading". */
  progress?: number;
  /** Velocidad ya formateada ("180 KB/s"). */
  speed?: string;
  /** Tiempo restante ya formateado ("~4 seg restantes"). */
  remaining?: string;
  /** En "uploading": la carga está en pausa (el botón pasa a "reanudar"). */
  paused?: boolean;
  /** Icono del tipo de archivo (por defecto según extensión). */
  icon?: string;
  /** En "done": muestra el badge. */
  ocrValidated?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
  className?: string;
}

function iconFor(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "picture_as_pdf";
  if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  return "description";
}

const iconBtn =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary";

export function UploadFileRow({
  name,
  status,
  size,
  detail,
  progress = 0,
  speed,
  remaining,
  paused,
  icon,
  ocrValidated = true,
  onPause,
  onResume,
  onCancel,
  onPreview,
  onDelete,
  onRetry,
  className,
}: UploadFileRowProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const sub = [size, detail].filter(Boolean);

  const tile =
    status === "done"
      ? { icon: "check_circle", cls: "bg-secondary-container text-on-secondary-container" }
      : status === "error"
        ? { icon: "error", cls: "bg-error-container text-error" }
        : { icon: icon ?? iconFor(name), cls: "bg-surface-container-high text-primary" };

  return (
    <div
      data-status={status}
      className={cn(
        "flex flex-col gap-space-xs rounded-xl p-space-md transition-all duration-200 hover:bg-surface-container",
        status === "error" ? "bg-error-container/30" : "bg-surface-container-low",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              tile.cls,
            )}
          >
            <Icon name={tile.icon} size={22} filled={status !== "uploading"} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-space-xs">
              <p className="truncate font-label-md text-label-md text-on-surface" title={name}>
                {name}
              </p>
              {status === "done" && ocrValidated && (
                <span className="flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-label-sm text-on-secondary-container">
                  <Icon name="psychology" size={14} /> Validado por OCR
                </span>
              )}
            </div>
            {sub.length > 0 && (
              <p
                className={cn(
                  "mt-0.5 font-numeric-data text-numeric-data",
                  status === "error" ? "text-error" : "text-on-surface-variant",
                )}
              >
                {sub.map((s, i) => (
                  <span key={i}>
                    {i > 0 && " • "}
                    {s}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-space-xs">
          {status === "uploading" && (
            <>
              {(paused ? onResume : onPause) && (
                <button
                  type="button"
                  title={paused ? "Reanudar carga" : "Pausar carga"}
                  aria-label={paused ? "Reanudar carga" : "Pausar carga"}
                  onClick={paused ? onResume : onPause}
                  className={cn(
                    iconBtn,
                    "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  <Icon name={paused ? "play_arrow" : "pause"} size={18} />
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  title="Cancelar"
                  aria-label="Cancelar carga"
                  onClick={onCancel}
                  className={cn(iconBtn, "text-error hover:bg-error-container/40")}
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </>
          )}
          {status === "done" && (
            <>
              {onPreview && (
                <button
                  type="button"
                  title="Previsualizar documento"
                  aria-label="Previsualizar documento"
                  onClick={onPreview}
                  className={cn(iconBtn, "text-primary hover:bg-surface-container-high")}
                >
                  <Icon name="visibility" size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  title="Eliminar registro"
                  aria-label="Eliminar registro"
                  onClick={onDelete}
                  className={cn(
                    iconBtn,
                    "text-on-surface-variant hover:bg-error-container/40 hover:text-error",
                  )}
                >
                  <Icon name="delete" size={18} />
                </button>
              )}
            </>
          )}
          {status === "error" && (
            <>
              {onRetry && (
                <button
                  type="button"
                  title="Reintentar"
                  aria-label="Reintentar carga"
                  onClick={onRetry}
                  className={cn(iconBtn, "text-primary hover:bg-surface-container-high")}
                >
                  <Icon name="refresh" size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  title="Quitar"
                  aria-label="Quitar archivo"
                  onClick={onDelete}
                  className={cn(iconBtn, "text-error hover:bg-error-container/40")}
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {status === "uploading" && (
        <div className="mt-1 w-full">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`Progreso de ${name}`}
            className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
          >
            <div
              className={cn(
                "h-2 rounded-full bg-secondary transition-all duration-500 ease-out",
                paused && "opacity-50",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-numeric-data text-[12px] text-on-surface-variant">
            <span>{paused ? `${pct}% • En pausa` : `${pct}% completado`}</span>
            {!paused && (speed || remaining) && (
              <span>{[speed, remaining].filter(Boolean).join(" • ")}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
