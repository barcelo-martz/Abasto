"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export interface InlineEditCellProps {
  value: number;
  onSave: (value: number) => void | Promise<void>;
  min?: number;
  max?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Edición directa de mostrador: Enter guarda, Esc cancela. */
export function InlineEditCell({
  value,
  onSave,
  min = 0,
  max,
  unit,
  disabled,
  className,
  ...rest
}: InlineEditCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.select();
  }, [editing]);

  const parsed = Number(draft);
  const invalid =
    draft.trim() === "" || Number.isNaN(parsed) || parsed < min || (max != null && parsed > max);

  async function commit() {
    if (invalid) return;
    setSaving(true);
    try {
      await onSave(parsed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }
  function cancel() {
    setDraft(String(value));
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        aria-label={rest["aria-label"] ?? "Editar existencia"}
        className={cn(
          "group inline-flex h-9 items-center gap-1.5 rounded-lg px-2 tabular font-numeric-data text-body-md font-bold text-primary transition-colors hover:bg-surface-container disabled:opacity-50",
          className,
        )}
      >
        {value}
        {unit && <span className="text-label-sm font-medium text-on-surface-variant">{unit}</span>}
        <Icon
          name="edit"
          size={14}
          className="text-outline opacity-0 transition-opacity group-hover:opacity-100"
        />
      </button>
    );
  }

  return (
    <div className={cn("relative flex max-w-[140px] items-center gap-1", className)}>
      <input
        ref={ref}
        inputMode="numeric"
        value={draft}
        aria-invalid={invalid || undefined}
        aria-label={rest["aria-label"] ?? "Existencia física"}
        title="Enter para guardar · Esc para cancelar"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void commit();
          if (e.key === "Escape") cancel();
        }}
        className={cn(
          "h-9 w-full rounded-lg bg-surface-container-lowest pl-3 pr-2 tabular font-numeric-data text-body-md font-bold text-primary shadow-[0_1px_3px_rgba(14,35,64,0.08)] focus:outline-none focus:ring-2",
          invalid ? "ring-2 ring-error" : "focus:ring-secondary",
        )}
      />
      <button
        type="button"
        aria-label="Guardar"
        disabled={invalid || saving}
        onClick={() => void commit()}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-secondary-container/50 disabled:opacity-40"
      >
        <Icon
          name={saving ? "progress_activity" : "check"}
          size={18}
          className={saving ? "animate-spin" : undefined}
        />
      </button>
      <button
        type="button"
        aria-label="Cancelar"
        onClick={cancel}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
      >
        <Icon name="close" size={18} />
      </button>
    </div>
  );
}
