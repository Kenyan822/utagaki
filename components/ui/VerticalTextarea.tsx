import { cn } from "@/lib/utils";
import React from "react";

interface VerticalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const VerticalTextarea = React.forwardRef<HTMLTextAreaElement, VerticalTextareaProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col items-center gap-3">
        {label && (
          <label className="text-sm tracking-[0.3em] text-hiwada font-medium">
            {label}
          </label>
        )}
        <div className="relative w-full max-w-[220px] aspect-[1/3] shochikubai-border bg-gradient-to-b from-white/80 to-white/60 shadow-inner">
          <div className="absolute inset-3 border border-dashed border-[rgba(211,180,99,0.5)] pointer-events-none" />
          <textarea
            ref={ref}
            className={cn(
              "w-full h-full p-8 resize-none bg-transparent",
              "border-0 focus:outline-none focus:ring-0",
              "vertical-rl text-upright text-xl tracking-[0.5em] leading-relaxed font-serif text-sumi",
              "placeholder:text-sumi/30",
              className
            )}
            placeholder={placeholder}
            {...props}
          />
          {/* 背景の罫線（便箋のようなガイドライン）をCSSで描画できれば理想だが、まずはシンプルに */}
        </div>
      </div>
    );
  }
);

VerticalTextarea.displayName = "VerticalTextarea";

