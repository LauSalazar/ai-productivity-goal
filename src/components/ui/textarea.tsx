"use client";

import * as React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Textarea({
  label,
  error,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-[#5c4a3a] block">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "block w-full rounded-xl border border-[#e3d4c2] bg-white px-4 py-2.5 text-[#18181b]",
          "placeholder:text-[#a1a1aa]",
          "focus-visible:border-[#b45309] focus-visible:ring-1 focus-visible:ring-[#b45309]",
          "disabled:bg-[#f5f1ea] disabled:text-[#a1a1aa]",
          error && "border-[#dc2626]",
          className
        )}
        rows={rows}
        {...rest}
      />
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
    </div>
  );
}
