import { ReactNode, useEffect } from 'react';
import { X, Gem } from 'lucide-react';

// ---------- Modal ----------
export function Modal({ open, onClose, title, children, wide }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-obsidian/75 backdrop-blur-sm anim-fade-in" onClick={onClose}>
      <div
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl bg-onyx border border-smoke shadow-2xl anim-scale-in max-h-[88vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-smoke shrink-0">
          <h3 className="font-display text-xl font-semibold text-ivory">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-pewter hover:text-ivory hover:bg-charcoal transition-colors cursor-pointer" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ---------- Toast ----------
export interface ToastMsg { id: number; text: string; kind?: 'success' | 'info' | 'error' }

export function Toasts({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[120] space-y-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto anim-slide-left flex items-center gap-3 rounded-xl bg-onyx border border-champagne/30 text-sand pl-3.5 pr-5 py-3 shadow-2xl shadow-black/60 text-sm"
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.kind === 'error' ? 'bg-rose-500/15 text-rose-400' : 'bg-champagne/15 text-champagne'}`}>
            <Gem size={11} />
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}

// ---------- Toggle ----------
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`toggle-track relative w-11 h-6 rounded-full cursor-pointer ${on ? 'bg-champagne' : 'bg-smoke'}`}
      aria-pressed={on}
    >
      <span className={`toggle-thumb absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow ${on ? 'translate-x-5 bg-obsidian' : 'translate-x-0 bg-ash'}`} />
    </button>
  );
}

// ---------- Page header ----------
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ivory tracking-wide">{title}</h1>
        {subtitle && <p className="text-sm text-pewter mt-1 font-light">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

// ---------- Empty state ----------
export function EmptyState({ icon: Icon, title, hint }: { icon: any; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full border border-smoke flex items-center justify-center mb-4">
        <Icon size={20} className="text-pewter" strokeWidth={1.5} />
      </div>
      <h4 className="font-display text-lg text-sand">{title}</h4>
      {hint && <p className="text-xs text-pewter mt-1 max-w-[260px] leading-relaxed">{hint}</p>}
    </div>
  );
}

// ---------- Trend pill ----------
export function TrendPill({ value, invert }: { value: number; invert?: boolean }) {
  const positive = invert ? value < 0 : value > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
      positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
    }`}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
}

// ---------- Gold button ----------
export function GoldButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`btn-gold rounded-xl text-obsidian text-sm font-semibold tracking-wide px-5 py-2.5 shadow-lg shadow-champagne/20 cursor-pointer ${className}`}
      style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}
    >
      {children}
    </button>
  );
}

// ---------- Input ----------
export const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm text-ivory placeholder:text-pewter/60 luxury-input';
