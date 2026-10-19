"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/app-provider";
import { t, type Language, ALL_LANGUAGES } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Key,
  Clock,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export function Settings() {
  const {
    settings,
    updateSettings,
    exportToJson,
    importFromJson,
    clearAll,
  } = useApp();
  const lang = settings.language;

  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [workMin, setWorkMin] = useState(String(settings.pomodoroWorkMinutes));
  const [breakMin, setBreakMin] = useState(String(settings.pomodoroBreakMinutes));
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "ok" | "error">("idle");
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveSettings = () => {
    updateSettings({
      apiKey: apiKey.trim(),
      pomodoroWorkMinutes: Math.max(1, parseInt(workMin) || 25),
      pomodoroBreakMinutes: Math.max(1, parseInt(breakMin) || 5),
    });
  };

  const handleImport = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const ok = importFromJson(text);
    setImportStatus(ok ? "ok" : "error");
    setImportFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card padding="lg">
        <h2 className="text-xl font-bold text-[#18181b] mb-6">
          {t("settings", lang)}
        </h2>

        <div className="space-y-6">
          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-[#b45309]" />
              <label className="font-medium text-[#18181b]">{t("language", lang)}</label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateSettings({ language: "es" })}
                className={`flex-1 text-xs font-semibold capitalize transition-colors ${
                  settings.language === "es"
                    ? "bg-[#fdf3e3] text-[#b45309]"
                    : "text-[#5c4a3a] hover:bg-[#f5f1ea]"
                }`}
              >
                ES
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateSettings({ language: "en" })}
                className={`flex-1 text-xs font-semibold capitalize transition-colors ${
                  settings.language === "en"
                    ? "bg-[#fdf3e3] text-[#b45309]"
                    : "text-[#5c4a3a] hover:bg-[#f5f1ea]"
                }`}
              >
                EN
              </Button>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Key size={20} className="text-[#b45309]" />
              <label className="font-medium text-[#18181b]">
                {t("apiKeyLabel", lang)}
              </label>
            </div>
            <Input
              type="password"
              value={apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setApiKey(e.target.value)
              }
              placeholder={t("apiKeyPlaceholder", lang)}
            />
            <p className="text-xs text-[#71717a]">{t("apiKeyHelp", lang)}</p>
          </div>

          {/* Pomodoro */}
          <div className="space-y-3 border-t border-[#ede3d3] pt-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#b45309]" />
              <h3 className="font-medium text-[#18181b]">Pomodoro</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c4a3a]">
                  {t("pomodoroWork", lang)}
                </label>
                <Input
                  type="number"
                  value={workMin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWorkMin(e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c4a3a]">
                  {t("pomodoroBreak", lang)}
                </label>
                <Input
                  type="number"
                  value={breakMin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBreakMin(e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="notifications"
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={() =>
                  updateSettings({
                    notificationsEnabled: !settings.notificationsEnabled,
                  })
                }
                className="w-4 h-4 text-[#b45309] focus-visible:ring-[#b45309]"
              />
              <label htmlFor="notifications" className="text-sm text-[#5c4a3a]">
                {t("notifications", lang)}
              </label>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveSettings}
            >
              {t("save", lang)}
            </Button>
          </div>

          {/* Backup */}
          <div className="space-y-3 border-t border-[#ede3d3] pt-6">
            <div className="flex items-center gap-3">
              <Download size={20} className="text-[#b45309]" />
              <h3 className="font-medium text-[#18181b]">Backup</h3>
            </div>
            <p className="text-sm text-[#71717a]">
              Exporta e importa toda tu información en un archivo JSON.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const json = exportToJson();
                  const blob = new Blob([json], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `focus-one-backup-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download size={16} className="mr-2" />
                {t("exportBackup", lang)}
              </Button>
              <div className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setImportFile(e.target.files?.[0] ?? null);
                  }}
                  className="block w-full text-sm text-[#71717a] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#f5f1ea] file:text-[#5c4a3a] hover:file:bg-[#ede3d3]"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={!importFile}
                onClick={handleImport}
              >
                <Upload size={16} className="mr-2" />
                {t("importNow", lang)}
              </Button>
            </div>
            {importStatus === "ok" && (
              <p className="text-xs text-[#16a34a]">
                ¡Datos importados correctamente!
              </p>
            )}
            {importStatus === "error" && (
              <p className="text-xs text-[#dc2626]">
                No se pudo importar el archivo. Verifica que sea un JSON válido.
              </p>
            )}
          </div>

          {/* Danger zone */}
          <div className="space-y-3 border-t border-[#ede3d3] pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-[#dc2626]" />
              <h3 className="font-medium text-[#18181b]">Zona de peligro</h3>
            </div>
            <p className="text-sm text-[#71717a]">{t("clearAllConfirm", lang)}</p>
            {confirmClear ? (
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    clearAll();
                    setConfirmClear(false);
                  }}
                >
                  <Trash2 size={16} className="mr-2" />
                  {t("clearAll", lang)}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                  {t("cancel", lang)}
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)} className="text-[#dc2626]">
                <Trash2 size={16} className="mr-2" />
                {t("clearAll", lang)}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
