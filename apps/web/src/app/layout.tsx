import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Abasto",
  description: "Disponibilidad de medicamentos en la red de farmacias",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-surface font-sans text-on-surface antialiased">{children}</body>
    </html>
  );
}
