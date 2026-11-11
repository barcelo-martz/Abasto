# @abasto/ui

Sistema de diseño de Abasto, compartido por `portal` y `panel`.

## Tokens

`src/styles/tokens.css` define los tokens con `@theme` de Tailwind v4. Cada app lo importa en su `globals.css`:

    @import "tailwindcss";
    @import "@abasto/ui/tokens.css";

Los tokens generan las clases: `bg-primary`, `text-on-surface-variant`, `p-space-md`, `gap-gutter`, `shadow-elevation-low`, `max-w-page`.

## Tipografía

Se combinan la familia y la escala: `font-display text-headline-md` para títulos (Plus Jakarta Sans) y `text-body-md` para el cuerpo (Inter). Los números de datos llevan `text-numeric-data tabular-nums`.

Los componentes `Icon` usan Material Symbols Outlined. Cada aplicación debe cargar la fuente en su `layout.tsx` raíz:

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200" />

## Colores

Los roles siguen Material Design 3. Para estados de disponibilidad: `status-available`, `status-low`, `error` y `status-transit`.
