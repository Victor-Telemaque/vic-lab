import type { Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans_JP, Manrope } from "next/font/google";
import { HeroGateInitScript } from "@/components/theme/hero-gate-init-script";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
import { SmoothScrollProvider } from "@/components/scroll/smooth-scroll-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { defaultSiteLocale } from "@/lib/site-config";
import "./globals.scss";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSansJp = IBM_Plex_Sans_JP({
  variable: "--font-ibm-plex-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultSiteLocale}
      suppressHydrationWarning
      className={`${manrope.variable} ${ibmPlexSansJp.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeInitScript />
        <HeroGateInitScript />
        <ThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
