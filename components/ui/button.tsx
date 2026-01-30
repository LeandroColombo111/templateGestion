"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-400/70 disabled:opacity-60",
          variant === "default" &&
            "bg-mint-400 text-slate-950 hover:bg-mint-500",
          variant === "outline" &&
            "border border-slate-700 text-slate-100 hover:bg-slate-800",
          variant === "ghost" &&
            "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
          size === "sm" && "px-3 py-1 text-xs",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-5 py-3 text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

