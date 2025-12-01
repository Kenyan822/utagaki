import { cn } from "@/lib/utils";
import React from "react";

interface VerticalTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const VerticalTextarea = React.forwardRef<HTMLTextAreaElement, VerticalTextareaProps>(
  ({ className, label, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col items-center gap-2">
        {label && (
          <label className="text-sm text-hiwada font-medium">{label}</label>
        )}
        <div className="relative w-full max-w-[200px] aspect-[1/3]">
          <textarea
            ref={ref}
            className={cn(
              "w-full h-full p-6 resize-none",
              "bg-kinari border-2 border-ai/20 rounded-sm focus:border-ai focus:ring-2 focus:ring-ai/20 focus:outline-none",
              "vertical-rl text-upright text-lg tracking-widest leading-loose font-serif text-sumi",
              "placeholder:text-sumi/30",
              "shadow-inner",
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

