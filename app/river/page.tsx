import { RiverStream } from "@/components/features/RiverStream";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RiverPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-kinari">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-linear-to-b from-matsu/5 via-kinari to-matsu/10 pointer-events-none z-0" />
      
      {/* ヘッダー */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-linear-to-b from-kinari/90 via-kinari/60 to-transparent backdrop-blur-[2px]">
        <div className="flex flex-col">
          <p className="text-xs tracking-[0.5em] text-matsu/60 font-serif mb-1">松竹梅</p>
          <h1 className="text-3xl font-bold text-matsu font-serif tracking-widest drop-shadow-sm">
            川 <span className="text-lg font-normal opacity-60 ml-2">- River -</span>
          </h1>
        </div>
        <Link href="/" className="group flex items-center gap-2 text-sm text-matsu/80 hover:text-ume transition-colors tracking-[0.2em] font-serif">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          戻る
        </Link>
      </header>

      {/* 川コンポーネント */}
      <RiverStream />

      {/* アクションボタン（新規投稿用だが、川では閲覧が主なので少し控えめに配置、あるいは削除も検討だが残す） */}
      <div className="absolute bottom-8 right-8 z-50">
        <Link href="/compose">
          <Button variant="musubi" size="lg" className="tracking-[0.3em] px-8 py-6 shadow-xl hover:scale-105 transition-transform">
            <span className="text-xl mr-2">＋</span> 詠む
          </Button>
        </Link>
      </div>
      
      {/* 使い方ガイド的なテキスト（左下） */}
      <div className="absolute bottom-8 left-8 z-40 pointer-events-none hidden md:block">
        <p className="vertical-rl text-matsu/40 text-xs font-serif tracking-widest h-32 leading-loose">
          流れる想いを<br/>
          掬い上げん
        </p>
      </div>
    </main>
  );
}
