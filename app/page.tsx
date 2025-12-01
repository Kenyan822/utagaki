"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/lib/user-context";
import { useGame } from "@/lib/game-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-kinari relative flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif text-ai tracking-widest writing-vertical-rl md:writing-horizontal-tb mx-auto h-64 md:h-auto flex items-center justify-center">
              歌垣
            </h1>
            <p className="text-sm text-hiwada font-serif tracking-widest">
              言葉で繋がる、心の縁。
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/login">
                <Button variant="primary" size="lg" className="w-48">
                  物語を始める
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="text-center mb-4">
                <p className="text-hiwada font-serif mb-2">ようこそ、{user?.name} 様</p>
              </div>

              {/* 性別によるメインアクションの出し分け */}
              {user?.gender === 'female' ? (
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <Link href="/compose" className="w-full">
                    <Button variant="primary" size="lg" className="w-full py-8 text-lg bg-shu hover:bg-shu/90 text-kinari">
                      詠む
                    </Button>
                  </Link>
                  <Link href="/waiting-room" className="w-full text-center text-sm text-hiwada hover:text-ai underline decoration-hiwada/30 underline-offset-4">
                    待合処へ ({myVerseCount}首)
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <Link href="/river" className="w-full">
                    <Button variant="primary" size="lg" className="w-full py-8 text-lg">
                      川へ行く
                    </Button>
                  </Link>
                  <Link href="/history" className="w-full text-center text-sm text-hiwada hover:text-ai underline decoration-hiwada/30 underline-offset-4">
                    詠み履歴 ({myReplyCount}首)
                  </Link>
                </div>
              )}

              {/* マッチング済みのチャットリスト (共通) */}
              {myMatches.length > 0 && (
                <div className="w-full max-w-xs mt-6 border-t border-hiwada/10 pt-6">
                  <h3 className="text-sm font-serif text-hiwada mb-3">文（ふみ）を交わす</h3>
                  <div className="flex flex-col gap-2">
                    {myMatches.map(match => {
                      // 相手の名前を特定
                      // マッチに関連する verse と reply を探す
                      const verse = verses.find(v => v.id === match.verseId);
                      const reply = replies.find(r => r.id === match.replyId);
                      
                      // 自分が verse の作者なら相手は reply の作者、逆も然り
                      let partnerName = "結ばれた縁";
                      if (verse && reply && user) {
                        partnerName = user.id === verse.author.id ? reply.author.name : verse.author.name;
                      }
                      
                      return (
                        <Link key={match.id} href={`/chat/${match.id}`} className="block">
                          <div className="bg-white/60 hover:bg-white p-3 rounded border border-hiwada/10 flex items-center justify-between text-sm transition-colors">
                            <span className="font-serif text-ai">{partnerName}</span> 
                            <span className="text-xs text-hiwada/60">→</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-8 mt-4 border-t border-hiwada/10 w-full flex justify-center gap-6 text-xs text-hiwada/60 mb-8">
                 <button onClick={logout} className="hover:text-shu transition-colors">
                   門を出る（ログアウト）
                 </button>
                 <Link href="/design-system" className="hover:text-ai transition-colors">
                   意匠一覧
                 </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-12 mb-4 text-[10px] text-hiwada/40 font-serif w-full text-center">
        <p>Utagaki Project</p>
      </footer>
    </div>
  );
}
