type Language = "es" | "en";

export interface InterviewAnswer {
  q1: string; // importance / motivation
  q2: string; // prior experience
  q3: string; // hours per week
  q4: string; // resources / tools
}

export interface GeneratedPlan {
  purpose: string;
  milestones: Array<{
    title: string;
    tasks: Array<{ title: string }>;
  }>;
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

/*---------------------------------------------------------------------
  Deterministic fallback (no API key / offline)
---------------------------------------------------------------------*/

function fallbackPlan(title: string, answers: InterviewAnswer, lang: Language): GeneratedPlan {
  const isEs = lang === "es";

  const purposeByLang: Record<Language, string> = {
    es: `Lograr "${title}" de forma sostenible, enfocando el esfuerzo en entregas mínimas viables que validen el progreso semana a semana.`,
    en: `Achieve "${title}" sustainably, focusing effort on minimum viable deliveries that validate progress week by week.`,
  };

  const milestonesByLang: Record<Language, Array<{ title: string; tasks: Array<{ title: string }> }>> = {
    es: [
      {
        title: "Definir alcance y criterios de éxito",
        tasks: [
          { title: "Escribir el objetivo en una frase clara y medible" },
          { title: "Listar los 3 criterios que definirán el éxito" },
        ],
      },
      {
        title: "Planificar primeras entregas",
        tasks: [
          { title: "Desglosar la primera entrega en tareas pequeñas" },
          { title: "Asignar fechas tentativas a cada tarea" },
        ],
      },
      {
        title: "Ejecutar la primera entrega mínima",
        tasks: [
          { title: "Completar la primera tarea del plan" },
          { title: "Revisar resultado y ajustar el siguiente hito" },
        ],
      },
      {
        title: "Consolidar y cerrar",
        tasks: [
          { title: "Documentar lo aprendido" },
          { title: "Celebrar el logro y definir el siguiente paso" },
        ],
      },
    ],
    en: [
      {
        title: "Define scope and success criteria",
        tasks: [
          { title: "Write the goal in one clear, measurable sentence" },
          { title: "List the 3 criteria that will define success" },
        ],
      },
      {
        title: "Plan first deliveries",
        tasks: [
          { title: "Break the first delivery into small tasks" },
          { title: "Assign tentative dates to each task" },
        ],
      },
      {
        title: "Execute first minimum delivery",
        tasks: [
          { title: "Complete the first task of the plan" },
          { title: "Review the result and adjust the next milestone" },
        ],
      },
      {
        title: "Consolidate and close",
        tasks: [
          { title: "Document what was learned" },
          { title: "Celebrate the achievement and define next step" },
        ],
      },
    ],
  };

  return { purpose: purposeByLang[lang], milestones: milestonesByLang[lang] };
}

/*---------------------------------------------------------------------
  OpenAI client
---------------------------------------------------------------------*/

export async function generatePlan(
  goalTitle: string,
  answers: InterviewAnswer,
  lang: Language,
  apiKey?: string
): Promise<GeneratedPlan> {
  if (!apiKey) {
    return fallbackPlan(goalTitle, answers, lang);
  }

  const isEs = lang === "es";
  const systemPrompt = isEs
    ? "Eres un asistente experto en productividad y consecución de objetivos. Responde ÚNICAMENTE con un objeto JSON válido, sin texto antes ni después."
    : "You are an expert productivity and goal-achievement assistant. Respond ONLY with a valid JSON object, no text before or after.";
  const userPrompt = isEs
    ? `Usuario quiere lograr: "${goalTitle}".
Respuestas del usuario:
1. Importancia: ${answers.q1}
2. Experiencia previa: ${answers.q2}
3. Horas por semana: ${answers.q3}
4. Recursos disponibles: ${answers.q4}

Genera en español:
- Un "purpose": propósito claro y resumido del objetivo (1-2 oraciones).
- Una lista "milestones" con 3-5 hitos. Cada hito tiene "title" y "tasks" con 2-4 tareas iniciales ({title}).
Mantén los hitos y tareas mínimos viables y accionables.`
    : `User wants to achieve: "${goalTitle}".
User answers:
1. Importance: ${answers.q1}
2. Prior experience: ${answers.q2}
3. Hours per week: ${answers.q3}
4. Resources available: ${answers.q4}

Generate in English:
- A "purpose": clear summarized purpose of the goal (1-2 sentences).
- A "milestones" list with 3-5 milestones. Each milestone has "title" and "tasks" with 2-4 initial tasks ({title}).
Keep milestones and tasks minimum viable and actionable.`;

  try {
    const res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI error ${res.status}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON in case the model wraps it in markdown fences.
    const jsonText = extractJson(content);
    const parsed = JSON.parse(jsonText) as GeneratedPlan;

    if (!parsed.purpose || !Array.isArray(parsed.milestones)) {
      throw new Error("Invalid plan shape");
    }

    return parsed;
  } catch {
    return fallbackPlan(goalTitle, answers, lang);
  }
}

function extractJson(text: string): string {
  const fence = text.match(/```json\n([\s\S]*?)\n```/);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1).trim();
  }
  return text.trim();
}
