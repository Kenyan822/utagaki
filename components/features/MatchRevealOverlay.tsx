"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/lib/user-context";
import { useRouter } from "next/navigation";

interface MatchRevealOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  partner: User | null;
  matchId?: string;
}

export function MatchRevealOverlay({ isOpen, onClose, partner, matchId }: MatchRevealOverlayProps) {
  const [step, setStep] = useState<"closed" | "opening" | "revealed">("closed");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setStep("closed");
      setTimeout(() => setStep("opening"), 800);
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
        className="fixed inset-0 z-[100] flex items-center justify-center"
        onClick={step === "revealed" ? handleClose : undefined}
      >
        {/* 豪華な背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-sumi via-sumi/95 to-sumi" />
        
        {/* 金箔散りばめ */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-kinpaku rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          
          {/* 相手の情報（御簾の奥にあるもの） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 後光 - 金色の光輪 */}
            <motion.div 
              initial={{ scale: 0, rotate: 0, opacity: 0 }}
              animate={step === "revealed" ? { scale: 2, rotate: 360, opacity: 0.4 } : {}}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.1) 40%, transparent 70%)",
              }}
            />

            {/* 第二の光輪 */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={step === "revealed" ? { scale: 1.5, opacity: 0.3 } : {}}
              transition={{ duration: 3, ease: "easeOut", delay: 0.3 }}
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(196,30,58,0.3) 0%, transparent 60%)",
              }}
            />

            {/* 相手のプロフィール */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={step === "revealed" ? { scale: 1, opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative z-10 flex flex-col items-center gap-8"
            >
              {/* アバター */}
              <div className="relative">
                {/* 外側の金縁 */}
                <div className="absolute -inset-3 rounded-full border-2 border-kinpaku/50 animate-pulse" />
                <div className="absolute -inset-5 rounded-full border border-kinpaku/30" />
                
                <div className="w-44 h-44 rounded-full border-4 border-kinpaku bg-gradient-to-b from-kinari to-[#f5f0e1] flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.5)] overflow-hidden">
                  <span className="text-7xl select-none">
                    {partner.gender === "male" ? (
                      <span className="text-matsu">殿</span>
                    ) : (
                      <span className="text-ume">姫</span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                {/* 縁結びメッセージ */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={step === "revealed" ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center gap-3 justify-center"
                >
                  <span className="text-kinpaku text-xl">✿</span>
                  <p className="text-kinpaku text-xl font-bold tracking-[0.3em]">
                    縁、結ばれたり
                  </p>
                  <span className="text-kinpaku text-xl">✿</span>
                </motion.div>

                {/* 相手の名前 */}
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={step === "revealed" ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-5xl font-serif text-kinari font-bold tracking-wider"
                >
                  {partner.name}
                </motion.h2>

                {/* 松竹梅装飾 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={step === "revealed" ? { opacity: 1 } : {}}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-center gap-6 text-3xl pt-4"
                >
                  <span className="text-matsu opacity-60">🌲</span>
                  <span className="text-kinpaku opacity-80">🎋</span>
                  <span className="text-ume opacity-60">🌸</span>
                </motion.div>
              </div>

              {/* チャットへ進むボタン */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={step === "revealed" ? { opacity: 1 } : {}}
                transition={{ delay: 2 }}
                onClick={handleClose}
                className="mt-8 px-10 py-4 bg-gradient-to-b from-kinpaku-light to-kinpaku text-sumi rounded-sm font-bold tracking-[0.2em] shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all border border-kinpaku-light/50"
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
            className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center justify-end"
            style={{ 
              background: `
                repeating-linear-gradient(
                  to bottom,
                  #d4a574 0px,
                  #d4a574 3px,
                  #c49a6c 4px,
                  #b8906a 5px,
                  #d4a574 6px
                )
              `,
              boxShadow: "0 10px 50px rgba(0,0,0,0.6), inset 0 -5px 20px rgba(0,0,0,0.2)"
            }}
          >
            {/* 上部の金装飾 */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-kinpaku/50 to-transparent" />
            
            {/* 御簾の装飾（紐） */}
            <div className="absolute bottom-[-60px] left-1/4 w-5 h-80 bg-gradient-to-b from-ume via-kurenai to-ume rounded-b-lg shadow-lg" />
            <div className="absolute bottom-[-60px] right-1/4 w-5 h-80 bg-gradient-to-b from-ume via-kurenai to-ume rounded-b-lg shadow-lg" />
            
            {/* 中央の豪華な結び目 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-28 h-28">
              <div className="absolute inset-0 bg-gradient-to-b from-kinpaku to-kinpaku-dark rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)]" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-kurenai drop-shadow-lg">
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="6" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
