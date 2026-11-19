import type { ImgHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type LogoVariant = "color" | "inverse" | "glass";

export interface IsotypeProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height"
> {
  variant?: LogoVariant;
  size?: number;
}

export function Isotype({ size = 40, className, ...props }: IsotypeProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/brand/isotipo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      {...props}
    />
  );
}
