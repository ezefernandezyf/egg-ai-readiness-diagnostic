import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import diagnosticRoutes from './routes/diagnostic.js';

// ── Configuration ───────────────────────────────────────────────
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const CORS_ORIGIN = process.env['CORS_ORIGIN'] ?? 'http://localhost:5173';

// ── Express app ─────────────────────────────────────────────────
const app = express();

// ── Middleware ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Diagnostic routes ───────────────────────────────────────────
app.use('/api/diagnostic', diagnosticRoutes);

// ── Error handler (must be last) ────────────────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] CORS origin: ${CORS_ORIGIN}`);
});
