export type Language = "es" | "en";

export type TranslationKey = keyof typeof es;

const es = {
  // Common
  appName: "Enfoque Uno",
  save: "Guardar",
  cancel: "Cancelar",
  edit: "Editar",
  delete: "Eliminar",
  done: "Listo",
  back: "Atrás",
  next: "Siguiente",
  previous: "Anterior",
  finish: "Finalizar",
  add: "Añadir",
  creating: "Creando...",
  loading: "Cargando...",
  noData: "Sin datos",
  success: "Éxito",
  error: "Error",
  tryAgain: "Inténtalo de nuevo",

  // Language
  language: "Idioma",
  languageEs: "Español",
  languageEn: "English",

  // Auth / settings
  settings: "Configuración",
  apiKeyLabel: "Clave API de OpenAI",
  apiKeyPlaceholder: "sk-...",
  apiKeyHelp: "Se guarda solo en tu navegador (localStorage). Se usa para la entrevista con la IA.",
  pomodoroWork: "Tiempo de trabajo (min)",
  pomodoroBreak: "Tiempo de descanso (min)",
  notifications: "Notificaciones activadas",
  exportBackup: "Exportar copia de seguridad (JSON)",
  importBackup: "Importar copia de seguridad",
  importFileLabel: "Seleccionar archivo JSON",
  importNow: "Importar datos",
  clearAll: "Borrar todos los datos",
  clearAllConfirm: "¿Estás seguro? Esto eliminará toda tu información y no se puede deshacer.",

  // Dashboard / home
  welcome: "Bienvenido a Enfoque Uno",
  welcomeSub:
    "Mantén un único objetivo principal activo. Diagnóstícalo con la IA, ejecuta día a día y reflexiona al final de cada jornada.",
  noActiveGoal: "No tienes un objetivo principal activo",
  createGoal: "Crear objetivo principal",
  viewGoals: "Ver objetivos",
  archived: "Archivados",
  completed: "Completados",

  // Goal creation
  createNewGoal: "Crear nuevo objetivo",
  goalTitlePlaceholder: "Ej. Lanzar mi tienda online",
  diagnosticTitle: "Entrevista diagnóstica",
  diagnosticSub:
    "Responde 4 preguntas rápidas para que la IA entienda tu contexto y proponga un plan inicial.",
  q1: "¿Por qué es importante este objetivo para ti?",
  q2: "¿Qué experiencia previa tienes con este tipo de meta?",
  q3: "¿Cuántas horas a la semana puedes dedicarle de forma realista?",
  q4: "¿Qué recursos o herramientas ya tienes disponibles?",
  aiGenerating: "La IA está diseñando tu plan de acción...",
  aiGeneratedPlan: "Plan de acción sugerido",
  purposeLabel: "Propósito",
  milestonesLabel: "Hitos sugeridos",
  tasksLabel: "Tareas iniciales",
  reviewPlan: "Revisa y ajusta el plan antes de guardarlo",
  acceptPlan: "Aceptar y crear objetivo",
  skipAi: "Crear sin asistente de IA",

  // Goal view
  activeGoal: "Objetivo principal activo",
  purpose: "Propósito",
  targetDate: "Fecha límite",
  progress: "Progreso",
  tasksCompleted: "tareas completadas",
  noMilestones: "Sin hitos todavía",
  addMilestone: "Añadir hito",
  addTask: "Añadir tarea",
  taskPlaceholder: "Nueva tarea ejecutable",
  markComplete: "Marcar como completada",
  markPending: "Marcar como pendiente",
  goalCompleted: "¡Objetivo completado!",
  archiveGoal: "Archivar objetivo",
  completeGoal: "Marcar objetivo como completado",
  onlyOneActive:
    "Solo puedes tener un objetivo principal activo. Completa o archiva el actual antes de crear otro.",

  // Focus timer
  focusMode: "Modo Enfoque",
  brainDump: "Brain Dump",
  brainDumpPlaceholder:
    "Anota aquí distracciones o ideas para retomar después sin perder el hilo.",
  sessionSaved: "Sesión de enfoque guardada",
  start: "Iniciar",
  pause: "Pausar",
  reset: "Reiniciar",
  workTime: "Tiempo de trabajo",
  breakTime: "Descanso",
  fullScreen: "Pantalla completa",
  exitFullScreen: "Salir de pantalla completa",

  // Daily reflection
  dailyReflection: "Reflexión diaria",
  reflectionSub: "Tómate un minuto para cerrar el día.",
  qProgress: "¿Qué avanzaste hoy?",
  qObstacle: "¿Qué obstáculo o distracción encontraste?",
  saveReflection: "Guardar reflexión",
  reflectionSaved: "Reflexión guardada",

  // Stats
  stats: "Estadísticas",
  streak: "Racha de días activos",
  streakDays: "días",
  totalFocusTime: "Tiempo total de enfoque",
  hours: "horas",
  minutes: "minutos",
  focusByWeek: "Enfoque por semana (min)",
  noStats: "Todavía no hay registros de enfoque.",
};

