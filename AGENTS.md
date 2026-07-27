# Egg Demo — Agent Context

> MVP: Herramienta interactiva de diagnóstico de madurez IA para Egg.live (egg.live).
> Proyecto de portfolio para demostrar iniciativa técnica y conseguir primer empleo como Full-Stack Developer.

## Stack

- **Frontend**: React 19 + TypeScript 5 (strict) + Vite + Tailwind CSS 4 + React Router 7
- **Backend**: Node.js + Express 5 + TypeScript + Prisma ORM
- **AI**: Groq API (server-side proxy, key nunca expuesta al cliente)
- **State**: TanStack Query (server) + Zustand (UI)
- **Validación**: Zod 4 (contratos compartidos front/back)
- **Testing**: Vitest (cuando corresponda)
- **Lint/Format**: ESLint 9 flat config + Prettier
- **Package Manager**: pnpm
- **Deploy**: Vercel (frontend SPA + serverless functions)

## Arquitectura

```
egg-demo/
├── web/                 # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # UI reutilizable (Header, Button, Card, etc.)
│   │   ├── features/    # Slices verticales (quiz, resultados, reporte)
│   │   ├── shared/      # Tipos, utilidades, layout
│   │   ├── routes/      # React Router config
│   │   ├── api/         # API client por dominio
│   │   ├── hooks/       # Custom hooks (TanStack Query)
│   │   └── main.tsx
│   └── package.json
├── server/              # Backend Express + Prisma
│   ├── src/
│   │   ├── routes/      # API endpoints REST
│   │   ├── services/    # Lógica de negocio (scoring, Groq)
│   │   ├── middleware/   # Auth, validación, error handler
│   │   ├── prisma/      # Schema + migrations
│   │   └── index.ts
│   └── package.json
├── shared/              # Zod schemas compartidos front/back
├── openspec/            # SDD artifacts
│   ├── config.yaml
│   └── changes/
├── design/              # Diseños de OpenPencil (exportados)
└── AGENTS.md
```

### Flujo de datos

```
Usuario -> Quiz interactivo (web/) -> Request a API (server/) ->
Validación Zod (shared/) -> Scoring service -> Groq AI (recomendaciones) ->
Response al frontend -> Visualización de resultados -> Reporte PDF
```

## Conventions

- **Commits**: Conventional Commits en inglés — `feat(scope):`, `fix(scope):`, `chore:`, `docs:`
- **React 19**: named imports, sin `useMemo`/`useCallback` innecesarios (el compiler lo maneja)
- **TypeScript**: strict mode, nunca `any`, `interface` para objetos, `type` para uniones/alias
- **Zod**: schemas en `shared/` son la fuente única de verdad — server valida input, web infiere tipos
- **UX States**: toda operación async debe tener estados Loading, Success, Error, Empty
- **Nunca usar em dash (—)** en la UI. Usar guión común (-) o coma (,) como alternativa. Sin excepción.
- **Never build after changes**, nunca agregar "Co-Authored-By" a commits
- **ESLint + Prettier**: `pnpm run lint` / `pnpm run format` antes de cada commit

## Git Workflow

1. **Feature branches**: toda tarea arranca en una rama nueva desde `main`
2. **Branch naming**: `feat/short-name`, `fix/short-name`, `chore/short-name`
3. **Atomic commits**: un cambio lógico por commit, formato convencional
4. **Push + PR + Merge**: push a la rama, crear PR a `main`, mergear
5. **Clean working tree**: sin archivos sin trackear, sin WIP antes del PR
6. **Lint before push**: `pnpm run lint` debe pasar

## How to Run

```bash
# Frontend
cd web/
pnpm install
pnpm run dev              # dev server en localhost:5173

# Backend
cd server/
pnpm install
pnpm run prisma:generate  # generar Prisma client
pnpm run prisma:migrate   # correr migrations
pnpm run dev              # dev server en localhost:3001
```

## SDD Conventions

- **SDD completo**: propose → spec → design → tasks → apply → verify → archive
- **Strict TDD**: deshabilitado (no hay test runner todavía)
- **Artefactos**: Engram + OpenSpec (híbrido)
- **Delivery**: `ask-always` — pregunto antes de cada commit/PR
- **Review budget**: 400 líneas máx antes de pedir aprobación

## Design Tools

OpenPencil para prototipado UI (app.openpencil.dev o AppImage local).
Los skills de diseño (`impeccable`, `design-taste-frontend`) se cargan según corresponda en cada fase SDD.

## Skills

Las skills aplicables se resuelven desde `.atl/skill-registry.md` y `~/.config/opencode/skills/`.
Skills relevantes para este proyecto: `react-19`, `tailwind-4`, `typescript`, `zod-4`, `work-unit-commits`.

## Contacto objetivo

- **Empresa**: Egg (EGG SAS) — Mendoza, Argentina
- **Producto**: egg.live — transformación de talento a la era IA
- **Canales**: LinkedIn (/company/egglive), sitio web, email
- **Target outreach**: Founder/CTO/Head de Producto
