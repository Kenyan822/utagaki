import { VerseComposer } from "@/components/features/VerseComposer";
import Link from "next/link";

export default function ComposePage() {
  return (
    <main className="min-h-screen bg-kinari relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-shu/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-ai/5 rounded-full blur-3xl pointer-events-none" />

      {/* ヘッダー */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-ai font-serif">詠む (Compose)</h1>
        <Link href="/" className="text-sm text-hiwada hover:underline">
          トップへ戻る
        </Link>
      </header>

      {/* コンテンツ */}
      <section className="relative z-10 py-8 md:py-16">
        <VerseComposer />
      </section>

      {/* 補足メッセージ */}
      <footer className="relative z-10 text-center text-xs text-hiwada/60 p-6">
        <p>詠んだ句は24時間の間、川を流れます。</p>
      </footer>
    </main>
  );
}

