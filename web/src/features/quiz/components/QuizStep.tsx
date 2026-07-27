import { useMemo } from 'react';
import { Button, cn } from '@/shared/ui';
import { useQuizStore } from '../stores/quiz-store';
import { QUIZ_DIMENSIONS } from '../types';
import { ProgressBar } from './ProgressBar';

// ── Props ────────────────────────────────────────────────────────
interface QuizStepProps {
  onComplete: () => void;
}

// ── Likert labels ────────────────────────────────────────────────
const LIKERT_LABELS: Record<number, string> = {
  1: 'No preparado',
  2: 'Poco preparado',
  3: 'Algo preparado',
  4: 'Preparado',
  5: 'Muy preparado',
};

// ── Component ─────────────────────────────────────────────────────
export function QuizStep({ onComplete }: QuizStepProps) {
  const { currentStep, answers, setAnswer, goBack, isStepComplete } = useQuizStore();

  const dimensionIndex = currentStep - 1;
  const dimension = QUIZ_DIMENSIONS[dimensionIndex];

  const stepComplete = dimension ? isStepComplete(dimension.id) : false;

  const isLastStep = currentStep >= QUIZ_DIMENSIONS.length;

  const dimAnswers = dimension ? answers[dimension.id] : undefined;

  // Track which questions have been touched (to show validation)
  const touched = useMemo(() => {
    if (!dimension) return new Set<string>();
    const t = new Set<string>();
    for (const q of dimension.questions) {
      if (typeof dimAnswers?.[q.key] === 'number') {
        t.add(q.key);
      }
    }
    return t;
  }, [dimension, dimAnswers]);

  if (!dimension) return null;

  return (
    <section className="mx-auto max-w-2xl py-8">
      <ProgressBar currentStep={currentStep} />

      {/* Dimension title */}
      <h2
        className="font-accent text-xs font-semibold tracking-[0.1em] text-rose uppercase mb-2"
      >
        Dimension {currentStep} de {QUIZ_DIMENSIONS.length}
      </h2>
      <h3 className="text-2xl font-semibold text-black-base mb-8">
        {dimension.label}
      </h3>

      {/* Questions */}
      <div className="flex flex-col gap-8">
        {dimension.questions.map((q) => {
          const currentScore = dimAnswers?.[q.key];
          const isTouched = touched.has(q.key);

          return (
            <div key={q.key}>
              <p className="text-base text-black-base mb-4">{q.text}</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setAnswer(dimension.id, q.key, score)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all',
                      currentScore === score
                        ? 'border-rose bg-rose text-white'
                        : 'border-grey-01 bg-white text-beige-04 hover:border-rose hover:text-rose',
                    )}
                    aria-label={`Puntaje ${score}: ${LIKERT_LABELS[score]}`}
                  >
                    {score}
                  </button>
                ))}
                <span className="ml-2 text-xs text-beige-04">
                  {currentScore ? LIKERT_LABELS[currentScore] ?? '' : ''}
                </span>
              </div>
              {/* Validation hint */}
              {!isTouched && (
                <p className="mt-1 text-xs text-beige-04">
                  Seleccioná un valor del 1 al 5
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={goBack}
          className="font-accent text-xs tracking-[0.07em]"
        >
          Anterior
        </Button>

        <Button
          onClick={onComplete}
          disabled={!stepComplete}
          className="font-accent text-xs tracking-[0.07em]"
        >
          {isLastStep ? 'Ver resultados' : 'Siguiente'}
        </Button>
      </div>
    </section>
  );
}
