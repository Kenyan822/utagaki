import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "musubi";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-ai text-kinari hover:bg-ai/90 shadow-sm",
      secondary: "bg-hiwada text-kinari hover:bg-hiwada/90 shadow-sm",
      outline: "border border-ai text-ai hover:bg-ai/10",
      ghost: "text-sumi hover:bg-sumi/5",
      musubi: "bg-shu text-kinari hover:bg-shu/90 shadow-md border-b-2 border-red-800 active:border-b-0 active:translate-y-[2px]", // 結びボタン用：立体感
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

