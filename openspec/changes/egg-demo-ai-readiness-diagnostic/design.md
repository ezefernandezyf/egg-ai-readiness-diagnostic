# Design: Egg AI Readiness Diagnostic Tool

## Architecture Overview

```
web/ (React 19 + Vite + Tailwind 4 + React Router 7)
  Quiz Wizard ─→ LeadCapture ─→ Dashboard (radar + breakdown)

server/ (Express 5 + Prisma + Groq SDK)
  POST /api/diagnostic/submit
  GET  /api/diagnostic/report/:id
  POST /api/diagnostic/send-email

shared/ (Zod 4)
  quiz.schema.ts  report.schema.ts  lead.schema.ts
```

Monorepo follows AGENTS.md conventions: `web/src/features/{quiz,report,lead}` vertical slices; `server/src/services/` for scoring/Groq/PDF; `shared/` as single source of truth for contracts. Vercel deploy: SPA (`web/`) + serverless functions (`server/api/`).

## Component Tree

```
App
├── routes/QuizPage
│   ├── QuizWizard          ← Zustand (quizStore: step, answers[])
│   │   ├── ProgressBar     ← sticky, computed %
│   │   ├── StepQuestion    ← 3x Likert per dimension
│   │   └── StepNavigation  ← Anterior (disabled step 1) | Siguiente / Ver Resultado
│   └── QuizIntro           ← Landing, "Comenzar diagnóstico"
├── routes/LeadPage
│   └── LeadForm            ← Email + Company + Role?, Zod client-side
├── routes/ReportPage
│   ├── RadarChart          ← Recharts, 5 axes, animation <500ms
│   ├── DimensionBreakdown  ← Score cards per dimension
│   ├── Recommendations     ← Groq output, priority badges
│   └── ReportActions       ← Descargar PDF | Enviar Email | Compartir LinkedIn
└── shared/
    ├── Layout              ← Header, Footer
    └── UI components       ← Button, Card, Input (Tailwind + cva)
```

## Data Flow

```
1. User completes 5-step quiz → answers[] in Zustand
2. Step 5 → LeadForm shown (email + company + role?)
3. POST /api/diagnostic/submit { answers[], email, company, role? }
4. server: Zod validate input → Scoring Service → Groq (12s timeout)
5. Single Prisma transaction: Lead + 15 QuizResponse + 5 DimensionScore + 1 Report
6. Response: { scores, narrative, recommendations, reportId }
7. Client: navigate /report/:id → render Dashboard
8. Dashboard: Recharts radar + dimension cards + recs
9. POST /api/diagnostic/send-email { email, reportId } → Nodemailer
10. GET /api/diagnostic/report/:id/pdf → PDF download
```

Duplicate email: server queries `Lead.email` hash → returns cached report, skips Groq.

## Routes

| Frontend Route | API Endpoint | Method | Description |
|---|---|---|---|
| `/` | — | — | Quiz intro (landing) |
| `/quiz` | — | — | 5-step wizard |
| `/lead` | — | — | Email capture form |
| `/report/:id` | `/api/diagnostic/report/:id` | GET | Dashboard data |
| — | `/api/diagnostic/submit` | POST | Quiz + lead submission |
| — | `/api/diagnostic/send-email` | POST | Email delivery |
| — | `/api/diagnostic/report/:id/pdf` | GET | PDF download |

## Prisma Schema

