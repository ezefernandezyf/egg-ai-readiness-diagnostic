# Tasks: Egg AI Readiness Diagnostic Tool

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~905 (all new) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

```
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Shared schemas + Prisma + scoring + server skeleton | PR 1 | Base on main; infra only |
| 2 | Quiz wizard + lead form + API client + routes | PR 2 | Depends on PR 1 for types |
| 3 | Groq service + submit endpoint + dashboard | PR 3 | Depends on PR 1 + PR 2 |
| 4 | PDF + email + report actions + final wiring | PR 4 | Depends on PR 3 |

## Phase 1: Foundation

- [x] 1.1 Project scaffolding: pnpm workspaces, Vite+React+TS (web/), Express+TS+Prisma (server/), Zod 4 (shared/)
- [x] 1.2 Create `shared/contracts/{quiz,report,lead}.schema.ts` — Likert 1–5, scores, email+company
- [x] 1.3 Create `server/prisma/schema.prisma` + migration — Lead, QuizResponse, DimensionScore, Report
- [x] 1.4 Create `server/src/services/scoring.ts` — `avg(Likert)→0-100` pure fn, low/med/high segment
- [x] 1.5 Create `server/src/middleware/errorHandler.ts` — global catch → sanitized JSON
- [x] 1.6 Scaffold `server/src/index.ts` — Express app, Prisma client, CORS, env vars

## Phase 2: Quiz + Lead Flow

- [x] 2.1 Create `quizStore.ts` — Zustand: step, answers, goNext/goBack + token update to Egg brand
- [x] 2.2 Create QuizWizard + ProgressBar + QuizStep — Likert pills, navigation, Egg brand styling
- [x] 2.3 Create `QuizIntro.tsx` — landing hero + "Comenzar diagnóstico" CTA with Egg brand
- [x] 2.4 Create `LeadForm.tsx` — email+company, Zod client validation, inline errors
- [x] 2.5 Create `web/src/api/diagnostic.ts` — typed fetch wrappers (submitQuiz, getReport)
- [x] 2.6 Create `useReport.ts` — TanStack Query hooks (useReport + useSubmitQuiz)
- [x] 2.7 Wire React Router: `/` quiz, `/lead` form, `/report/:id` placeholder

## Phase 3: Report Engine

- [x] 3.1 Create `server/src/services/groq.ts` — prompt, groq-sdk, AbortController 12s, 1 retry, partial fallback
- [x] 3.2 Create `server/src/routes/diagnostic.ts` — POST /submit (Zod→scoring→Groq→Prisma tx), GET /report/:id
- [x] 3.3 Create `RadarChart.tsx` — Recharts 5-axis radar, hover score, mount animation <500ms
- [x] 3.4 Create `DimensionBreakdown.tsx` — 5 bars with score bar + normalized value
- [x] 3.5 Create `Recommendations.tsx` — Groq recs list with priority badges
- [x] 3.6 Create `useReport.ts` — TanStack Query hooks (useReport + useSubmitQuiz)
- [x] 3.7 Create `ScoreCard.tsx` — overall score circle + maturity badge
- [x] 3.8 Create `ReportDashboard.tsx` — main layout composing all report components
- [x] 3.9 Create `ReportPage.tsx` — route page with loading/error/success states
- [x] 3.10 Create `ReportActions.tsx` — Download PDF + Email buttons (Phase 4 placeholders)
- [x] 3.11 Wire QueryClientProvider + ReportPage route in main.tsx
- [x] 3.12 Install dependencies: groq-sdk, @tanstack/react-query, recharts

## Phase 4: Delivery + Polish

- [x] 4.1 Create `server/src/services/pdf.ts` — jsPDF doc: scores, narrative, recs
- [x] 4.2 Create `server/src/services/email.ts` — Nodemailer transport + send report-link
- [x] 4.3 Add GET /report/:id/pdf + POST /send-email routes
- [x] 4.4 Create `ReportActions.tsx` — Descargar PDF, Enviar Email, Compartir LinkedIn
- [ ] 4.5 E2E verification: submit→score→Groq→dashboard→PDF→email (deferred — not for MVP)
