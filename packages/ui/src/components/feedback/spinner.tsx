import { cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

const sizes = { sm: 16, md: 24, lg: 40 } as const;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "circular" | "dual-ring" | "dots";
  size?: keyof typeof sizes;
  /** Texto accesible. */
  label?: string;
}

const tone = cva("", { variants: { v: { circular: "text-secondary" } } });

export function Spinner({
  variant = "circular",
  size = "md",
  label = "Cargando",
  className,
  ...props
}: SpinnerProps) {
  const px = sizes[size];
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center text-secondary", className)}
      {...props}
    >
      {variant === "circular" && (
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          className={cn("animate-spin", tone({ v: "circular" }))}
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".2"
            strokeWidth="3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {variant === "dual-ring" && (
        <span className="relative inline-block" style={{ width: px, height: px }} aria-hidden>
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary-container border-t-transparent" />
          <span
            className="absolute inset-[22%] animate-spin rounded-full border-[3px] border-secondary border-b-transparent"
            style={{ animationDirection: "reverse", animationDuration: "0.9s" }}
          />
        </span>
      )}
      {variant === "dots" && (
        <span className="inline-flex items-center gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-bounce rounded-full bg-secondary"
              style={{ width: px / 3, height: px / 3, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
