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
  title: "Utagaki - 歌垣",
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
        className={`${notoSerifJP.variable} ${shipporiMincho.variable} antialiased font-serif`}
      >
        <UserProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </UserProvider>
      </body>
    </html>
  );
}
