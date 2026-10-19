"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Play,
  Pause,
  Clock,
  SkipBack,
  Maximize,
  Minimize,
  Save,
  CheckCircle2,
} from "lucide-react";

export function FocusTimer() {
  const {
    activeGoal,
    hasActiveGoal,
    settings,
    addFocusSession,
  } = useApp();
  const lang = settings.language;

  if (!hasActiveGoal || !activeGoal) {
    return (
      <Card padding="lg" className="text-center py-12">
        <Clock size={40} className="mx-auto text-[#a1a1aa] mb-4" />
        <h2 className="text-lg font-bold text-[#18181b] mb-2">
          {t("focusMode", lang)}
        </h2>
        <p className="text-[#71717a]">
          Debes tener un objetivo principal activo para usar el modo enfoque.
        </p>
      </Card>
    );
  }

  const workMinutes = settings.pomodoroWorkMinutes;
  const breakMinutes = settings.pomodoroBreakMinutes;

  const [mode, setMode] = useState<"work" | "break">("work");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [brainDump, setBrainDump] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goalRef = useRef(activeGoal.id);

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(mode === "work" ? workMinutes * 60 : breakMinutes * 60);
    setSessionSaved(false);
  }, [mode, workMinutes, breakMinutes]);

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      resetTimer();
      return;
    }
    setIsRunning((prev) => !prev);
  }, [timeLeft, resetTimer]);

  useEffect(() => {
    goalRef.current = activeGoal.id;
  }, [activeGoal.id]);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft === 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          // Save session on work block completion
          if (mode === "work") {
            const minutes = workMinutes;
            addFocusSession(goalRef.current, minutes, brainDump);
            setSessionSaved(true);
          }
          setMode((m) => (m === "work" ? "break" : "work"));
          setTimeLeft(
            mode === "work" ? breakMinutes * 60 : workMinutes * 60
          );
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, workMinutes, breakMinutes, brainDump, addFocusSession]);

  // Reset when mode changes manually
  useEffect(() => {
    // handled by reset on mode switch via buttons
  }, [mode]);

  const mm = Math.floor(timeLeft / 60);
  const ss = timeLeft % 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => {
      if (!prev) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      return !prev;
    });
  };

  const handleSaveSession = () => {
    if (timeLeft === totalSeconds) return; // no time worked yet
    const worked = Math.round((totalSeconds - timeLeft) / 60);
    if (worked > 0) {
      addFocusSession(goalRef.current, worked, brainDump);
      setSessionSaved(true);
    }
  };

  return (
    <div
      className={`min-h-[60vh] p-6 transition-all duration-300 ${
        isFullScreen
          ? "bg-[#18181b] text-white"
          : "bg-[#fbfaf7] text-[#18181b]"
      }`}
    >
      {!isFullScreen && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{t("focusMode", lang)}</h2>
          <Button variant="ghost" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize size={16} />
            ) : (
              <Maximize size={16} />
            )}
          </Button>
        </div>
      )}

      <Card
        padding="none"
        className={`mx-auto max-w-xl ${
          isFullScreen ? "bg-transparent border-0 shadow-none p-0" : ""
        }`}
      >
        <div className={`relative rounded-2xl overflow-hidden p-8 md:p-12 text-center ${
          isFullScreen
            ? "bg-[#18181b]/90 border border-white/10"
            : "bg-white border border-[#ede3d3]"
        }`}>
          {/* Timer */}
          <div className="mb-8 relative">
            <svg
              className="w-48 h-48 transform -rotate-90 mx-auto"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#e3d4c2"
                strokeWidth="10"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={isFullScreen ? "#b45309" : "#b45309"}
                strokeWidth="10"
                fill="none"
                strokeDasharray="264"
                strokeDashoffset={`${264 - (progress / 100) * 264}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[4rem] font-mono font-bold tabular-nums">
                {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
              </span>
              <span className="text-sm text-[#71717a] mt-2 uppercase tracking-wider">
                {mode === "work" ? t("workTime", lang) : t("breakTime", lang)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTimer}
              className="text-[#71717a] hover:bg-[#f5f1ea]"
            >
              <SkipBack size={16} />
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={toggleTimer}
              className="shadow-lg"
            >
              {isRunning ? (
                <>
                  <Pause size={20} className="mr-2" />
                  {t("pause", lang)}
                </>
              ) : (
                <>
                  <Play size={20} className="mr-2" />
                  {t("start", lang)}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode((m) => (m === "work" ? "break" : "work"))}
              disabled={isRunning}
              className="text-[#71717a] hover:bg-[#f5f1ea]"
            >
              {mode === "work" ? t("breakTime", lang) : t("workTime", lang)}
            </Button>
          </div>

          {/* Brain dump */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#b45309]">
                {t("brainDump", lang)}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  sessionSaved
                    ? "bg-[#f0fdf4] text-[#16a34a]"
                    : "bg-[#f5f1ea] text-[#71717a]"
                }`}
              >
                {sessionSaved ? t("sessionSaved", lang) : "—"}
              </span>
            </div>
            <Textarea
              value={brainDump}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setBrainDump(e.target.value)
              }
              rows={4}
              placeholder={t("brainDumpPlaceholder", lang)}
              className={`
                ${isFullScreen ? "bg-[#18181b]/30 border-white/20 text-white placeholder-white/40 focus-visible:ring-[#b45309]" : ""}
              `}
            />
            <div className="mt-3 flex justify-end">
              {timeLeft < totalSeconds && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveSession}
                  disabled={sessionSaved}
                >
                  <Save size={16} className="mr-2" />
                  {t("save", lang)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {!isFullScreen && (
        <div className="mt-6 text-center text-xs text-[#71717a]">
          Presiona F11 o el botón de pantalla completa para una experiencia sin distracciones.
        </div>
      )}
    </div>
  );
}
