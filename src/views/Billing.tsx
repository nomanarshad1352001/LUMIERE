import { useState } from 'react';
import {
  Check, CreditCard, Download, Crown, ShieldCheck,
  CalendarClock, Plus, Sparkles
} from 'lucide-react';
import { plans, Plan, Invoice, Artisan } from '../data/lumiereData';
import { PageHeader, Modal, inputCls } from '../components/ui';

interface BillingProps {
  plan: Plan;
  onChangePlan: (p: Plan) => void;
  invoices: Invoice[];
  onAddInvoice: (inv: Invoice) => void;
  artisans: Artisan[];
  toast: (msg: string, kind?: 'success' | 'info' | 'error') => void;
}

export default function Billing({ plan, onChangePlan, invoices, onAddInvoice, artisans, toast }: BillingProps) {
  const [yearly, setYearly] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [invoiceDetail, setInvoiceDetail] = useState<Invoice | null>(null);
  const [card, setCard] = useState({ number: '•••• •••• •••• 4242', holder: 'Alexandra Laurent', expiry: '08 / 27' });
  const [cardForm, setCardForm] = useState({ number: '', holder: '', expiry: '' });

  const seatsUsed = artisans.length;

  const switchPlan = (p: Plan) => {
    if (p.name === plan.name) return;
    onChangePlan(p);
    onAddInvoice({
      id: `LUM-${2042 + invoices.length}`,
      date: new Date().toISOString().slice(0, 10),
      amount: yearly ? p.priceY : p.priceM,
      status: 'pending',
      plan: `${p.name} — ${yearly ? 'Annual' : 'Monthly'}`,
    });
    toast(`Maison moved to ${p.name}`);
  };

  const downloadInvoice = (inv: Invoice) => {
    const content = [
      'MAISON OS — OFFICIAL INVOICE',
      '=================================',
      `Invoice:    ${inv.id}`,
      `Date:       ${inv.date}`,
      `Plan:       ${inv.plan}`,
      `Amount:     $${inv.amount.toLocaleString()}.00`,
      `Status:     ${inv.status.toUpperCase()}`,
      '=================================',
      'Merci for your patronage — LUMIÈRE',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Invoice ${inv.id} downloaded`);
  };

  const saveCard = () => {
    if (cardForm.number.replace(/\s/g, '').length < 16) { toast('Enter a valid 16-digit card number', 'error'); return; }
    setCard({
      number: `•••• •••• •••• ${cardForm.number.replace(/\s/g, '').slice(-4)}`,
      holder: cardForm.holder || card.holder,
      expiry: cardForm.expiry || card.expiry,
    });
    setCardOpen(false);
    setCardForm({ number: '', holder: '', expiry: '' });
    toast('Payment method updated');
  };

  const statusStyle: Record<Invoice['status'], string> = {
    paid: 'bg-emerald-500/15 text-emerald-400',
    pending: 'bg-amber-500/15 text-amber-400',
    failed: 'bg-rose-500/15 text-rose-400',
  };

  return (
    <div>
      <PageHeader title="Subscription" subtitle="Your Maison OS plan, payment method, and receipts" />

      {/* current plan + payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 anim-fade-up rounded-2xl overflow-hidden relative border border-champagne/30"
          style={{ background: 'linear-gradient(135deg,#1c1917,#2a2118)' }}>
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-champagne/10 blur-2xl" />
          <div className="absolute right-24 bottom-0 w-32 h-32 rounded-full bg-bronze/20 blur-2xl" />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-1">
              <Crown size={16} className="text-champagne" />
              <span className="text-[10px] font-bold uppercase tracking-luxe text-champagne/90">Current Plan</span>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-display text-3xl font-semibold text-ivory">{plan.name}</div>
                <p className="text-sm text-linen/80 mt-1 font-light">{plan.tagline}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold text-ivory">
                  ${yearly ? plan.priceY : plan.priceM}
                  <span className="text-sm text-pewter font-body">/{yearly ? 'yr' : 'mo'}</span>
                </div>
                {yearly && plan.priceM > 0 && <div className="text-[11px] text-emerald-400 font-semibold">2 months offert</div>}
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-linen">Artisan seats</span>
                <span className="font-semibold text-ivory">{seatsUsed} / {plan.seats}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-smoke overflow-hidden">
                <div className="h-full rounded-full progress-anim" style={{ width: `${Math.min(100, (seatsUsed / plan.seats) * 100)}%`, background: 'linear-gradient(90deg,#c9a962,#f0dfae)' }} />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-linen/80">
              <CalendarClock size={13} className="text-champagne" />
              Next billing on <b className="text-ivory">Jul 1, 2025</b>
            </div>
          </div>
        </div>

        {/* payment method */}
        <div className="anim-fade-up stagger-2 rounded-2xl border border-smoke bg-onyx p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-champagne" />
            <h3 className="font-display text-lg font-semibold text-ivory">Payment Method</h3>
          </div>
          <div className="flex-1 rounded-xl p-4 mb-4 relative overflow-hidden border border-smoke"
            style={{ background: 'linear-gradient(135deg,#0a0908,#1c1917)' }}>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-champagne/10 blur-xl" />
            <div className="flex items-center justify-between mb-6">
              <CreditCard size={20} className="text-champagne/70" />
              <span className="text-[10px] font-bold tracking-widest text-pewter italic">VISA</span>
            </div>
            <div className="font-mono text-sand tracking-widest text-sm">{card.number}</div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-pewter">
              <span>{card.holder}</span>
              <span>{card.expiry}</span>
            </div>
          </div>
          <button
            onClick={() => setCardOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-smoke py-2.5 text-sm text-sand hover:border-champagne/50 hover:text-champagne transition-colors cursor-pointer"
          >
            <Plus size={14} /> Update Card
          </button>
        </div>
      </div>

      {/* billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-6 anim-fade-up">
        <span className={`text-sm font-medium ${!yearly ? 'text-ivory' : 'text-pewter'}`}>Monthly</span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${yearly ? 'bg-champagne' : 'bg-smoke'}`}
          aria-label="Toggle billing period"
        >
          <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-obsidian shadow transition-transform duration-300 ${yearly ? 'translate-x-5' : ''}`} />
        </button>
        <span className={`text-sm font-medium flex items-center gap-1.5 ${yearly ? 'text-ivory' : 'text-pewter'}`}>
          Annual
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">Save 17%</span>
        </span>
      </div>

      {/* plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {plans.map((p, i) => {
          const current = p.name === plan.name;
          return (
            <div
              key={p.name}
              className={`anim-fade-up stagger-${i + 1} lift relative rounded-2xl border p-6 flex flex-col bg-onyx ${
                p.highlight ? 'border-champagne/50 shadow-xl shadow-champagne/10' : 'border-smoke'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider text-obsidian px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-champagne/30" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
                  <Sparkles size={10} /> Chosen by Most
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-ivory flex items-center gap-1.5">
                {p.name}
                {p.name === 'Grand Maison' && <Crown size={14} className="text-champagne" />}
              </h3>
              <p className="text-xs text-pewter mt-1 min-h-[30px] font-light">{p.tagline}</p>
              <div className="mt-4 mb-5">
                <span className="font-display text-3xl font-semibold text-ivory">${yearly ? p.priceY : p.priceM}</span>
                <span className="text-sm text-pewter">/{yearly ? 'yr' : 'mo'}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-linen/85">
                    <Check size={13} className="text-champagne shrink-0 mt-0.5" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => switchPlan(p)}
                disabled={current}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                  current
                    ? 'bg-charcoal text-pewter'
                    : p.highlight
                      ? 'btn-gold text-obsidian shadow-lg shadow-champagne/20'
                      : 'border border-smoke text-sand hover:border-champagne/50 hover:text-champagne'
                }`}
                style={p.highlight && !current ? { background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' } : undefined}
              >
                {current ? '✓ Current Plan' : `Move to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* invoices */}
      <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-smoke">
          <h3 className="font-display text-lg font-semibold text-ivory">Receipts</h3>
          <span className="text-xs text-pewter flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-400" /> Secured payments
          </span>
        </div>
        <div className="divide-y divide-smoke/60">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 px-6 py-4 hover:bg-charcoal/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-charcoal border border-smoke flex items-center justify-center shrink-0">
                <Download size={15} className="text-pewter" />
              </div>
              <div className="min-w-0 flex-1">
                <button onClick={() => setInvoiceDetail(inv)} className="text-sm font-medium text-ivory hover:text-champagne transition-colors cursor-pointer">
                  {inv.id}
                </button>
                <div className="text-xs text-pewter">{inv.plan} · {inv.date}</div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${statusStyle[inv.status]}`}>
                {inv.status}
              </span>
              <span className="text-sm font-semibold text-ivory w-20 text-right">
                ${inv.amount.toLocaleString()}
              </span>
              <button
                onClick={() => downloadInvoice(inv)}
                className="flex items-center gap-1.5 text-xs font-semibold text-champagne border border-champagne/30 rounded-lg px-3 py-1.5 hover:bg-champagne/10 transition-colors cursor-pointer"
              >
                <Download size={11} /> PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* card modal */}
      <Modal open={cardOpen} onClose={() => setCardOpen(false)} title="Update Payment Method">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Card number</label>
            <input
              value={cardForm.number}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                setCardForm({ ...cardForm, number: digits.replace(/(.{4})/g, '$1 ').trim() });
              }}
              placeholder="4242 4242 4242 4242"
              className={`${inputCls} font-mono`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Card holder</label>
              <input value={cardForm.holder} onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })} placeholder="Alexandra Laurent" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Expiry</label>
              <input
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value.replace(/[^\d/]/g, '').replace(/^(\d{2})(\d)/, '$1 / $2').slice(0, 7) })}
                placeholder="MM / YY"
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 pt-1">
            <button onClick={() => setCardOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-pewter hover:text-ivory hover:bg-charcoal transition-colors cursor-pointer">Cancel</button>
            <button onClick={saveCard} className="btn-gold px-5 py-2.5 rounded-xl text-obsidian text-sm font-semibold shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>Save Card</button>
          </div>
        </div>
      </Modal>

      {/* invoice detail modal */}
      <Modal open={!!invoiceDetail} onClose={() => setInvoiceDetail(null)} title={invoiceDetail?.id ?? ''}>
        {invoiceDetail && (
          <div className="space-y-4">
            <div className="rounded-xl bg-charcoal/60 border border-smoke p-5 font-mono text-sm text-sand space-y-2">
              <div className="flex justify-between"><span>Plan</span><b className="text-ivory">{invoiceDetail.plan}</b></div>
              <div className="flex justify-between"><span>Invoice date</span><b className="text-ivory">{invoiceDetail.date}</b></div>
              <div className="flex justify-between"><span>Status</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusStyle[invoiceDetail.status]}`}>{invoiceDetail.status}</span>
              </div>
              <div className="flex justify-between border-t border-smoke pt-2 text-base"><span>Total</span><b className="text-champagne">${invoiceDetail.amount.toLocaleString()}.00</b></div>
            </div>
            <button
              onClick={() => downloadInvoice(invoiceDetail)}
              className="btn-gold w-full flex items-center justify-center gap-2 rounded-xl text-obsidian text-sm font-semibold py-3 shadow-lg shadow-champagne/20 cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}
            >
              <Download size={14} /> Download Invoice
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
