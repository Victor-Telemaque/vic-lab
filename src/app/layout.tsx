import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_JP, Manrope } from "next/font/google";
import { AppIntlProvider } from "@/components/i18n/intl-provider";
import { HeroGateInitScript } from "@/components/theme/hero-gate-init-script";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
import { SmoothScrollProvider } from "@/components/scroll/smooth-scroll-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.scss";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSansJp = IBM_Plex_Sans_JP({
  variable: "--font-ibm-plex-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vic Lab | Senior Front-End Developer",
  description:
    "Senior front-end developer focused on product, performance, and maintainable interfaces. Vue, React, TypeScript.",
};

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
      lang="fr"
      suppressHydrationWarning
      className={`${manrope.variable} ${ibmPlexSansJp.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <ThemeInitScript />
        <HeroGateInitScript />
        <ThemeProvider>
          <SmoothScrollProvider>
            <AppIntlProvider>{children}</AppIntlProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
