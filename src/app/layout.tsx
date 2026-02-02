import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";

const inter = localFont({
  src: "../../public/fonts/Inter/Inter-VariableFont_opsz,wght.woff2",
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/fonts/Instrument_Serif/InstrumentSerif-Regular.woff2",
      style: "normal",
    },
    {
      path: "../../public/fonts/Instrument_Serif/InstrumentSerif-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

const stixTwoText = localFont({
  src: "../../public/fonts/STIX_Two_Text/STIXTwoText-Italic-VariableFont_wght.woff2",
  variable: "--font-stix",
  display: "swap",
  preload: false,
});

const pinyonScript = localFont({
  src: "../../public/fonts/Pinyon_Script/PinyonScript-Regular.woff2",
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
});

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
    <html lang="es" className={`scroll-smooth ${inter.variable} ${instrumentSerif.variable} ${stixTwoText.variable} ${pinyonScript.variable}`}>
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
