import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "musubi" | "gold" | "tsuki" | "mizu";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    // 共通スタイル: 明朝体、少しゆったりとした字間
    const baseStyles = "inline-flex items-center justify-center rounded-md font-serif font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-50 tracking-wide cursor-pointer relative overflow-hidden";
    
    const variants = {
      // 松（Matsu）: 深緑、威厳、落ち着き
      primary: "bg-matsu text-kinari hover:bg-matsu/90 shadow-md border border-matsu/50 hover:shadow-lg hover:-translate-y-0.5",
      
      // 竹（Take）: 成長、若々しさ
      secondary: "bg-take text-kinari hover:bg-take/90 shadow-sm hover:shadow-md hover:-translate-y-0.5",
      
      // 枠線（金と松）
      outline: "border border-gold text-matsu hover:bg-gold/10 hover:border-gold-light",
      
      // ゴースト
      ghost: "text-sumi hover:bg-matsu/5 hover:text-matsu",
      
      // 結び・梅（Ume）: 華やか、重要アクション
      musubi: "bg-ume text-kinari border-2 border-gold/50 hover:border-gold hover:bg-ume/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 shadow-ume/20",
      
      // 金（Gold）: 最も豪華、特別
      gold: "bg-linear-to-br from-gold via-gold-light to-gold text-matsu font-bold border border-gold-light/50 shadow-lg hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 shadow-gold/30",
      
      // 月（Tsuki）: 黄金色、幻想的
      tsuki: "bg-linear-to-br from-[#c7b370] to-[#e6d089] text-[#2d2d2d] border border-gold hover:brightness-110 shadow-lg hover:shadow-xl hover:-translate-y-0.5",

      // 水（Mizu）: 瑠璃色、清らか
      mizu: "bg-linear-to-br from-[#2a4e69] to-[#4a7291] text-kinari border border-blue-300/30 hover:brightness-110 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs",
      md: "h-11 px-6 text-sm", // 少し高さを増して優雅に
      lg: "h-14 px-8 text-base",
      xl: "h-16 px-10 text-lg min-w-[200px]", // 新規: 特に強調したいボタン用
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* 光沢エフェクト (GoldとMusubiのみ) */}
        {(variant === 'gold' || variant === 'musubi' || variant === 'tsuki') && (
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1s_infinite]" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {props.children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
