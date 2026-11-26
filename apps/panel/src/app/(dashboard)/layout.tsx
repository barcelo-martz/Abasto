"use client";

import { AREA_POR_ROL, MENU_POR_ROL } from "@/config/navigation";
import { RUTAS } from "@/config/routes";
import { limpiarSesion, obtenerSesion } from "@/features/auth/session";
import { api } from "@/lib/api";
import {
  AppShell,
  Sidebar,
  Topbar,
  UserMenu,
  sidebarPresets,
  type SidebarPresetKey,
} from "@abasto/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sesion = obtenerSesion();
    if (!sesion) {
      if (pathname !== RUTAS.login) router.replace(RUTAS.login);
      return;
    }
    if (sesion.usuario.rol === "CIUDADANO") {
      limpiarSesion();
      router.replace(RUTAS.login);
      return;
    }

    const area = AREA_POR_ROL[sesion.usuario.rol];
    if (area && pathname === "/") {
      router.replace(area);
      return;
    }
    if (area && pathname !== area && pathname !== "/" && pathname !== RUTAS.perfil) {
      router.replace(area);
    }
  }, [pathname, router]);

  const sesion = obtenerSesion();
  if (!sesion) return null;
  if (sesion.usuario.rol === "CIUDADANO") return null;

  const area = AREA_POR_ROL[sesion.usuario.rol];
  if (area && pathname !== area && pathname !== RUTAS.perfil) return null;

  const menu = MENU_POR_ROL[sesion.usuario.rol] ?? [];
  const presetKey: SidebarPresetKey =
    sesion.usuario.rol === "PERSONAL_FARMACIA"
      ? "pharmacy"
      : sesion.usuario.rol === "PERSONAL_ALMACEN"
        ? "warehouse"
        : sesion.usuario.rol === "SUPERVISOR_MUNICIPAL"
          ? "supervisor"
          : "admin";
  const preset = sidebarPresets[presetKey];
  const refreshToken = sesion.refreshToken;

  async function cerrarSesion() {
    try {
      await api.auth.logout({ refreshToken });
    } catch {
      // Permitir cerrar localmente aunque la API no esté disponible.
    }
    limpiarSesion();
    router.replace(RUTAS.login);
    router.refresh();
  }

  return (
    <AppShell
      sidebar={
        <Sidebar
          sections={[
            {
              title: "Gestión",
              items: menu.map((item) => ({
                label: item.texto,
                href: item.href,
                icon: item.icon,
                active: pathname === item.href,
              })),
            },
          ]}
          context={preset.context}
          linkComponent={Link}
          user={{
            name: `${sesion.usuario.nombres} ${sesion.usuario.apellidos}`.trim(),
            role: sesion.usuario.rol,
          }}
        />
      }
      topbar={(openMenu) => (
        <Topbar
          context={
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="font-headline-sm text-[14px] text-primary">
                  Gestión institucional
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  {preset.context.label}
                </span>
              </div>
            </div>
          }
          onMenuClick={openMenu}
          actions={
            <UserMenu
              name={`${sesion.usuario.nombres} ${sesion.usuario.apellidos}`.trim()}
              subtitle={sesion.usuario.rol}
              verified
              linkComponent={Link}
              onSignOut={cerrarSesion}
              actions={[{ label: "Mi perfil", icon: "person", href: RUTAS.perfil }]}
            />
          }
        />
      )}
    >
      {children}
    </AppShell>
  );
}
