"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { t, type TranslationKey } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Target,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  ChevronRight,
  Clock,
  Archive,
  X,
} from "lucide-react";

export function GoalView() {
  const {
    activeGoal,
    hasActiveGoal,
    settings,
    milestones,
    tasks,
    milestoneProgress,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    archiveGoal,
    completeGoal,
  } = useApp();
  const lang = settings.language;

  const [newMilestone, setNewMilestone] = useState("");
  const [newTask, setNewTask] = useState("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [editGoalTitle, setEditGoalTitle] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);

  if (!hasActiveGoal || !activeGoal) return null;

  const goalMilestones = milestones.filter((m) => m.goalId === activeGoal.id);
  const { done, total, percent } = milestoneProgress(activeGoal.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b45309]">
                {t("activeGoal", lang)}
              </span>
              {editingGoal ? (
                <Button variant="ghost" size="sm" onClick={() => setEditingGoal(false)}>
                  <X size={16} />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditGoalTitle(activeGoal.title);
                    setEditingGoal(true);
                  }}
                >
                  <Edit3 size={16} />
                </Button>
              )}
            </div>
            {editingGoal ? (
              <Input
                value={editGoalTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditGoalTitle(e.target.value)
                }
                className="max-w-xs"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[#18181b]">{activeGoal.title}</h1>
            )}
            <p className="text-[#5c4a3a]">{activeGoal.purpose || t("purpose", lang)}</p>
            <div className="mt-2 flex items-center gap-3 text-sm text-[#71717a]">
              <Clock size={14} className="mr-1" />
              <span>{t("targetDate", lang)}:</span>
              <time>
                {new Date(activeGoal.targetDate).toLocaleDateString(
                  lang === "es" ? "es-ES" : "en-US"
                )}
              </time>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => archiveGoal(activeGoal.id)}
            >
              <Archive size={16} />
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => completeGoal(activeGoal.id)}
            >
              <CheckCircle2 size={16} />
              {t("completeGoal", lang)}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-[#18181b]">{t("progress", lang)}</span>
            <span className="font-semibold text-[#b45309]">{percent}%</span>
          </div>
          <div className="w-full bg-[#e3d4c2] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-[#b45309] transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#71717a] mt-2">
            {done} {t("tasksCompleted", lang)} / {total}
          </p>
        </div>
      </Card>

      {/* Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#18181b]">
            {t("milestonesLabel", lang)}
          </h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t("addMilestone", lang)}
              value={newMilestone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMilestone(e.target.value)
              }
              className="max-w-sm"
            />
            <Button
              variant="primary"
              size="sm"
              disabled={!newMilestone.trim()}
              onClick={() => {
                addMilestone(activeGoal.id, newMilestone.trim());
                setNewMilestone("");
              }}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {goalMilestones.length === 0 ? (
          <p className="text-[#71717a] text-center py-8">{t("noMilestones", lang)}</p>
        ) : (
          <div className="space-y-3">
            {goalMilestones.map((m) => {
              const mTasks = tasks.filter((t) => t.milestoneId === m.id);
              const mDone = mTasks.filter((t) => t.isCompleted).length;
              const mPercent = mTasks.length
                ? Math.round((mDone / mTasks.length) * 100)
                : 0;
              const isOpen = selectedMilestoneId === m.id;
              return (
                <Card key={m.id} padding="none" className="border-[#ede3d3] overflow-hidden">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer bg-[#fbfaf7] hover:bg-[#f5f1ea] transition-colors"
                    onClick={() => setSelectedMilestoneId(isOpen ? null : m.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          m.status === "completed"
                            ? "bg-[#16a34a]"
                            : m.status === "in_progress"
                            ? "bg-[#b45309]"
                            : "bg-[#e3d4c2]"
                        }`}
                      ></span>
                      <span className="font-medium text-[#18181b] truncate">{m.title}</span>
                      <span className="ml-auto text-xs text-[#71717a]">
                        {mPercent}%
                      </span>
                      <ChevronRight
                        size={16}
                        className={`text-[#a1a1aa] transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateMilestone(m.id, {
                            status:
                              m.status === "completed" ? "pending" : "completed",
                          });
                        }}
                      >
                        {m.status === "completed" ? (
                          <CheckCircle2 size={16} className="text-[#16a34a]" />
                        ) : (
                          <CheckCircle2 size={16} className="text-[#a1a1aa]" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMilestone(m.id);
                        }}
                      >
                        <Trash2 size={16} className="text-[#dc2626]" />
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-[#ede3d3]">
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          placeholder={t("taskPlaceholder", lang)}
                          value={newTask}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewTask(e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!newTask.trim()}
                          onClick={() => {
                            addTask(m.id, newTask.trim());
                            setNewTask("");
                          }}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {mTasks.length === 0 && (
                          <p className="text-xs text-[#a1a1aa] text-center py-3">
                            {t("noData", lang)}
                          </p>
                        )}
                        {mTasks.map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#f5f1ea] transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={t.isCompleted}
                              onChange={() => toggleTask(t.id)}
                              className="w-4 h-4 text-[#b45309] focus-visible:ring-2 focus-visible:ring-[#b45309]"
                            />
                            <span
                              className={`text-sm truncate ${
                                t.isCompleted
                                  ? "line-through text-[#a1a1aa]"
                                  : "text-[#5c4a3a]"
                              }`}
                            >
                              {t.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(t.id);
                              }}
                            >
                              <Trash2 size={14} className="text-[#dc2626]" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
