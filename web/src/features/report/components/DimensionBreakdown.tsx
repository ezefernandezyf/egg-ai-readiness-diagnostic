// ── DimensionBreakdown ────────────────────────────────────────────
// 5 rows with horizontal bar + score number.

interface DimensionBreakdownProps {
  dimensions: Array<{
    dimension: string;
    score: number;
  }>;
}

const DIMENSION_LABELS: Record<string, string> = {
  Estrategia: 'Estrategia',
  Talento: 'Talento',
  Procesos: 'Procesos',
  'Tecnolog\u00eda': 'Tecnologia',
  Cultura: 'Cultura',
};

function getBarColor(score: number): string {
  if (score <= 33) return 'var(--color-rose)';
  if (score <= 66) return 'var(--color-yellow)';
  return '#22C55E';
}

export function DimensionBreakdown({ dimensions }: DimensionBreakdownProps) {
  return (
    <div className="flex flex-col gap-4">
      {dimensions.map((d) => {
        const label = DIMENSION_LABELS[d.dimension] ?? d.dimension;
        const rounded = Math.round(d.score);
        const barColor = getBarColor(d.score);

        return (
          <div key={d.dimension} className="flex items-center gap-4">
            {/* Dimension label */}
            <span className="w-24 shrink-0 font-accent text-sm font-medium text-black-base">
              {label}
            </span>

            {/* Bar track */}
            <div className="flex-1 h-3 rounded-full bg-bg-panel overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${rounded}%`,
                  backgroundColor: barColor,
                }}
              />
            </div>

            {/* Score number */}
            <span
              className="w-10 text-right font-accent text-lg font-light text-black-base"
              style={{ fontWeight: 300 }}
            >
              {rounded}
            </span>
          </div>
        );
      })}
    </div>
  );
}
