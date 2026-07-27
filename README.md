# Egg AI Readiness Diagnostic

Diagnóstico interactivo de madurez IA para empresas. Herramienta full-stack que evalúa 5 dimensiones clave y genera un reporte personalizado con recomendaciones vía Groq.

Inspirado en [Egg.live](https://egg.live), plataforma argentina de transformación de talento a la era IA.

## Quick path

```bash
# 1. Server
cd server
pnpm install
pnpm run prisma:generate && pnpm run prisma:migrate
pnpm dev               # localhost:3001

# 2. Web
cd web
pnpm install
pnpm dev               # localhost:5173

# 3. Tests
pnpm test              # 40 tests, 0 failures
```

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript 5, Vite, Tailwind CSS 4 |
| Backend | Node.js, Express 5, Prisma ORM |
| AI | Groq API (llama-3.1-8b-instant) |
| State | TanStack Query + Zustand |
| Validación | Zod 4 (contratos compartidos front/back) |
| Tests | Vitest (40 tests) |
| PDF | jsPDF |
| Diseño | Plus Jakarta Sans + Space Grotesk |

## Funcionalidades

- **Quiz interactivo**: 5 dimensiones × 3 preguntas, escala Likert 1-5, barra de progreso
- **Scoring**: Normalización (avg-1)/4×100, segmentación low/medium/high
- **Reporte con IA**: Narrativa y recomendaciones personalizadas generadas por Groq
- **Dashboard**: Radar chart (Recharts), desglose por dimensión, recomendaciones priorizadas
- **PDF descargable**: Reporte completo con scores y recomendaciones
- **Lead capture**: Nombre, apellido, teléfono, país, empresa — segmentación por madurez

## Arquitectura

```
egg-demo/
├── web/          # React SPA (quiz wizard, dashboard, lead form)
├── server/       # Express API (scoring, Groq, PDF, Prisma)
├── shared/       # Zod schemas compartidos (tipos front/back)
└── openspec/     # SDD artifacts (spec, design, tasks)
```

## Detalles técnicos

| Aspecto | Decisión |
|---------|----------|
| Brand | Egg tokens reales: #f7f5f2, #ff647c, #1b1b1b, #ffcd00 |
| Scoring | `(avg(likert) - 1) / 4 * 100` — pura, sin efectos secundarios |
| Groq | Timeout 12s, 1 retry, fallback a scores-only |
| Email | SHA-256 hash en DB, sin texto plano |
| PDF | jsPDF (serverless-safe, sin headless browser) |
| Auth | Sin auth — herramienta pública |

## Deploy

- **Frontend**: Vercel
- **Backend**: Render
- **DB**: Supabase (PostgreSQL)

---

*Demo no oficial — no afiliado con Egg.live.*
