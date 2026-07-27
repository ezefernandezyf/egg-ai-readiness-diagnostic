import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/shared/layout';
import { QuizWizard } from '@/features/quiz/components/QuizWizard';
import { LeadForm } from '@/features/lead/components/LeadForm';
import { ReportPage } from '@/features/report/pages/ReportPage';
import '@/index.css';

// ── TanStack Query client ────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

// ── App shell ────────────────────────────────────────────────────
function AppShell() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/lead" element={<LeadPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}

// ── Home — Quiz wizard ───────────────────────────────────────────
function QuizPage() {
  return (
    <QuizWizard
      onComplete={() => {
        // Navigate to lead is handled inside QuizWizard via useEffect
      }}
    />
  );
}

// ── Lead capture ─────────────────────────────────────────────────
function LeadPage() {
  return <LeadForm />;
}

// ── 404 page ─────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h2 className="text-2xl font-semibold text-black-base">Pagina no encontrada</h2>
      <p className="text-beige-04">La pagina que buscas no existe.</p>
    </section>
  );
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </StrictMode>,
);
