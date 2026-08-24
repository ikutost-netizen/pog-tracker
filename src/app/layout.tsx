import type { Metadata } from "next";
import { Noto_Sans_JP, Chivo_Mono, DotGothic16 } from "next/font/google";
import NavHeader from "@/components/NavHeader";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
});

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo",
  display: "swap",
});

const dotGothic = DotGothic16({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dotgothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "POG Tracker",
  description: "仲間5人のPOGポイント推移を共有するトラッカー",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${chivoMono.variable} ${dotGothic.variable}`}>
      <body style={{ fontFamily: 'var(--font-noto), sans-serif' }}>
        <NavHeader />
        {children}
      </body>
    </html>
  );
}
