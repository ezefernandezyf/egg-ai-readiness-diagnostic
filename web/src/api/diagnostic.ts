// ── Types ────────────────────────────────────────────────────────
interface SubmitAnswer {
  dimension: string;
  questionKey: string;
  score: number;
}

export interface SubmitPayload {
  answers: SubmitAnswer[];
  email: string;
  company: string;
  role?: string;
}

export interface DimensionScore {
  dimension: string;
  score: number;
}

export interface Recommendation {
  dimension: string;
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  expectedImpact: string;
}

export interface SubmitResponse {
  reportId: string;
  overallScore: number;
  maturitySegment: string;
  dimensionScores: DimensionScore[];
  narrative: string | null;
  recommendations: Recommendation[] | null;
  partial: boolean;
}

export interface ReportResponse {
  id: string;
  overallScore: number;
  maturitySegment: string;
  dimensionScores: DimensionScore[];
  narrative: string | null;
  recommendations: Recommendation[] | null;
  partial: boolean;
  pdfUrl: string | null;
  createdAt: string;
}

// ── API base ─────────────────────────────────────────────────────
const API_BASE = '/api';

// ── Submit quiz + lead ───────────────────────────────────────────
export async function submitQuiz(payload: SubmitPayload): Promise<SubmitResponse> {
  const response = await fetch(`${API_BASE}/diagnostic/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ?? `Error ${response.status}: no se pudo enviar el diagnostico`,
    );
  }

  return response.json() as Promise<SubmitResponse>;
}

// ── Get report by ID ─────────────────────────────────────────────
export async function getReport(reportId: string): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE}/diagnostic/report/${reportId}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Reporte no encontrado');
    }
    throw new Error(`Error ${response.status}: no se pudo obtener el reporte`);
  }

  return response.json() as Promise<ReportResponse>;
}

// ── Generate PDF ─────────────────────────────────────────────────
export async function generateReportPdf(
  reportId: string,
  chartImage: string | null,
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/diagnostic/report/${reportId}/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chartImage }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ?? `Error ${response.status}: no se pudo generar el PDF`,
    );
  }

  return response.blob();
}

// ── Send email with report ───────────────────────────────────────
export async function sendReportEmail(
  reportId: string,
  email: string,
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/diagnostic/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportId, email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ?? `Error ${response.status}: no se pudo enviar el email`,
    );
  }

  return response.json() as Promise<{ success: boolean; message: string }>;
}