```prisma
model Lead {
  id               String   @id @default(uuid())
  email_hash       String   @unique
  company          String
  role             String?
  maturity_segment String   // "low" | "medium" | "high"
  created_at       DateTime @default(now())
  responses        QuizResponse[]
  scores           DimensionScore[]
  report           Report?
}

model QuizResponse {
  id           String @id @default(uuid())
  lead_id      String
  dimension    String // "Estrategia"|"Talento"|"Procesos"|"Tecnología"|"Cultura"
  question_key String
  score_1_5    Int
  lead         Lead   @relation(fields: [lead_id], references: [id])
}

model DimensionScore {
  id         String @id @default(uuid())
  lead_id    String
  dimension  String
  score_0_100 Float
  lead       Lead   @relation(fields: [lead_id], references: [id])
}

model Report {
  id              String   @id @default(uuid())
  lead_id         String   @unique
  overall_score   Float
  narrative       String?
  recommendations Json     // [{dimension, action, priority, expected_impact}]
  pdf_url         String?
  partial         Boolean  @default(false)
  created_at      DateTime @default(now())
  lead            Lead     @relation(fields: [lead_id], references: [id])
}
```

Email is stored as SHA-256 hash — never plaintext. `maturity_segment` derived from `overall_score`.

## Scoring Algorithm

`dimension_score = (avg(likert_1_5) - 1) / 4 * 100`

- All 1s → avg=1 → (0)/4*100 = **0**
- All 5s → avg=5 → (4)/4*100 = **100**
- All 3s → avg=3 → (2)/4*100 = **50**

`overall_score = avg(all 5 dimension_scores)`

Maturity segment: `score ≤ 33 → low | 34-66 → medium | 67-100 → high`

Runs server-side in `server/src/services/scoring.ts`. Pure function, no side effects.

## Groq Integration

| Aspect | Decision |
|---|---|
| Model | `llama-3.1-8b-instant` (fast, cheap, <1s typical) |
| SDK | `groq-sdk` npm package |
| Timeout | AbortController 12s |
| Retry | 1 retry on Zod validation failure |
| Fallback | Return scores only, `partial=true`, no narrative |

Prompt template in `server/src/services/groq.ts`. Structured prompt with dimension scores → response validated against `shared/report.schema.ts` Zod schema. Groq API key in `GROQ_API_KEY` env var — never serialized to client.

## PDF Generation

**Library**: `jspdf` (no headless browser, works in serverless). Decision table:

| Option | Tradeoff | Chosen |
|---|---|---|
| Puppeteer | Heavy (~300MB), slow cold start, serverless-unsuitable | No |
| jsPDF | Lightweight, serverless-compatible, limited styling | **Yes** |
| pdfmake | Declarative, good layout, heavier bundle | No |

Flow: Dashboard "Descargar PDF" → `GET /api/diagnostic/report/:id/pdf` → jsPDF builds document with radar chart (rendered as canvas → PNG base64 via `html2canvas` on client, sent as `POST /api/diagnostic/report/:id/pdf` with chart image) → PDF stream response.

## Error Handling

| Failure | UX | Server |
|---|---|---|
| Groq timeout/error | Report shown without AI narrative, "Reintentar IA" button | `partial=true`, scores only |
| Email delivery fail | Report unlocked anyway, "Reenviar email" button | Log error, return 502 |
| Duplicate email | Cached report returned instantly | Query by `email_hash` |
| PDF generation fail | Dashboard visible, "Reintentar PDF" button | 500, no side effects |
| Zod validation fail | Inline error per field (web + server) | 400 with field-level errors |

Global error middleware in `server/src/middleware/errorHandler.ts` catches unhandled → 500 + sanitized message. Client: TanStack Query `onError` → toast.

## State Management

- **TanStack Query**: Server state — report fetching, quiz submission mutation, email send. Caching, dedupe, loading/error states built-in.
- **Zustand**: UI state only — `quizStore` (currentStep, answers per dimension, `goNext()`, `goBack()`). No state survives page refresh (MVP per spec).

## Security

- Groq API key: `process.env.GROQ_API_KEY` server-side only — never in client bundle
- Email: stored as SHA-256 hash in DB; plaintext only transient for SMTP
- Input: Zod validation on BOTH client (UX) and server (security). `shared/` schemas enforce this.
- PDF: no user input rendered unsanitized; text from Groq treated as safe (server-generated)
- CORS: Express configured for `web` origin only in production