const en = {
  appName: "Focus One",
  save: "Save",
  cancel: "Cancel",
  edit: "Edit",
  delete: "Delete",
  done: "Done",
  back: "Back",
  next: "Next",
  previous: "Previous",
  finish: "Finish",
  add: "Add",
  creating: "Creating...",
  loading: "Loading...",
  noData: "No data",
  success: "Success",
  error: "Error",
  tryAgain: "Try again",

  language: "Language",
  languageEs: "Español",
  languageEn: "English",

  settings: "Settings",
  apiKeyLabel: "OpenAI API Key",
  apiKeyPlaceholder: "sk-...",
  apiKeyHelp: "Stored only in your browser (localStorage). Used for the AI interview.",
  pomodoroWork: "Work time (min)",
  pomodoroBreak: "Break time (min)",
  notifications: "Notifications enabled",
  exportBackup: "Export backup (JSON)",
  importBackup: "Import backup",
  importFileLabel: "Select JSON file",
  importNow: "Import data",
  clearAll: "Clear all data",
  clearAllConfirm: "Are you sure? This will delete all your information and cannot be undone.",

  welcome: "Welcome to Focus One",
  welcomeSub:
    "Keep a single main goal active. Diagnose it with AI, execute day by day, and reflect at the end of each day.",
  noActiveGoal: "You have no active main goal",
  createGoal: "Create main goal",
  viewGoals: "View goals",
  archived: "Archived",
  completed: "Completed",

  createNewGoal: "Create new goal",
  goalTitlePlaceholder: "E.g. Launch my online store",
  diagnosticTitle: "Diagnostic interview",
  diagnosticSub:
    "Answer 4 quick questions so the AI understands your context and proposes an initial plan.",
  q1: "Why is this goal important to you?",
  q2: "What prior experience do you have with this kind of goal?",
  q3: "How many hours per week can you realistically dedicate?",
  q4: "What resources or tools do you already have available?",
  aiGenerating: "The AI is designing your action plan...",
  aiGeneratedPlan: "Suggested action plan",
  purposeLabel: "Purpose",
  milestonesLabel: "Suggested milestones",
  tasksLabel: "Initial tasks",
  reviewPlan: "Review and adjust the plan before saving",
  acceptPlan: "Accept and create goal",
  skipAi: "Create without AI assistant",

  activeGoal: "Active main goal",
  purpose: "Purpose",
  targetDate: "Target date",
  progress: "Progress",
  tasksCompleted: "tasks completed",
  noMilestones: "No milestones yet",
  addMilestone: "Add milestone",
  addTask: "Add task",
  taskPlaceholder: "New executable task",
  markComplete: "Mark as complete",
  markPending: "Mark as pending",
  goalCompleted: "Goal completed!",
  archiveGoal: "Archive goal",
  completeGoal: "Mark goal as completed",
  onlyOneActive:
    "You can only have one active main goal. Complete or archive the current one before creating another.",

  focusMode: "Focus mode",
  brainDump: "Brain Dump",
  brainDumpPlaceholder:
    "Write down distractions or ideas here to come back to later without losing your thread.",
  sessionSaved: "Focus session saved",
  start: "Start",
  pause: "Pause",
  reset: "Reset",
  workTime: "Work time",
  breakTime: "Break",
  fullScreen: "Full screen",
  exitFullScreen: "Exit full screen",

  dailyReflection: "Daily reflection",
  reflectionSub: "Take a minute to close the day.",
  qProgress: "What progress did you make today?",
  qObstacle: "What obstacle or distraction did you encounter?",
  saveReflection: "Save reflection",
  reflectionSaved: "Reflection saved",

  stats: "Statistics",
  streak: "Active days streak",
  streakDays: "days",
  totalFocusTime: "Total focus time",
  hours: "hours",
  minutes: "minutes",
  focusByWeek: "Focus per week (min)",
  noStats: "No focus records yet.",
};

const dictionaries: Record<Language, typeof es> = { es, en };

export function t(key: TranslationKey, lang: Language): string {
  return dictionaries[lang][key] ?? key;
}

export const ALL_LANGUAGES: { code: Language; label: string }[] = [
  { code: "es", label: t("languageEs", "es") },
  { code: "en", label: t("languageEn", "en") },
];
