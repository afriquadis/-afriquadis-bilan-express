import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bilan Express - Diagnostic de Santé Intelligent",
  description: "Réalisez un bilan de santé complet et personnalisé basé sur vos symptômes avec l'intelligence artificielle.",
  keywords: ["diagnostic", "santé", "symptômes", "AFRIQUADIS", "bilan", "médical"],
  authors: [{ name: "AFRIQUADIS" }],
  category: "Health & Medical",
  themeColor: "#0ea5e9",
  icons: {
    icon: "/afriquadis-logo.png",
    shortcut: "/afriquadis-logo.png",
    apple: "/afriquadis-logo.png",
  },
  manifest: "/site.webmanifest",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        {/* Fallback explicites pour les navigateurs */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen font-sans antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 pb-20 md:pb-6">
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                {children}
              </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
              <BottomNavigation />
            </div>

            {/* Floating Action Elements */}
            <WhatsAppButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}