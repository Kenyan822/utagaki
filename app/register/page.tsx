"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const { register } = useUser();

  const handleRegister = () => {
    if (name && gender) {
      register(name, gender);
    }
  };

  return (
    <div className="shochikubai-canvas flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[rgba(138,27,69,0.18)] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[rgba(61,138,92,0.2)] to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-md shochikubai-panel p-8 md:p-12 relative z-10 flex flex-col gap-10">
        
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] text-hiwada/60 mb-2">松竹梅</p>
          <h1 className="text-3xl font-serif text-ai font-bold tracking-[0.4em] mb-2">新規登録</h1>
          <p className="text-xs text-hiwada/60 tracking-[0.3em]">門をくぐるための名乗りを上げてください</p>
        </div>

        {/* 入力フォーム群 */}
        <div className="flex flex-col gap-8">
          
          {/* 名前入力 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-hiwada font-medium text-center tracking-[0.4em]">お名前 (雅号)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 在原業平"
              className="w-full text-center py-3 border-b-2 border-ai/30 bg-transparent text-xl font-serif text-sumi focus:outline-none focus:border-ai placeholder:text-sumi/20 transition-colors"
            />
          </div>

          {/* 性別選択 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm text-hiwada font-medium text-center tracking-[0.4em]">性別</label>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setGender("male")}
                className={cn(
                  "flex-1 py-4 border rounded-lg transition-all font-serif text-lg relative overflow-hidden group bg-gradient-to-br from-white/40 to-transparent",
                  gender === "male" 
                    ? "bg-ai text-kinari border-ai shadow-md" 
                    : "bg-transparent text-sumi border-sumi/20 hover:bg-ai/5"
                )}
              >
                <span className="relative z-10">殿方</span>
                {gender === "male" && <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />}
              </button>
              <button
                onClick={() => setGender("female")}
                className={cn(
                  "flex-1 py-4 border rounded-lg transition-all font-serif text-lg relative overflow-hidden group bg-gradient-to-br from-white/40 to-transparent",
                  gender === "female" 
                    ? "bg-shu text-kinari border-shu shadow-md" 
                    : "bg-transparent text-sumi border-sumi/20 hover:bg-shu/5"
                )}
              >
                <span className="relative z-10">姫君</span>
                {gender === "female" && <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />}
              </button>
            </div>
          </div>

        </div>

        {/* 決定ボタン */}
        <div className="mt-4 flex flex-col gap-4">
          <Button 
            variant="musubi" 
            size="lg" 
            className="w-full py-4 text-lg font-bold shadow-lg"
            disabled={!name.trim() || !gender}
            onClick={handleRegister}
          >
            登録して始める
          </Button>
          <Link href="/login" className="text-center text-xs text-hiwada hover:underline">
            すでに名乗りを上げている方はこちら
          </Link>
        </div>

      </div>
    </div>
  );
}

