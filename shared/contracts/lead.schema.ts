import { z } from 'zod';

// ── Lead capture form ───────────────────────────────────────────
export const LeadCapture = z.object({
  email: z.string().email('Ingresá un email válido'),
  company: z.string().min(1, 'Ingresá el nombre de tu empresa'),
  role: z.string().optional(),
});
export type LeadCapture = z.infer<typeof LeadCapture>;

// ── Lead record (server-side) ────────────────────────────────────
export const Lead = z.object({
  id: z.string().uuid(),
  emailHash: z.string(),
  company: z.string(),
  role: z.string().nullable(),
  maturitySegment: z.enum(['low', 'medium', 'high']),
  createdAt: z.string().datetime(),
});
export type Lead = z.infer<typeof Lead>;

// ── Full submission payload (quiz + lead) ────────────────────────
export const DiagnosticSubmitPayload = z.object({
  answers: z.array(
    z.object({
      dimension: z.string(),
      questionKey: z.string(),
      score: z.number().int().min(1).max(5),
    }),
  ),
  email: z.string().email(),
  company: z.string().min(1),
  role: z.string().optional(),
});
export type DiagnosticSubmitPayload = z.infer<typeof DiagnosticSubmitPayload>;
