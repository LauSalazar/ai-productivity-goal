"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getStorage, emptyData, type StoredAppData } from "@/lib/storage";
import type { Goal, Milestone, Task, UserSettings } from "@/types";

type ViewId =
  | "dashboard"
  | "goal"
  | "wizard"
  | "focus"
  | "reflection"
  | "stats"
  | "settings";

interface AppContextType {
  goals: Goal[];
  milestones: Milestone[];
  tasks: Task[];
  settings: UserSettings;
  activeGoal: Goal | null;
  hasActiveGoal: boolean;
  view: ViewId;
  setView: (v: ViewId) => void;
  createGoal: (
    title: string,
    targetDate: string
  ) => { goal: Goal; ok: boolean; reason?: string };
  updateGoal: (id: string, patch: Partial<Goal>) => boolean;
  archiveGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  updateMilestone: (id: string, patch: Partial<Milestone>) => boolean;
  deleteMilestone: (id: string) => void;
  addTask: (milestoneId: string, title: string, dueDate?: string) => void;
  toggleTask: (id: string) => boolean;
  updateTask: (id: string, patch: Partial<Task>) => boolean;
  deleteTask: (id: string) => void;
  addFocusSession: (goalId: string, minutes: number, notes: string) => void;
  milestoneProgress: (goalId: string) => { done: number; total: number; percent: number };
  totalFocusMinutes: (goalId: string) => number;
  focusMinutesByDay: (goalId: string) => Record<string, number>;
  streakDays: (goalId: string) => number;
  saveReflection: (date: string, progress: string, obstacle: string) => void;
  getReflection: (
    date: string
  ) => { progress: string; obstacle: string } | null;
  updateSettings: (patch: Partial<UserSettings>) => void;
  exportToJson: () => string;
  importFromJson: (json: string) => boolean;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const storage = getStorage();
  const [data, setData] = useState<StoredAppData>(() => emptyData());
  const [view, setView] = useState<ViewId>("dashboard");

  useEffect(() => {
    const unsub = storage.subscribe(setData);
    return unsub;
  }, [storage]);

  const goals = useMemo(() => data.goals, [data]);
  const milestones = useMemo(() => data.milestones, [data]);
  const tasks = useMemo(() => data.tasks, [data]);
  const settings = useMemo(() => data.userSettings, [data]);

  const activeGoal = useMemo(
    () => goals.find((g) => g.status === "active") ?? null,
    [goals]
  );
  const hasActiveGoal = activeGoal != null;

  const createGoal = useCallback(
    (title: string, targetDate: string) => {
      if (storage.hasActiveGoal()) {
        return { goal: null as unknown as Goal, ok: false, reason: "one_active" };
      }
      const goal = storage.createGoal({
        title,
        purpose: "",
        targetDate,
        status: "active",
      });
      return { goal, ok: true };
    },
    [storage]
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<Goal>) => {
      return storage.updateGoal(id, patch) != null;
    },
    [storage]
  );

  const archiveGoal = useCallback((id: string) => {
    storage.updateGoal(id, { status: "archived" });
  }, [storage]);

  const completeGoal = useCallback((id: string) => {
    storage.updateGoal(id, { status: "completed" });
  }, [storage]);

  const deleteGoal = useCallback((id: string) => {
    storage.deleteGoal(id);
  }, [storage]);

  const addMilestone = useCallback((goalId: string, title: string) => {
    storage.createMilestone(goalId, title);
  }, [storage]);

  const updateMilestone = useCallback(
    (id: string, patch: Partial<Milestone>) => {
      return storage.updateMilestone(id, patch) != null;
    },
    [storage]
  );

  const deleteMilestone = useCallback((id: string) => {
    storage.deleteMilestone(id);
  }, [storage]);

  const addTask = useCallback(
    (milestoneId: string, title: string, dueDate?: string) => {
      storage.createTask(milestoneId, title, dueDate);
    },
    [storage]
  );

  const toggleTask = useCallback((id: string) => {
    return storage.toggleTask(id) != null;
  }, [storage]);

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      return storage.updateTask(id, patch) != null;
    },
    [storage]
  );

  const deleteTask = useCallback((id: string) => {
    storage.deleteTask(id);
  }, [storage]);

  const addFocusSession = useCallback(
    (goalId: string, minutes: number, notes: string) => {
      storage.createFocusSession(goalId, minutes, notes);
    },
    [storage]
  );

  const milestoneProgress = useCallback(
    (goalId: string) => storage.milestoneProgress(goalId),
    [storage]
  );

  const totalFocusMinutes = useCallback(
    (goalId: string) => storage.totalFocusMinutes(goalId),
    [storage]
  );

  const focusMinutesByDay = useCallback(
    (goalId: string) => storage.focusMinutesByDay(goalId),
    [storage]
  );

  const streakDays = useCallback((goalId: string) => storage.streakDays(goalId), [storage]);

  const saveReflection = useCallback(
    (date: string, progress: string, obstacle: string) => {
      storage.upsertReflection(date, progress, obstacle);
    },
    [storage]
  );

  const getReflection = useCallback(
    (date: string) => {
      const r = storage.getReflectionForDate(date);
      if (!r) return null;
      return { progress: r.progressText, obstacle: r.obstacleText };
    },
    [storage]
  );

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    storage.updateSettings(patch);
  }, [storage]);

  const exportToJson = useCallback(() => storage.exportToJson(), [storage]);

  const importFromJson = useCallback(
    (json: string) => storage.importFromJson(json),
    [storage]
  );

  const clearAll = useCallback(() => storage.clearAll(), [storage]);

  const value: AppContextType = {
    goals,
    milestones,
    tasks,
    settings: settings!,
    activeGoal,
    hasActiveGoal,
    view,
    setView,
    createGoal,
    updateGoal,
    archiveGoal,
    completeGoal,
    deleteGoal,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    addFocusSession,
    milestoneProgress,
    totalFocusMinutes,
    focusMinutesByDay,
    streakDays,
    saveReflection,
    getReflection,
    updateSettings,
    exportToJson,
    importFromJson,
    clearAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
