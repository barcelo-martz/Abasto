"use client";
import { useState, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { fieldShell } from "./input";
import { useFieldContext } from "./field";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Añadir etiqueta…",
  max,
  disabled,
  id,
  className,
}: TagInputProps) {
  const f = useFieldContext();
  const [draft, setDraft] = useState("");
  const full = max != null && value.length >= max;
  const add = () => {
    const t = draft.trim();
    if (!t || full || value.some((v) => v.toLowerCase() === t.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
  };
  return (
    <div
      className={cn(
        fieldShell({
          state: f?.invalid ? "error" : "default",
          disabled: !!(disabled ?? f?.disabled),
        }),
        "flex-wrap gap-2 p-2",
        className,
      )}
    >
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex h-8 items-center gap-1 rounded-full bg-secondary-container pl-3 pr-1 font-label-sm text-label-sm text-on-secondary-container"
        >
          {t}
          <button
            type="button"
            aria-label={`Quitar ${t}`}
            onClick={() => onChange(value.filter((v) => v !== t))}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-secondary/15"
          >
            <Icon name="close" size={14} />
          </button>
        </span>
      ))}
      <input
        id={id ?? f?.id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={key}
        onBlur={add}
        disabled={disabled ?? f?.disabled ?? full}
        placeholder={full ? "Máximo alcanzado" : placeholder}
        aria-describedby={f?.describedBy}
        className="h-8 min-w-[8rem] flex-1 border-0 bg-transparent px-1 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
      />
    </div>
  );
}
