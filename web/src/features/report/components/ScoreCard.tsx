// ── ScoreCard ─────────────────────────────────────────────────────
// Overall score with maturity badge and score ring.

interface ScoreCardProps {
  overallScore: number;
  maturitySegment: string;
}

const SEGMENT_META: Record<string, { label: string; color: string }> = {
  low: { label: 'Principiante', color: 'var(--color-rose)' },
  medium: { label: 'En desarrollo', color: 'var(--color-yellow)' },
  high: { label: 'Avanzado', color: '#22C55E' },
};

export function ScoreCard({ overallScore, maturitySegment }: ScoreCardProps) {
  const segment = SEGMENT_META[maturitySegment] ?? { label: maturitySegment, color: 'var(--color-beige-04)' };
  const roundedScore = Math.round(overallScore);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Score circle */}
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="var(--color-grey-01)"
            strokeWidth="8"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke={segment.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - roundedScore / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span
          className="absolute font-accent text-5xl font-light text-black-base"
          style={{ fontWeight: 300 }}
        >
          {roundedScore}
        </span>
      </div>

      {/* Maturity badge */}
      <span
        className="inline-block rounded-full px-4 py-1 font-accent text-xs font-semibold tracking-[0.1em] uppercase"
        style={{
          backgroundColor: segment.color,
          color: maturitySegment === 'high' ? '#1b1b1b' : '#ffffff',
        }}
      >
        {segment.label}
      </span>

      <p className="text-sm text-beige-04">Score general de madurez IA</p>
    </div>
  );
}
