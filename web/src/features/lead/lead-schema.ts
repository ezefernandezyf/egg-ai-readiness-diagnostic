import { z } from 'zod';

export const leadSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Ingresá un email')
    .email('Ingresá un email válido'),
  firstName: z
    .string()
    .trim()
    .min(1, 'Ingresá tu nombre'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Ingresá tu apellido'),
  phoneCountryCode: z
    .string()
    .min(1, 'Seleccioná un código de país'),
  phoneNumber: z
    .string()
    .trim()
    .min(1, 'Ingresá tu teléfono'),
  country: z
    .string()
    .trim()
    .min(1, 'Ingresá tu país'),
  company: z
    .string()
    .trim()
    .min(1, 'Ingresá el nombre de tu empresa'),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
