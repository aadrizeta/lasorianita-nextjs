import type { Metadata } from "next";
import { Inter, Instrument_Serif, STIX_Two_Text, Pinyon_Script } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

const inter = Inter({
  variable: "--nf-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const instrumentSerif = Instrument_Serif({
  variable: "--nf-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const stixTwoText = STIX_Two_Text({
  variable: "--nf-math",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const pinyonScript = Pinyon_Script({
  variable: "--nf-script",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9XDB0XDVP0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9XDB0XDVP0');
          `}
        </Script>
      </head>
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
