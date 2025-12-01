"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";
import { Button } from "@/components/ui/Button";
import { useGame, VerseVariant } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";

interface VerseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    id: string;
    content: string;
    author: { name: string };
    variant: VerseVariant;
  } | null;
}

export function VerseDetailModal({ isOpen, onClose, verse }: VerseDetailModalProps) {
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInput, setShowInput] = useState(false); // 入力モードへの切り替えフラグ
  
  const { addReply } = useGame();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!user || !verse) return;

    setIsSubmitting(true);
    // 送信処理演出
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    addReply(verse.id, reply, user);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // 少し待ってから閉じる
    setTimeout(() => {
      setReply("");
      setIsSubmitted(false);
      setShowInput(false);
      onClose();
    }, 2500);
  };

  // モーダルが閉じられたら状態リセット
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setReply("");
        setIsSubmitted(false);
        setShowInput(false);
      }, 300);
    }
  }, [isOpen]);

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
            className="fixed inset-0 bg-sumi/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-hidden"
          >
            {/* モーダルコンテンツ */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#fcfaf2] w-full max-w-5xl h-[85vh] md:h-[75vh] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gold/40 isolate"
            >
              {/* 背景テクスチャ */}
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none z-[-1]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
              />

              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 text-matsu/50 hover:text-ume transition-colors p-2 rounded-full hover:bg-black/5"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* 左側：上の句表示エリア */}
              <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-linear-to-br from-matsu/5 to-transparent">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gold/30 to-transparent" />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="text-center mb-6 md:mb-8 opacity-60">
                    <p className="text-xs tracking-[0.3em] text-matsu font-serif mb-2">上の句</p>
                    <div className="w-8 h-[1px] bg-matsu/30 mx-auto" />
                  </div>

                  <Tanzaku
                    content={verse.content}
                    authorName={verse.author.name}
                    variant={verse.variant}
                    className="shadow-2xl scale-100 md:scale-125 origin-center"
                  />
                </motion.div>
              </div>

              {/* 区切り線（縦） */}
              <div className="hidden md:block w-[1px] h-full bg-linear-to-b from-transparent via-gold/30 to-transparent" />

              {/* 右側：アクション/入力エリア */}
              <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 bg-white/40 backdrop-blur-sm overflow-hidden">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    /* 送信完了画面 */
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-6xl mb-6 text-ume drop-shadow-md"
                      >
                        ✿
                      </motion.div>
                      <h3 className="font-serif text-2xl text-matsu mb-3 tracking-widest">返歌、届きました</h3>
                      <p className="text-sm text-matsu/60 font-serif tracking-wider">
                        良き縁となりますように。
                      </p>
                    </motion.div>
                  ) : showInput ? (
                    /* 入力フォーム (縦書きモード) */
                    <motion.div
                      key="input"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full h-full flex flex-row-reverse items-start justify-center gap-8 md:gap-12"
                    >
                      {/* 右端：ラベル（兼ヘッダー） */}
                      <div className="h-full py-4 flex flex-col items-center opacity-60 flex-shrink-0">
                        <p className="vertical-rl text-xs tracking-[0.3em] text-matsu font-serif mb-2">下の句を詠む</p>
                        <div className="h-16 w-[1px] bg-matsu/30 mx-auto" />
                      </div>

                      {/* 中央：入力エリア */}
                      <div className="h-full flex-1 max-w-[240px]">
                        <VerticalTextarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="ここに返歌をしたためる..."
                          className="h-full w-full text-lg bg-transparent border-none focus:ring-0 resize-none font-serif leading-loose tracking-widest"
                          autoFocus
                        />
                      </div>
                      
                      {/* 左端：アクションボタン（縦並び） */}
                      <div className="h-full flex flex-col justify-end gap-4 flex-shrink-0 pb-4">
                        <Button 
                          variant="musubi" 
                          size="lg" 
                          onClick={handleSubmit}
                          disabled={!reply.trim() || isSubmitting}
                          className="min-w-[120px] shadow-xl vertical-rl text-upright py-6 tracking-widest h-auto"
                        >
                          {isSubmitting ? "送信中..." : "返歌を送る"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowInput(false)}
                          className="text-matsu/60 hover:text-matsu vertical-rl text-upright py-4 tracking-widest h-auto"
                        >
                          戻る
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    /* 初期状態：アクション選択 */
                    <motion.div
                      key="action"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-8"
                    >
                      <div className="text-center space-y-4">
                        <p className="font-serif text-matsu/80 text-lg tracking-widest leading-loose">
                          この句に<br />心を寄せますか？
                        </p>
                      </div>

                      <Button 
                        variant="gold" 
                        size="xl"
                        onClick={() => setShowInput(true)}
                        className="py-8 px-12 text-xl tracking-[0.3em] font-serif border-gold shadow-gold/20"
                      >
                        下の句を詠む
                      </Button>

                      <p className="text-xs text-matsu/40 font-serif tracking-wider">
                        ※ 返歌を詠むと、お相手に通知が届きます
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
