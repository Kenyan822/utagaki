import { cn } from "@/lib/utils";
import React from "react";

interface TanzakuProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  authorName?: string;
  variant?: "kinari" | "sakura" | "mizu" | "kusa";
  vertical?: boolean;
}

export const Tanzaku = React.forwardRef<HTMLDivElement, TanzakuProps>(
  ({ className, content, authorName, variant = "kinari", vertical = true, ...props }, ref) => {
    
    const variants = {
      kinari: "bg-kinari border-hiwada/10",
      sakura: "bg-[#fdeff2] border-pink-200", // 桜色
      mizu: "bg-[#eaf4fc] border-blue-200",   // 水色
      kusa: "bg-[#f5f9e8] border-green-200",  // 若草色（淡）
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative shadow-md p-6 border flex flex-col items-center justify-between transition-transform hover:scale-[1.02] cursor-pointer",
          // 短冊らしい比率 (縦長)
          "w-24 min-h-[300px] md:w-32 md:min-h-[400px]",
          variants[variant],
          className
        )}
        {...props}
      >
        {/* 紐を通す穴の装飾 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-sumi/10 border border-sumi/20" />

        {/* 本文エリア: 縦書き・中央揃え */}
        <div className={cn(
          "flex-1 flex items-center justify-center w-full py-8",
          vertical && "vertical-rl text-upright font-serif text-xl md:text-2xl leading-relaxed tracking-widest text-sumi"
        )}>
          {content}
        </div>

        {/* 署名エリア */}
        {authorName && (
          <div className={cn(
            "text-xs md:text-sm text-hiwada/80 font-serif mt-2",
            vertical && "vertical-rl text-upright tracking-wide"
          )}>
            {authorName}
          </div>
        )}
      </div>
    );
  }
);

Tanzaku.displayName = "Tanzaku";

