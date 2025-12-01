"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/lib/user-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { users, login } = useUser();

  return (
    <div className="shochikubai-canvas flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-[rgba(138,27,69,0.18)] to-transparent blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-[rgba(13,47,38,0.2)] to-transparent blur-3xl" />
      </div>
      <div className="w-full max-w-md shochikubai-panel p-8 md:p-12 relative z-10 flex flex-col gap-8">
        
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] text-hiwada/60 mb-2">松竹梅</p>
          <h1 className="text-3xl font-serif text-ai font-bold tracking-[0.4em] mb-2">門を開く</h1>
          <p className="text-xs text-hiwada/60 tracking-[0.3em]">どなたとして入りますか？</p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8 text-hiwada/60">
            <p className="mb-4">まだ誰も名乗りを上げていません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => login(u.id)}
                className="w-full text-left p-4 shochikubai-card hover:-translate-y-0.5 border border-white/40 hover:border-kinari/80 transition-all flex items-center justify-between group"
              >
                <div>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full mr-2 font-bold tracking-[0.2em]",
                    u.gender === "male" ? "bg-ai/20 text-ai" : "bg-shu/20 text-shu"
                  )}>
                    {u.gender === "male" ? "殿" : "姫"}
                  </span>
                  <span className="font-serif text-lg text-sumi group-hover:text-ai transition-colors">{u.name}</span>
                </div>
                <span className="text-hiwada/40 group-hover:text-ai/60">→</span>
              </button>
            ))}
          </div>
        )}

        <div className="pt-6 border-t border-hiwada/10">
          <Link href="/register">
            <Button variant="outline" className="w-full py-3 border-dashed border-ai/30 text-ai hover:bg-white/30">
              新しく名乗りを上げる (新規登録)
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
