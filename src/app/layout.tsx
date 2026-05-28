import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, Manrope } from "next/font/google";
import { AppIntlProvider } from "@/components/i18n/intl-provider";
import { LavaLampBackground } from "@/components/effects/lava-lamp-background";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
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
  title: "Vic Lab | Creative Front-End Developer",
  description:
    "Portfolio of a creative front-end developer building product-focused and interactive digital experiences.",
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
      <body className="min-h-full flex flex-col">
        <ThemeInitScript />
        <LavaLampBackground />
        <ThemeProvider>
          <AppIntlProvider>{children}</AppIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
