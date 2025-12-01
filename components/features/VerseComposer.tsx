"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";
import { Button } from "@/components/ui/Button";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { cn } from "@/lib/utils";
import { useGame, VerseVariant } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";

const VARIANTS: { id: VerseVariant; label: string; description: string; gradient: string }[] = [
  { id: "matsu", label: "松", description: "常磐の深緑で凛と", gradient: "from-[#0b2f26] via-[#13553b] to-[#1e6b4b]" },
  { id: "take", label: "竹", description: "伸びやかな翠竹", gradient: "from-[#3d8a5c] via-[#59b274] to-[#94d6a4]" },
  { id: "ume", label: "梅", description: "華やかな紅梅", gradient: "from-[#8a1b45] via-[#b93f6b] to-[#d56b8d]" },
  { id: "tsuki", label: "月", description: "幻想的な黄金の輝き", gradient: "from-[#c7b370] via-[#e6d089] to-[#c7b370]" },
  { id: "mizu", label: "水", description: "清らかな瑠璃の流れ", gradient: "from-[#2a4e69] via-[#4a7291] to-[#2a4e69]" },
];

export function VerseComposer() {
  const [content, setContent] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<VerseVariant>("matsu");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addVerse } = useGame();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!user) return; // ログインしていない場合は送信不可
    
    setIsSubmitting(true);
    
    // 擬似的な遅延
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Contextに追加
    addVerse(content, user, selectedVariant);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // 送信完了画面
  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col items-center justify-center h-full text-center space-y-6"
      >
        <div className="text-6xl text-ume animate-pulse">✿</div>
        <div>
          <h2 className="text-2xl font-serif text-matsu mb-2">流しました</h2>
          <p className="text-take/80">良い縁がありますように。</p>
        </div>
        <div className="pt-8">
          <Button 
            variant="outline" 
            onClick={() => {
              setContent("");
              setIsSubmitted(false);
            }}
            className="border-ume text-ume hover:bg-ume/10"
          >
            もう一首詠む
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 items-start justify-center max-w-6xl mx-auto p-4">
      {/* 左側: 入力フォーム */}
      <div className="flex-1 w-full max-w-xl bg-kinari/80 backdrop-blur-sm border border-gold/30 rounded-lg shadow-lg p-8 space-y-8">
        <div className="text-center space-y-1">
          <p className="text-sm tracking-[0.4em] text-matsu/60 font-serif">詠む心を整える</p>
          <h2 className="text-2xl font-serif text-matsu tracking-widest">一首詠む</h2>
        </div>
        
        <div className="flex flex-col gap-8">
          {/* テキスト入力 */}
          <div className="flex justify-center bg-white/40 p-6 rounded-xl border border-white/60 shadow-inner">
             <VerticalTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="五・七・五 または 自由律"
              className="h-72 md:h-96 w-32 md:w-44 text-2xl"
            />
          </div>

          {/* 紙の選択 */}
          <div className="space-y-4">
            <label className="text-sm text-matsu/80 font-medium block text-center tracking-[0.4em]">
              短冊の意匠を選ぶ
            </label>
            <div className="flex flex-col gap-3">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id as any)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 shadow-sm transition-all relative overflow-hidden group",
                    selectedVariant === v.id
                      ? "ring-2 ring-offset-2 ring-gold scale-[1.02]"
                      : "hover:scale-[1.01] opacity-90 hover:opacity-100",
                    // グラデーション背景
                    `bg-linear-to-r ${v.gradient}`
                  )}
                  title={v.label}
                >
                  {/* 光沢エフェクト */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                  
                  <div className="flex w-full items-center justify-between relative z-10 text-kinari">
                    <span className="text-xl font-serif font-bold drop-shadow-md">{v.label}</span>
                    <span className="text-[10px] md:text-xs tracking-[0.2em] opacity-90 font-serif">{v.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="pt-4 text-center">
            <Button 
              variant="musubi" 
              size="lg" 
              onClick={handleSubmit} 
              disabled={!content.trim() || isSubmitting}
              className="w-full md:w-auto px-12 py-6 text-lg"
            >
              {isSubmitting ? "流しています..." : "川に流す"}
            </Button>
          </div>
        </div>
      </div>

      {/* 右側: プレビュー */}
      <div className="hidden md:flex flex-col items-center justify-center pt-6 flex-1 space-y-6 sticky top-24">
        <div className="bg-white/60 p-6 rounded border border-gold/20 text-center w-full max-w-sm">
          <p className="text-sm text-matsu/60 tracking-[0.4em] mb-2">御披露目</p>
          <p className="text-lg font-serif text-matsu">流れる前の佇まい</p>
        </div>
        <div className="relative p-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <Tanzaku 
            content={content || "ここに句が入ります"} 
            variant={selectedVariant}
            authorName="あなた"
            className="scale-110 shadow-2xl relative z-10"
          />
        </div>
      </div>
    </div>
  );
}
