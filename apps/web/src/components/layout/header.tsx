"use client";
import { RUTAS } from "@/config/routes";
import { api } from "@/lib/api";
import { limpiarSesion, useSesion } from "@/lib/session";
import { Button, Icon, NotificationsMenu, PortalHeader, UserMenu } from "@abasto/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const sesion = useSesion();
  const enlaces = [
    { href: RUTAS.buscar, label: "Medicamentos" },
    { href: RUTAS.farmacias, label: "Farmacias" },
    { href: RUTAS.guia, label: "Guía de medicamentos" },
    { href: RUTAS.receta, label: "Leer receta" },
  ].map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(`${item.href}/`),
  }));

  async function cerrarSesion() {
    if (sesion) {
      try {
        await api.auth.logout({ refreshToken: sesion.refreshToken });
      } catch {
        // Si ocurre un error al cerrar sesión, simplemente limpiamos la sesión localmente
      }
    }
    limpiarSesion();
    router.push(RUTAS.login);
    router.refresh();
  }

  return (
    <>
      <PortalHeader
        variant="scrolled"
        items={enlaces}
        logoHref={RUTAS.inicio}
        linkComponent={Link}
        onSearchClick={() => router.push(RUTAS.buscar)}
        onSearchSubmit={(query) => {
          const params = new URLSearchParams({ q: query });
          router.push(`${RUTAS.buscar}?${params.toString()}`);
        }}
        account={(tone) => (
          <div className="flex items-center gap-1">
            {sesion ? (
              <UserMenu
                name={`${sesion.usuario.nombres} ${sesion.usuario.apellidos}`.trim()}
                subtitle={sesion.usuario.rol}
                verified
                tone={tone}
                linkComponent={Link}
                onSignOut={cerrarSesion}
                actions={[
                  { label: "Mi cuenta", icon: "person", href: RUTAS.cuenta },
                  { label: "Mis recetas", icon: "receipt_long", href: RUTAS.receta },
                  { label: "Mis recorridos", icon: "route", href: RUTAS.recorrido },
                  { label: "Favoritos", icon: "route", href: RUTAS.favoritos },
                ]}
                trigger={
                  <span
                    className={
                      tone === "dark"
                        ? "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-on-primary md:w-auto md:px-3"
                        : "flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-primary md:w-auto md:px-3"
                    }
                  >
                    <Icon name="account_circle" size={22} />
                    <span className="hidden max-w-28 truncate font-label-md text-label-md md:ml-2 md:inline">
                      Mi cuenta
                    </span>
                  </span>
                }
              />
            ) : (
              <>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 px-0 md:hidden bg-primary-container/10 rounded-2xl"
                >
                  <Link href={RUTAS.login} aria-label="Iniciar sesión">
                    <Icon name="person" size={20} />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="hidden md:inline-flex">
                  <Link href={RUTAS.login}>Iniciar sesión</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant={tone === "dark" ? "secondary" : "primary"}
                  className="hidden sm:inline-flex"
                >
                  <Link href={RUTAS.registro}>Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>
        )}
        notifications={(tone) => <NotificationsMenu items={[]} unreadCount={0} tone={tone} />}
      />
    </>
  );
}
