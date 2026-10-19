"use client";

import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Card({ children, className, padding = "md", ...rest }: CardProps) {
  const paddings: Record<string, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#ede3d3] shadow-sm",
        paddings[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
