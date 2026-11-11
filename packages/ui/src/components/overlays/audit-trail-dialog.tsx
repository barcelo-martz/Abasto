"use client";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "../button/button";
import { Icon } from "../icon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "./modal";

export interface AuditStep {
  id?: string;
  icon: string;
  title: ReactNode;
  /** Fecha/hora o estado ("12 Oct 2024 • 08:30", "Activo en almacén"). */
  date?: ReactNode;
  description?: ReactNode;
  /** Línea de dato extra (p. ej. sensor IoT). */
  meta?: ReactNode;
  /** done = completado (teal) · current = paso actual (navy). */
  status?: "done" | "current";
}

export interface AuditTrailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Texto bajo el título (hash). */
  hash?: string;
  /** Badge a la derecha ("Inmutable"). */
  badge?: string;
  steps: AuditStep[];
  /** Pie izquierdo ("Auditoría CECMED ID #9982-A"). */
  footnote?: ReactNode;
  verifyLabel?: string;
  onVerify?: () => void;
}

export function AuditTrailDialog({
  open,
  onOpenChange,
  title,
  hash,
  badge,
  steps,
  footnote,
  verifyLabel = "Validar firma digital",
  onVerify,
}: AuditTrailDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader
          icon="fingerprint"
          actions={
            badge ? (
              <span className="rounded-full bg-secondary-container px-3 py-1 font-label-sm text-label-sm text-on-secondary-container">
                {badge}
              </span>
            ) : undefined
          }
        >
          <ModalTitle>{title}</ModalTitle>
          {hash ? (
            <ModalDescription className="tabular font-numeric-data text-numeric-data text-secondary">
              {hash}
            </ModalDescription>
          ) : (
            <ModalDescription className="sr-only">Historial de trazabilidad</ModalDescription>
          )}
        </ModalHeader>

        <ModalBody>
          <ol className="relative flex flex-col gap-space-sm py-space-xs">
            <span
              aria-hidden
              className="absolute bottom-4 left-4 top-4 w-0.5 -translate-x-1/2 bg-surface-container-highest"
            />
            {steps.map((s, i) => {
              const current = s.status === "current";
              return (
                <li
                  key={s.id ?? i}
                  aria-current={current ? "step" : undefined}
                  className="relative z-10 flex items-start gap-4"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-card-sm",
                      current ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary",
                    )}
                  >
                    <Icon name={s.icon} size={16} />
                  </span>
                  <div
                    className={cn(
                      "min-w-0 flex-1 rounded-xl p-3",
                      current ? "bg-surface-container-high/60" : "bg-surface-container-low",
                    )}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-space-sm">
                      <span className="font-label-md text-label-md text-primary">{s.title}</span>
                      {s.date && (
                        <span
                          className={cn(
                            "tabular font-numeric-data text-numeric-data",
                            current ? "font-bold text-secondary" : "text-outline",
                          )}
                        >
                          {s.date}
                        </span>
                      )}
                    </div>
                    {s.description && (
                      <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                        {s.description}
                      </p>
                    )}
                    {s.meta && (
                      <p className="mt-1 flex items-center gap-2 font-numeric-data text-numeric-data font-bold text-secondary">
                        <span aria-hidden className="h-2 w-2 rounded-full bg-secondary" />
                        {s.meta}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </ModalBody>

        <ModalFooter className="justify-between">
          <span className="font-label-sm text-label-sm text-outline">{footnote}</span>
          {onVerify && (
            <Button variant="tonal" leadingIcon="verified" onClick={onVerify}>
              {verifyLabel}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
