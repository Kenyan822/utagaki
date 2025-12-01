"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/Button";

export default function ChatPage() {
  const params = useParams();
  const matchId = params.matchId as string;
  const { user } = useUser();
  const { matches, verses, replies, messages, sendMessage, getMatch } = useGame();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const match = getMatch(matchId);
  const verse = match ? verses.find(v => v.id === match.verseId) : null;
  const reply = match ? replies.find(r => r.id === match.replyId) : null;

  // マッチに関連するメッセージをフィルタリング
  const chatMessages = messages.filter(m => m.matchId === matchId);

  // 相手を特定
  const partner = verse && reply && user
    ? (verse.author.id === user.id ? reply.author : verse.author)
    : null;

  // 新しいメッセージが来たら下にスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!user) {
    return <div className="p-8 text-center text-hiwada">ログインしてください。</div>;
  }

  if (!match || !verse || !reply) {
    return (
      <div className="min-h-screen bg-kinari flex items-center justify-center">
        <div className="text-center">
          <p className="text-hiwada mb-4">この文のやり取りは見つかりませんでした。</p>
          <Link href="/waiting-room" className="text-shu underline">待合処へ戻る</Link>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(matchId, user.id, newMessage.trim());
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-kinari flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-hiwada/10 p-4 flex items-center justify-between">
        <Link href="/waiting-room" className="text-hiwada hover:text-shu transition-colors">
          ← 戻る
        </Link>
        <h1 className="text-lg font-serif text-ai">
          {partner?.name ?? "相手"} との文
        </h1>
        <div className="w-12" /> {/* スペーサー */}
      </header>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 最初のきっかけとなった歌 */}
        <div className="flex flex-col items-center gap-4 py-8 opacity-70">
          <div className="bg-white/50 p-4 rounded border border-hiwada/10 text-center max-w-sm">
            <p className="font-serif text-hiwada mb-2 text-sm border-b border-hiwada/10 pb-2">縁の始まり</p>
            <div className="flex flex-row-reverse justify-center gap-4 text-sumi font-serif">
              {/* 右側：上の句（先に詠まれたもの） */}
              <div className="flex flex-col items-center gap-1">
                <div className="writing-vertical-rl h-32 text-lg">{verse.content}</div>
                <span className="text-[10px] text-hiwada/60">{verse.author.name}</span>
              </div>
              
              {/* 左側：下の句（返歌）※縦書きなので左に配置されるのが後 */}
              <div className="flex flex-col items-center gap-1 mt-8">
                <div className="writing-vertical-rl h-32 text-lg">{reply.content}</div>
                <span className="text-[10px] text-hiwada/60">{reply.author.name}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-hiwada/40">ここから二人の物語が始まります</p>
        </div>

        {/* チャットメッセージ */}
        {chatMessages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  isMe
                    ? "bg-shu text-kinari rounded-br-none"
                    : "bg-white border border-hiwada/20 text-sumi rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-kinari/60" : "text-hiwada/40"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-hiwada/10 p-4">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="文を書く..."
            className="flex-1 px-4 py-2 border border-hiwada/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-shu/30 bg-kinari"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-shu hover:bg-shu/90 text-kinari px-6"
          >
            送る
          </Button>
        </div>
      </div>
    </main>
  );
}
