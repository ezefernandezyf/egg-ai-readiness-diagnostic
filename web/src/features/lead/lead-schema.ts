import { z } from 'zod';

export const leadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá un email')
    .email('Ingresá un email válido'),
  company: z
    .string()
    .trim()
    .min(1, 'Ingresá el nombre de tu empresa'),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
