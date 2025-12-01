"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/lib/user-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { users, login } = useUser();

  return (
    <div className="min-h-screen bg-kinari flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-sm p-8 md:p-12 rounded-lg border border-hiwada/10 shadow-xl relative z-10 flex flex-col gap-8">
        
        <div className="text-center">
          <h1 className="text-3xl font-serif text-ai font-bold tracking-widest mb-2">門を開く</h1>
          <p className="text-xs text-hiwada/60">どなたとして入りますか？</p>
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
                className="w-full text-left p-4 bg-white/60 hover:bg-white border border-transparent hover:border-ai/20 rounded-md transition-all shadow-sm flex items-center justify-between group"
              >
                <div>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full mr-2 font-bold",
                    u.gender === "male" ? "bg-ai/10 text-ai" : "bg-shu/10 text-shu"
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
            <Button variant="outline" className="w-full py-3 border-dashed border-ai/30 text-ai hover:bg-ai/5">
              新しく名乗りを上げる (新規登録)
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
