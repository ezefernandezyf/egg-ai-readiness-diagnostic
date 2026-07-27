# Proposal: Egg AI Readiness Diagnostic Tool

## Intent

Replace Egg's high-friction lead funnel (8-field form → 90-min meeting with zero instant value) with an interactive AI Readiness Diagnostic that delivers a personalized score + report in exchange for lead data, warming prospects before the sales conversation.

## Business Context

Egg.live (EGG SAS, Mendoza 2015, $2.9M funding) is an Argentinian EdTech helping enterprises transition to the AI era via live training, an HCA team-formation algorithm, and a Sync Index for cooperation measurement. Portfolio MVP targeting founder/CTO outreach to demonstrate full-stack + AI integration capability.

## Problem

Current funnel: Landing → LeadConnector form → 90-min call → Sale. **No instant value exchange.** The lead gives their data and waits days for a meeting. High abandonment, no lead qualification signal, no organic shareability.

## Solution

Multi-step interactive web app evaluating AI maturity across 5 dimensions (Strategy, Talent, Processes, Technology, Culture). Generates an instant Groq-powered report with dimension scores, narrative summary, and personalized recommendations — delivered as interactive dashboard + PDF.

## Scope

| In Scope | Out of Scope |
|----------|-------------|
| 5-dimension quiz (~15 questions) | Admin dashboard / lead management |
| Groq scoring + narrative report | Multi-language (Spanish-only MVP) |
| Interactive dashboard (radar + breakdown) | A/B testing infra |
| Downloadable PDF | SSO / advanced auth |
| Email report delivery | LeadConnector webhook (V2) |
| LinkedIn share card | Multi-tenant / team features |
| Lead capture + maturity-segmented storage | HCA / Sync Index integration |

## User Journey

1. Land → diagnostic intro screen with promise ("Conocé tu madurez IA en 5 min")
2. Answer 3 questions/dimension across 5 screens (progress bar, back navigation)
3. Enter email to unlock report (Zod-validated, stored in DB)
4. System scores responses → calls Groq for narrative + recs → generates PDF
5. User sees interactive dashboard (radar chart, dimension scores, recommendations)
6. Report arrives by email
7. User can share score card on LinkedIn (viral loop)

## Success Criteria

- [ ] Full diagnostic completable in <5 min
- [ ] Report generated in <15s (incl. Groq)
- [ ] PDF downloadable + email-delivered
- [ ] Lead stored with per-dimension maturity scores
- [ ] Zero PII in client-side code
- [ ] All `shared/` Zod schemas pass strict TS check

## Technical Approach

Monorepo: `web/` (React 19 + Vite + Tailwind 4) → quiz + dashboard; `server/` (Express + Prisma) → REST API + Groq proxy; `shared/` → Zod contracts. Quiz submission → server scores → Groq returns structured JSON (scores, narrative, recs) → stored in Postgres → PDF generated server-side → emailed.

## Capabilities

| New | Description |
|-----|-------------|
| `ai-readiness-quiz` | Multi-step form, 5 dimensions, progress UX, Zod validation |
| `ai-report-engine` | Scoring logic + Groq narrative + recommendation generation |
| `lead-capture` | Email + company info, maturity-segmented storage |

Modified capabilities: None (greenfield).

## Risks & Mitigations

| Risk | L | Mitigation |
|------|---|------------|
| Groq latency/cost | Med | Cache reports, dedupe by email hash |
| Feels like thin lead bait | Med | Invest in genuine assessment + specific recs |
| Egg has internal version | Low | Exploration found no evidence |
| Single-dev capacity | Med | Aggressive MVP scoping |

## Rollback Plan

Deploy to subdomain (`diagnostico.egg.live` or route). Rollback: remove link from main site. No existing funnel is modified — the diagnostic supplements the current form.

## Next Steps

1. Spec (sdd-spec) — detailed requirements + scenarios for each capability
2. Design (sdd-design) — technical architecture, data flow, component tree
3. Tasks (sdd-tasks) — implementation plan
