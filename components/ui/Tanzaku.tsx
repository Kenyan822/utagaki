import { cn } from "@/lib/utils";
import React from "react";

interface TanzakuProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  authorName?: string;
  variant?: "kinari" | "matsu" | "take" | "ume" | "miyabi" | "tsuki" | "mizu";
  vertical?: boolean;
}

export const Tanzaku = React.forwardRef<HTMLDivElement, TanzakuProps>(
  ({ className, content, authorName, variant = "kinari", vertical = true, ...props }, ref) => {
    
    // バリアントごとのスタイル定義
    // 高級感を出すため、グラデーション、シャドウ、ボーダーを強化
    const variants = {
      // 標準（生成り）: 最高級和紙の質感
      kinari: "bg-[#fcfaf2] border-gold/40 text-sumi shadow-md",
      
      // 松（Matsu）: 深遠な常盤色
      matsu: "bg-linear-to-b from-[#1a3c30] via-[#2a5544] to-[#1a3c30] border-gold text-[#fcfaf2] shadow-xl",
      
      // 竹（Take）: 青々とした若竹
      take: "bg-linear-to-b from-[#5c7a4a] via-[#7a9966] to-[#5c7a4a] border-gold text-[#fcfaf2] shadow-xl",
      
      // 梅（Ume）: 高貴な紅梅
      ume: "bg-linear-to-b from-[#9e3a5a] via-[#d65f85] to-[#9e3a5a] border-gold text-[#fcfaf2] shadow-xl",
      
      // 雅（Miyabi）: 幽玄な江戸紫
      miyabi: "bg-linear-to-b from-[#4a3b69] via-[#6a5690] to-[#4a3b69] border-gold text-[#fcfaf2] shadow-xl",
      
      // 月（Tsuki）: 黄金の輝き（山吹色・金茶）
      tsuki: "bg-linear-to-b from-[#c7b370] via-[#e6d089] to-[#c7b370] border-gold-light text-[#2d2d2d] shadow-xl",
      
      // 水（Mizu）: 清らかな瑠璃色
      mizu: "bg-linear-to-b from-[#2a4e69] via-[#4a7291] to-[#2a4e69] border-gold text-[#fcfaf2] shadow-xl",
    };

    const isDarkVariant = variant !== "kinari" && variant !== "tsuki";

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-between transition-all duration-700 ease-out hover:scale-[1.03] hover:-translate-y-1 cursor-pointer overflow-hidden isolate",
          // 短冊の比率と形状
          "w-32 min-h-[420px] md:w-40 md:min-h-[520px] py-10 px-6",
          // 枠線（二重線風のエフェクトを内側に持つため、外枠はシンプルに）
          "border border-solid rounded-sm",
          variants[variant],
          className
        )}
        {...props}
      >
        {/* --- テクスチャレイヤー --- */}
        {/* 和紙の繊維感（ノイズ） */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 雲竜紙のような繊維パターン（CSS描画） */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-[-20%] w-[140%] h-[1px] bg-current rotate-12 blur-[1px]" />
          <div className="absolute top-40 left-[-20%] w-[140%] h-[2px] bg-current -rotate-6 blur-[2px]" />
          <div className="absolute bottom-20 left-[-20%] w-[140%] h-[1px] bg-current rotate-3 blur-[1px]" />
        </div>

        {/* --- 装飾レイヤー --- */}
        
        {/* 枠の内側の飾り線（金箔押し風） */}
        <div className="absolute inset-2 border border-gold/30 pointer-events-none z-10" />
        <div className="absolute inset-3 border border-gold/10 pointer-events-none z-10" />

        {/* 四隅の金箔装飾（コーナー） */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/60 z-10" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/60 z-10" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/60 z-10" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/60 z-10" />

        {/* --- コンテンツレイヤー --- */}

        {/* 紐を通す穴と紐 */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          {/* 紐 */}
          <div className="w-[2px] h-16 bg-linear-to-b from-gold/0 via-gold/80 to-gold/0 absolute -top-12" />
          
          {/* 穴 */}
          <div className={cn(
            "w-4 h-4 rounded-full border-2 shadow-inner flex items-center justify-center",
            isDarkVariant ? "bg-[#1a1a1a] border-gold" : "bg-[#f0f0f0] border-gold/50"
          )}>
            <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
          </div>
        </div>

        {/* 句（メインテキスト） */}
        <div className={cn(
          "flex-1 flex items-center justify-center w-full relative z-20 py-8",
          vertical && "vertical-rl text-upright font-serif",
          // 高級感のある文字スタイル
          "text-2xl md:text-3xl leading-relaxed tracking-[0.2em]",
          isDarkVariant ? "text-[#fcfaf2] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" : "text-[#1a1a1a]"
        )}>
          {/* 文字の周りのぼんやりとした光彩（可読性向上と幽玄さ） */}
          {isDarkVariant && (
            <span className="absolute inset-0 blur-md bg-white/5 -z-10" />
          )}
          {content}
        </div>

        {/* 署名 */}
        {authorName && (
          <div className={cn(
            "relative z-20 mt-4 font-serif text-sm opacity-80",
            vertical && "vertical-rl text-upright tracking-widest",
             isDarkVariant ? "text-gold-light" : "text-matsu"
          )}>
            <span className="text-[0.8em] opacity-70 mr-2">詠み人</span>
            {authorName}
            {/* 落款（ハンコ）風の装飾 */}
            <span className={cn(
              "mt-3 w-5 h-5 border border-red-800/60 rounded-sm flex items-center justify-center text-[8px] text-red-800 select-none opacity-70",
              vertical ? "mx-auto" : "inline-flex ml-2"
            )}>
              印
            </span>
          </div>
        )}

        {/* 下部の金砂子（きんすなご）風グラデーション */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gold/20 to-transparent pointer-events-none z-10 mix-blend-plus-lighter" />
      </div>
    );
  }
);

Tanzaku.displayName = "Tanzaku";
