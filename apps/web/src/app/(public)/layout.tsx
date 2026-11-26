"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RUTAS } from "@/config/routes";
import { MobileTabBar } from "@abasto/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const items = [
    {
      label: "Farmacias",
      href: RUTAS.farmacias,
      icon: "local_hospital",
      active: pathname === RUTAS.farmacias || pathname.startsWith(`${RUTAS.farmacias}/`),
    },
    {
      label: "Buscar",
      href: RUTAS.buscar,
      icon: "search",
      active: pathname === RUTAS.buscar || pathname.startsWith(`${RUTAS.buscar}/`),
    },
    {
      label: "Recetas",
      href: RUTAS.receta,
      icon: "receipt",
      active: pathname === RUTAS.receta || pathname.startsWith(`${RUTAS.receta}/`),
    },
  ];
  return (
    <>
      <Header />
      <main className="mx-auto pb-24 pt-10 lg:pb-10">{children}</main>
      <Footer />
      <MobileTabBar items={items} linkComponent={Link} position="fixed" className="lg:hidden" />
    </>
  );
}
