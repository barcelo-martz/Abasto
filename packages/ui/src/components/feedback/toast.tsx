"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { TONE_ICON, toneIconColor, type FeedbackTone } from "./alert";

export interface ToastOptions {
  tone?: FeedbackTone;
  title: ReactNode;
  description?: ReactNode;
  /** ms; 0 = no se cierra solo. Por defecto 5000. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}
interface ToastItem extends ToastOptions {
  id: number;
}
interface ToastApi {
  toast: (o: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return c;
}

const barColor: Record<FeedbackTone, string> = {
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
  info: "bg-primary-container",
};
const accent: Record<FeedbackTone, string> = {
  success: "before:bg-success",
  error: "before:bg-error",
  warning: "before:bg-warning",
  info: "before:bg-primary-container",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const toast = useCallback((o: ToastOptions) => {
    const id = nextId.current++;
    setItems((l) => [...l, { ...o, id }]);
    return id;
  }, []);
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* Móvil: superior ancho completo · Escritorio: esquina superior derecha */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex flex-col gap-space-xs p-space-sm pt-safe sm:inset-x-auto sm:right-0 sm:w-[400px] sm:p-space-md"
      >
        {items.map((t) => (
          <ToastView key={t.id} item={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const tone = item.tone ?? "info";
  const duration = item.duration ?? 5000;
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!duration) return;
    const raf = requestAnimationFrame(() => setRun(true));
    const t = setTimeout(onClose, duration);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [duration, onClose]);

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto relative animate-toast-in overflow-hidden rounded-xl bg-surface-container-lowest shadow-overlay",
        "before:absolute before:inset-y-0 before:left-0 before:w-1.5",
        accent[tone],
      )}
    >
      <div className="flex items-start gap-space-sm py-space-sm pl-space-md pr-space-xs">
        <Icon
          name={TONE_ICON[tone]}
          size={22}
          filled
          className={cn("mt-0.5", toneIconColor[tone])}
        />
        <div className="min-w-0 flex-1">
          <p className="font-headline-sm text-headline-sm text-on-surface">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
              {item.description}
            </p>
          )}
          {item.action && (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick();
                onClose();
              }}
              className="mt-1.5 cursor-pointer font-label-md text-label-md text-secondary hover:underline"
            >
              {item.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Cerrar notificación"
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-outline hover:bg-surface-container hover:text-primary"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      {duration > 0 && (
        <div className="h-1 w-full bg-surface-container">
          <div
            className={cn("h-full ease-linear", barColor[tone])}
            style={{
              width: run ? "0%" : "100%",
              transition: run ? `width ${duration}ms linear` : "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
