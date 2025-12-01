import { VerseComposer } from "@/components/features/VerseComposer";
import Link from "next/link";

export default function ComposePage() {
  return (
    <main className="shochikubai-canvas relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[rgba(138,27,69,0.15)] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[rgba(13,47,38,0.2)] to-transparent blur-3xl" />
      </div>

      <header className="relative z-10 p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center max-w-6xl mx-auto w-full">
        <div>
          <p className="text-xs tracking-[0.5em] text-hiwada/60">松竹梅</p>
          <h1 className="text-3xl font-serif text-ai">詠む（Compose）</h1>
        </div>
        <Link href="/" className="text-sm text-hiwada hover:text-shu tracking-[0.3em]">
          トップへ
        </Link>
      </header>

      <section className="relative z-10 py-8 md:py-16">
        <VerseComposer />
      </section>

      <footer className="relative z-10 text-center text-xs text-hiwada/60 p-6 tracking-[0.3em]">
        <p>詠んだ句は二十四時の間、川面で輝きます。</p>
      </footer>
    </main>
  );
}

