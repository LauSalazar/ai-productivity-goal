import type {
  Goal,
  Milestone,
  Task,
  FocusSession,
  DailyReflection,
  UserSettings,
} from "@/types";

const STORAGE_KEY = "focus_one_app_data";
const EXPORT_VERSION = 1;

/*---------------------------------------------------------------------
  Types
---------------------------------------------------------------------*/

export type Language = "es" | "en";
export type GoalStatus = "active" | "completed" | "archived";
export type MilestoneStatus = "pending" | "in_progress" | "completed";

export interface StoredGoal {
  id: string;
  title: string;
  purpose: string;
  targetDate: string;
  status: GoalStatus;
  createdAt: string;
}

export interface StoredMilestone {
  id: string;
  goalId: string;
  title: string;
  order: number;
  status: MilestoneStatus;
}

export interface StoredTask {
  id: string;
  milestoneId: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

export interface StoredFocusSession {
  id: string;
  goalId: string;
  durationMinutes: number;
  timestamp: string;
  brainDumpNotes: string;
}

export interface StoredDailyReflection {
  id: string;
  date: string; // YYYY-MM-DD
  progressText: string;
  obstacleText: string;
}

export interface StoredUserSettings {
  language: Language;
  apiKey: string;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  notificationsEnabled: boolean;
}

export interface StoredAppData {
  version: number;
  goals: StoredGoal[];
  milestones: StoredMilestone[];
  tasks: StoredTask[];
  focusSessions: StoredFocusSession[];
  dailyReflections: StoredDailyReflection[];
  userSettings: StoredUserSettings;
}

/*---------------------------------------------------------------------
  Helpers
---------------------------------------------------------------------*/

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_SETTINGS: StoredUserSettings = {
  language: "es",
  apiKey: "",
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  notificationsEnabled: true,
};

export function emptyData(): StoredAppData {
  return {
    version: EXPORT_VERSION,
    goals: [],
    milestones: [],
    tasks: [],
    focusSessions: [],
    dailyReflections: [],
    userSettings: { ...DEFAULT_SETTINGS },
  };
}

/*---------------------------------------------------------------------
  StorageService
---------------------------------------------------------------------*/

export class StorageService {
  private data: StoredAppData;
  private listeners: Array<(data: StoredAppData) => void> = [];

  constructor() {
    this.data = this.load() ?? emptyData();
    this.ensureDefaults();
  }

  /*---------- persistence ----------*/

