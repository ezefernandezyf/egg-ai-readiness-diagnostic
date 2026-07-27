// ── PDF Generation Service ─────────────────────────────────────────
// Generates branded PDF reports using jsPDF.
// Egg brand: dark text #1b1b1b on white, Space Grotesk for scores.
// Falls back to Helvetica (built-in) since Space Grotesk requires font embedding.

import { jsPDF } from 'jspdf';

// ── Types ─────────────────────────────────────────────────────────
export interface PdfDimensionScore {
  dimension: string;
  score: number;
}

export interface PdfRecommendation {
  dimension: string;
  action: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  expectedImpact: string;
}

export interface PdfInput {
  overallScore: number;
  maturitySegment: string;
  dimensionScores: PdfDimensionScore[];
  recommendations: PdfRecommendation[];
  chartImageBase64?: string | null;
}

// ── Brand constants ───────────────────────────────────────────────
const TEXT_DARK = '#1b1b1b';
const TEXT_MUTED = '#8d877c';
const ROSE = '#ff647c';
const YELLOW = '#ffcd00';
const GREEN = '#22C55E';
const GREY = '#d2d2d2';
const BG_LIGHT = '#ece7e6';

const PAGE_WIDTH = 210; // A4 in mm
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// ── Helpers ───────────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score <= 33) return ROSE;
  if (score <= 66) return YELLOW;
  return GREEN;
}

function getSegmentLabel(segment: string): string {
  const labels: Record<string, string> = {
    low: 'Principiante',
    medium: 'En desarrollo',
    high: 'Avanzado',
  };
  return labels[segment] ?? segment;
}

// ── Generate PDF ──────────────────────────────────────────────────
export function generatePdf(input: PdfInput): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = MARGIN;

  // ── Title ─────────────────────────────────────────────────────────
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(TEXT_DARK);
  doc.text('Diagnostico de Madurez IA', MARGIN, y);
  y += 6;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_MUTED);
  doc.text('Generado por Egg.live', MARGIN, y);
  y += 14;

  // ── Separator ─────────────────────────────────────────────────────
  doc.setDrawColor(GREY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;

  // ── Overall Score ─────────────────────────────────────────────────
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(TEXT_DARK);
  doc.text('Score General', MARGIN, y);
  y += 10;

  const scoreColor = getScoreColor(input.overallScore);
  const roundedScore = Math.round(input.overallScore);

  // Score number (large)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(scoreColor);
  doc.text(String(roundedScore), MARGIN, y + 10);

  // Maturity badge
  const segLabel = getSegmentLabel(input.maturitySegment);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  const badgeWidth = doc.getTextWidth(segLabel) + 8;
  doc.setFillColor(scoreColor);
  doc.roundedRect(MARGIN + 20, y, badgeWidth, 7, 3, 3, 'F');
  doc.setTextColor('#ffffff');
  doc.text(segLabel, MARGIN + 24, y + 5.5);
  y += 18;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_MUTED);
  doc.text('Score general de madurez IA', MARGIN, y);
  y += 14;

  // ── Chart Image ────────────────────────────────────────────────────
  if (input.chartImageBase64) {
    try {
      const imgData = input.chartImageBase64.startsWith('data:')
        ? input.chartImageBase64
        : `data:image/png;base64,${input.chartImageBase64}`;

      const imgWidth = CONTENT_WIDTH * 0.6;
      const imgHeight = imgWidth * 0.8;
      const imgX = MARGIN + (CONTENT_WIDTH - imgWidth) / 2;

      doc.addImage(imgData, 'PNG', imgX, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch {
      // Silently skip chart if image embedding fails
      y += 4;
    }
  }

  // ── Dimension Breakdown ────────────────────────────────────────────
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(TEXT_DARK);
  doc.text('Desglose por Dimension', MARGIN, y);
  y += 10;

  for (const dim of input.dimensionScores) {
    const barColor = getScoreColor(dim.score);
    const rounded = Math.round(dim.score);
    const barMaxWidth = CONTENT_WIDTH - 50; // reserve space for number

    // Dimension label
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);
    doc.text(dim.dimension, MARGIN, y);

    // Bar track (background)
    doc.setFillColor(BG_LIGHT);
    doc.roundedRect(MARGIN, y + 2, barMaxWidth, 5, 2.5, 2.5, 'F');

    // Bar fill
    const fillWidth = (rounded / 100) * barMaxWidth;
    if (fillWidth > 0) {
      doc.setFillColor(barColor);
      doc.roundedRect(MARGIN, y + 2, fillWidth, 5, 2.5, 2.5, 'F');
    }

    // Score number
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.text(String(rounded), MARGIN + barMaxWidth + 6, y + 5.5);

    y += 10;
  }

  y += 4;

  // Check if we need a new page for recommendations
  if (y > PAGE_HEIGHT - 60) {
    doc.addPage();
    y = MARGIN;
  }

  // ── Separator ─────────────────────────────────────────────────────
  doc.setDrawColor(GREY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;

  // ── Recommendations ───────────────────────────────────────────────
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(TEXT_DARK);
  doc.text('Recomendaciones', MARGIN, y);
  y += 10;

  const topRecs = input.recommendations.slice(0, 3);

  for (let i = 0; i < topRecs.length; i++) {
    const rec = topRecs[i];
    if (!rec) continue;

    // Check page break
    if (y > PAGE_HEIGHT - 40) {
      doc.addPage();
      y = MARGIN;
    }

    // Recommendation card
    const cardBg = BG_LIGHT;
    const cardPadding = 4;
    const cardHeight = 22;

    // Card background
    doc.setFillColor(cardBg);
    doc.roundedRect(MARGIN, y, CONTENT_WIDTH, cardHeight, 3, 3, 'F');

    // Priority badge
    const priorityColors: Record<string, string> = {
      critical: ROSE,
      high: ROSE,
      medium: YELLOW,
      low: BG_LIGHT,
    };
    const badgeColor = priorityColors[rec.priority] ?? YELLOW;
    const badgeText = rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1);

    doc.setFillColor(badgeColor);
    const pBadgeWidth = doc.getTextWidth(badgeText) + 4;
    doc.roundedRect(MARGIN + 4, y + 3, pBadgeWidth, 5, 2, 2, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor('#ffffff');
    doc.text(badgeText, MARGIN + 6, y + 6.5);

    // Dimension label
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED);
    doc.text(rec.dimension, MARGIN + 10 + pBadgeWidth, y + 6.5);

    // Action text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);
    const textLines = doc.splitTextToSize(rec.action, CONTENT_WIDTH - cardPadding * 2 - 4);
    doc.text(textLines, MARGIN + 4, y + 12);

    y += cardHeight + 6;
  }

  y += 6;

  // ── Footer ─────────────────────────────────────────────────────────
  if (y > PAGE_HEIGHT - 20) {
    doc.addPage();
    y = PAGE_HEIGHT - 15;
  } else {
    y = PAGE_HEIGHT - 15;
  }

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED);
  doc.text('Diagnostico de Madurez IA - Egg.live', MARGIN, y);

  // Return as Buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  return pdfBuffer;
}
