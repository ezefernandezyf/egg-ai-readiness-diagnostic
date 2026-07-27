import { Button } from '@/shared/ui';

// ── Props ────────────────────────────────────────────────────────
interface QuizIntroProps {
  onStart: () => void;
}

// ── Component ─────────────────────────────────────────────────────
export function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <section className="flex flex-col items-center justify-center py-24 text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-[999px] bg-yellow/20 px-4 py-1.5">
        <span className="font-accent text-xs font-semibold tracking-[0.1em] text-black-base uppercase">
          Diagnóstico gratuito
        </span>
      </div>

      {/* Title */}
      <h1
        className="max-w-3xl text-[clamp(2rem,5vw,50px)] font-semibold leading-tight tracking-[-0.02em] text-black-base"
      >
        Diagnóstico de Transformación
        <br />
        <span className="text-rose">¿Tu equipo está listo para la era IA?</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 max-w-lg text-lg text-beige-04">
        Respondé 15 preguntas y recibí un reporte instantáneo con
        recomendaciones personalizadas para tu empresa.
      </p>

      {/* CTA */}
      <Button
        size="lg"
        onClick={onStart}
        className="mt-10 min-w-[260px] rounded-[30px] font-accent text-sm font-medium tracking-[0.07em]"
      >
        Comenzar diagnóstico
      </Button>

      {/* Trust markers */}
      <div className="mt-8 flex items-center gap-6 text-sm text-beige-04">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose" />
          Sin registro
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose" />
          5 minutos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose" />
          Reporte instantáneo
        </span>
      </div>
    </section>
  );
}
