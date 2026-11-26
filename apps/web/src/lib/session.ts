"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface SesionUsuario {
  id: string;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: string;
  provinciaId?: string | null;
  municipioId?: string | null;
  farmaciaId?: string | null;
  almacenId?: string | null;
}

export interface SesionGuardada {
  accessToken: string;
  refreshToken: string;
  usuario: SesionUsuario;
}

const STORAGE_KEYS = {
  accessToken: "abasto.accessToken",
  refreshToken: "abasto.refreshToken",
  usuario: "abasto.usuario",
} as const;

export const AUTH_CHANGE_EVENT = "abasto:auth-change";

export function obtenerSesion(): SesionGuardada | null {
  if (typeof window === "undefined") return null;

  const storage = localStorage.getItem(STORAGE_KEYS.accessToken) ? localStorage : sessionStorage;
  const accessToken = storage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = storage.getItem(STORAGE_KEYS.refreshToken);
  const usuarioJson = storage.getItem(STORAGE_KEYS.usuario);

  if (!accessToken || !refreshToken || !usuarioJson) return null;

  try {
    return {
      accessToken,
      refreshToken,
      usuario: JSON.parse(usuarioJson) as SesionUsuario,
    };
  } catch {
    limpiarSesion();
    return null;
  }
}

export function limpiarSesion() {
  if (typeof window === "undefined") return;
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of Object.values(STORAGE_KEYS)) storage.removeItem(key);
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function emitirCambioSesion() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

function obtenerSnapshotSesion(): string | null {
  if (typeof window === "undefined") return null;

  const storage = localStorage.getItem(STORAGE_KEYS.accessToken) ? localStorage : sessionStorage;
  const accessToken = storage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = storage.getItem(STORAGE_KEYS.refreshToken);
  const usuarioJson = storage.getItem(STORAGE_KEYS.usuario);

  if (!accessToken || !refreshToken || !usuarioJson) return null;
  return JSON.stringify([accessToken, refreshToken, usuarioJson]);
}

export function useSesion() {
  const snapshot = useSyncExternalStore(
    (callback) => {
      window.addEventListener(AUTH_CHANGE_EVENT, callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener(AUTH_CHANGE_EVENT, callback);
        window.removeEventListener("storage", callback);
      };
    },
    obtenerSnapshotSesion,
    () => null,
  );

  return useMemo(() => {
    if (!snapshot) return null;
    try {
      const [accessToken, refreshToken, usuarioJson] = JSON.parse(snapshot) as [
        string,
        string,
        string,
      ];
      return { accessToken, refreshToken, usuario: JSON.parse(usuarioJson) as SesionUsuario };
    } catch {
      return null;
    }
  }, [snapshot]);
}
