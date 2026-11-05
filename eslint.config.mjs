import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Apaga las reglas de estilo que chocan con Prettier (el formato lo decide Prettier).
  prettier,
  {
    settings: {
      // La config está en la raíz, no dentro de cada app: se le indica dónde están.
      next: { rootDir: ["apps/web/", "apps/panel/"] },
      // En un monorepo la detección automática no encuentra React desde la raíz.
      react: { version: "19" },
    },
  },
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "**/next-env.d.ts",
    "apps/api/**",
  ]),
]);
