import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PWAInstaller from "@/components/PWAInstaller";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "TAMA BASE | 川崎市多摩区の地域情報",
  description: "川崎市多摩区のお店・公園・子育て情報をまとめてチェック。新規オープン情報や子連れOKのお店も掲載。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TAMA BASE",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "TAMA BASE | 川崎市多摩区の地域情報",
    description: "お店・公園・子育て情報をまとめてチェック",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={noto.className}>
      <body className="min-h-dvh flex flex-col bg-[#F7F7F4] antialiased">
        <main className="flex-1">{children}</main>
        <Navbar />
        <PWAInstaller />
      </body>
    </html>
  );
}
