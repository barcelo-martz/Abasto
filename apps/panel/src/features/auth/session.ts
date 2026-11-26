"use client";

import type { RolUsuario } from "@abasto/contracts";

export interface SesionPanel {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    correo: string;
    nombres: string;
    apellidos: string;
    rol: RolUsuario;
    provinciaId?: string | null;
    municipioId?: string | null;
    farmaciaId?: string | null;
    almacenId?: string | null;
  };
}

const CLAVE = "abasto.panel.sesion";

export function guardarSesion(sesion: SesionPanel, recordar: boolean) {
  const serializada = JSON.stringify(sesion);
  localStorage.removeItem(CLAVE);
  sessionStorage.removeItem(CLAVE);
  (recordar ? localStorage : sessionStorage).setItem(CLAVE, serializada);
}

export function obtenerSesion(): SesionPanel | null {
  if (typeof window === "undefined") return null;
  const serializada = localStorage.getItem(CLAVE) ?? sessionStorage.getItem(CLAVE);
  if (!serializada) return null;
  try {
    return JSON.parse(serializada) as SesionPanel;
  } catch {
    limpiarSesion();
    return null;
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE);
  sessionStorage.removeItem(CLAVE);
}
