"use client";
import {
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";

export type RejectReason = "type" | "size";
export interface RejectedFile {
  file: File;
  reason: RejectReason;
  message: string;
}

export interface FileDropzoneProps {
  /** Mismo formato que <input accept>: ".pdf,image/*,image/png". */
  accept?: string;
  /** Tamaño máximo por archivo, en MB. */
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  onReject?: (rejected: RejectedFile[]) => void;
  title?: ReactNode;
  description?: ReactNode;
  browseLabel?: string;
  /** Texto de formatos soportados al pie. Si se omite se genera de accept/maxSize. */
  footnote?: ReactNode;
  /** Acciones extra junto al botón (p. ej. "Activar cámara web"). */
  extraActions?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
      return file.type.toLowerCase() === rule;
    });
}

function describeAccept(accept?: string) {
  if (!accept) return "";
  return accept
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith(".")) return s.slice(1).toUpperCase();
      const [type = s, sub = ""] = s.split("/");
      return (sub === "*" || !sub ? type : sub).toUpperCase();
    })
    .join(", ");
}

export function FileDropzone({
  accept,
  maxSize,
  multiple = true,
  disabled,
  onFiles,
  onReject,
  title = "Arrastra y suelta tu receta médica o documento aquí",
  description = "o utiliza el selector de archivos del sistema",
  browseLabel = "Explorar archivos locales",
  footnote,
  extraActions,
  inputRef,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const localRef = useRef<HTMLInputElement | null>(null);
  const depth = useRef(0);

  useImperativeHandle(inputRef, () => localRef.current!);

  const setRefs = (el: HTMLInputElement | null) => {
    localRef.current = el;
  };

  const process = (list: FileList | File[]) => {
    const files = Array.from(list);
    const ok: File[] = [];
    const bad: RejectedFile[] = [];
    for (const file of multiple ? files : files.slice(0, 1)) {
      if (!matchesAccept(file, accept)) {
        bad.push({ file, reason: "type", message: `"${file.name}": formato no soportado.` });
      } else if (maxSize && file.size > maxSize * 1024 * 1024) {
        bad.push({
          file,
          reason: "size",
          message: `"${file.name}": supera el máximo de ${maxSize} MB.`,
        });
      } else ok.push(file);
    }
    if (ok.length) onFiles?.(ok);
    if (bad.length) onReject?.(bad);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    depth.current = 0;
    setDragging(false);
    if (disabled) return;
    process(e.dataTransfer.files);
  };

  const open = () => !disabled && localRef.current?.click();
  const auto =
    footnote ??
    (accept || maxSize
      ? `Formatos soportados: ${describeAccept(accept) || "cualquiera"}${maxSize ? ` de hasta ${maxSize} MB` : ""}.`
      : null);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current++;
        if (!disabled) setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      }}
      onDrop={onDrop}
      data-state={disabled ? "disabled" : dragging ? "dragover" : "idle"}
      aria-disabled={disabled || undefined}
      className={cn(
        "group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed p-space-2xl text-center transition-all duration-300",
        "border-primary-container/30 bg-surface-container-low/50",
        !disabled && "hover:border-secondary hover:bg-surface-container-low",
        dragging && "border-secondary bg-secondary-container/20",
        disabled && "cursor-not-allowed border-outline-variant bg-surface-container-low opacity-60",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary-container/5 via-secondary/10 to-primary-container/5 opacity-0 transition-opacity duration-500",
          !disabled && "group-hover:opacity-100",
          dragging && "opacity-100",
        )}
      />
      <input
        ref={setRefs}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) process(e.target.files);
          e.target.value = ""; // permite volver a elegir el mismo archivo
        }}
      />
      <div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-primary shadow-raised transition-transform duration-300",
          !disabled && "group-hover:scale-105",
          dragging && "scale-110",
        )}
      >
        <Icon name={dragging ? "download" : "upload_file"} size={32} className="text-secondary" />
        {!disabled && (
          <span aria-hidden className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
          </span>
        )}
      </div>
      <div className="relative mt-space-md flex max-w-md flex-col items-center">
        <p className="font-headline-sm text-headline-sm text-on-surface">
          {dragging ? "Suelta los archivos para subirlos" : title}
        </p>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{description}</p>
        <div className="mt-space-md flex flex-wrap items-center justify-center gap-space-xs">
          <button
            type="button"
            disabled={disabled}
            onClick={open}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-space-md py-space-xs font-label-md text-label-md text-on-primary shadow-card-sm transition-all hover:bg-primary-container hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:cursor-not-allowed"
          >
            <Icon name="folder_open" size={18} />
            {browseLabel}
          </button>
          {extraActions}
        </div>
      </div>
      {auto && (
        <div className="relative mt-space-lg w-full border-t border-surface-container pt-space-md font-label-sm text-label-sm text-on-surface-variant">
          {auto}
        </div>
      )}
    </div>
  );
}
