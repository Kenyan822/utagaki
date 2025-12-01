"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGame, Reply, Verse, Match } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { Button } from "@/components/ui/Button";
import { MatchRevealOverlay } from "@/components/features/MatchRevealOverlay";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { user } = useUser();
  const { replies, verses, matches } = useGame();
  const [matchedPartner, setMatchedPartner] = useState<{ name: string; gender: "male" | "female" } | null>(null);

  // 自分の返信一覧を取得
  const myReplies = replies.filter(r => r.author.id === user?.id);

  // 返信に関連する上の句を取得するヘルパー
  const getVerse = (verseId: string) => verses.find(v => v.id === verseId);

  // マッチング状態を確認
  const getMatch = (replyId: string) => matches.find(m => m.replyId === replyId);

  // マッチング演出を表示する
  const showMatchReveal = (verse: Verse, matchId: string) => {
    setMatchedPartner({ 
      name: verse.author.name, 
      gender: verse.author.gender,
      matchId: matchId // チャット遷移用
    } as any);
  };

  if (!user) {
    return <div className="p-8 text-center text-hiwada">ログインしてください。</div>;
  }

  return (
    <main className="shochikubai-canvas min-h-screen relative p-4 md:p-8">
      <header className="flex justify-between items-start md:items-center mb-8 max-w-5xl mx-auto">
        <div>
          <p className="text-xs tracking-[0.4em] text-hiwada/60">松竹梅</p>
          <h1 className="text-3xl font-bold text-ai font-serif">詠み履歴</h1>
          <p className="text-sm text-hiwada mt-1 tracking-[0.3em]">あなたが川へ流した返歌の一覧。</p>
        </div>
        <Link href="/" className="text-sm text-hiwada hover:text-shu tracking-[0.3em]">
          戻る
        </Link>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {myReplies.length === 0 ? (
          <div className="col-span-full text-center py-20 border border-dashed border-white/40 rounded-lg">
            <p className="text-hiwada mb-4">まだ返歌を詠んでいません。</p>
            <Link href="/river">
              <Button variant="primary">川へ行く</Button>
            </Link>
          </div>
        ) : (
          myReplies.map((reply) => {
            const verse = getVerse(reply.verseId);
            const match = getMatch(reply.id);

            if (!verse) return null;

            return (
              <div key={reply.id} className="shochikubai-card p-6 border border-white/40 flex gap-4 transition-all hover:-translate-y-1">
                {/* 相手の上の句（小さく表示） */}
                <div className="flex-shrink-0 opacity-80 scale-75 origin-top-left -mr-4">
                  <Tanzaku
                    content={verse.content}
                    authorName={verse.author.name}
                    variant={verse.variant}
                    vertical={true}
                    className="h-40 w-16 min-h-[160px] p-2 text-xs"
                  />
                </div>

                {/* 自分の返歌 */}
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <span className="text-xs text-hiwada mb-1 block tracking-[0.3em]">あなたの返歌</span>
                    <div className="text-lg font-serif text-sumi writing-vertical-rl h-32 border-r border-white/30 pr-4 mr-4 tracking-[0.3em]">
                      {reply.content}
                    </div>
                  </div>
                  
                  <div className="flex justify-end items-end mt-2">
                    {match ? (
                      <Button 
                        variant="musubi" 
                        size="sm" 
                        onClick={() => showMatchReveal(verse, match.id)}
                        className="text-xs px-3 py-1 h-auto tracking-[0.2em]"
                      >
                        縁あり！
                      </Button>
                    ) : (
                      <span className="text-xs text-hiwada/40">返事待ち...</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* マッチング演出オーバーレイ */}
      <MatchRevealOverlay 
        isOpen={!!matchedPartner} 
        partner={matchedPartner as any} 
        matchId={(matchedPartner as any)?.matchId}
        onClose={() => setMatchedPartner(null)} 
      />
    </main>
  );
}

