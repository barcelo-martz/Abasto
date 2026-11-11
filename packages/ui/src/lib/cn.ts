import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom font-size tokens (text-headline-sm, ...)
// so they don't get dropped when merged with colour utilities (text-primary).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-hero",
            "display-hero-mobile",
            "headline-xl",
            "headline-xl-mobile",
            "headline-lg",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label-md",
            "label-sm",
            "numeric-data",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
