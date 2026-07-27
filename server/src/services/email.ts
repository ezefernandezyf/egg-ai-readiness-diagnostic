// ── Email Delivery Service ─────────────────────────────────────────
// Sends report PDF via SMTP using nodemailer.
// Development fallback: logs to console when SMTP is not configured.

import nodemailer from 'nodemailer';

// ── Types ─────────────────────────────────────────────────────────
export interface EmailInput {
  to: string;
  reportId: string;
  overallScore: number;
  pdfBuffer: Buffer;
}

// ── Check if SMTP is configured ───────────────────────────────────
function isSmtpConfigured(): boolean {
  return !!(process.env['EMAIL_HOST'] && process.env['EMAIL_USER'] && process.env['EMAIL_PASS']);
}

// ── Create transporter lazily ─────────────────────────────────────
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env['EMAIL_HOST'] ?? 'localhost',
      port: parseInt(process.env['EMAIL_PORT'] ?? '587', 10),
      secure: process.env['EMAIL_PORT'] === '465',
      auth: {
        user: process.env['EMAIL_USER'] ?? '',
        pass: process.env['EMAIL_PASS'] ?? '',
      },
    });
  }
  return transporter;
}

// ── Send email ────────────────────────────────────────────────────
export async function sendReportEmail(input: EmailInput): Promise<{ success: boolean; message: string }> {
  const { to, reportId, overallScore, pdfBuffer } = input;
  const viewUrl = `${process.env['WEB_URL'] ?? 'http://localhost:5173'}/report/${reportId}`;

  if (!isSmtpConfigured()) {
    // ── Development fallback — log to console ─────────────────────
    console.log('─'.repeat(60));
    console.log('[email] DEV MODE — SMTP not configured, logging email:');
    console.log(`  To: ${to}`);
    console.log(`  Subject: Tu Diagnostico de Madurez IA - Egg.live`);
    console.log(`  Report ID: ${reportId}`);
    console.log(`  Score: ${Math.round(overallScore)}/100`);
    console.log(`  View URL: ${viewUrl}`);
    console.log(`  PDF size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
    console.log('─'.repeat(60));

    return {
      success: true,
      message: 'Email logged to console (dev mode)',
    };
  }

  try {
    const transport = getTransporter();

    const info = await transport.sendMail({
      from: `"Egg.live - Diagnostico IA" <${process.env['EMAIL_USER']!}>`,
      to,
      subject: 'Tu Diagnostico de Madurez IA - Egg.live',
      html: buildEmailHtml({ to, reportId, overallScore, viewUrl }),
      attachments: [
        {
          filename: `diagnostico-ia-${reportId.slice(0, 8)}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('[email] Sent:', info.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[email] Failed to send:', errorMessage);
    return { success: false, message: `Error sending email: ${errorMessage}` };
  }
}

// ── Build HTML email body ─────────────────────────────────────────
function buildEmailHtml(input: { to: string; reportId: string; overallScore: number; viewUrl: string }): string {
  const { to, overallScore, viewUrl } = input;
  const recipientName = to.split('@')[0] ?? '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1b1b1b; background: #f7f5f2; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .header p { font-size: 14px; color: #8d877c; margin: 0; }
    .score-box { background: #ffffff; border: 1px solid #d2d2d2; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px; }
    .score-box .score { font-size: 48px; font-weight: 700; color: #22C55E; }
    .score-box .label { font-size: 12px; color: #8d877c; text-transform: uppercase; letter-spacing: 0.07em; margin-top: 4px; }
    .cta { display: inline-block; background: #ff647c; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 999px; font-size: 14px; font-weight: 600; margin-top: 16px; }
    .footer { text-align: center; font-size: 12px; color: #8d877c; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tu Diagnostico de Madurez IA</h1>
      <p>Gracias por completar el diagnostico, ${recipientName}</p>
    </div>
    <div class="score-box">
      <div class="score">${Math.round(overallScore)}</div>
      <div class="label">Score General</div>
    </div>
    <p style="font-size: 14px; color: #1b1b1b; line-height: 1.5; text-align: center;">
      Adjunto encontras tu reporte en PDF con el detalle completo
      de tus resultados y recomendaciones personalizadas.
    </p>
    <div style="text-align: center;">
      <a href="${viewUrl}" class="cta">Ver online</a>
    </div>
    <div class="footer">
      <p>Diagnostico de Madurez IA - Egg.live</p>
    </div>
  </div>
</body>
</html>`;
}
