"use client";

import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Clock, Flame, BarChart3, TrendingUp } from "lucide-react";

export function Stats() {
  const {
    activeGoal,
    hasActiveGoal,
    settings,
    streakDays,
    totalFocusMinutes,
    focusMinutesByDay,
  } = useApp();
  const lang = settings.language;

  if (!hasActiveGoal || !activeGoal) {
    return (
      <Card padding="lg" className="text-center py-12">
        <Clock size={40} className="mx-auto text-[#a1a1aa] mb-4" />
        <h2 className="text-lg font-bold text-[#18181b] mb-2">{t("stats", lang)}</h2>
        <p className="text-[#71717a]">
          {t("noStats", lang)}
        </p>
      </Card>
    );
  }

  const streak = streakDays(activeGoal.id);
  const totalMinutes = totalFocusMinutes(activeGoal.id);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const byDay = focusMinutesByDay(activeGoal.id);
  const days = Object.keys(byDay).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#18181b]">{t("stats", lang)}</h2>
          <p className="text-[#71717a]">{activeGoal.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fdf3e3] flex items-center justify-center">
              <Flame size={20} className="text-[#b45309]" />
            </div>
            <div>
              <div className="text-xs text-[#71717a] uppercase tracking-wider">
                {t("streak", lang)}
              </div>
              <div className="text-3xl font-bold text-[#18181b]">{streak}</div>
              <div className="text-xs text-[#b45309] font-medium">{t("streakDays", lang)}</div>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] flex items-center justify-center">
              <Clock size={20} className="text-[#16a34a]" />
            </div>
            <div>
              <div className="text-xs text-[#71717a] uppercase tracking-wider">
                {t("totalFocusTime", lang)}
              </div>
              <div className="text-3xl font-bold text-[#18181b]">{hours}</div>
              <div className="text-xs text-[#16a34a] font-medium">
                {minutes} {t("minutes", lang)}
              </div>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fdf3e3] flex items-center justify-center">
              <TrendingUp size={20} className="text-[#b45309]" />
            </div>
            <div>
              <div className="text-xs text-[#71717a] uppercase tracking-wider">
                Días con enfoque
              </div>
              <div className="text-3xl font-bold text-[#18181b]">{days.length}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-[#b45309]" />
          <h3 className="text-sm font-semibold text-[#18181b]">Enfoque por día</h3>
        </div>
        <div className="h-48 flex items-end gap-2 w-full max-w-md">
          {days.length === 0 ? (
            <p className="text-[#71717a] text-center mt-10">{t("noStats", lang)}</p>
          ) : (
            days.map((day) => {
              const mins = byDay[day];
              const max = Math.max(...days.map((d) => byDay[d]));
              const height = max ? (mins / max) * 100 : 0;
              const label = day.slice(5);
              return (
                <div key={day} className="flex flex-col items-center gap-2 w-full">
                  <div
                    className={`w-full h-full bg-[#b45309]/60 rounded-t-sm transition-all duration-500`}
                    style={{ height: `${height}%` }}
                    title={`${label}: ${mins} min`}
                  ></div>
                  <span className="text-[10px] text-[#a1a1aa]">{label}</span>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
