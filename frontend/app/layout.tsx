import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energycom Nexus AI",
  description: "From Land to Power",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
