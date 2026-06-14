import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GoogleAdSense } from "@/components/google-adsense";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "SysTools Perú - Herramientas, Sistemas y Tecnología",
  description: "Herramientas digitales, sistemas, descargas y tutoriales para Perú.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <GoogleAnalytics />
        <GoogleAdSense />
      </body>
    </html>
  );
}
