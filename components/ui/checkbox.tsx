"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-slate-600 bg-slate-950 text-mint-400 focus-visible:ring-2 focus-visible:ring-mint-400/70",
        className
      )}
      {...props}
    />
  )
);

Checkbox.displayName = "Checkbox";
