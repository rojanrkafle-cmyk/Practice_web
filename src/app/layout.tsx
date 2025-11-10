import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["serif"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-japanese",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Japanese Swords',
    default: 'Japanese Swords - Handcrafted Traditional Katana, Wakizashi & Tanto',
  },
  description: 'Discover authentic Japanese swords crafted with traditional methods. Browse our collection of katana, wakizashi, and tanto blades.',
  keywords: ['japanese swords', 'katana', 'wakizashi', 'tanto', 'samurai swords', 'handcrafted swords'],
  authors: [{ name: 'Master Swordsmith' }],
  creator: 'Japanese Swords',
  publisher: 'Japanese Swords',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/hero-banner.jpg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${cormorantGaramond.variable} ${notoSansJP.variable} ${inter.variable} 
          antialiased bg-black text-white min-h-screen
          motion-safe:scroll-smooth`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-black"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
