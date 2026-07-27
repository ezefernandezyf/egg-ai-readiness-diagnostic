// ── ReportActions ─────────────────────────────────────────────────
// Download PDF + LinkedIn share with loading states, error handling,
// and double-submit prevention.

import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { generateReportPdf } from '@/api/diagnostic';
import { Button } from '@/shared/ui';

interface ReportActionsProps {
  reportId: string;
  /** Ref to the radar chart DOM element for screenshot capture */
  chartRef: React.RefObject<HTMLDivElement | null>;
}

// ── States ────────────────────────────────────────────────────────
type PdfState = 'idle' | 'loading' | 'success' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  'Reporte no encontrado': 'El reporte no existe. Verifica el enlace.',
  'NetworkError': 'Error de conexion. Verifica tu conexion a internet.',
};

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return ERROR_MESSAGES[err.message] ?? err.message;
  }
  return 'Ocurrio un error inesperado.';
}

export function ReportActions({ reportId, chartRef }: ReportActionsProps) {
  const [pdfState, setPdfState] = useState<PdfState>('idle');
  const [pdfError, setPdfError] = useState<string | null>(null);
  const submitLockRef = useRef(false);

  // ── Handle PDF download ─────────────────────────────────────────
  const handleDownloadPdf = useCallback(async () => {
    // Double-submit prevention
    if (submitLockRef.current) return;
    submitLockRef.current = true;

    setPdfState('loading');
    setPdfError(null);

    try {
      // Capture radar chart as PNG
      let chartImage: string | null = null;
      if (chartRef?.current) {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        });
        chartImage = canvas.toDataURL('image/png');
      }

      // Generate PDF
      const blob = await generateReportPdf(reportId, chartImage);

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `diagnostico-ia-${reportId.slice(0, 8)}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);

      setPdfState('success');
    } catch (err) {
      setPdfError(getErrorMessage(err));
      setPdfState('error');
    } finally {
      submitLockRef.current = false;
    }
  }, [reportId, chartRef]);

  // ── Handle LinkedIn share ────────────────────────────────────────
  const handleLinkedInShare = useCallback(() => {
    const url = encodeURIComponent(
      `${window.location.origin}/report/${reportId}`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank',
      'noopener,noreferrer'
    );
  }, [reportId]);

  // ── Retry handler ──────────────────────────────────────────────
  const handleRetryPdf = () => {
    setPdfState('idle');
    setPdfError(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── PDF Download Section ───────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {pdfState === 'idle' && (
          <Button
            onClick={handleDownloadPdf}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar PDF
          </Button>
        )}

        {pdfState === 'loading' && (
          <Button disabled variant="secondary" className="w-full sm:w-auto">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-grey-01 border-t-rose shrink-0" />
            Generando PDF...
          </Button>
        )}

        {pdfState === 'success' && (
          <div className="flex items-center gap-3 rounded-[16px] border border-green-500/30 bg-green-50 p-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-sm text-green-700">PDF descargado correctamente.</span>
          </div>
        )}

        {pdfState === 'error' && (
          <div className="flex items-center gap-3 rounded-[16px] border border-rose/30 bg-rose/5 p-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff647c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-rose">{pdfError || 'Error al generar el PDF.'}</p>
              <button
                onClick={handleRetryPdf}
                className="mt-1 font-accent text-xs font-semibold tracking-[0.07em] text-rose uppercase hover:underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── LinkedIn Share Section ─────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          onClick={handleLinkedInShare}
          className="w-full border-[#1b1b1b] tracking-[0.07em] sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Compartir en LinkedIn
        </Button>
      </div>
    </div>
  );
}
