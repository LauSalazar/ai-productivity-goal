"use client";

import { useApp } from "@/components/providers/app-provider";
import { Dashboard } from "@/components/views/dashboard";
import { GoalView } from "@/components/views/goal-view";
import { FocusTimer } from "@/components/views/focus-timer";
import { DailyReflection } from "@/components/views/daily-reflection";
import { Stats } from "@/components/views/stats";
import { Settings } from "@/components/views/settings";
import { useEffect } from "react";

interface RouterProps {
  onCreateGoal: () => void;
}

export function Router({ onCreateGoal }: RouterProps) {
  const { view, hasActiveGoal, setView } = useApp();

  useEffect(() => {
    if (!hasActiveGoal && view === "goal") {
      setView("dashboard");
    }
  }, [hasActiveGoal, view, setView]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 relative">
        {view === "dashboard" && <Dashboard onCreateGoal={onCreateGoal} />}
        {view === "goal" && <GoalView />}
        {view === "focus" && <FocusTimer />}
        {view === "reflection" && <DailyReflection />}
        {view === "stats" && <Stats />}
        {view === "settings" && <Settings />}
      </main>
    </div>
  );
}
