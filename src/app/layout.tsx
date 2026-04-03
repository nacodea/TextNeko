import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import BuyMeACoffeeWidget from "@/components/BuyMeACoffee";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const localSans = localFont({
  src: [
    {
      path: "./fonts/NotoSansJP-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansJP-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap", // 推奨：FOITを避ける
  variable: "--font-local-sans", // CSS 変数名(お好みで)
});

export const metadata: Metadata = {
  title: "TextNeko | テキスト一括整形",
  description:
    "大文字/小文字、スネーク⇄キャメル、全角半角、スラッグ化などを一括実行",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground antialiased">
        <Providers>
          <div className="min-h-dvh">
            <header className="border-b bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/50">
              <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">
                  TextNeko <span className="ml-1">🐈</span>
                </h1>
                <nav className="text-xs text-muted-foreground">
                  Nova / shadcn
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
            <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-muted-foreground">
              © {new Date().getFullYear()} TextNeko
            </footer>
          </div>
        </Providers>
        <BuyMeACoffeeWidget />
      </body>
    </html>
  );
}
