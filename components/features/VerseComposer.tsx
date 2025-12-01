"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";
import { Button } from "@/components/ui/Button";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { cn } from "@/lib/utils";
import { useGame } from "@/lib/game-context";
import { useUser } from "@/lib/user-context";

const VARIANTS = [
  { id: "kinari", label: "生成", color: "bg-kinari" },
  { id: "sakura", label: "桜", color: "bg-[#fdeff2]" },
  { id: "mizu", label: "水", color: "bg-[#eaf4fc]" },
  { id: "kusa", label: "若草", color: "bg-[#f5f9e8]" },
] as const;

export function VerseComposer() {
  const [content, setContent] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<"kinari" | "sakura" | "mizu" | "kusa">("kinari");
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
        <div className="text-6xl text-shu animate-pulse">✿</div>
        <div>
          <h2 className="text-2xl font-serif text-ai mb-2">流しました</h2>
          <p className="text-hiwada">良い縁がありますように。</p>
        </div>
        <div className="pt-8">
          <Button 
            variant="outline" 
            onClick={() => {
              setContent("");
              setIsSubmitted(false);
            }}
            className="border-shu text-shu hover:bg-shu/10"
          >
            もう一首詠む
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center max-w-5xl mx-auto p-4">
      {/* 左側: 入力フォーム */}
      <div className="flex-1 w-full max-w-md bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-hiwada/10">
        <h2 className="text-xl font-serif text-ai mb-6 text-center">上の句を詠む</h2>
        
        <div className="flex flex-col gap-6">
          {/* テキスト入力 */}
          <div className="flex justify-center bg-kinari p-4 rounded border border-black/5 shadow-inner">
             <VerticalTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="五・七・五 または 自由律"
              className="h-64 md:h-80 w-32 md:w-40 text-xl"
            />
          </div>

          {/* 紙の選択 */}
          <div className="space-y-2">
            <label className="text-sm text-hiwada font-medium block text-center">短冊の色を選ぶ</label>
            <div className="flex justify-center gap-3">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id as any)}
                  className={cn(
                    "w-8 h-8 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110",
                    v.color,
                    selectedVariant === v.id && "ring-2 ring-ai ring-offset-2"
                  )}
                  title={v.label}
                />
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
              className="w-full md:w-auto px-12"
            >
              {isSubmitting ? "流しています..." : "川に流す"}
            </Button>
          </div>
        </div>
      </div>

      {/* 右側: プレビュー */}
      <div className="hidden md:flex flex-col items-center justify-center pt-8">
        <p className="text-sm text-hiwada/60 mb-4 font-serif">プレビュー</p>
        <Tanzaku 
          content={content || "ここに句が入ります"} 
          variant={selectedVariant}
          authorName="あなた"
          className="scale-110 shadow-xl"
        />
      </div>
    </div>
  );
}

