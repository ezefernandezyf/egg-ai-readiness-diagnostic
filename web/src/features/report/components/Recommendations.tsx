// ── Recommendations ───────────────────────────────────────────────
// List of AI-generated recommendations with priority badges.

import type { Recommendation } from '@/api/diagnostic';

interface RecommendationsProps {
  recommendations: Recommendation[];
  narrative: string | null;
  partial: boolean;
  onRetry?: () => void;
}

const PRIORITY_META: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critico', className: 'bg-rose text-white' },
  high: { label: 'Alto', className: 'bg-rose/20 text-rose' },
  medium: { label: 'Medio', className: 'bg-yellow/30 text-black-base' },
  low: { label: 'Bajo', className: 'bg-bg-panel text-beige-04' },
};

const FALLBACK_PRIORITY = { label: 'Medio', className: 'bg-yellow/30 text-black-base' };

export function Recommendations({
  recommendations,
  narrative,
  partial,
  onRetry,
}: RecommendationsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Narrative */}
      {narrative && (
        <div className="rounded-[16px] bg-bg-panel p-5">
          <p className="text-base leading-relaxed text-black-base">{narrative}</p>
        </div>
      )}

      {/* Partial warning */}
      {partial && (
        <div className="rounded-[16px] border border-yellow bg-yellow/10 p-4">
          <p className="text-sm text-black-base">
            No pudimos generar las recomendaciones con IA en este momento.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 font-accent text-xs font-semibold tracking-[0.07em] text-rose uppercase hover:underline"
            >
              Reintentar IA
            </button>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-accent text-sm font-semibold tracking-[0.07em] text-beige-04 uppercase">
            Recomendaciones
          </h3>

          {recommendations.map((rec, index) => {
            const priority = PRIORITY_META[rec.priority] ?? FALLBACK_PRIORITY;
            return (
              <div
                key={index}
                className="rounded-[16px] border border-grey-01 bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-lg">&#9654;</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-accent text-xs font-medium text-beige-04 tracking-[0.07em] uppercase">
                        {rec.dimension}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 font-accent text-[10px] font-semibold tracking-[0.1em] uppercase ${priority.className}`}
                      >
                        {priority.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-black-base">{rec.action}</p>
                    <p className="mt-1 text-xs text-beige-04">{rec.expectedImpact}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
