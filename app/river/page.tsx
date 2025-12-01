import { RiverStream } from "@/components/features/RiverStream";
import Link from "next/link";

export default function RiverPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* ナビゲーション（仮） */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-kinari/80 to-transparent">
        <h1 className="text-2xl font-bold text-ai font-serif">川 (River)</h1>
        <Link href="/" className="text-sm text-hiwada hover:underline">
          戻る
        </Link>
      </header>

      {/* 川コンポーネント */}
      <RiverStream />

      {/* アクションボタン（仮） */}
      <div className="absolute bottom-8 right-8 z-50">
        <button className="bg-shu text-kinari px-6 py-3 rounded-full shadow-lg font-bold hover:scale-105 transition-transform">
          ＋ 詠む
        </button>
      </div>
    </main>
  );
}

