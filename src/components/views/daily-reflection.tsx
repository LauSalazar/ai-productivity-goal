"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle2, Calendar } from "lucide-react";

export function DailyReflection() {
  const { settings, saveReflection, getReflection } = useApp();
  const lang = settings.language;

  const today = new Date().toISOString().slice(0, 10);
  const [progress, setProgress] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const r = getReflection(today);
    if (r) {
      setProgress(r.progress);
      setObstacle(r.obstacle);
      setSaved(true);
    }
  }, [getReflection, today]);

  const handleSave = () => {
    saveReflection(today, progress, obstacle);
    setSaved(true);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={32} className="text-[#b45309]" />
          <div>
            <h2 className="text-xl font-bold text-[#18181b]">
              {t("dailyReflection", lang)}
            </h2>
            <p className="text-[#71717a] text-sm">{t("reflectionSub", lang)}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-[#5c4a3a] block mb-2">
              {t("qProgress", lang)}
            </label>
            <Textarea
              value={progress}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setProgress(e.target.value)
              }
              rows={4}
              placeholder="Escribe brevemente qué lograste hoy..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#5c4a3a] block mb-2">
              {t("qObstacle", lang)}
            </label>
            <Textarea
              value={obstacle}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setObstacle(e.target.value)
              }
              rows={4}
              placeholder="¿Qué te distractó o dificultó el avance?"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={saved || (!progress.trim() && !obstacle.trim())}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <CheckCircle2 size={18} className="mr-2" />
                {t("reflectionSaved", lang)}
              </>
            ) : (
              <>
                <Clock size={18} className="mr-2" />
                {t("saveReflection", lang)}
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="text-center text-xs text-[#a1a1aa]">
        {new Date(today).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
