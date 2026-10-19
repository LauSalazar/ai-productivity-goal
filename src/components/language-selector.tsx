"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { t, ALL_LANGUAGES } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSelector() {
  const { settings, updateSettings } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-label="Cambiar idioma"
        className="flex items-center gap-2 px-2"
      >
        <Globe size={16} />
        <span className="hidden sm:inline text-xs font-medium uppercase tracking-wide">
          {settings.language.toUpperCase()}
        </span>
        <ChevronDown size={14} className="ml-1" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-[#ede3d3] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {ALL_LANGUAGES.map((lng) => (
            <button
              key={lng.code}
              onClick={() => {
                updateSettings({ language: lng.code });
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                settings.language === lng.code
                  ? "bg-[#fdf3e3] text-[#b45309] font-semibold"
                  : "text-[#5c4a3a] hover:bg-[#f5f1ea]"
              }`}
            >
              {settings.language === lng.code && (
                <span className="text-[#b45309]">✓</span>
              )}
              {lng.code === "es" ? t("languageEs", settings.language) : t("languageEn", settings.language)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
