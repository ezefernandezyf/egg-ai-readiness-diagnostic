import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Card, Input } from '@/shared/ui';
import { useQuizStore } from '@/features/quiz/stores/quiz-store';
import { submitQuiz } from '@/api/diagnostic';
import { leadSchema, type LeadFormValues } from '@/features/lead/lead-schema';

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
    defaultValues: { email: '', company: '' },
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
            Ingresa tu email para recibir el reporte
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
