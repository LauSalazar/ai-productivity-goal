"use client";

import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Play, Clock, CheckCircle2, Plus } from "lucide-react";

interface DashboardProps {
  onCreateGoal: () => void;
}

export function Dashboard({ onCreateGoal }: DashboardProps) {
  const { hasActiveGoal, activeGoal, settings, setView } = useApp();
  const lang = settings.language;

  const handleCreate = onCreateGoal;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18181b]">{t("welcome", lang)}</h1>
          <p className="text-[#71717a] mt-1">{t("welcomeSub", lang)}</p>
        </div>
        {!hasActiveGoal && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreate}
            className="shadow-md"
          >
            <Plus size={18} className="mr-2" />
            {t("createGoal", lang)}
          </Button>
        )}
      </div>

      {!hasActiveGoal || !activeGoal ? (
        <Card padding="lg">
          <div className="text-center py-10">
            <Target size={48} className="mx-auto text-[#a1a1aa] mb-4" />
            <h2 className="text-lg font-semibold text-[#18181b] mb-2">
              {t("noActiveGoal", lang)}
            </h2>
            <p className="text-[#71717a] mb-6 max-w-md mx-auto">
              Define un único objetivo principal y deja que el asistente de IA te ayude a
              diagnosticarlo y planificar los primeros pasos.
            </p>
            <Button variant="primary" onClick={handleCreate} className="w-full sm:w-auto">
              {t("createNewGoal", lang)}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card padding="md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fdf3e3] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={24} className="text-[#b45309]" />
              </div>
              <div>
                <h2 className="font-semibold text-[#18181b]">{activeGoal?.title}</h2>
                <p className="text-sm text-[#71717a] mt-1">
                  {t("targetDate", lang)}:
                  {" "}
                  <time className="font-medium">
                    {activeGoal ? new Date(activeGoal.targetDate).toLocaleDateString(lang === "es" ? "es-ES" : "en-US") : "—"}
                  </time>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="ghost" size="sm" onClick={() => setView("focus")} className="w-full">
                <Play size={16} className="mr-2" />
                {t("focusMode", lang)}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView("reflection")} className="w-full">
                <Clock size={16} className="mr-2" />
                {t("dailyReflection", lang)}
              </Button>
            </div>
          </Card>
          <div className="text-sm text-[#71717a]">
            {t("onlyOneActive", lang)}
          </div>
        </>
      )}
    </div>
  );
}
