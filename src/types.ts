import type {
  Language,
  GoalStatus,
  MilestoneStatus,
  StoredGoal,
  StoredMilestone,
  StoredTask,
  StoredFocusSession,
  StoredDailyReflection,
  StoredUserSettings,
  StoredAppData,
} from "@/lib/storage";

export type {
  Language,
  GoalStatus,
  MilestoneStatus,
  StoredGoal,
  StoredMilestone,
  StoredTask,
  StoredFocusSession,
  StoredDailyReflection,
  StoredUserSettings,
  StoredAppData,
};

export type Goal = StoredGoal;
export type Milestone = StoredMilestone;
export type Task = StoredTask;
export type FocusSession = StoredFocusSession;
export type DailyReflection = StoredDailyReflection;
export type UserSettings = StoredUserSettings;
export type AppData = StoredAppData;
