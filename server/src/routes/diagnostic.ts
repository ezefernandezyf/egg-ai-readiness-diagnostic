// ── Diagnostic Routes ─────────────────────────────────────────────
// POST /api/diagnostic/submit — full submission flow
// GET  /api/diagnostic/report/:id — fetch report data
// POST /api/diagnostic/report/:id/pdf — generate and return PDF
// POST /api/diagnostic/send-email — send report via email

import { Router, type IRouter } from 'express';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';
import { calculateDimensionScore, calculateOverallScore, getMaturitySegment } from '../services/scoring.js';
import { generateReport } from '../services/groq.js';
import { generatePdf } from '../services/pdf.js';
import { sendReportEmail } from '../services/email.js';
import type { AnswerInput } from '../services/groq.js';
import type { PdfInput, PdfDimensionScore, PdfRecommendation } from '../services/pdf.js';
import { DiagnosticSubmitPayload } from '@egg-demo/shared/contracts/lead.schema.js';

// ── Dependencies ──────────────────────────────────────────────────
const prisma = new PrismaClient();
const router: IRouter = Router();

// ── Helper: hash email ────────────────────────────────────────────
function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

// ── POST /api/diagnostic/submit ──────────────────────────────────
router.post('/submit', async (req, res, next) => {
  try {
    // 1. Validate input
    const parsed = DiagnosticSubmitPayload.parse(req.body);
    const { answers, email, company, role } = parsed;

    // 2. Group answers by dimension
    const grouped: Record<string, number[]> = {};
    for (const a of answers) {
      if (!grouped[a.dimension]) grouped[a.dimension] = [];
      grouped[a.dimension]!.push(a.score);
    }

    const DIMENSIONS = ['Estrategia', 'Talento', 'Procesos', 'Tecnologia', 'Cultura'];

    // 3. Calculate per-dimension scores
    const dimensionScores = DIMENSIONS.map((dim) => ({
      dimension: dim,
      score: calculateDimensionScore(grouped[dim] ?? []),
    }));

    const overallScore = calculateOverallScore(dimensionScores.map((d) => d.score));
    const maturitySegment = getMaturitySegment(overallScore);

    // 4. Generate narrative via Groq
    const answerInputs: AnswerInput[] = answers.map((a) => ({
      dimension: a.dimension,
      questionKey: a.questionKey,
      score: a.score,
    }));

    const groqResult = await generateReport(
      dimensionScores.map((d) => ({ dimension: d.dimension, score: d.score })),
      answerInputs,
    );

    const isPartial = groqResult === null;

    // 5. Persist to database in a transaction
    const emailHash = hashEmail(email);

    // Check for duplicate email
    const existingLead = await prisma.lead.findUnique({
      where: { email_hash: emailHash },
      include: { report: true },
    });

    if (existingLead?.report) {
      // Return cached report
      res.json({
        reportId: existingLead.report.id,
        overallScore,
        maturitySegment,
        dimensionScores,
        narrative: existingLead.report.narrative,
        recommendations: existingLead.report.recommendations
          ? JSON.parse(existingLead.report.recommendations as string)
          : null,
        partial: existingLead.report.partial,
      });
      return;
    }

    const report = await prisma.$transaction(async (tx) => {
      // Create or find lead
      const lead = existingLead ?? (await tx.lead.create({
        data: {
          email_hash: emailHash,
          company,
          role: role ?? null,
          maturity_segment: maturitySegment,
        },
      }));

      // Create all quiz responses (15 total)
      for (const a of answers) {
        await tx.quizResponse.create({
          data: {
            lead_id: lead.id,
            dimension: a.dimension,
            question_key: a.questionKey,
            score_1_5: a.score,
          },
        });
      }

      // Create dimension scores (5 total)
      for (const ds of dimensionScores) {
        await tx.dimensionScore.create({
          data: {
            lead_id: lead.id,
            dimension: ds.dimension,
            score_0_100: ds.score,
          },
        });
      }

      // Create report
      const newReport = await tx.report.create({
        data: {
          lead_id: lead.id,
          overall_score: overallScore,
          narrative: groqResult?.narrative ?? null,
          recommendations: groqResult?.recommendations
            ? JSON.stringify(groqResult.recommendations)
            : null,
          partial: isPartial,
        },
      });

      return newReport;
    });

    // 6. Return response
    res.status(201).json({
      reportId: report.id,
      overallScore,
      maturitySegment,
      dimensionScores,
      narrative: groqResult?.narrative ?? null,
      recommendations: groqResult?.recommendations ?? null,
      partial: isPartial,
    });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/diagnostic/report/:id ───────────────────────────────
router.get('/report/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        lead: {
          include: {
            scores: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Reporte no encontrado', statusCode: 404 });
      return;
    }

    // Build response
    const dimensionScores = report.lead.scores.map((s) => ({
      dimension: s.dimension,
      score: s.score_0_100,
    }));

    const maturitySegment = getMaturitySegment(report.overall_score);

    res.json({
      id: report.id,
      overallScore: report.overall_score,
      maturitySegment,
      dimensionScores,
      narrative: report.narrative,
      recommendations: report.recommendations
        ? JSON.parse(report.recommendations as string)
        : null,
      partial: report.partial,
      pdfUrl: report.pdf_url,
      createdAt: report.created_at.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/diagnostic/report/:id/pdf ──────────────────────────
router.post('/report/:id/pdf', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { chartImage } = req.body as { chartImage?: string };

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        lead: {
          include: { scores: true },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Reporte no encontrado', statusCode: 404 });
      return;
    }

    const dimensionScores: PdfDimensionScore[] = report.lead.scores.map((s) => ({
      dimension: s.dimension,
      score: s.score_0_100,
    }));

    const recommendations: PdfRecommendation[] = report.recommendations
      ? (JSON.parse(report.recommendations as string) as PdfRecommendation[])
      : [];

    const maturitySegment = getMaturitySegment(report.overall_score);

    const pdfInput: PdfInput = {
      overallScore: report.overall_score,
      maturitySegment,
      dimensionScores,
      recommendations,
      chartImageBase64: chartImage ?? null,
    };

    const pdfBuffer = generatePdf(pdfInput);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="diagnostico-ia-${id.slice(0, 8)}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

// ── POST /api/diagnostic/send-email ──────────────────────────────
router.post('/send-email', async (req, res, next) => {
  try {
    const { reportId, email } = req.body as { reportId?: string; email?: string };

    if (!reportId || !email) {
      res.status(400).json({
        error: 'reportId y email son requeridos',
        statusCode: 400,
      });
      return;
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        lead: {
          include: { scores: true },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Reporte no encontrado', statusCode: 404 });
      return;
    }

    const dimensionScores: PdfDimensionScore[] = report.lead.scores.map((s) => ({
      dimension: s.dimension,
      score: s.score_0_100,
    }));

    const recommendations: PdfRecommendation[] = report.recommendations
      ? (JSON.parse(report.recommendations as string) as PdfRecommendation[])
      : [];

    const maturitySegment = getMaturitySegment(report.overall_score);

    const pdfInput: PdfInput = {
      overallScore: report.overall_score,
      maturitySegment,
      dimensionScores,
      recommendations,
      chartImageBase64: null,
    };

    const pdfBuffer = generatePdf(pdfInput);

    const result = await sendReportEmail({
      to: email,
      reportId,
      overallScore: report.overall_score,
      pdfBuffer,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
