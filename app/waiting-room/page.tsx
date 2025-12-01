"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGame, Verse, Reply } from "@/lib/game-context";
import { useUser, User } from "@/lib/user-context";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MatchRevealOverlay } from "@/components/features/MatchRevealOverlay";

export default function WaitingRoomPage() {
  const { user } = useUser();
  const { getUserVerses, getRepliesByVerseId, createMatch } = useGame();
  const [matchedPartner, setMatchedPartner] = useState<(User & { matchId: string }) | null>(null);

  // ログインしていない場合はリダイレクトなどの処理が必要だが、今回は簡易的にメッセージ表示
  if (!user) {
    return <div className="p-8 text-center text-hiwada">ログインしてください。</div>;
  }

  const myVerses = getUserVerses(user.id);

  const handleMatch = (verseId: string, reply: Reply) => {
    const newMatchId = createMatch(verseId, reply.id); // createMatchがIDを返すように変更したため
    setMatchedPartner({ ...reply.author, matchId: newMatchId });
  };

  return (
    <main className="shochikubai-canvas min-h-screen relative p-4 md:p-8">
      {/* ヘッダー */}
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.4em] text-hiwada/60">松竹梅</p>
          <h1 className="text-3xl font-serif text-ai">待合処</h1>
        </div>
        <Link href="/" className="text-sm text-hiwada hover:text-shu transition-colors tracking-[0.3em]">
          戻る
        </Link>
      </header>

      {/* 句のリスト */}
      {myVerses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-hiwada/60 font-serif mb-4">まだ句を詠んでいません</p>
          <Link href="/compose">
            <Button variant="musubi">
              最初の句を詠む
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {myVerses.map((verse) => {
            const verseReplies = getRepliesByVerseId(verse.id);
            return (
              <VerseSection
                key={verse.id}
                verse={verse}
                replies={verseReplies}
                onMatch={(reply) => handleMatch(verse.id, reply)}
              />
            );
          })}
        </div>
      )}

      {/* マッチング演出オーバーレイ */}
      <MatchRevealOverlay 
        isOpen={!!matchedPartner} 
        partner={matchedPartner} 
        matchId={matchedPartner?.matchId} // IDを渡す
        onClose={() => setMatchedPartner(null)} 
      />
    </main>
  );
}

function VerseSection({ verse, replies, onMatch }: { verse: Verse, replies: Reply[], onMatch: (reply: Reply) => void }) {
  // マッチング済みかどうかの判定（簡易的にstatusを見る）
  const isMatched = verse.status === "matched";

  return (
    <div className="shochikubai-card p-6 border border-white/40 flex flex-col md:flex-row gap-8">
      {/* 左側: 自分の上の句 */}
      <div className="flex-shrink-0 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/30 pb-6 md:pb-0 md:pr-8">
        <span className="text-xs text-hiwada mb-2 font-serif tracking-[0.3em]">あなたの句</span>
        <Tanzaku
          content={verse.content}
          authorName={verse.author.name}
          variant={verse.variant}
          className="scale-90 origin-top"
        />
        {isMatched && (
          <div className="mt-4 px-3 py-1 bg-shu text-kinari text-xs rounded-full font-bold tracking-[0.2em]">
            結び済み
          </div>
        )}
      </div>

      {/* 右側: 届いた返歌リスト */}
      <div className="flex-1 overflow-x-auto">
        <span className="text-xs text-hiwada mb-4 block font-serif tracking-[0.3em]">届いた返歌 ({replies.length})</span>
        
        {replies.length === 0 ? (
          <div className="h-full flex items-center justify-center text-hiwada/40 text-sm py-10">
            まだ返歌は届いていません...
          </div>
        ) : (
          <div className="flex gap-6 pb-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex flex-col items-center gap-4 min-w-[140px]">
                {/* 下の句（簡易表示）: 本来は短冊コンポーネントか、専用の表示にする */}
                <div className="bg-white/60 border border-white/40 p-4 w-32 h-64 writing-vertical-rl text-lg font-serif shadow-inner flex items-center justify-center relative rounded-lg">
                   {/* 本文 */}
                   <span className="text-sumi tracking-[0.3em]">{reply.content}</span>
                   {/* 署名 */}
                   <span className="absolute bottom-2 left-2 text-xs text-hiwada/70">{reply.author.name}</span>
                </div>

                {!isMatched ? (
                   <Button 
                     variant="musubi" 
                     size="sm" 
                     onClick={() => onMatch(reply)}
                     className="w-full text-xs tracking-[0.2em]"
                   >
                     これで結ぶ
                   </Button>
                ) : (
                  <div className="h-8" /> // スペーサー
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

