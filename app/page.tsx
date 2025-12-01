"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { useGame } from "@/lib/game-context";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { user, isAuthenticated, logout } = useUser();
  const { getUserVerses, replies, matches, verses } = useGame();

  // 自分のマッチングを取得
  const myMatches = matches.filter(m => {
    if (!user) return false;
    const verse = verses.find(v => v.id === m.verseId);
    const reply = replies.find(r => r.id === m.replyId);
    if (!verse || !reply) return false;
    return verse.author.id === user.id || reply.author.id === user.id;
  });

  // 自分の詠んだ句の数を取得（女性用）
  const myVerseCount = user ? getUserVerses(user.id).length : 0;

  // 自分の詠んだ返歌の数を取得（男性用）
  const myReplyCount = user ? replies.filter(r => r.author.id === user.id).length : 0;

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-kinari">
      {/* --- 装飾背景 (Decorations) --- */}
      
      {/* 四隅の装飾 (Corner Ornaments) */}
      <div className="fixed top-0 left-0 w-32 h-32 pointer-events-none opacity-20 z-0">
        <svg viewBox="0 0 100 100" className="fill-matsu">
          <path d="M0,0 Q50,0 50,50 T100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="10" />
          <circle cx="40" cy="10" r="5" />
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-40 h-40 pointer-events-none opacity-20 z-0 rotate-180">
        <svg viewBox="0 0 100 100" className="fill-ume">
           <path d="M0,0 Q50,0 50,50 T100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="2" />
           <circle cx="20" cy="20" r="15" />
           <circle cx="45" cy="15" r="8" />
        </svg>
      </div>

      {/* 霞（Kasumi）のようなぼかし */}
      <div className="fixed top-1/4 right-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-[-10%] w-96 h-96 bg-miyabi/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- メインコンテンツ --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-lg flex flex-col items-center gap-10 py-10 px-6 border border-gold/30 bg-white/40 backdrop-blur-sm shadow-xl rounded-lg">
          
          {/* タイトルセクション */}
          <div className="text-center space-y-4 relative py-8">
            <h1 className="text-5xl md:text-7xl font-serif tracking-widest text-transparent bg-clip-text bg-linear-to-b from-matsu via-sumi to-matsu drop-shadow-sm select-none">
              歌垣
            </h1>
            <div className="w-24 h-[2px] bg-linear-to-r from-transparent via-gold to-transparent mx-auto" />
            <p className="text-sm md:text-base text-matsu/80 font-serif tracking-[0.2em]">
              言葉で結ぶ、<br className="md:hidden" />千年の恋。
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-6 w-full max-w-xs animate-fade-in">
              <Link href="/login" className="w-full">
                <Button variant="gold" size="xl" className="w-full text-xl shadow-gold/40">
                  物語を始める
                </Button>
              </Link>
              <div className="text-center text-xs text-matsu/60 font-serif">
                <span className="inline-block border-b border-matsu/20 pb-1">
                  雅な世界へようこそ
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
              <div className="text-center">
                <p className="text-matsu font-serif text-lg">
                  ようこそ、<span className="font-bold border-b-2 border-gold/50 px-1">{user?.name}</span> 様
                </p>
              </div>

              {/* アクションボタン */}
              <div className="w-full max-w-xs space-y-6">
                {user?.gender === 'female' ? (
                  <>
                    <Link href="/compose" className="block w-full">
                      <Button variant="musubi" size="xl" className="w-full py-6 text-xl tracking-widest">
                        詠む
                      </Button>
                    </Link>
                    <Link href="/waiting-room" className="block w-full">
                      <Button variant="secondary" className="w-full">
                        待合処へ ({myVerseCount}首)
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/river" className="block w-full">
                      <Button variant="primary" size="xl" className="w-full py-6 text-xl tracking-widest">
                        川へ行く
                      </Button>
                    </Link>
                    <Link href="/history" className="block w-full">
                      <Button variant="outline" className="w-full">
                        詠み履歴 ({myReplyCount}首)
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* マッチングリスト */}
              {myMatches.length > 0 && (
                <div className="w-full max-w-xs pt-6 border-t border-gold/30">
                  <h3 className="text-sm font-serif text-matsu/70 mb-4 text-center tracking-widest">
                    — 結ばれた縁 —
                  </h3>
                  <div className="flex flex-col gap-3">
                    {myMatches.map(match => {
                      const verse = verses.find(v => v.id === match.verseId);
                      const reply = replies.find(r => r.id === match.replyId);
                      
                      let partnerName = "結ばれた縁";
                      if (verse && reply && user) {
                        partnerName = user.id === verse.author.id ? reply.author.name : verse.author.name;
                      }
                      
                      return (
                        <Link key={match.id} href={`/chat/${match.id}`} className="block group">
                          <div className="bg-white/60 border border-gold/30 p-3 rounded flex items-center justify-between shadow-sm transition-all group-hover:shadow-md group-hover:border-gold group-hover:bg-white/80">
                            <span className="font-serif text-matsu text-sm">{partnerName}</span> 
                            <span className="text-gold text-xs group-hover:translate-x-1 transition-transform">拝見 →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* フッターリンク */}
              <div className="flex gap-6 text-xs text-matsu/50 font-serif pt-4">
                 <button onClick={logout} className="hover:text-ume transition-colors">
                   門を出る
                 </button>
                 <span className="text-gold/50">|</span>
                 <Link href="/design-system" className="hover:text-take transition-colors">
                   意匠一覧
                 </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-4 text-[10px] text-matsu/30 font-serif text-center relative z-10">
        <p>Utagaki Project</p>
      </footer>
    </div>
  );
}
