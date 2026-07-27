// ── ReportPage ────────────────────────────────────────────────────
// Route page that loads report by ID and renders ReportDashboard.

import { useParams, useNavigate } from 'react-router';
import { useReport } from '@/hooks/useReport';
import { ReportDashboard } from '../components/ReportDashboard';
import { Button } from '@/shared/ui';

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: report, isLoading, isError, error, refetch } = useReport(id);

  // ── Loading state ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-grey-01 border-t-rose" />
        <p className="text-beige-04">Cargando tu reporte...</p>
      </section>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (isError || !report) {
    return (
      <section className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <h2 className="text-2xl font-semibold text-black-base">
          {isError && error?.message === 'Reporte no encontrado'
            ? 'Reporte no encontrado'
            : 'Error al cargar el reporte'}
        </h2>
        <p className="text-beige-04">
          {isError && error?.message === 'Reporte no encontrado'
            ? 'El reporte que buscas no existe o el enlace no es valido.'
            : 'Ocurrio un error al obtener tu reporte. Intentalo de nuevo.'}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
          {error?.message !== 'Reporte no encontrado' && (
            <Button onClick={() => refetch()}>Reintentar</Button>
          )}
        </div>
      </section>
    );
  }

  // ── Success state ───────────────────────────────────────────────
  const handleRetryAi = () => {
    // Placeholder — Phase 4 could implement a dedicated retry endpoint
    refetch();
  };

  return (
    <section>
      <div className="mb-6 text-center">
        <h1 className="font-accent text-2xl font-semibold text-black-base">
          Tu Diagnostico de Madurez IA
        </h1>
        <p className="mt-1 text-sm text-beige-04">
          Completado el {new Date(report.createdAt).toLocaleDateString('es-AR')}
        </p>
      </div>

      <ReportDashboard report={report} onRetryAi={handleRetryAi} />
    </section>
  );
}
