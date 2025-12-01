import type { Metadata } from "next";
import { Noto_Serif_JP, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/lib/game-context";
import { UserProvider } from "@/lib/user-context";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "歌垣 - Utagaki",
  description: "言葉でつながる、感性マッチングアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${shipporiMincho.variable} antialiased font-serif relative min-h-screen`}
      >
        {/* 松竹梅の装飾背景 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* 左上 - 松の装飾 */}
          <div className="absolute -top-20 -left-20 w-80 h-80 opacity-[0.06]">
            <svg viewBox="0 0 200 200" className="w-full h-full text-matsu">
              <g fill="currentColor">
                {/* 松の枝 */}
                <ellipse cx="100" cy="60" rx="60" ry="25" />
                <ellipse cx="70" cy="90" rx="45" ry="20" />
                <ellipse cx="130" cy="90" rx="45" ry="20" />
                <ellipse cx="100" cy="120" rx="50" ry="22" />
                <rect x="95" y="110" width="10" height="70" />
              </g>
            </svg>
          </div>

          {/* 右上 - 梅の装飾 */}
          <div className="absolute -top-10 -right-10 w-64 h-64 opacity-[0.08]">
            <svg viewBox="0 0 200 200" className="w-full h-full text-ume">
              <g fill="currentColor">
                {/* 梅の花 */}
                <circle cx="100" cy="100" r="15" />
                <circle cx="100" cy="60" r="20" />
                <circle cx="138" cy="80" r="20" />
                <circle cx="124" cy="120" r="20" />
                <circle cx="76" cy="120" r="20" />
                <circle cx="62" cy="80" r="20" />
              </g>
            </svg>
          </div>

          {/* 右下 - 竹の装飾 */}
          <div className="absolute -bottom-20 -right-10 w-48 h-96 opacity-[0.06]">
            <svg viewBox="0 0 100 300" className="w-full h-full text-take">
              <g fill="currentColor">
                {/* 竹の幹 */}
                <rect x="40" y="0" width="20" height="300" rx="5" />
                {/* 節 */}
                <rect x="35" y="50" width="30" height="4" rx="2" />
                <rect x="35" y="120" width="30" height="4" rx="2" />
                <rect x="35" y="190" width="30" height="4" rx="2" />
                <rect x="35" y="260" width="30" height="4" rx="2" />
                {/* 葉 */}
                <ellipse cx="70" cy="30" rx="25" ry="8" transform="rotate(30 70 30)" />
                <ellipse cx="30" cy="80" rx="25" ry="8" transform="rotate(-30 30 80)" />
                <ellipse cx="70" cy="150" rx="25" ry="8" transform="rotate(30 70 150)" />
              </g>
            </svg>
          </div>

          {/* 左下 - 雲の装飾 */}
          <div className="absolute bottom-0 left-0 w-full h-32 opacity-[0.04]">
            <svg viewBox="0 0 800 100" className="w-full h-full text-kinpaku" preserveAspectRatio="none">
              <g fill="currentColor">
                <ellipse cx="100" cy="80" rx="80" ry="40" />
                <ellipse cx="200" cy="70" rx="100" ry="50" />
                <ellipse cx="350" cy="85" rx="70" ry="35" />
                <ellipse cx="500" cy="75" rx="90" ry="45" />
                <ellipse cx="650" cy="80" rx="85" ry="40" />
                <ellipse cx="750" cy="70" rx="70" ry="35" />
              </g>
            </svg>
          </div>

          {/* 金箔散りばめ効果 */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-kinpaku/20 rounded-full blur-sm" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-kinpaku/15 rounded-full blur-sm" />
          <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-kinpaku/20 rounded-full blur-sm" />
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-kinpaku/10 rounded-full blur-md" />
          <div className="absolute top-1/2 right-1/5 w-2 h-2 bg-kinpaku/15 rounded-full blur-sm" />
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10">
          <UserProvider>
            <GameProvider>
              {children}
            </GameProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
