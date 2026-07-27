import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Card, Input, Select } from '@/shared/ui';
import { useQuizStore } from '@/features/quiz/stores/quiz-store';
import { submitQuiz } from '@/api/diagnostic';
import { leadSchema, type LeadFormValues } from '@/features/lead/lead-schema';

// ── Country code options ─────────────────────────────────────────
const COUNTRY_CODES = [
  { value: '+54', label: '+54 AR' },
  { value: '+1', label: '+1 US' },
  { value: '+52', label: '+52 MX' },
  { value: '+57', label: '+57 CO' },
  { value: '+56', label: '+56 CL' },
  { value: '+34', label: '+34 ES' },
  { value: '+598', label: '+598 UY' },
  { value: '+55', label: '+55 BR' },
  { value: '+51', label: '+51 PE' },
  { value: '+58', label: '+58 VE' },
  { value: '+593', label: '+593 EC' },
  { value: '+44', label: '+44 UK' },
  { value: '+49', label: '+49 DE' },
  { value: '+33', label: '+33 FR' },
  { value: '+39', label: '+39 IT' },
];

// ── Component ─────────────────────────────────────────────────────
export function LeadForm() {
  const navigate = useNavigate();
  const { answers, reset } = useQuizStore();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneCountryCode: '+54',
      phoneNumber: '',
      country: '',
      company: '',
    },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setSubmitError(null);

    try {
      // Flatten answers from store into array format expected by API
      const answerList: Array<{ dimension: string; questionKey: string; score: number }> = [];
      for (const [dimensionId, dimAnswers] of Object.entries(answers)) {
        for (const [questionKey, score] of Object.entries(dimAnswers)) {
          answerList.push({
            dimension: dimensionId,
            questionKey,
            score,
          });
        }
      }

      const result = await submitQuiz({
        answers: answerList,
        email: data.email.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: `${data.phoneCountryCode} ${data.phoneNumber.trim()}`,
        country: data.country.trim(),
        company: data.company.trim(),
      });

      // Reset quiz state
      reset();

      // Navigate to report
      navigate(`/report/${result.reportId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Error al enviar el formulario. Intentalo de nuevo.',
      );
    }
  };

  return (
    <section className="mx-auto max-w-lg py-12">
      <Card radius="card" padding="lg" shadow="md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black-base">¡Casi listo!</h2>
          <p className="mt-2 text-beige-04">
            Completá tus datos para recibir el reporte
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              error={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              {...register('firstName')}
            />

            <Input
              label="Apellido"
              type="text"
              placeholder="Tu apellido"
              error={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-3">
            <div className="min-w-[110px]">
              <Select
                label="Código"
                options={COUNTRY_CODES}
                error={!!errors.phoneCountryCode}
                errorMessage={errors.phoneCountryCode?.message}
                {...register('phoneCountryCode')}
              />
            </div>
            <Input
              label="Teléfono"
              type="tel"
              placeholder="Ej: 11 1234-5678"
              error={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </div>

          <Input
            label="País"
            type="text"
            placeholder="Ej: Argentina"
            error={!!errors.country}
            errorMessage={errors.country?.message}
            {...register('country')}
          />

          <Input
            label="Empresa"
            type="text"
            placeholder="Nombre de tu empresa"
            error={!!errors.company}
            errorMessage={errors.company?.message}
            {...register('company')}
          />

          {submitError && (
            <p className="text-sm text-red-500 text-center">{submitError}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-[30px] font-accent text-sm tracking-[0.07em]"
          >
            {isSubmitting ? 'Enviando...' : 'Ver mi reporte'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
