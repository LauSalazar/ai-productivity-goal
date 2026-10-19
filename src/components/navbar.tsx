"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";
import {
  LayoutDashboard,
  Target,
  Play,
  Clock,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";

const navItems: Array<{
  id: "dashboard" | "goal" | "focus" | "reflection" | "stats" | "settings";
  labelKey: TranslationKey;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "dashboard", labelKey: "welcome", icon: LayoutDashboard },
  { id: "goal", labelKey: "activeGoal", icon: Target },
  { id: "focus", labelKey: "focusMode", icon: Play },
  { id: "reflection", labelKey: "dailyReflection", icon: Clock },
  { id: "stats", labelKey: "stats", icon: BarChart3 },
  { id: "settings", labelKey: "settings", icon: Settings },
];

export function Navbar() {
  const { view, setView, activeGoal, hasActiveGoal, settings } = useApp();
  const lang = settings.language;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 border-b border-[#ede3d3] bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setView("dashboard");
              setMobileOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#b45309] flex items-center justify-center">
              <span className="text-white font-bold text-xs">1</span>
            </div>
            <span className="font-semibold text-[#18181b] tracking-tight">
              Enfoque Uno
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[#5c4a3a] hover:bg-[#f5f1ea] focus-visible:ring-2 focus-visible:ring-[#b45309]"
            aria-label="Menú"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-full md:hidden bg-white border-r border-[#ede3d3] transform transition-transform duration-300 z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = view === item.id;
            const locked =
              (item.id === "focus" || item.id === "reflection" || item.id === "stats") &&
              !hasActiveGoal;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (locked) return;
                  setView(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  active
                    ? "bg-[#fdf3e3] text-[#b45309] font-semibold shadow-sm"
                    : locked
                    ? "text-[#a1a1aa]"
                    : "text-[#5c4a3a] hover:bg-[#f5f1ea]"
                }`}
                disabled={locked}
                aria-disabled={locked}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">
                  {active ? "▸ " : ""}{t(item.labelKey, lang)}
                </span>
                {locked && (
                  <span className="ml-auto text-[10px] text-[#a1a1aa] uppercase tracking-wider">
                    Bloqueado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-1 px-4 py-3 border-t md:border-t-0">
        {navItems.map((item) => {
          const active = view === item.id;
          const locked =
            (item.id === "focus" || item.id === "reflection" || item.id === "stats") &&
            !hasActiveGoal;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (locked) return;
                setView(item.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#fdf3e3] text-[#b45309] shadow-sm"
                  : locked
                  ? "text-[#a1a1aa]"
                  : "text-[#5c4a3a] hover:bg-[#f5f1ea]"
              }`}
              disabled={locked}
              aria-disabled={locked}
              title={
                locked ? t("onlyOneActive", lang) : undefined
              }
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{t(item.labelKey, lang)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
