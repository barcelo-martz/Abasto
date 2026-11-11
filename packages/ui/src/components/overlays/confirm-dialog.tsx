"use client";
import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button/button";
import { Icon } from "../icon";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "./modal";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  /** Texto que hay que escribir para habilitar la acción. Por defecto "ELIMINAR" si tone="danger"; sin texto en "primary". */
  confirmText?: string;
  /** Etiqueta del botón de confirmación. */
  confirmLabel: string;
  cancelLabel?: string;
  /** Puede ser asíncrona: el botón muestra carga y el diálogo se cierra al terminar. */
  onConfirm: () => void | Promise<void>;
  tone?: "danger" | "primary";
  /** Etiqueta pequeña sobre el título ("Acción irreversible"). */
  eyebrow?: string;
  /** Icono Material Symbol (por defecto según tone). */
  icon?: string;
}

export function ConfirmDialog({ open, onOpenChange, ...rest }: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ConfirmBody onOpenChange={onOpenChange} {...rest} />
      </ModalContent>
    </Modal>
  );
}

function ConfirmBody({
  onOpenChange,
  title,
  description,
  confirmText,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  tone = "danger",
  eyebrow,
  icon,
}: Omit<ConfirmDialogProps, "open">) {
  const danger = tone === "danger";
  const required = confirmText ?? (danger ? "ELIMINAR" : undefined);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const ok = !required || typed.trim() === required;

  async function run() {
    if (!ok || busy) return;
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-space-md p-space-xl"
      onSubmit={(e) => {
        e.preventDefault();
        void run();
      }}
    >
      <div className="flex items-start gap-space-md">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            danger ? "bg-error-container text-on-error-container" : "bg-primary-fixed text-primary",
          )}
        >
          <Icon name={icon ?? (danger ? "delete_forever" : "help")} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <span
              className={cn(
                "mb-1 inline-block rounded-full px-2.5 py-0.5 font-label-sm text-label-sm",
                danger ? "bg-error-container text-error" : "bg-primary-fixed text-primary",
              )}
            >
              {eyebrow}
            </span>
          )}
          <ModalTitle>{title}</ModalTitle>
        </div>
      </div>

      <ModalDescription className="mt-0 font-body-md text-body-md">{description}</ModalDescription>

      {required && (
        <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-space-sm">
          <label
            htmlFor="abasto-confirm-input"
            className="flex items-center justify-between gap-2 font-label-sm text-label-sm text-on-surface-variant"
          >
            <span>
              Para autorizar, escribe{" "}
              <strong className={cn("font-bold", danger ? "text-error" : "text-primary")}>
                {required}
              </strong>{" "}
              en el recuadro:
            </span>
            <span className="text-outline">Requerido</span>
          </label>
          <input
            id="abasto-confirm-input"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={required}
            className={cn(
              "h-11 w-full rounded-lg bg-surface-container-lowest px-3 font-numeric-data text-numeric-data text-on-surface shadow-inner",
              "placeholder:text-outline-variant focus:outline-none focus:ring-2",
              danger ? "focus:ring-error" : "focus:ring-secondary",
            )}
          />
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch justify-end gap-space-sm pt-space-xs sm:flex-row sm:items-center">
        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant={danger ? "danger" : "primary"}
          leadingIcon={danger ? "warning" : "check"}
          disabled={!ok}
          loading={busy}
        >
          {confirmLabel}
        </Button>
      </div>
    </form>
  );
}
