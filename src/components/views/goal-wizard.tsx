"use client";

import { useState, useCallback } from "react";
import { useApp } from "@/components/providers/app-provider";
import { getStorage } from "@/lib/storage";
import { t, type TranslationKey } from "@/lib/i18n";
import { generatePlan, type InterviewAnswer, type GeneratedPlan } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, Loader2, Check, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const QUESTIONS: Array<{
  key: "q1" | "q2" | "q3" | "q4";
  labelKey: TranslationKey;
  placeholder: string;
}> = [
  {
    key: "q1",
    labelKey: "q1",
    placeholder: "Ej. Quiero cambiar de carrera y sentirme realizado profesionalmente.",
  },
  {
    key: "q2",
    labelKey: "q2",
    placeholder: "Ej. Nunca lo he hecho, pero tengo curiosidad y algo de base.",
  },
  {
    key: "q3",
    labelKey: "q3",
    placeholder: "Ej. 5-7 horas a la semana.",
  },
  {
    key: "q4",
    labelKey: "q4",
    placeholder: "Ej. Computadora, conexión a internet, algunos libros.",
  },
];

interface MilestoneDraft {
  title: string;
  tasks: string[];
}

interface WizardProps {
  onClose: () => void;
}

export function GoalWizard({ onClose }: WizardProps) {
  const { settings, createGoal, setView } = useApp();
  const lang = settings.language;
  const storage = getStorage();
  const [step, setStep] = useState<"intro" | "interview" | "review" | "done">("intro");
  const [answers, setAnswers] = useState<InterviewAnswer>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const [goalTitle, setGoalTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [editingPurpose, setEditingPurpose] = useState("");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>([]);
  const [error, setError] = useState("");

  const minDate = new Date().toISOString().slice(0, 10);
  const defaultTarget = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const handleGenerate = useCallback(async () => {
    if (!goalTitle.trim()) return;
    setGenerating(true);
    setError("");
    try {
      const generated: GeneratedPlan = await generatePlan(
        goalTitle,
        answers,
        lang,
        settings.apiKey
      );
      setEditingPurpose(generated.purpose);
      setMilestones(
        generated.milestones.map((m) => ({
          title: m.title,
          tasks: [...m.tasks.map((t) => t.title)],
        }))
      );
      setStep("review");
    } catch {
      setError(t("tryAgain", lang));
    } finally {
      setGenerating(false);
    }
  }, [goalTitle, answers, lang, settings.apiKey, t]);

  const handleCreateFinal = useCallback(() => {
    if (!targetDate) {
      setError("Selecciona una fecha límite");
      return;
    }
    const result = createGoal(goalTitle.trim(), targetDate);
    if (!result.ok) {
      setError(t("onlyOneActive", lang));
      return;
    }
    const goal = result.goal;
    storage.updateGoal(goal.id, {
      purpose: editingPurpose.trim() || goalTitle.trim(),
    });
    milestones.forEach((m, idx) => {
      const ms = storage.createMilestone(goal.id, m.title, idx);
      m.tasks.forEach((taskTitle) => {
        if (taskTitle.trim()) storage.createTask(ms.id, taskTitle.trim());
      });
    });
    setStep("done");
  }, [
    goalTitle,
    targetDate,
    createGoal,
    editingPurpose,
    milestones,
    storage,
    t,
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-2">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="ml-2">
          <X size={18} />
        </Button>
      </div>

      {/* Step: intro */}
      {step === "intro" && (
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <Target size={32} className="text-[#b45309]" />
            <h2 className="text-xl font-bold text-[#18181b]">
              {t("createNewGoal", lang)}
            </h2>
          </div>
          <p className="text-[#5c4a3a] mb-6">{t("diagnosticSub", lang)}</p>
          <div className="space-y-4">
            <Input
              label={t("activeGoal", lang)}
              placeholder={t("goalTitlePlaceholder", lang)}
              value={goalTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGoalTitle(e.target.value)
              }
            />
            <Input
              label={t("targetDate", lang)}
              type="date"
              min={minDate}
              value={targetDate || defaultTarget}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTargetDate(e.target.value)
              }
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-[#71717a]">{t("aiGenerating", lang)}</span>
            <Button
              variant="primary"
              disabled={generating || !goalTitle.trim()}
              onClick={() => {
                setTargetDate(targetDate || defaultTarget);
                setStep("interview");
              }}
            >
              {t("next", lang)} <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step: interview */}
      {step === "interview" && (
        <Card padding="lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#18181b]">
              {t("diagnosticTitle", lang)}
            </h2>
            <p className="text-[#71717a] mt-1">{t("diagnosticSub", lang)}</p>
          </div>
          <div className="space-y-5">
            {QUESTIONS.map((q) => (
              <div key={q.key} className="space-y-2">
                <label className="text-sm font-medium text-[#5c4a3a]">
                  {t(q.labelKey, lang)}
                </label>
                <Textarea
                  value={answers[q.key]}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setAnswers({ ...answers, [q.key]: e.target.value })
                  }
                  rows={3}
                  placeholder={q.placeholder}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("intro")}
            >
              <ChevronLeft size={16} className="mr-2" />
              {t("back", lang)}
            </Button>
            <Button
              variant="primary"
              disabled={
                generating ||
                !answers.q1 ||
                !answers.q2 ||
                !answers.q3 ||
                !answers.q4
              }
              onClick={() => void handleGenerate()}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {t("creating", lang)}
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  {t("next", lang)}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Step: review */}
      {step === "review" && (
        <Card padding="lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#18181b]">
              {t("aiGeneratedPlan", lang)}
            </h2>
            <p className="text-[#71717a] mt-1">{t("reviewPlan", lang)}</p>
          </div>
          <div className="space-y-1 mb-6">
            <div className="flex items-start gap-3">
              <Check size={20} className="mt-1 text-[#16a34a] flex-shrink-0" />
              <div>
                <div className="font-medium text-[#18181b]">
                  {t("purposeLabel", lang)}
                </div>
                <Textarea
                  value={editingPurpose}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingPurpose(e.target.value)
                  }
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {milestones.map((m, mi) => (
              <div key={mi} className="border border-[#ede3d3] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#b45309]">
                    {t("milestonesLabel", lang)} {mi + 1}
                  </span>
                  <Input
                    value={m.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const next = [...milestones];
                      next[mi].title = e.target.value;
                      setMilestones(next);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {m.tasks.map((task, ti) => (
                    <div key={ti} className="flex items-center gap-2">
                      <span className="text-[#a1a1aa] text-xs">○</span>
                      <Input
                        value={task}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const next = [...milestones];
                          next[mi].tasks[ti] = e.target.value;
                          setMilestones(next);
                        }}
                        className="flex-1 bg-transparent border-0 px-0 py-0 focus:ring-0"
                      />
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = [...milestones];
                      next[mi].tasks.push("");
                      setMilestones(next);
                    }}
                    className="text-xs p-1.5"
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMilestones([...milestones, { title: "", tasks: [] }]);
              }}
            >
              {t("addMilestone", lang)}
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep("interview")}>
              <ChevronLeft size={16} className="mr-2" />
              {t("previous", lang)}
            </Button>
            <Button variant="primary" onClick={handleCreateFinal} disabled={generating}>
              {t("acceptPlan", lang)}
            </Button>
          </div>
        </Card>
      )}

      {/* Step: done */}
      {step === "done" && (
        <Card padding="lg" className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-[#16a34a]" />
          </div>
          <h2 className="text-xl font-bold text-[#18181b] mb-2">
            ¡Objetivo creado!
          </h2>
          <p className="text-[#71717a] mb-6">
            Tu plan de acción está listo. Ve al objetivo para comenzar a ejecutar.
          </p>
          <Button variant="primary" onClick={() => {
            setView("goal");
            onClose();
          }}>
            {t("done", lang)}
          </Button>
        </Card>
      )}

      {error && (
        <div className="rounded-xl p-4 bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
