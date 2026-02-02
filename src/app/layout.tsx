import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";

export const metadata: Metadata = {
  title: "La Sorianita | Legado Artesano",
  description: "Página oficial del obrador 'La Sorianita'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body>
        <Header />
        <div className="h-15 md:h-20 bg-soria-red" />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
