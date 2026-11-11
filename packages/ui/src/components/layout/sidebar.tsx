"use client";
import { useState, type ElementType, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Icon } from "../icon";
import { Logo } from "../brand/logo";
import { AppLink } from "../navigation/link";

export interface SidebarItem {
  label: string;
  icon: string;
  href?: string;
  active?: boolean;
  /** Contador (string o número). */
  count?: string | number | null;
  /** Contador en tono de alerta (ámbar). */
  isWarning?: boolean;
}
export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  name: string;
  role: string;
  status?: ReactNode;
}

export interface SidebarProps {
  sections: SidebarSection[];
  /** Nodo/unidad activa bajo el logo ("Modo Farmacia Hospitalaria"). */
  context?: { label: string; icon?: string };
  /** Aviso contextual bajo el logo. */
  notice?: ReactNode;
  user?: SidebarUser;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  linkComponent?: ElementType;
  /** Contenido extra al pie (cambio de turno, etc.). */
  footer?: ReactNode;
  className?: string;
}

export function Sidebar({
  sections,
  context,
  notice,
  user,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  linkComponent,
  footer,
  className,
}: SidebarProps) {
  const [inner, setInner] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? inner;
  const toggle = () => {
    const n = !isCollapsed;
    setInner(n);
    onCollapsedChange?.(n);
  };

  return (
    <aside
      aria-label="Navegación institucional"
      className={cn(
        "flex h-full shrink-0 flex-col bg-surface-container-lowest shadow-bar transition-[width] duration-300",
        isCollapsed ? "w-[76px]" : "w-72",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 px-space-md">
        <Logo size={32} withWordmark={!isCollapsed} />
        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-expanded={!isCollapsed}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container lg:flex"
        >
          <Icon
            name={isCollapsed ? "keyboard_double_arrow_right" : "keyboard_double_arrow_left"}
            size={20}
          />
        </button>
      </div>

      {context && !isCollapsed && (
        <div className="mx-space-sm mb-space-xs flex items-center gap-2 rounded-xl bg-secondary-container/40 px-space-sm py-2 text-on-secondary-container">
          <Icon name={context.icon ?? "local_pharmacy"} size={18} className="text-secondary" />
          <span className="truncate font-label-sm text-label-sm">{context.label}</span>
        </div>
      )}
      {notice && !isCollapsed && (
        <div className="mx-space-sm mb-space-xs rounded-xl bg-surface-container-low p-space-sm font-body-sm text-body-sm text-on-surface-variant">
          {notice}
        </div>
      )}

      <nav className="no-scrollbar flex-1 overflow-y-auto px-space-xs py-space-xs">
        {sections.map((s) => (
          <div key={s.title} className="mb-space-md">
            {!isCollapsed && (
              <h2 className="px-space-sm pb-1 font-label-sm text-[11px] font-semibold uppercase tracking-wider text-outline">
                {s.title}
              </h2>
            )}
            <ul className="flex flex-col gap-0.5">
              {s.items.map((it) => (
                <li key={it.label}>
                  <AppLink
                    linkComponent={linkComponent}
                    href={it.href ?? "#"}
                    aria-current={it.active ? "page" : undefined}
                    title={isCollapsed ? it.label : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-space-sm rounded-xl px-space-sm py-2 font-label-md text-label-md transition-colors",
                      it.active
                        ? "bg-secondary-container/50 font-bold text-secondary"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <Icon name={it.icon} size={22} filled={it.active} />
                    {!isCollapsed && <span className="flex-1 truncate">{it.label}</span>}
                    {!isCollapsed && it.count != null && (
                      <span
                        className={cn(
                          "tabular rounded-full px-2 py-0.5 font-numeric-data text-[11px] font-bold",
                          it.isWarning
                            ? "bg-warning-container text-on-warning-container"
                            : "bg-surface-container text-on-surface-variant",
                        )}
                      >
                        {it.count}
                      </span>
                    )}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer}
      {user && (
        <div className="m-space-xs flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="person" size={20} />
          </span>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate font-headline-sm text-[14px] text-primary">{user.name}</p>
              <p className="truncate font-label-sm text-[11px] text-on-surface-variant">
                {user.role}
              </p>
              {user.status}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export type SidebarPresetKey = "pharmacy" | "warehouse" | "supervisor" | "admin";

export interface SidebarPreset {
  context: { label: string; icon: string };
  headerRole: string;
  title: string;
  subtitle: string;
  sections: SidebarSection[];
}

/** Los 4 perfiles institucionales del prototipo de navegación. */
export const sidebarPresets: Record<SidebarPresetKey, SidebarPreset> = {
  pharmacy: {
    context: { label: "Modo Farmacia Hospitalaria", icon: "local_pharmacy" },
    headerRole: "Farmacia Comunitaria / Hospitalaria",
    title: "Control de Dispensación y Stock en Tiempo Real",
    subtitle:
      "Monitoreo activo de recetas validadas por el tarjetón municipal, alertas de reposición y balance de inventario por lotes.",
    sections: [
      {
        title: "Operaciones Diarias",
        items: [
          { label: "Dispensación Mostrador", icon: "point_of_sale", active: true, count: "84" },
          { label: "Recetas Médicas & Tarjetón", icon: "receipt_long" },
          { label: "Validación de Carnet CI", icon: "badge" },
          { label: "Turnos y Cuadrante de Guardia", icon: "calendar_today" },
        ],
      },
      {
        title: "Inventario y Lotes",
        items: [
          { label: "Stock en Vitrina", icon: "inventory_2" },
          { label: "Lotes Próximos a Vencer", icon: "event_busy", count: "14", isWarning: true },
          { label: "Cadena de Frío e Insulinas", icon: "ac_unit" },
          { label: "Solicitud de Reabastecimiento", icon: "local_shipping" },
        ],
      },
      {
        title: "Auditoría de Unidad",
        items: [
          { label: "Libro Oficial de Estupefacientes", icon: "menu_book" },
          { label: "Cierre Diario de Caja y Mermas", icon: "fact_check" },
        ],
      },
    ],
  },
  warehouse: {
    context: { label: "Modo Almacén Mayorista Ensumed", icon: "warehouse" },
    headerRole: "Distribuidora Nacional Ensumed",
    title: "Recepción Masiva y Despacho Interprovincial de Lotes",
    subtitle:
      "Gestión de contenedores farmacéuticos, guías de envío sanitarias y monitoreo de cámaras frigoríficas centrales.",
    sections: [
      {
        title: "Logística Primaria",
        items: [
          { label: "Recepción de Laboratorios", icon: "pallet", active: true, count: "12" },
          { label: "Emisión de Guías de Envío", icon: "local_shipping", count: "48" },
          { label: "Cuarentena de Lotes CECMED", icon: "security", count: "3", isWarning: true },
          { label: "Flota y Rutas Provinciales", icon: "route" },
        ],
      },
      {
        title: "Cámaras Frigoríficas",
        items: [
          { label: "Biológicos y Vacunas (2°C-8°C)", icon: "severe_cold" },
          { label: "Hemoderivados y Sueros", icon: "bloodtype" },
          { label: "Sensores y Alarmas Térmicas", icon: "thermostat", count: "0" },
        ],
      },
      {
        title: "Auditoría y Licitación",
        items: [
          { label: "Control de Mermas en Tránsito", icon: "report_problem" },
          { label: "Balance Mayorista de Distribución", icon: "analytics" },
        ],
      },
    ],
  },
  supervisor: {
    context: { label: "Modo Supervisor Municipal / Provincial", icon: "monitoring" },
    headerRole: "Dirección Municipal de Salud (DMS)",
    title: "Monitoreo Territorial de Abastecimiento y Cobertura",
    subtitle:
      "Visualización de stock crítico, compensación entre policlínicos y fiscalización de programas para pacientes crónicos.",
    sections: [
      {
        title: "Supervisión Territorial",
        items: [
          { label: "Matriz de Disponibilidad", icon: "grid_view", active: true },
          {
            label: "Alertas de Desabastecimiento",
            icon: "crisis_alert",
            count: "9",
            isWarning: true,
          },
          { label: "Balance y Transferencias", icon: "compare_arrows", count: "18" },
          { label: "Mapa de Cobertura Poblacional", icon: "map" },
        ],
      },
      {
        title: "Fiscalización de Red",
        items: [
          { label: "Auditorías de Tarjetón", icon: "manage_search" },
          { label: "Inspecciones Sanitarias", icon: "assignment_turned_in" },
          { label: "Control de Receta Oficial", icon: "clinical_notes" },
        ],
      },
      {
        title: "Informes Epidemiológicos",
        items: [
          { label: "Consumo de Antimicrobianos", icon: "ssid_chart" },
          { label: "Reportes al Consejo de Salud", icon: "summarize" },
        ],
      },
    ],
  },
  admin: {
    context: { label: "Modo Administrador Regulador CECMED", icon: "admin_panel_settings" },
    headerRole: "Autoridad Nacional Reguladora CECMED",
    title: "Gobernanza de Datos Clínicos y Catálogo Farmacéutico",
    subtitle:
      "Homologación de principios activos, control de llaves de recetas digitales y auditoría del sistema nacional.",
    sections: [
      {
        title: "Registro Regulador",
        items: [
          { label: "Catálogo Nacional CECMED", icon: "menu_book", active: true },
          { label: "Aprobación de Nuevos Lotes", icon: "verified", count: "5" },
          { label: "Retiro y Alertas Sanitarias", icon: "gavel", count: "1", isWarning: true },
          { label: "Normativa de Prescripción", icon: "policy" },
        ],
      },
      {
        title: "Infraestructura y Nodos",
        items: [
          { label: "Directorio de Farmacias y Hospitales", icon: "account_tree" },
          { label: "Gestión de Identidades Médicas", icon: "badge" },
          { label: "Nodos y Sincronización", icon: "hub" },
        ],
      },
      {
        title: "Auditoría",
        items: [
          { label: "Auditoría Forense", icon: "troubleshoot" },
          { label: "Parámetros del Sistema", icon: "tune" },
        ],
      },
    ],
  },
};
