// ── ReportDashboard ───────────────────────────────────────────────
// Main layout composing ScoreCard, RadarChart, DimensionBreakdown,
// Recommendations, and ReportActions.

import { useRef } from 'react';
import { Card } from '@/shared/ui';
import { ScoreCard } from './ScoreCard';
import { RadarChartComponent } from './RadarChart';
import { DimensionBreakdown } from './DimensionBreakdown';
import { Recommendations } from './Recommendations';
import { ReportActions } from './ReportActions';
import type { ReportResponse } from '@/api/diagnostic';

interface ReportDashboardProps {
  report: ReportResponse;
  onRetryAi?: () => void;
}

export function ReportDashboard({ report, onRetryAi }: ReportDashboardProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Score section */}
      <Card radius="card" padding="lg" shadow="md" className="mb-6">
        <ScoreCard
          overallScore={report.overallScore}
          maturitySegment={report.maturitySegment}
        />

        {/* Radar + Dimension breakdown side-by-side on larger screens */}
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <RadarChartComponent ref={chartRef} data={report.dimensionScores} />
          </div>
          <div className="flex-1">
            <DimensionBreakdown dimensions={report.dimensionScores} />
          </div>
        </div>
      </Card>

      {/* Narrative + Recommendations */}
      <Card radius="card" padding="lg" shadow="md" className="mb-6">
        <Recommendations
          recommendations={report.recommendations ?? []}
          narrative={report.narrative}
          partial={report.partial}
          onRetry={onRetryAi}
        />
      </Card>

      {/* Actions */}
      <ReportActions reportId={report.id} chartRef={chartRef} />
    </div>
  );
}
