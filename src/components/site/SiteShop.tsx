import { useState, FormEvent } from 'react';
import {
  Heart, Plus, Star, X, Minus, Trash2, ShoppingBag, ShieldCheck, Truck, Gem
} from 'lucide-react';
import { products, SiteProduct, formatPrice } from '../../data/siteData';
import { PieceCategory } from '../../data/lumiereData';
import { useScrollReveal } from './SiteApp';

export interface CartItem { product: SiteProduct; qty: number }
export interface OrderInfo { name: string; email: string; city: string }

interface SiteShopProps {
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  wishlist: Set<string>;
  onToggleWish: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  onAcquire: (items: CartItem[], order: OrderInfo, total: number) => void;
  filter: string;
  setFilter: (f: string) => void;
  toast: (msg: string) => void;
}

const categories: ('All' | PieceCategory)[] = ['All', 'Rings', 'Necklaces', 'Watches', 'Earrings', 'Fragrance'];

export default function SiteShop({ cart, setCart, wishlist, onToggleWish, cartOpen, setCartOpen, onAcquire, filter, setFilter, toast }: SiteShopProps) {
  const ref = useScrollReveal([filter]);
  const [quick, setQuick] = useState<SiteProduct | null>(null);
  const [checkout, setCheckout] = useState(false);
  const [order, setOrder] = useState<OrderInfo>({ name: '', email: '', city: '' });
  const [orderErr, setOrderErr] = useState('');
  const [placed, setPlaced] = useState(false);

  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = (p: SiteProduct) => {
    const found = cart.find((i) => i.product.id === p.id);
    setCart(found ? cart.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i)) : [...cart, { product: p, qty: 1 }]);
    toast(`${p.name} added to your collection`);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  };

  const submitOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!order.name.trim()) { setOrderErr('May we have your name?'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) { setOrderErr('A valid email is required for our concierge.'); return; }
    if (!order.city.trim()) { setOrderErr('Which city may we deliver to?'); return; }
    setOrderErr('');
    setPlaced(true);
    onAcquire(cart, order, total);
    setCart([]);
    window.setTimeout(() => { setPlaced(false); setCheckout(false); setCartOpen(false); setOrder({ name: '', email: '', city: '' }); }, 2600);
  };

  const badgeColor = (b?: string) =>
    b === 'New' ? 'bg-champagne text-obsidian' :
    b === 'Limited' ? 'bg-red-900/80 text-red-200' :
    b === 'Iconic' ? 'bg-ivory text-obsidian' :
    'bg-charcoal text-champagne border border-champagne/40';

  return (
    <section id="shop" ref={ref} className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* heading */}
      <div className="text-center mb-12 reveal">
        <div className="text-champagne text-[11px] tracking-luxe uppercase mb-4">The Boutique</div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory">
          Acquire a <span className="italic gold-gradient-text font-medium">Masterpiece</span>
        </h2>
      </div>

      {/* filters */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-12 reveal">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-[11px] tracking-wide uppercase transition-all duration-300 cursor-pointer ${
              filter === cat
                ? 'bg-champagne text-obsidian font-semibold'
                : 'border border-smoke text-linen hover:border-champagne/50 hover:text-champagne'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p, i) => (
          <article key={p.id} className="group relative rounded-2xl overflow-hidden bg-onyx border border-smoke hover:border-champagne/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/60 reveal" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
            <div className="img-zoom relative h-72 cursor-pointer overflow-hidden" onClick={() => setQuick(p)}>
              <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {p.badge && <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase ${badgeColor(p.badge)}`}>{p.badge}</span>}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleWish(p.id); }}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer ${wishlist.has(p.id) ? 'bg-champagne text-obsidian scale-110' : 'bg-obsidian/50 text-sand hover:text-champagne'}`}
                aria-label="Wishlist"
              >
                <Heart size={15} fill={wishlist.has(p.id) ? 'currentColor' : 'none'} />
              </button>
              <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="block w-full text-center py-2.5 rounded-full bg-obsidian/70 backdrop-blur-md border border-champagne/30 text-[10px] tracking-wide-luxe uppercase text-champagne">
                  Quick View
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={11} className={s < Math.floor(p.rating) ? 'text-champagne' : 'text-smoke'} fill={s < Math.floor(p.rating) ? 'currentColor' : 'none'} />
                ))}
                <span className="text-[10px] text-pewter ml-1">{p.rating}</span>
              </div>
              <div className="text-[9px] tracking-wide-luxe uppercase text-pewter mb-1">{p.category}</div>
              <h3 onClick={() => setQuick(p)} className="font-display text-lg font-medium text-ivory leading-snug cursor-pointer hover:text-champagne transition-colors">
                {p.name}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-lg text-champagne">{formatPrice(p.price)}</span>
                <button onClick={() => addToCart(p)} className="w-9 h-9 rounded-full border border-champagne/40 text-champagne flex items-center justify-center hover:bg-champagne hover:text-obsidian transition-all duration-300 cursor-pointer" aria-label="Add to collection">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ------ Quick View ------ */}
      {quick && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md anim-fade-in" onClick={() => setQuick(null)}>
          <div className="relative w-full max-w-3xl rounded-3xl bg-onyx border border-smoke overflow-hidden grid md:grid-cols-2 anim-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-72 md:h-auto">
              <img src={quick.image} alt={quick.name} className="absolute inset-0 w-full h-full object-cover" />
              {quick.badge && <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-champagne text-obsidian text-[9px] font-bold tracking-wider uppercase">{quick.badge}</span>}
            </div>
            <div className="p-7 lg:p-9 relative">
              <button onClick={() => setQuick(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center cursor-pointer" aria-label="Close">
                <X size={15} />
              </button>
              <div className="text-[10px] tracking-luxe uppercase text-champagne mb-2">{quick.description.length > 0 ? quick.category : ''} · Hand-finished</div>
              <h3 className="font-display text-3xl font-semibold text-ivory pr-8">{quick.name}</h3>
              <div className="flex items-center gap-1.5 mt-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={13} className={s < Math.floor(quick.rating) ? 'text-champagne' : 'text-smoke'} fill={s < Math.floor(quick.rating) ? 'currentColor' : 'none'} />
                ))}
                <span className="text-xs text-pewter ml-1">{quick.rating}</span>
              </div>
              <p className="mt-4 text-sm text-linen/80 font-light leading-relaxed">{quick.description}</p>
              <div className="mt-4 space-y-1.5 text-xs text-pewter">
                <div className="flex items-center gap-2"><Gem size={12} className="text-champagne/80" /> {quick.material}</div>
                <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-champagne/80" /> Certificate of provenance</div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-3xl text-champagne">{formatPrice(quick.price)}</span>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { addToCart(quick); setQuick(null); }}
                  className="btn-gold flex-1 rounded-xl py-3.5 text-obsidian text-xs font-bold tracking-wide-luxe uppercase cursor-pointer flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}
                >
                  <Plus size={14} /> Add to Collection
                </button>
                <button
                  onClick={() => onToggleWish(quick.id)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${wishlist.has(quick.id) ? 'bg-champagne border-champagne text-obsidian' : 'border-smoke text-sand hover:border-champagne/60 hover:text-champagne'}`}
                  aria-label="Wishlist"
                >
                  <Heart size={16} fill={wishlist.has(quick.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="mt-5 flex items-center gap-4 text-[10px] text-pewter">
                <span className="flex items-center gap-1"><Truck size={11} className="text-champagne/60" /> Armored delivery</span>
                <span className="flex items-center gap-1"><ShieldCheck size={11} className="text-champagne/60" /> Fully insured</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------ Cart drawer + checkout ------ */}
      <div className={`fixed inset-0 z-[70] bg-obsidian/70 backdrop-blur-sm transition-opacity duration-400 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => { setCartOpen(false); setCheckout(false); }} />
      <aside className={`fixed top-0 right-0 z-[75] h-full w-full max-w-md bg-onyx border-l border-smoke flex flex-col transition-transform duration-500 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-smoke">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-champagne" />
            <h3 className="font-display text-xl font-semibold text-ivory">{checkout ? 'Acquisition Details' : 'Your Collection'}</h3>
            <span className="text-xs text-pewter">({cart.reduce((a, i) => a + i.qty, 0)})</span>
          </div>
          <button onClick={() => { setCartOpen(false); setCheckout(false); }} className="w-9 h-9 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center cursor-pointer" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* order placed state */}
        {placed ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 anim-fade-up">
            <div className="w-16 h-16 rounded-full border border-champagne flex items-center justify-center text-champagne mb-5 animate-ripple-gold">
              <ShieldCheck size={28} strokeWidth={1.25} />
            </div>
            <h4 className="font-display text-2xl text-ivory">Acquisition Placed</h4>
            <p className="mt-2 text-sm text-pewter">
              Our concierge will contact you within the hour. Your pieces have entered the atelier's commission board.
            </p>
          </div>
        ) : checkout ? (
          /* checkout form */
          <form onSubmit={submitOrder} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div className="rounded-xl bg-charcoal/60 border border-smoke p-4 text-sm space-y-1.5">
              {cart.map((i) => (
                <div key={i.product.id} className="flex justify-between text-linen/80 text-xs">
                  <span>{i.qty} × {i.product.name}</span>
                  <span className="text-sand">{formatPrice(i.product.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-smoke text-base font-semibold">
                <span className="text-sand">Total</span>
                <span className="font-display text-champagne">{formatPrice(total)}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Full name *</label>
              <input value={order.name} onChange={(e) => setOrder({ ...order, name: e.target.value })} placeholder="Charlotte du Pont" className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-pewter/60" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Private email *</label>
              <input type="email" value={order.email} onChange={(e) => setOrder({ ...order, email: e.target.value })} placeholder="charlotte@dupont.fr" className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-pewter/60" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Delivery city *</label>
              <input value={order.city} onChange={(e) => setOrder({ ...order, city: e.target.value })} placeholder="Paris" className="luxury-input w-full rounded-xl px-4 py-3 text-sm text-ivory placeholder:text-pewter/60" />
            </div>
            {orderErr && <p className="text-xs font-medium text-rose-400 anim-fade-in">{orderErr}</p>}
            <div className="pt-2 space-y-2.5">
              <button type="submit" className="btn-gold w-full rounded-xl py-3.5 text-obsidian text-xs font-bold tracking-wide-luxe uppercase cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}>
                Confirm Acquisition · {formatPrice(total)}
              </button>
              <button type="button" onClick={() => setCheckout(false)} className="w-full rounded-xl py-3 text-xs font-medium text-pewter hover:text-ivory border border-smoke hover:border-ash transition-colors cursor-pointer">
                ← Return to collection
              </button>
            </div>
            <p className="text-[10px] text-pewter text-center leading-relaxed">
              Your order opens a commission on the maison's atelier board — you can follow it in the console.
            </p>
          </form>
        ) : (
          /* cart items */
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={40} className="text-ash mb-4" strokeWidth={1} />
                  <p className="text-sm text-pewter">Your collection awaits its first treasure.</p>
                </div>
              ) : (
                cart.map(({ product, qty }, idx) => (
                  <div key={product.id} className="flex gap-4 anim-fade-up" style={{ animationDelay: `${idx * 70}ms` }}>
                    <div className="w-20 h-24 rounded-xl overflow-hidden border border-smoke shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[9px] tracking-wide-luxe uppercase text-pewter">{product.category}</div>
                          <h4 className="font-display text-base text-ivory leading-snug">{product.name}</h4>
                        </div>
                        <button onClick={() => setCart(cart.filter((i) => i.product.id !== product.id))} className="text-pewter hover:text-rose-400 transition-colors cursor-pointer" aria-label="Remove">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button onClick={() => updateQty(product.id, -1)} className="w-7 h-7 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center cursor-pointer" aria-label="Decrease">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm text-ivory w-5 text-center">{qty}</span>
                          <button onClick={() => updateQty(product.id, 1)} className="w-7 h-7 rounded-full border border-smoke text-sand hover:border-champagne hover:text-champagne transition-colors flex items-center justify-center cursor-pointer" aria-label="Increase">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm text-champagne font-display">{formatPrice(product.price * qty)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-smoke px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-linen">Total</span>
                  <span className="font-display text-xl text-champagne">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-pewter">
                  <Truck size={13} className="text-champagne/70" />
                  Complimentary armored delivery included
                </div>
                <button
                  onClick={() => setCheckout(true)}
                  className="btn-gold w-full rounded-xl py-3.5 text-obsidian text-xs font-bold tracking-wide-luxe uppercase cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}
                >
                  Request Acquisition
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </section>
  );
}
