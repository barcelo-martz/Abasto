"use client";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useEffect, useState, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../button/icon-button";
import { Icon } from "../icon";
import { overlayBackdropClass } from "./shared";

export interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt: string;
  /** Título accesible (por defecto alt). */
  title?: string;
  /** Sello criptográfico opcional ("Sello LIMS válido"). */
  seal?: string;
  /** Nombre de archivo al descargar. Si se omite no se muestra el botón. */
  downloadName?: string;
  minZoom?: number;
  maxZoom?: number;
}

const STEP = 0.25;

/** Visor de recetas a pantalla completa con zoom, rotación y descarga. */
export function Lightbox({
  open,
  onOpenChange,
  src,
  alt,
  title,
  seal,
  downloadName,
  minZoom = 0.5,
  maxZoom = 4,
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    if (!open) {
      // Reset transient viewer state when the dialog closes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setZoom(1);
      setRot(0);
    }
  }, [open]);

  const clamp = (z: number) => Math.min(maxZoom, Math.max(minZoom, z));
  const reset = () => {
    setZoom(1);
    setRot(0);
  };

  function onKey(e: KeyboardEvent) {
    if (e.key === "+" || e.key === "=") setZoom((z) => clamp(z + STEP));
    else if (e.key === "-") setZoom((z) => clamp(z - STEP));
    else if (e.key.toLowerCase() === "r") setRot((r) => r + 90);
    else if (e.key === "0") reset();
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn(overlayBackdropClass, "bg-primary/90")} />
        <Dialog.Content
          onKeyDown={onKey}
          aria-describedby={undefined}
          className="fixed inset-0 z-[60] flex flex-col outline-none animate-fade-in"
        >
          <VisuallyHidden.Root>
            <Dialog.Title>{title ?? alt}</Dialog.Title>
          </VisuallyHidden.Root>

          <div className="flex shrink-0 items-start justify-between gap-space-sm p-space-md pt-safe">
            {seal ? (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-label-sm text-label-sm text-on-secondary shadow-card">
                <Icon name="lock" size={14} filled />
                {seal}
              </span>
            ) : (
              <span />
            )}
            <Dialog.Close asChild>
              <IconButton icon="close" variant="soft" aria-label="Cerrar visor" />
            </Dialog.Close>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-space-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-h-full max-w-full select-none rounded-xl object-contain shadow-float transition-transform duration-200"
              style={{ transform: `scale(${zoom}) rotate(${rot}deg)` }}
            />
          </div>

          <div className="flex shrink-0 justify-center p-space-md pb-safe">
            <div
              role="toolbar"
              aria-label="Controles del visor"
              className="flex items-center gap-1 rounded-xl bg-surface-container-lowest/90 px-2 py-1 text-primary shadow-float backdrop-blur-md"
            >
              <IconButton
                icon="zoom_out"
                variant="ghost"
                size="sm"
                aria-label="Alejar"
                disabled={zoom <= minZoom}
                onClick={() => setZoom((z) => clamp(z - STEP))}
              />
              <span
                aria-live="polite"
                className="tabular w-12 text-center font-numeric-data text-numeric-data"
              >
                {Math.round(zoom * 100)}%
              </span>
              <IconButton
                icon="zoom_in"
                variant="ghost"
                size="sm"
                aria-label="Acercar"
                disabled={zoom >= maxZoom}
                onClick={() => setZoom((z) => clamp(z + STEP))}
              />
              <IconButton
                icon="rotate_right"
                variant="ghost"
                size="sm"
                aria-label="Rotar 90 grados"
                onClick={() => setRot((r) => r + 90)}
              />
              <IconButton
                icon="restart_alt"
                variant="ghost"
                size="sm"
                aria-label="Restablecer vista"
                onClick={reset}
              />
              {downloadName && (
                <>
                  <span aria-hidden className="mx-1 h-4 w-px bg-outline-variant" />
                  <a
                    href={src}
                    download={downloadName}
                    aria-label="Descargar"
                    title="Descargar"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                  >
                    <Icon name="download" size={18} />
                  </a>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
