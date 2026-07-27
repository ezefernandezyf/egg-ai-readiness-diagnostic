import type { ReactNode } from 'react';

// ── Props ────────────────────────────────────────────────────────
interface LayoutProps {
  children: ReactNode;
}

// ── Layout ───────────────────────────────────────────────────────
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────
function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-grey-01 bg-white/80 backdrop-blur-sm">
      <div className="container-egg flex h-14 items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-black-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Diagnóstico IA
        </span>
        <span className="font-accent text-xs font-medium tracking-[0.07em] text-beige-04 uppercase">
          Demo no oficial
        </span>
      </div>
    </header>
  );
}

// ── Footer ───────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-grey-01 bg-white py-6">
      <div className="container-egg text-center text-sm text-beige-04">
        <p>Diagnóstico IA - Demo no oficial</p>
      </div>
    </footer>
  );
}