  private load(): StoredAppData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredAppData>;
      return {
        ...emptyData(),
        ...parsed,
        userSettings: { ...DEFAULT_SETTINGS, ...(parsed.userSettings ?? {}) },
      };
    } catch {
      return null;
    }
  }

  private save(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // localStorage may be unavailable/quota exceeded; state stays in memory.
    }
    this.listeners.forEach((fn) => fn(this.data));
  }

  private ensureDefaults(): void {
    const settings = this.data.userSettings;
    if (!settings.language) settings.language = "es";
    if (settings.pomodoroWorkMinutes == null) settings.pomodoroWorkMinutes = 25;
    if (settings.pomodoroBreakMinutes == null) settings.pomodoroBreakMinutes = 5;
    if (settings.notificationsEnabled == null) settings.notificationsEnabled = true;
    this.save();
  }

  subscribe(fn: (data: StoredAppData) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((f) => f !== fn);
    };
  }

  /*---------- export / import ----------*/

  exportToJson(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importFromJson(json: string): boolean {
    try {
      const parsed = JSON.parse(json) as Partial<StoredAppData>;
      if (!parsed.goals || !Array.isArray(parsed.goals)) return false;
      this.data = {
        ...emptyData(),
        ...parsed,
        userSettings: {
          ...DEFAULT_SETTINGS,
          ...(this.data.userSettings ?? {}),
          ...(parsed.userSettings ?? {}),
        },
      };
      this.ensureDefaults();
      this.save();
      return true;
    } catch {
      return false;
    }
  }

  clearAll(): void {
    this.data = emptyData();
    this.save();
  }

  /*---------- settings ----------*/

  getSettings(): StoredUserSettings {
    return this.data.userSettings;
  }

  updateSettings(partial: Partial<StoredUserSettings>): void {
    this.data.userSettings = { ...this.data.userSettings, ...partial };
    this.save();
  }

  /*---------- goals ----------*/

  getGoals(): StoredGoal[] {
    return [...this.data.goals];
  }

  getActiveGoal(): StoredGoal | null {
    return this.data.goals.find((g) => g.status === "active") ?? null;
  }

  hasActiveGoal(): boolean {
    return this.data.goals.some((g) => g.status === "active");
  }

  createGoal(goal: Omit<StoredGoal, "id" | "createdAt">): StoredGoal {
    const created: StoredGoal = {
      ...goal,
      id: uuid(),
      createdAt: nowIso(),
    };
    this.data.goals.push(created);
    this.save();
    return created;
  }

  updateGoal(id: string, patch: Partial<StoredGoal>): StoredGoal | null {
    const goal = this.data.goals.find((g) => g.id === id);
    if (!goal) return null;
    Object.assign(goal, patch);
    this.save();
    return goal;
  }

  deleteGoal(id: string): boolean {
    const idx = this.data.goals.findIndex((g) => g.id === id);
    if (idx === -1) return false;
    this.data.goals.splice(idx, 1);
    this.data.milestones = this.data.milestones.filter((m) => m.goalId !== id);
    this.data.tasks = this.data.tasks.filter((t) => {
      const m = this.data.milestones.find((mm) => mm.id === t.milestoneId);
      return m != null;
    });
    this.data.focusSessions = this.data.focusSessions.filter((s) => s.goalId !== id);
    this.save();
    return true;
  }

  /*---------- milestones ----------*/

  getMilestonesForGoal(goalId: string): StoredMilestone[] {
    return [...this.data.milestones]
      .filter((m) => m.goalId === goalId)
      .sort((a, b) => a.order - b.order);
  }

  createMilestone(
    goalId: string,
    title: string,
    order?: number
  ): StoredMilestone {
    const milestones = this.getMilestonesForGoal(goalId);
    const nextOrder = order ?? (milestones.length > 0 ? Math.max(...milestones.map((m) => m.order)) + 1 : 0);
    const milestone: StoredMilestone = {
      id: uuid(),
      goalId,
      title,
      order: nextOrder,
      status: "pending",
    };
    this.data.milestones.push(milestone);
    this.save();
    return milestone;
  }

  updateMilestone(id: string, patch: Partial<StoredMilestone>): StoredMilestone | null {
    const m = this.data.milestones.find((x) => x.id === id);
    if (!m) return null;
    Object.assign(m, patch);
    this.save();
    return m;
  }

  deleteMilestone(id: string): boolean {
    const milestone = this.data.milestones.find((m) => m.id === id);
    if (!milestone) return false;
    this.data.tasks = this.data.tasks.filter((t) => t.milestoneId !== id);
    this.data.milestones = this.data.milestones.filter((m) => m.id !== id);
    this.save();
    return true;
  }

  /*---------- tasks ----------*/

  getTasksForMilestone(milestoneId: string): StoredTask[] {
    return [...this.data.tasks].filter((t) => t.milestoneId === milestoneId);
  }

  createTask(milestoneId: string, title: string, dueDate?: string): StoredTask {
    const task: StoredTask = {
      id: uuid(),
      milestoneId,
      title,
      isCompleted: false,
      ...(dueDate ? { dueDate } : {}),
    };
    this.data.tasks.push(task);
    this.save();
    return task;
  }

  updateTask(id: string, patch: Partial<StoredTask>): StoredTask | null {
    const t = this.data.tasks.find((x) => x.id === id);
    if (!t) return null;
    Object.assign(t, patch);
    this.save();
    return t;
  }

  toggleTask(id: string): StoredTask | null {
    const t = this.data.tasks.find((x) => x.id === id);
    if (!t) return null;
    t.isCompleted = !t.isCompleted;
    this.save();
    return t;
  }

  deleteTask(id: string): boolean {
    const idx = this.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.data.tasks.splice(idx, 1);
    this.save();
    return true;
  }

  /*---------- focus sessions ----------*/

  getFocusSessionsForGoal(goalId: string): StoredFocusSession[] {
    return [...this.data.focusSessions]
      .filter((s) => s.goalId === goalId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  createFocusSession(
    goalId: string,
    durationMinutes: number,
    brainDumpNotes: string
  ): StoredFocusSession {
    const session: StoredFocusSession = {
      id: uuid(),
      goalId,
      durationMinutes,
      timestamp: nowIso(),
      brainDumpNotes,
    };
    this.data.focusSessions.push(session);
    this.save();
    return session;
  }

  /*---------- daily reflections ----------*/

  getReflectionForDate(date: string): StoredDailyReflection | null {
    return this.data.dailyReflections.find((r) => r.date === date) ?? null;
  }

  upsertReflection(date: string, progressText: string, obstacleText: string): StoredDailyReflection {
    const existing = this.getReflectionForDate(date);
    if (existing) {
      existing.progressText = progressText;
      existing.obstacleText = obstacleText;
      this.save();
      return existing;
    }
    const reflection: StoredDailyReflection = {
      id: uuid(),
      date,
      progressText,
      obstacleText,
    };
    this.data.dailyReflections.push(reflection);
    this.save();
    return reflection;
  }

  /*---------- computed ----------*/

  milestoneProgress(goalId: string): { done: number; total: number; percent: number } {
    const milestones = this.getMilestonesForGoal(goalId);
    let done = 0;
    let total = 0;
    milestones.forEach((m) => {
      const tasks = this.getTasksForMilestone(m.id);
      total += tasks.length;
      done += tasks.filter((t) => t.isCompleted).length;
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, percent };
  }

  totalFocusMinutes(goalId: string): number {
    return this.data.focusSessions
      .filter((s) => s.goalId === goalId)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }

  focusMinutesByDay(goalId: string): Record<string, number> {
    const map: Record<string, number> = {};
    this.data.focusSessions
      .filter((s) => s.goalId === goalId)
      .forEach((s) => {
        const day = s.timestamp.slice(0, 10);
        map[day] = (map[day] ?? 0) + s.durationMinutes;
      });
    return map;
  }

  streakDays(goalId: string): number {
    const byDay = this.focusMinutesByDay(goalId);
    const days = Object.keys(byDay).sort();
    if (days.length === 0) return 0;
    const today = todayKey();
    let streak = 0;
    let cursor = today;
    // Count backwards from today (or yesterday if no session today) while consecutive days have sessions.
    let i = days.length - 1;
    let expected = today;
    while (i >= 0) {
      if (days[i] === expected) {
        streak += 1;
        const d = new Date(expected + "T00:00:00");
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().slice(0, 10);
        i -= 1;
      } else if (days[i] < expected) {
        // gap found
        break;
      } else {
        i -= 1;
      }
    }
    // If today has no session, streak counts only if yesterday started it; the loop above handles
    // it because expected starts at today and requires a match.
    return streak;
  }

  recentReflections(limit = 7): StoredDailyReflection[] {
    return [...this.data.dailyReflections]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  }
}

/*---------------------------------------------------------------------
  Singleton
---------------------------------------------------------------------*/

let storageInstance: StorageService | null = null;

export function getStorage(): StorageService {
  if (!storageInstance) {
    storageInstance = new StorageService();
  }
  return storageInstance;
}
