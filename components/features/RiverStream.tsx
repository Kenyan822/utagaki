"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { VerseDetailModal } from "./VerseDetailModal";
import { useGame, VerseVariant } from "@/lib/game-context";

const getVariant = (v: string) => {
  if (["kinari", "sakura", "mizu", "kusa"].includes(v)) return v as any;
  return "kinari";
};

// レーン数（画面の横幅を何分割するか）
const LANE_COUNT = 4; 

export function RiverStream() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const { verses } = useGame(); // Contextからデータを取得

  useEffect(() => {
    // データソースを verses (Context) に変更
    // ただし、数が少ないと寂しいので、少し増幅させる
    // NOTE: versesのスプレッド展開 (...) を行う前に、versesが反復可能か確認するか、配列であることを保証する
    // useVerses の初期値が undefined の場合のエラーガードは Context hook 内にあるが、念のため
    const sourceVerses = Array.isArray(verses) ? verses : [];
    const baseItems = [...sourceVerses];
    
    // 足りない場合は繰り返す
    if (sourceVerses.length > 0) {
      while(baseItems.length < 20) {
         // ランダムに選んで追加
         const randomVerse = sourceVerses[Math.floor(Math.random() * sourceVerses.length)];
         if (randomVerse) {
            baseItems.push(randomVerse);
         }
      }
    }
    
    // レーンごとに最後のアイテムの終了時間を管理して重なりを防ぐ簡易ロジック
    const laneDelays = new Array(LANE_COUNT).fill(0).map(() => Math.random() * 10);

    const generatedItems = baseItems.map((item, i) => {
      // 既存ロジックと同じ
      const lane = i % LANE_COUNT;
      const startDelay = laneDelays[lane];
      const interval = Math.random() * 15 + 30; 
      laneDelays[lane] += interval;

      return {
        ...item,
        uniqueId: `${item.id}-${i}`, // IDが重複しないようにインデックスを付与
        lane: lane,
        xOffset: Math.random() * 20 - 10, 
        duration: Math.random() * 20 + 40,
        delay: startDelay,
      };
    });

    setItems(generatedItems);
  }, [verses]); // versesが変わったら再生成

  return (
    <>
      <div className="relative w-full h-screen overflow-hidden bg-ai/10">
        {/* 川の背景: 縦に流れるイメージ */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 animate-pulse" />
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="water-v" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* 縦方向の波紋イメージ */}
                <path d="M50 0 Q 60 25 50 50 T 50 100" fill="none" stroke="currentColor" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#water-v)" className="text-ai" />
          </svg>
        </div>

        {/* どんぶらこエリア */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {items.map((item) => (
            <FloatingTanzakuVertical 
              key={item.uniqueId} 
              item={item} 
              onClick={() => setSelectedVerse(item)}
            />
          ))}
        </div>
      </div>

      {/* 詳細・返信モーダル */}
      <VerseDetailModal
        isOpen={!!selectedVerse}
        onClose={() => setSelectedVerse(null)}
        verse={selectedVerse}
      />
    </>
  );
}

function FloatingTanzakuVertical({ item, onClick }: { item: any, onClick: () => void }) {
  const controls = useAnimationControls();

  useEffect(() => {
    // 画面上外(-50vh) から 下外(150vh) へ移動
    // item.delay が変更された場合などに備えて、アニメーションを再設定
    controls.start({
      y: ["-50vh", "150vh"],
      x: [0, 10, -10, 0], // 左右にゆらゆら
      rotate: [0, 2, -2, 0], // 微妙に回転
      transition: {
        y: {
          duration: item.duration,
          repeat: Infinity,
          ease: "linear",
          delay: item.delay,
        },
        x: {
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        rotate: {
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }
      }
    });
  }, [controls, item.duration, item.delay]); // item全体ではなく必要なプロパティのみ依存させる

  // レーンの中心位置 (%)
  const laneCenter = (100 / LANE_COUNT) * item.lane + (100 / LANE_COUNT / 2);

  return (
    <motion.div
      animate={controls}
      initial={{ y: "-50vh" }}
      style={{
        position: "absolute",
        left: `${laneCenter + item.xOffset}%`,
        // top は animation で制御
      }}
      className="pointer-events-auto cursor-pointer" // 親でnoneにしているのでここでautoに戻す
      whileHover={{ 
        scale: 1.1, 
        zIndex: 50,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
    >
      <Tanzaku 
        content={item.content} 
        authorName={item.author.name} 
        variant={getVariant(item.variant)}
        className="shadow-xl"
      />
    </motion.div>
  );
}
