import { cn } from '@/shared/ui';
import { QUIZ_DIMENSIONS } from '../types';

// ── Props ────────────────────────────────────────────────────────
interface ProgressBarProps {
  currentStep: number; // 0-6 (0=intro, 1-5=dim, 6=lead)
}

// ── Component ─────────────────────────────────────────────────────
export function ProgressBar({ currentStep }: ProgressBarProps) {
  // Only show during quiz steps (1-5) and lead form (6)
  if (currentStep === 0) return null;

  const totalQuizSteps = QUIZ_DIMENSIONS.length; // 5
  const activeStep = Math.min(currentStep, totalQuizSteps);
  const progress = Math.round((activeStep / totalQuizSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1.5">
          {QUIZ_DIMENSIONS.map((dim, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            return (
              <div
                key={dim.id}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors duration-300',
                  isCompleted && 'bg-rose',
                  isActive && 'bg-rose',
                  !isActive && !isCompleted && 'bg-grey-01',
                )}
              />
            );
          })}
        </div>
        <span className="font-accent text-xs font-medium tracking-[0.07em] text-beige-04">
          {progress}%
        </span>
      </div>
    </div>
  );
}
