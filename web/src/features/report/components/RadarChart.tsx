// ── RadarChart ────────────────────────────────────────────────────
// 5-dimension radar chart using Recharts.

import { forwardRef } from 'react';
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  data: Array<{
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

export const RadarChartComponent = forwardRef<HTMLDivElement, RadarChartProps>(
  function RadarChartComponent({ data }, ref) {
  const chartData = data.map((d) => ({
    dimension: DIMENSION_LABELS[d.dimension] ?? d.dimension,
    score: Math.round(d.score),
  }));

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={chartData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="var(--color-grey-01)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: 'var(--color-beige-04)',
              fontSize: 11,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2E8B8B"
            fill="#2E8B8B"
            fillOpacity={0.2}
            strokeWidth={2}
            animationDuration={500}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
  },
);
