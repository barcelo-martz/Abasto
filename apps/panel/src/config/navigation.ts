import { RolUsuario } from "@abasto/contracts";

export const AREA_POR_ROL: Partial<Record<RolUsuario, string>> = {
  PERSONAL_FARMACIA: "/farmacia",
  PERSONAL_ALMACEN: "/almacen",
  SUPERVISOR_MUNICIPAL: "/supervisor",
  ADMINISTRADOR: "/admin",
};

export const MENU_POR_ROL: Partial<
  Record<RolUsuario, { href: string; texto: string; icon: string }[]>
> = {
  PERSONAL_FARMACIA: [{ href: "/farmacia", texto: "Resumen", icon: "local_pharmacy" }],
  PERSONAL_ALMACEN: [{ href: "/almacen", texto: "Resumen", icon: "warehouse" }],
  SUPERVISOR_MUNICIPAL: [{ href: "/supervisor", texto: "Tablero", icon: "monitoring" }],
  ADMINISTRADOR: [
    { href: "/admin", texto: "Dashboard General", icon: "dashboard" },
    { href: "/admin/usuarios", texto: "Gestion de Usuarios", icon: "manage_accounts" },
    { href: "/admin/medicamentos", texto: "Catalogo de Medicamentos", icon: "pill" },
    { href: "/admin/farmacias", texto: "Red de Farmacias", icon: "local_pharmacy" },
    { href: "/admin/parametros", texto: "Parametros Normativos", icon: "settings" },
    { href: "/admin/alertas", texto: "Centro de Alertas", icon: "notifications" },
    { href: "/admin/auditoria-seguridad", texto: "Auditoria y Seguridad", icon: "security" },
    { href: "/admin/configuracion", texto: "Configuración del Sistema", icon: "settings" },
  ],
};
