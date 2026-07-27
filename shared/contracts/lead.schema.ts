import { z } from 'zod';

// ── Lead capture form ───────────────────────────────────────────
export const LeadCapture = z.object({
  email: z.string().email('Ingresá un email válido'),
  firstName: z.string().min(1, 'Ingresá tu nombre'),
  lastName: z.string().min(1, 'Ingresá tu apellido'),
  phone: z.string().min(1, 'Ingresá tu teléfono'),
  country: z.string().min(1, 'Ingresá tu país'),
  company: z.string().min(1, 'Ingresá el nombre de tu empresa'),
});
export type LeadCapture = z.infer<typeof LeadCapture>;

// ── Lead record (server-side) ────────────────────────────────────
export const Lead = z.object({
  id: z.string().uuid(),
  emailHash: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  country: z.string(),
  company: z.string(),
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
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  country: z.string().min(1),
  company: z.string().min(1),
});
export type DiagnosticSubmitPayload = z.infer<typeof DiagnosticSubmitPayload>;
