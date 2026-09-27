import { useState, useEffect, useRef, FormEvent } from 'react';
import { Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Wand2, Gem } from 'lucide-react';
import { DEMO_CREDS, IMG, User } from '../data/lumiereData';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToSite?: () => void;
}

export default function LoginPage({ onLogin, onBackToSite }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Autofill with typewriter animation
  const autofillDemo = () => {
    if (isTyping) return;
    setIsTyping(true);
    setError('');
    setEmail('');
    setPassword('');

    const typeField = (text: string, setter: (v: string) => void) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const tick = () => {
          i += 1;
          setter(text.slice(0, i));
          if (i < text.length) timers.current.push(window.setTimeout(tick, 38 + Math.random() * 42));
          else resolve();
        };
        tick();
      });

    typeField(DEMO_CREDS.email, setEmail)
      .then(() => new Promise((r) => timers.current.push(window.setTimeout(r, 250))))
      .then(() => typeField(DEMO_CREDS.password, setPassword))
      .then(() => setIsTyping(false));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid maison email address.'); return; }
    if (password.length < 8) { setError('The maison key must be at least 8 characters.'); return; }
    setIsLoading(true);
    timers.current.push(
      window.setTimeout(() => {
        setIsLoading(false);
        setLeaving(true);
        timers.current.push(
          window.setTimeout(() => onLogin({
            name: DEMO_CREDS.name,
            email,
            maison: DEMO_CREDS.maison,
            role: DEMO_CREDS.role,
          }), 1100)
        );
      }, 1400)
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-obsidian flex items-center justify-center">
      {/* ---- Back to boutique ---- */}
      {onBackToSite && (
        <button
          onClick={onBackToSite}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-pewter hover:text-champagne transition-colors cursor-pointer anim-fade-up"
        >
          <ArrowLeft size={14} />
          Back to the Boutique
        </button>
      )}
      {/* ---- Animated background layers ---- */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={IMG.heroLogin}
            alt=""
            className={`w-full h-full object-cover ken-burns transition-opacity duration-[2000ms] ${entered ? 'opacity-30' : 'opacity-0'}`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/60 to-obsidian" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,9,8,0.88)_78%)]" />
      </div>

      {/* ---- Floating gold particles ---- */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => {
          const size = 2 + (i % 4);
          const left = (i * 47) % 100;
          const dur = 9 + (i % 7) * 2.1;
          const delay = (i % 9) * 1.2;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-champagne/60"
              style={{
                width: size, height: size, left: `${left}%`, bottom: '-10px',
                filter: 'blur(0.5px)',
                animation: `particleDrift ${dur}s linear ${delay}s infinite`,
                boxShadow: '0 0 8px rgba(212,175,106,0.8)',
              }}
            />
          );
        })}
      </div>

      {/* ---- Rotating ornament rings ---- */}
      <div className={`absolute w-[620px] h-[620px] rounded-full border border-champagne/10 animate-rotate-slow transition-all duration-[1500ms] ${entered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} aria-hidden>
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-champagne/70" style={{ boxShadow: '0 0 12px rgba(212,175,106,0.9)' }} />
      </div>
      <div className={`absolute w-[840px] h-[840px] rounded-full border border-champagne/5 transition-all duration-[2000ms] ${entered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ animation: 'rotateSlow 65s linear infinite reverse' }} aria-hidden />

      {/* ---- Login card ---- */}
      <div
        className={`relative z-10 w-[92%] max-w-md transition-all duration-1000 ${leaving ? 'opacity-0 -translate-y-16 scale-95' : entered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-95'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="gradient-border rounded-3xl">
          <div className="glass-panel rounded-3xl px-8 sm:px-10 py-10 relative overflow-hidden">
            {/* inner glows */}
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-champagne/10 blur-3xl animate-float-slow" aria-hidden />
            <div className="absolute -bottom-28 -left-20 w-52 h-52 rounded-full bg-bronze/10 blur-3xl" aria-hidden />

            {/* Brand mark */}
            <div className={`relative text-center mb-8 transition-all duration-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`} style={{ transitionDelay: '150ms' }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-champagne/40 mb-4 relative animate-float-y">
                <Gem size={26} className="text-champagne" strokeWidth={1.25} />
                <span className="absolute inset-0 rounded-full animate-ripple-gold" aria-hidden />
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-wide-luxe">
                <span className="text-shimmer">LUMIÈRE</span>
              </h1>
              <p className="mt-2 text-[11px] tracking-luxe uppercase text-pewter">Maison OS · Private Console</p>
            </div>

            {/* Welcome line */}
            <div className={`relative text-center mb-7 transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="gold-line flex-1" />
                <Sparkles size={14} className="text-champagne" />
                <span className="gold-line flex-1" />
              </div>
              <p className="text-sm text-sand/80 font-light">Authorised maison members only</p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {/* Email */}
              <div className={`transition-all duration-700 ${entered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: '420ms' }}>
                <label className="block text-[10px] tracking-wide-luxe uppercase text-pewter mb-2">Maison Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pewter" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@lumiere.com"
                    autoComplete="email"
                    className="luxury-input w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-ivory placeholder:text-pewter/50"
                  />
                  {isTyping && email.length > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-champagne animate-pulse" />
                  )}
                </div>
              </div>

              {/* Password */}
              <div className={`transition-all duration-700 ${entered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`} style={{ transitionDelay: '520ms' }}>
                <label className="block text-[10px] tracking-wide-luxe uppercase text-pewter mb-2">Maison Key</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pewter" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    className="luxury-input w-full rounded-xl pl-11 pr-12 py-3.5 text-sm text-ivory placeholder:text-pewter/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-pewter hover:text-champagne transition-colors cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember / forgot */}
              <div className={`flex items-center justify-between transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '620ms' }}>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center cursor-pointer ${remember ? 'bg-champagne border-champagne' : 'border-ash'}`}
                    aria-label="Remember me"
                  >
                    {remember && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                  <span className="text-xs text-sand/70">Remember this console</span>
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-champagne hover:text-sand transition-colors cursor-pointer">
                  Request new key
                </a>
              </div>

              {error && (
                <p className="text-xs text-rose-400 anim-fade-in text-center bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2.5">{error}</p>
              )}

              {/* Submit */}
              <div className={`transition-all duration-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '700ms' }}>
                <button
                  type="submit"
                  disabled={isLoading || isTyping}
                  className="btn-gold group w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide-luxe uppercase text-obsidian disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #d4af6a, #f0dfae, #c9a962)' }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-obsidian/40 border-t-obsidian rounded-full animate-spin" />
                        Opening the vault…
                      </>
                    ) : (
                      <>
                        Enter Maison OS
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className={`flex items-center gap-3 transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '780ms' }}>
                <span className="h-px flex-1 bg-smoke" />
                <span className="text-[10px] uppercase tracking-wide-luxe text-pewter">or</span>
                <span className="h-px flex-1 bg-smoke" />
              </div>

              {/* Autofill demo */}
              <div className={`transition-all duration-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '860ms' }}>
                <button
                  type="button"
                  onClick={autofillDemo}
                  disabled={isTyping || isLoading}
                  className="w-full rounded-xl py-3 text-xs font-medium tracking-wide uppercase border border-dashed border-champagne/50 text-champagne hover:bg-champagne/10 hover:border-champagne/80 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Wand2 size={14} className={isTyping ? 'animate-pulse' : ''} />
                  {isTyping ? 'Autofilling maison key…' : 'Autofill Demo Login'}
                </button>
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-pewter">
                  <ShieldCheck size={12} className="text-champagne/70" />
                  <span>{DEMO_CREDS.email} · {DEMO_CREDS.password}</span>
                </div>
              </div>
            </form>

            <p className={`relative text-center mt-7 text-[11px] text-pewter transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '940ms' }}>
              Access is monitored & logged ·{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-champagne hover:text-sand transition-colors cursor-pointer border-b border-champagne/40 pb-0.5">
                Security policy
              </a>
            </p>
          </div>
        </div>

        <p className={`text-center mt-6 text-[10px] tracking-luxe uppercase text-pewter/50 transition-all duration-700 ${entered ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1000ms' }}>
          Paris · Genève · Milano · Tokyo
        </p>
      </div>

      {/* ---- Leaving overlay ---- */}
      {leaving && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <Gem size={40} className="text-champagne mx-auto mb-4 animate-float-y" strokeWidth={1} />
            <p className="font-display text-2xl text-sand tracking-wide-luxe anim-fade-up">Welcome back, Madame Laurent</p>
          </div>
        </div>
      )}
    </div>
  );
}
