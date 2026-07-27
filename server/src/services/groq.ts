// ── Groq AI Service ───────────────────────────────────────────────
// Generates narrative + recommendations from dimension scores.
// Fallback: returns null when Groq is unavailable or times out.

import Groq from 'groq-sdk';
import { z } from 'zod';

// ── Configuration ─────────────────────────────────────────────────
const MODEL = 'llama-3.1-8b-instant';
const TIMEOUT_MS = 12_000;
const MAX_RETRIES = 1;

// ── Types ─────────────────────────────────────────────────────────
export interface DimensionScoreInput {
  dimension: string;
  score: number;
}

export interface AnswerInput {
  dimension: string;
  questionKey: string;
  score: number;
}

// ── Response type (matches shared/report.schema.ts) ──────────────
export interface GroqNarrativeResult {
  narrative: string;
  recommendations: Array<{
    dimension: string;
    action: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    expectedImpact: string;
  }>;
}

// ── Zod validation for Groq response ──────────────────────────────
const GroqResponseSchema = z.object({
  narrative: z.string().min(1),
  recommendations: z
    .array(
      z.object({
        dimension: z.string().min(1),
        action: z.string().min(1),
        priority: z.enum(['critical', 'high', 'medium', 'low']),
        expectedImpact: z.string().min(1),
      }),
    )
    .min(3)
    .max(5),
});

// ── Initialize client lazily ──────────────────────────────────────
let groqClient: Groq | null = null;

function getClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env['GROQ_API_KEY'];
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// ── Build structured prompt ──────────────────────────────────────
function buildPrompt(
  dimensionScores: DimensionScoreInput[],
  _answers: AnswerInput[],
): string {
  const scoresBlock = dimensionScores
    .map((d) => `- ${d.dimension}: ${Math.round(d.score)}/100`)
    .join('\n');

  return `Eres un consultor experto en transformacion digital y adopcion de IA en empresas.

Una empresa completo un diagnostico de madurez en IA con 15 preguntas distribuidas en 5 dimensiones (Estrategia, Talento, Procesos, Tecnologia, Cultura). Cada pregunta se respondio en escala Likert 1-5.

## Puntajes por dimension:
${scoresBlock}

## Instrucciones:
1. Redacta un parrafo de narrativa (max 3 oraciones) en ESPANOL analizando el resultado general.
2. Genera entre 3 y 5 recomendaciones accionables especificas para mejorar su madurez en IA.
3. Cada recomendacion debe incluir: dimension a la que pertenece, accion concreta, prioridad (critical/high/medium/low), y el impacto esperado.

Responde SOLO con JSON valido, sin explicaciones adicionales:
{
  "narrative": "texto de analisis",
  "recommendations": [
    {
      "dimension": "Estrategia",
      "action": "accion concreta",
      "priority": "high",
      "expectedImpact": "impacto esperado"
    }
  ]
}`;
}

// ── Call Groq API with retry ──────────────────────────────────────
async function callGroq(
  prompt: string,
  signal: AbortSignal,
): Promise<unknown> {
  const client = getClient();

  const completion = await client.chat.completions.create(
    {
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Eres un consultor experto en transformacion digital. Respondes SOLO con JSON valido.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    },
    { signal },
  );

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Groq returned empty response');
  }

  return JSON.parse(content);
}

// ── Generate report ──────────────────────────────────────────────
export async function generateReport(
  dimensionScores: DimensionScoreInput[],
  answers: AnswerInput[],
): Promise<GroqNarrativeResult | null> {
  const prompt = buildPrompt(dimensionScores, answers);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const raw = await callGroq(prompt, controller.signal);
      const validated = GroqResponseSchema.parse(raw);

      return {
        narrative: validated.narrative,
        recommendations: validated.recommendations,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('[groq] Request timed out after', TIMEOUT_MS, 'ms');
        break; // Don't retry on timeout
      }

      if (err instanceof z.ZodError) {
        console.warn('[groq] Zod validation failed (attempt', attempt + 1, '):', err.issues);

        if (attempt < MAX_RETRIES) {
          console.warn('[groq] Retrying...');
          continue;
        }
      } else {
        console.warn('[groq] API error (attempt', attempt + 1, '):', err);
        if (attempt < MAX_RETRIES) {
          console.warn('[groq] Retrying...');
          continue;
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  // All attempts exhausted — return null (scores-only fallback)
  console.error('[groq] All attempts exhausted. Returning null (fallback).');
  if (lastError) {
    console.error('[groq] Last error:', lastError.message);
  }
  return null;
}
