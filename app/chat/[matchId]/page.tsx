"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGame } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
      <div className="shochikubai-canvas min-h-screen flex items-center justify-center">
        <div className="text-center shochikubai-panel px-12 py-10 space-y-4">
          <p className="text-hiwada mb-4">この文のやり取りは見つかりませんでした。</p>
          <Link href="/waiting-room" className="text-shu underline tracking-[0.3em]">待合処へ戻る</Link>
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
    <main className="shochikubai-canvas min-h-screen flex flex-col">
      <header className="bg-white/40 backdrop-blur-lg border-b border-white/30 p-4 flex items-center justify-between rounded-t-2xl">
        <Link href="/waiting-room" className="text-hiwada hover:text-shu transition-colors tracking-[0.3em]">
          ← 戻る
        </Link>
        <h1 className="text-lg font-serif text-ai tracking-[0.3em]">
          {partner?.name ?? "相手"} との文
        </h1>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="shochikubai-card p-6 border border-white/40 text-center max-w-md">
            <p className="font-serif text-hiwada mb-2 text-sm border-b border-white/30 pb-2 tracking-[0.3em]">縁の始まり</p>
            <div className="flex flex-row-reverse justify-center gap-6 text-sumi font-serif">
              <div className="flex flex-col items-center gap-1">
                <div className="writing-vertical-rl h-32 text-lg tracking-[0.3em]">{verse.content}</div>
                <span className="text-[10px] text-hiwada/60">{verse.author.name}</span>
              </div>
              <div className="flex flex-col items-center gap-1 mt-8">
                <div className="writing-vertical-rl h-32 text-lg tracking-[0.3em]">{reply.content}</div>
                <span className="text-[10px] text-hiwada/60">{reply.author.name}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-hiwada/40 tracking-[0.3em]">ここから二人の物語が始まります</p>
        </div>

        {chatMessages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={cn(
                  "max-w-[70%] px-5 py-3 rounded-2xl shadow-md tracking-[0.1em]",
                  isMe
                    ? "bg-gradient-to-br from-shu to-ume-rose text-kinari rounded-br-none"
                    : "bg-white/80 border border-white/40 text-sumi rounded-bl-none"
                )}
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

      <div className="bg-white/60 backdrop-blur-lg border-t border-white/30 p-4 rounded-b-2xl">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="文を書く..."
            className="flex-1 px-4 py-3 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-shu/30 bg-white/70"
          />
          <Button
            variant="musubi"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-6"
          >
            送る
          </Button>
        </div>
      </div>
    </main>
  );
}
