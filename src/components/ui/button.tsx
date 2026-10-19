"use client";

import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

function baseClasses(variant: ButtonVariant, size: "sm" | "md" | "lg"): string {
  const common =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<ButtonVariant, string> = {
    primary:
      common +
      " bg-[#b45309] text-white hover:bg-[#92400e] focus-visible:ring-[#b45309]/30 shadow-sm",
    secondary:
      common +
      " bg-[#ede3d3] text-[#5c4a3a] hover:bg-[#e3d4c2] focus-visible:ring-[#ede3d3]/40",
    ghost:
      common +
      " bg-transparent text-[#71717a] hover:bg-[#f5f1ea] focus-visible:ring-[#ede3d3]/40",
    danger:
      common +
      " bg-[#dc2626] text-white hover:bg-[#b91c1c] focus-visible:ring-[#dc2626]/30",
    success:
      common +
      " bg-[#16a34a] text-white hover:bg-[#15803d] focus-visible:ring-[#16a34a]/30",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return `${variants[variant]} ${sizes[size]}`;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  return (
    <button className={cn(baseClasses(variant, size), className)} {...rest}>
      {children}
    </button>
  );
}
