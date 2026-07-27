import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useQuizStore } from '../stores/quiz-store';
import { QuizIntro } from './QuizIntro';
import { QuizStep } from './QuizStep';

// ── Props ────────────────────────────────────────────────────────
interface QuizWizardProps {
  onComplete: () => void;
}

// ── Component ─────────────────────────────────────────────────────
export function QuizWizard({ onComplete }: QuizWizardProps) {
  const { currentStep, goNext } = useQuizStore();
  const navigate = useNavigate();

  // Navigate to lead form when quiz is done
  useEffect(() => {
    if (currentStep === 6) {
      onComplete();
      navigate('/lead');
    }
  }, [currentStep, navigate, onComplete]);

  // Step 0: Intro
  if (currentStep === 0) {
    return <QuizIntro onStart={goNext} />;
  }

  // Steps 1-5: Quiz dimensions
  if (currentStep >= 1 && currentStep <= 5) {
    return (
      <QuizStep
        onComplete={() => {
          goNext();
        }}
      />
    );
  }

  // Step 6: render nothing while navigating
  return null;
}
