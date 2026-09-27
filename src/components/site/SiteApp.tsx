import { useState, useEffect, useRef } from 'react';
import {
  Gem, ShoppingBag, Heart, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  ArrowRight, ArrowUpRight, ArrowUp, Award, Clock, Globe2, HandHeart,
  Sparkles, Star, Quote, MapPin, Phone, Mail, Send, CheckCircle2, MonitorCog
} from 'lucide-react';
import { collections, gallery as galleryItems, testimonials as testimonialsData, heroSlides, marqueeItems, siteNavLinks } from '../../data/siteData';
import { IMG, PieceCategory } from '../../data/lumiereData';
import SiteShop, { CartItem, OrderInfo } from './SiteShop';

// ---------- scroll reveal hook (shared) ----------
export function useScrollReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = ref.current ?? document;
    const els = scope.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

interface SiteAppProps {
  onOpenConsole: () => void;
  onAcquire: (items: CartItem[], order: OrderInfo, total: number) => void;
  toast: (msg: string) => void;
}

export default function SiteApp({ onOpenConsole, onAcquire, toast }: SiteAppProps) {
  const [slide, setSlide] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [shopFilter, setShopFilter] = useState<string>('All');
  const [tmIndex, setTmIndex] = useState(0);
  const [tmAnim, setTmAnim] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const rootRef = useScrollReveal([shopFilter]);

  // hero rotation
  useEffect(() => {
    const iv = window.setInterval(() => {
      setSlideVisible(false);
      window.setTimeout(() => { setSlide((s) => (s + 1) % heroSlides.length); setSlideVisible(true); }, 500);
    }, 7000);
    return () => window.clearInterval(iv);
  }, []);

  // navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // testimonial auto
  useEffect(() => {
    const iv = window.setInterval(() => goTestimonial(tmIndex + 1), 6000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmIndex]);

  // counters
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const targets = [38, 800, 4, 4800];
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1800, 1);
          setCounts(targets.map((v) => Math.round(v * (1 - Math.pow(1 - t, 3)))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    const el = document.getElementById('story-stats');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTestimonial = (i: number) => {
    setTmAnim(false);
    window.setTimeout(() => { setTmIndex(((i % testimonialsData.length) + testimonialsData.length) % testimonialsData.length); setTmAnim(true); }, 250);
  };

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleWish = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from wishlist'); }
      else { next.add(id); toast('Saved to your wishlist'); }
      return next;
    });
  };

  const current = heroSlides[slide];
  const tm = testimonialsData[tmIndex];
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const selectCollection = (filter: PieceCategory) => {
    setShopFilter(filter);
    scrollTo('#shop');
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-obsidian text-ivory font-body">
      {/* ============ NAVBAR ============ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-obsidian/88 backdrop-blur-xl border-b border-smoke/70 py-3' : 'bg-transparent py-5'}`}>
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-9 h-9 rounded-full border border-champagne/50 flex items-center justify-center group-hover:border-champagne transition-colors">
              <Gem size={17} className="text-champagne group-hover:rotate-12 transition-transform duration-500" strokeWidth={1.25} />
            </div>
            <div className="text-left">
              <div className="font-display text-xl font-semibold tracking-wide-luxe leading-none gold-gradient-text">LUMIÈRE</div>
              <div className="text-[8px] tracking-luxe text-pewter uppercase mt-0.5">Maison de Luxe</div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {siteNavLinks.map((link) => (
              <button key={link.label} onClick={() => scrollTo(link.href)} className="relative text-[12px] tracking-wide-luxe uppercase text-sand/70 hover:text-champagne transition-colors cursor-pointer py-1 group">
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-champagne transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button onClick={() => scrollTo('#shop')} className="relative p-2 text-sand/80 hover:text-champagne transition-colors cursor-pointer" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
              {wishlist.size > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-champagne text-obsidian text-[9px] font-bold flex items-center justify-center">{wishlist.size}</span>}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-sand/80 hover:text-champagne transition-colors cursor-pointer" aria-label="Collection bag">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-champagne text-obsidian text-[9px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
            {/* ===== CONSOLE GATE ===== */}
            <button
              onClick={onOpenConsole}
              className="hidden sm:flex items-center gap-2 ml-1 rounded-full border border-champagne/40 text-champagne px-4 py-2 text-[11px] font-semibold tracking-wide-luxe uppercase hover:bg-champagne/10 hover:border-champagne/70 transition-all cursor-pointer"
            >
              <MonitorCog size={13} />
              Maison Console
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-sand hover:text-champagne transition-colors cursor-pointer" aria-label="Menu">
              {mobileOpen ? <X size={20} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-onyx/95 backdrop-blur-xl border-t border-smoke px-6 py-4 space-y-1">
            {siteNavLinks.map((link) => (
              <button key={link.label} onClick={() => scrollTo(link.href)} className="block w-full text-left py-3 text-sm tracking-wide-luxe uppercase text-sand/80 hover:text-champagne border-b border-smoke/50 transition-colors cursor-pointer">
                {link.label}
              </button>
            ))}
            <button onClick={() => { setMobileOpen(false); onOpenConsole(); }} className="block w-full text-left py-3 text-sm tracking-wide-luxe uppercase text-champagne cursor-pointer">
              → Maison Console
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative h-screen min-h-[620px] w-full overflow-hidden">
        {heroSlides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-[1400ms] ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image} alt={s.title} className="w-full h-full object-cover ken-burns" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/35 to-obsidian" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(10,9,8,0.55)_90%)]" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="flex items-center gap-3 mb-6 anim-fade-up">
            <span className="gold-line w-14" />
            <span className={`text-[11px] tracking-luxe uppercase text-champagne transition-opacity duration-700 ${slideVisible ? 'opacity-100' : 'opacity-0'}`}>{current.kicker}</span>
            <span className="gold-line w-14" />
          </div>
          <h1 className="font-display font-light text-5xl sm:text-7xl lg:text-8xl leading-[1.05] max-w-5xl text-ivory">
            <span className={`block transition-opacity duration-700 ${slideVisible ? 'opacity-100' : 'opacity-0'}`}>{current.title.split(' ').slice(0, -2).join(' ')}</span>
            <span className="block italic font-medium">
              <span className={`text-shimmer inline-block transition-opacity duration-700 ${slideVisible ? 'opacity-100' : 'opacity-0'}`}>{current.title.split(' ').slice(-2).join(' ')}</span>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-sm sm:text-base text-sand/75 font-light leading-relaxed anim-fade-up stagger-3">
            For nearly four decades, Lumière has transformed rare earths into wearable light.
            Each piece is a covenant between time, craft, and the one who wears it.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 anim-fade-up stagger-4">
            <button onClick={() => scrollTo('#shop')} className="btn-gold group rounded-full px-9 py-3.5 text-xs font-bold tracking-wide-luxe uppercase text-obsidian cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}>
              <span className="flex items-center gap-2"><Sparkles size={14} /> Explore the Boutique <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" /></span>
            </button>
            <button onClick={onOpenConsole} className="rounded-full px-9 py-3.5 text-xs font-semibold tracking-wide-luxe uppercase border border-champagne/40 text-sand hover:bg-champagne/10 hover:border-champagne/70 transition-all cursor-pointer">
              Maison Console →
            </button>
          </div>
          <div className="mt-12 flex items-center gap-2">
            {heroSlides.map((s, i) => (
              <button key={s.id} onClick={() => { setSlideVisible(false); window.setTimeout(() => { setSlide(i); setSlideVisible(true); }, 400); }} className="group p-1.5 cursor-pointer" aria-label={`Slide ${i + 1}`}>
                <span className={`block h-px transition-all duration-500 ${i === slide ? 'w-10 bg-champagne' : 'w-5 bg-ash group-hover:bg-sand'}`} />
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => scrollTo('#collections')} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-pewter hover:text-champagne transition-colors cursor-pointer" aria-label="Scroll">
          <span className="text-[10px] tracking-luxe uppercase">Scroll</span>
          <ChevronDown size={18} className="animate-bounce" />
        </button>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="relative py-5 border-y border-smoke/60 bg-onyx/60 overflow-hidden">
        <div className="flex items-center gap-10 w-max" style={{ animation: 'marqueeScroll 28s linear infinite' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-10 shrink-0">
              <span className="text-[11px] tracking-luxe uppercase text-sand/60 font-light">{item}</span>
              <Gem size={11} className="text-champagne/70" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>

      {/* ============ COLLECTIONS ============ */}
      <section id="collections" className="relative py-24 lg:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 text-champagne text-[11px] tracking-luxe uppercase mb-4">
            <Gem size={13} /> The Vault
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory">
            Signature <span className="italic gold-gradient-text font-medium">Collections</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
          {collections.map((c, i) => (
            <button key={c.id} onClick={() => selectCollection(c.filter)} className={`group relative text-left rounded-3xl overflow-hidden border border-smoke hover:border-champagne/40 transition-all duration-700 cursor-pointer reveal ${i % 2 === 1 ? 'md:translate-y-10' : ''}`}>
              <div className="img-zoom relative h-80 lg:h-[420px] overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                <div className="flex items-end justify-between gap-4">
                  <div className="transition-transform duration-500 group-hover:-translate-y-1.5">
                    <div className="text-[10px] tracking-luxe uppercase text-champagne/90 mb-2">{c.items} Masterpieces</div>
                    <h3 className="font-display text-2xl lg:text-3xl font-medium text-ivory">{c.name}</h3>
                    <p className="mt-1.5 text-xs text-sand/60 font-light italic max-w-xs">{c.tagline}</p>
                  </div>
                  <div className="shrink-0 w-11 h-11 rounded-full border border-champagne/40 flex items-center justify-center text-champagne transition-all duration-500 group-hover:bg-champagne group-hover:text-obsidian group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============ SHOP (with cart/checkout) ============ */}
      <SiteShop
        cart={cart}
        setCart={setCart}
        wishlist={wishlist}
        onToggleWish={toggleWish}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        onAcquire={onAcquire}
        filter={shopFilter}
        setFilter={setShopFilter}
        toast={toast}
      />

      {/* ============ STORY ============ */}
      <section id="maison" className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-champagne/5 blur-[140px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div className="relative reveal">
              <div className="img-zoom relative rounded-3xl overflow-hidden border border-smoke h-[500px]">
                <img src={IMG.earModel} alt="Maison Lumière" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-4 sm:-right-8 glass-panel rounded-2xl border border-smoke px-6 py-5 animate-float-y shadow-2xl shadow-black/60">
                <div className="font-display text-3xl font-semibold gold-gradient-text">1987</div>
                <div className="text-[10px] tracking-wide-luxe uppercase text-sand/70 mt-1">Founded in Place Vendôme</div>
              </div>
              <div className="absolute -top-8 -left-4 sm:-left-8 w-24 h-24 animate-rotate-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs><path id="circlePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" /></defs>
                  <text className="fill-champagne" style={{ fontSize: '9.5px', letterSpacing: '3px' }}>
                    <textPath href="#circlePath">MAISON LUMIÈRE · HAUTE JOAILLERIE ·</textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><Award size={18} className="text-champagne" /></div>
              </div>
            </div>
            <div className="reveal">
              <div className="text-champagne text-[11px] tracking-luxe uppercase mb-4">The Maison</div>
              <h2 className="font-display text-4xl sm:text-5xl font-light leading-tight text-ivory">
                Nearly Four Decades of{' '}<span className="italic gold-gradient-text font-medium">Chasing Light</span>
              </h2>
              <p className="mt-6 text-sm sm:text-base text-sand/70 font-light leading-relaxed">
                From a single bench in Place Vendôme to ateliers across three continents, Lumière has remained faithful to one conviction: that a jewel is not an object, but a moment of light, made eternal.
              </p>
              <p className="mt-4 text-sm sm:text-base text-sand/70 font-light leading-relaxed">
                Every stone is chosen by our founder's granddaughters. Every setting is finished by hands that apprenticed for a decade before touching gold. Nothing leaves the maison until it has earned silence.
              </p>
              <button onClick={() => scrollTo('#lookbook')} className="mt-8 inline-flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-champagne hover:text-sand transition-colors cursor-pointer group">
                Discover the Lookbook <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
          </div>

          {/* stats */}
          <div id="story-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-smoke bg-smoke reveal">
            {[
              { icon: Award, value: counts[0], suffix: '', label: 'Years of Mastery' },
              { icon: Clock, value: counts[1], suffix: '+', label: 'Hours per Masterpiece' },
              { icon: Globe2, value: counts[2], suffix: '', label: 'Atelier Cities' },
              { icon: HandHeart, value: counts[3], suffix: '+', label: 'Private Clients' },
            ].map((s) => (
              <div key={s.label} className="bg-onyx px-6 py-10 text-center group hover:bg-charcoal transition-colors duration-500">
                <s.icon size={20} className="mx-auto mb-4 text-champagne/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.25} />
                <div className="font-display text-4xl font-semibold text-ivory">{s.value.toLocaleString()}{s.suffix}</div>
                <div className="mt-1 text-[10px] tracking-wide-luxe uppercase text-pewter">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOOKBOOK ============ */}
      <section id="lookbook" className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="text-champagne text-[11px] tracking-luxe uppercase mb-4">Campaign · SS Collection</div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory">The <span className="italic gold-gradient-text font-medium">Lookbook</span></h2>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4">
          {galleryItems.map((g, i) => (
            <button key={g.id} onClick={() => setLightbox(i)} className="group relative w-full mb-4 rounded-2xl overflow-hidden border border-smoke hover:border-champagne/40 transition-colors cursor-pointer reveal block" style={{ breakInside: 'avoid' }}>
              <img src={g.image} alt={g.title} loading="lazy" className="w-full object-cover transition-transform duration-1000 group-hover:scale-105" style={{ height: g.h }} />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-[9px] tracking-luxe uppercase text-champagne">No. {String(i + 1).padStart(2, '0')}</div>
                <div className="font-display text-lg text-ivory">{g.title}</div>
              </div>
            </button>
          ))}
        </div>

        {lightbox !== null && (
          <div className="fixed inset-0 z-[80] bg-obsidian/95 backdrop-blur-xl flex items-center justify-center anim-fade-in px-4" onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center cursor-pointer z-10" aria-label="Close"><X size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! - 1 + galleryItems.length) % galleryItems.length); }} className="absolute left-4 sm:left-8 w-11 h-11 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne flex items-center justify-center cursor-pointer z-10" aria-label="Previous"><ChevronLeft size={18} /></button>
            <div className="relative max-w-3xl w-full anim-scale-in" onClick={(e) => e.stopPropagation()}>
              <img src={galleryItems[lightbox].image} alt={galleryItems[lightbox].title} className="w-full max-h-[78vh] object-contain rounded-2xl border border-smoke" />
              <div className="mt-4 text-center">
                <div className="text-[10px] tracking-luxe uppercase text-champagne">{String(lightbox + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</div>
                <div className="font-display text-xl text-ivory mt-1">{galleryItems[lightbox].title}</div>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setLightbox((l) => (l! + 1) % galleryItems.length); }} className="absolute right-4 sm:right-8 w-11 h-11 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne flex items-center justify-center cursor-pointer z-10" aria-label="Next"><ChevronRight size={18} /></button>
          </div>
        )}
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="voices" className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-champagne/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="reveal mb-4"><div className="text-champagne text-[11px] tracking-luxe uppercase">Client Voices</div></div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory reveal">Words That <span className="italic gold-gradient-text font-medium">Outshine Gold</span></h2>
          <div className="relative mt-12 reveal">
            <div className="glass-panel rounded-3xl border border-smoke px-6 sm:px-14 py-12 relative overflow-hidden">
              <Quote size={64} className="absolute -top-2 left-6 text-champagne/10" strokeWidth={0.75} />
              <div className={`transition-all duration-300 ${tmAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} className="text-champagne" fill="currentColor" />)}
                </div>
                <blockquote className="font-display text-xl sm:text-2xl font-light italic text-sand leading-relaxed max-w-2xl mx-auto">“{tm.quote}”</blockquote>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <img src={tm.image} alt={tm.name} className="w-14 h-14 rounded-full object-cover border-2 border-champagne/50" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-ivory">{tm.name}</div>
                    <div className="text-[11px] text-pewter tracking-wide">{tm.title}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6">
              <button onClick={() => goTestimonial(tmIndex - 1)} className="w-10 h-10 rounded-full border border-smoke text-linen hover:border-champagne hover:text-champagne transition-all flex items-center justify-center cursor-pointer" aria-label="Previous"><ChevronLeft size={16} /></button>
              <div className="flex items-center gap-2.5">
                {testimonialsData.map((_, i) => (
                  <button key={i} onClick={() => goTestimonial(i)} className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === tmIndex ? 'w-8 bg-champagne' : 'w-1.5 bg-smoke hover:bg-ash'}`} aria-label={`Voice ${i + 1}`} />
                ))}
              </div>
              <button onClick={() => goTestimonial(tmIndex + 1)} className="w-10 h-10 rounded-full border border-smoke text-linen hover:border-champagne hover:text-champagne transition-all flex items-center justify-center cursor-pointer" aria-label="Next"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <div className="text-champagne text-[11px] tracking-luxe uppercase mb-4">At Your Service</div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-ivory">Begin the <span className="italic gold-gradient-text font-medium">Conversation</span></h2>
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: MapPin, title: 'Flagship Atelier', lines: ['8 Place Vendôme', '75001 Paris, France'] },
              { icon: Phone, title: 'Private Concierge', lines: ['+33 1 42 61 58 58', '24 / 7 for Patron members'] },
              { icon: Mail, title: 'Correspondence', lines: ['maison@lumiere.paris', 'Replies within 4 hours'] },
            ].map((c) => (
              <div key={c.title} className="group flex items-start gap-5 rounded-2xl bg-onyx border border-smoke p-6 hover:border-champagne/40 transition-all duration-500 reveal">
                <div className="w-12 h-12 rounded-full border border-champagne/40 flex items-center justify-center text-champagne shrink-0 group-hover:bg-champagne group-hover:text-obsidian transition-all duration-500">
                  <c.icon size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-ivory">{c.title}</h3>
                  {c.lines.map((l) => <p key={l} className="text-sm text-pewter font-light mt-0.5">{l}</p>)}
                </div>
              </div>
            ))}
            {/* newsletter */}
            <div className="rounded-2xl border border-champagne/30 bg-gradient-to-br from-charcoal to-onyx p-6 reveal">
              <h3 className="font-display text-lg text-ivory">The Private List</h3>
              <p className="text-xs text-pewter mt-1 mb-4">Invitations to viewings, previews of unlisted pieces.</p>
              <div className="flex gap-2">
                <input id="nl-email" type="email" placeholder="Your email address" className="luxury-input flex-1 min-w-0 rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-pewter/50" />
                <button
                  onClick={() => { setSubscribed(true); toast('Welcome to the Private List'); window.setTimeout(() => setSubscribed(false), 3500); }}
                  className="btn-gold w-12 h-12 rounded-xl text-obsidian flex items-center justify-center cursor-pointer shrink-0"
                  style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}
                  aria-label="Subscribe"
                >
                  {subscribed ? <CheckCircle2 size={16} /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* contact form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setContactSent(true); toast('Your letter has been received'); window.setTimeout(() => setContactSent(false), 3500); (e.target as HTMLFormElement).reset(); }}
            className="lg:col-span-3 rounded-3xl bg-onyx border border-smoke p-7 lg:p-9 reveal"
          >
            <h3 className="font-display text-2xl text-ivory mb-6">Write to the Maison</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-2">Full Name</label>
                <input required className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory" placeholder="Alexandra Laurent" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-2">Email</label>
                <input type="email" required className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory" placeholder="you@example.com" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-2">Subject</label>
              <select className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory cursor-pointer">
                <option>Private Viewing Request</option>
                <option>Bespoke Commission</option>
                <option>Heritage Restoration</option>
                <option>Press & Partnerships</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-2">Message</label>
              <textarea required rows={5} className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory resize-none" placeholder="Tell us about the moment you wish to capture…" />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-[11px] text-pewter max-w-xs">All correspondence is confidential and handled by a dedicated concierge.</p>
              <button type="submit" className="btn-gold rounded-full px-9 py-3.5 text-obsidian text-xs font-bold tracking-wide-luxe uppercase cursor-pointer flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}>
                {contactSent ? <><CheckCircle2 size={15} /> Letter Sent</> : <><Send size={14} /> Send Letter</>}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-smoke bg-onyx/70 overflow-hidden">
        <div className="gold-line w-full" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-full border border-champagne/50 flex items-center justify-center">
                  <Gem size={18} className="text-champagne" strokeWidth={1.25} />
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold tracking-wide-luxe gold-gradient-text leading-none">LUMIÈRE</div>
                  <div className="text-[8px] tracking-luxe text-pewter uppercase mt-1">Maison de Luxe · Est. 1987</div>
                </div>
              </div>
              <p className="text-sm text-pewter font-light leading-relaxed max-w-sm">
                A maison of lightkeepers. Transforming the earth's rarest treasures into moments that outlive time — handcrafted in Paris, Genève, Milano, and Tokyo.
              </p>
              <button onClick={onOpenConsole} className="mt-5 flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-champagne hover:text-sand transition-colors cursor-pointer group">
                <MonitorCog size={14} /> Enter the Maison Console
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
            {[
              { title: 'Collections', links: ['High Jewelry Rings', 'Emerald Ode', 'Horology Masters', 'Golden Atelier'] },
              { title: 'Maison', links: ['Our Story', 'Ateliers', 'Craftsmanship', 'Provenance'] },
              { title: 'Client Care', links: ['Contact Concierge', 'Care Guide', 'Delivery & Insurance', 'Book Appointment'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] tracking-luxe uppercase text-champagne mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-pewter hover:text-champagne font-light transition-colors cursor-pointer inline-block hover:translate-x-1 duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t border-smoke flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-pewter">© 1987–2025 Maison Lumière. Crafted with reverence.</p>
            <div className="flex items-center gap-6 text-[11px] text-pewter">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-champagne transition-colors cursor-pointer">Privacy</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-champagne transition-colors cursor-pointer">Terms</a>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-10 h-10 rounded-full border border-smoke flex items-center justify-center hover:border-champagne hover:text-champagne transition-all cursor-pointer" aria-label="Back to top">
                <ArrowUp size={15} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
