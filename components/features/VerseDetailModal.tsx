"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react"; 
import { useGame } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";

interface VerseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    id: string; // idを追加
    content: string;
    author: { name: string }; // user object対応
    variant: "kinari" | "sakura" | "mizu" | "kusa";
  } | null;
}

export function VerseDetailModal({ isOpen, onClose, verse }: VerseDetailModalProps) {
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addReply } = useGame();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!user || !verse) return;

    setIsSubmitting(true);
    // 送信処理
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    addReply(verse.id, reply, user);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // 少し待ってから閉じる
    setTimeout(() => {
      setReply("");
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!verse) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-sumi/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* モーダルコンテンツ */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-kinari w-full max-w-4xl h-[80vh] md:h-[70vh] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden border border-hiwada/20"
            >
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-hiwada hover:text-shu transition-colors"
              >
                <span className="text-2xl font-serif">×</span>
              </button>

              {/* 左側（または上側）：上の句表示エリア */}
              <div className="flex-1 bg-ai/5 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-hiwada/10">
                <h3 className="text-hiwada font-serif mb-6 tracking-widest text-lg">上の句</h3>
                <Tanzaku
                  content={verse.content}
                  authorName={verse.author.name}
                  variant={verse.variant}
                  className="scale-110 shadow-lg pointer-events-none"
                />
              </div>

              {/* 右側（または下側）：返信フォームエリア */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-kinari z-20 text-center"
                  >
                    <div className="text-4xl mb-4 text-shu">✿</div>
                    <p className="font-serif text-xl text-hiwada mb-2">返歌を届けました</p>
                    <p className="text-sm text-sumi/60">縁がありますように。</p>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="text-hiwada font-serif mb-6 tracking-widest text-lg">返歌を詠む</h3>
                    <div className="w-full flex justify-center mb-8">
                      <VerticalTextarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="ここに下の句を..."
                        className="h-64"
                      />
                    </div>
                    <Button 
                      variant="musubi" 
                      size="lg" 
                      onClick={handleSubmit}
                      disabled={!reply.trim() || isSubmitting}
                      className="w-48"
                    >
                      {isSubmitting ? "文を運んでいます..." : "返歌を送る"}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

