// ── Email Service (stub) ────────────────────────────────────────────
// Email delivery has been removed. This file is kept as a stub
// in case email functionality is re-added in the future.

export interface EmailInput {
  to: string;
  reportId: string;
  overallScore: number;
  pdfBuffer: Buffer;
}

export async function sendReportEmail(_input: EmailInput): Promise<{ success: boolean; message: string }> {
  return { success: false, message: 'Email service is disabled' };
}
