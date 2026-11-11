"use client";
import type { ReactNode } from "react";
import { Button } from "../button/button";
import { Icon } from "../icon";
import { Modal, ModalContent, ModalDescription, ModalTitle } from "./modal";

export interface SuccessDialogAction {
  label: string;
  icon?: string;
  onClick?: () => void;
}

export interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Etiqueta verde sobre el título ("Operación certificada"). */
  badge?: string;
  /** Identificador destacado del comprobante. */
  receiptId?: { label: string; value: string };
  /** Resumen clave/valor del comprobante. */
  summary?: { label: string; value: ReactNode }[];
  primaryAction?: SuccessDialogAction;
  secondaryAction?: SuccessDialogAction;
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  badge,
  receiptId,
  summary,
  primaryAction,
  secondaryAction,
}: SuccessDialogProps) {
  const act = (a?: SuccessDialogAction) => () => {
    a?.onClick?.();
    onOpenChange(false);
  };
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <div
          aria-hidden
          className="h-2.5 w-full shrink-0 bg-linear-to-r from-secondary via-secondary-fixed to-primary"
        />
        <div className="flex flex-col items-center gap-space-md overflow-y-auto p-space-xl text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-secondary/15"
            />
            <span className="relative z-10 flex h-20 w-20 animate-check-pop items-center justify-center rounded-full bg-secondary-container text-secondary shadow-inner">
              <Icon name="check_circle" size={44} filled />
            </span>
            <span
              aria-hidden
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-secondary-fixed"
            />
            <span
              aria-hidden
              className="absolute -bottom-1 -left-2 h-2.5 w-2.5 rounded-full bg-primary-fixed-dim"
            />
            <span
              aria-hidden
              className="absolute -left-3 top-1/2 h-2 w-2 rounded-full bg-secondary"
            />
          </div>

          <div>
            {badge && (
              <span className="mb-2 inline-block rounded-full bg-secondary-container px-3 py-1 font-label-sm text-label-sm text-on-secondary-container">
                {badge}
              </span>
            )}
            <ModalTitle className="font-headline-md text-headline-md">{title}</ModalTitle>
            {description && (
              <ModalDescription className="mt-1 font-body-md text-body-md">
                {description}
              </ModalDescription>
            )}
          </div>

          {(receiptId || (summary && summary.length > 0)) && (
            <dl className="flex w-full flex-col gap-2 rounded-2xl bg-surface-container-low p-space-md text-left">
              {receiptId && (
                <div className="flex items-center justify-between gap-space-sm pb-1">
                  <dt className="font-label-sm text-label-sm text-outline">{receiptId.label}</dt>
                  <dd className="tabular font-numeric-data text-numeric-data font-bold text-primary">
                    {receiptId.value}
                  </dd>
                </div>
              )}
              {summary?.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-space-md font-body-sm text-body-sm"
                >
                  <dt className="shrink-0 text-on-surface-variant">{row.label}</dt>
                  <dd className="text-right font-semibold text-primary">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex w-full flex-col items-stretch justify-center gap-space-sm pt-space-xs sm:flex-row sm:items-center">
            {primaryAction && (
              <Button
                variant="primary"
                leadingIcon={primaryAction.icon}
                onClick={act(primaryAction)}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="ghost" onClick={act(secondaryAction)}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
