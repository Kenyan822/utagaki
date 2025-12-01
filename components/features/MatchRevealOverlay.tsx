"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/user-context";
import { useRouter } from "next/navigation";

interface MatchRevealOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  partner: User | null; // マッチング相手
  matchId?: string; // 追加: マッチIDがあればチャットへ遷移
}

export function MatchRevealOverlay({ isOpen, onClose, partner, matchId }: MatchRevealOverlayProps) {
  const [step, setStep] = useState<"closed" | "opening" | "revealed">("closed");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setStep("closed");
      // 1. 御簾が降りている状態からスタート
      // 2. 少し待ってから御簾が上がる
      setTimeout(() => setStep("opening"), 800);
      // 3. 完全に上がりきって相手が表示される
      setTimeout(() => setStep("revealed"), 2500);
    } else {
      setStep("closed");
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    if (matchId) {
      router.push(`/chat/${matchId}`);
    }
  };

  if (!isOpen || !partner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-sumi/90 backdrop-blur-sm"
        onClick={step === "revealed" ? handleClose : undefined}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* 相手の情報（御簾の奥にあるもの） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 後光 */}
            <motion.div 
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={step === "revealed" ? { scale: 1.5, rotate: 180, opacity: 0.5 } : {}}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute w-[800px] h-[800px] bg-gradient-radial from-shu/30 to-transparent rounded-full pointer-events-none"
            />

            {/* 相手の顔（アイコン） */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={step === "revealed" ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
              <div className="w-40 h-40 rounded-full border-4 border-shu bg-kinari flex items-center justify-center shadow-[0_0_50px_rgba(235,97,1,0.5)] overflow-hidden">
                {/* 簡易アバター表示 */}
                <span className="text-6xl text-shu font-serif select-none">
                  {partner.gender === "male" ? "殿" : "姫"}
                </span>
              </div>
              
              <div className="text-center space-y-2">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={step === "revealed" ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-shu text-lg font-bold tracking-widest"
                >
                  縁、結ばれたり
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={step === "revealed" ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-4xl font-serif text-kinari font-bold"
                >
                  {partner.name}
                </motion.h2>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={step === "revealed" ? { opacity: 1 } : {}}
                transition={{ delay: 2 }}
                onClick={handleClose}
                className="mt-8 px-8 py-3 border border-kinari/30 text-kinari rounded-full hover:bg-kinari/10 transition-colors text-sm tracking-widest"
              >
                文（ふみ）を交わす
              </motion.button>
            </motion.div>
          </div>

          {/* 御簾（Sudare）アニメーション */}
          <motion.div
            initial={{ height: "120%" }}
            animate={step !== "closed" ? { height: "0%" } : { height: "120%" }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-0 left-0 right-0 bg-[#e6cda3] z-20 border-b-8 border-hiwada flex flex-col items-center justify-end shadow-2xl"
            style={{ 
              backgroundImage: "repeating-linear-gradient(to bottom, #e6cda3, #e6cda3 4px, #dbb680 5px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            {/* 御簾の装飾（紐や房） */}
            <div className="absolute bottom-[-40px] left-1/4 w-4 h-60 bg-shu rounded-b-lg shadow-lg" />
            <div className="absolute bottom-[-40px] right-1/4 w-4 h-60 bg-shu rounded-b-lg shadow-lg" />
            
            {/* 中央の結び目 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24">
               <svg viewBox="0 0 100 100" className="w-full h-full text-shu drop-shadow-lg">
                 <path d="M50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 20 50 20" fill="none" stroke="currentColor" strokeWidth="8" />
                 <path d="M50 20 L 50 80 M 20 50 L 80 50" stroke="currentColor" strokeWidth="8" />
               </svg>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
