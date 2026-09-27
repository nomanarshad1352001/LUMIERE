import { useState, useMemo } from 'react';
import {
  Search, Plus, ArrowUpDown, X, Mail, MapPin, Calendar,
  Crown, Trash2, ChevronLeft, ChevronRight, Users2, Download, Gem
} from 'lucide-react';
import { Client, ClientTier, uid, fmtMoney } from '../data/lumiereData';
import { Modal, PageHeader, EmptyState, inputCls } from '../components/ui';

interface ClientsProps {
  clients: Client[];
  onAdd: (c: Client) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Client['status']) => void;
  toast: (msg: string) => void;
}

type SortKey = 'name' | 'tier' | 'status' | 'lifetimeValue' | 'joined';
const PAGE_SIZE = 8;

const statusStyle: Record<Client['status'], string> = {
  active: 'bg-emerald-500/15 text-emerald-400',
  'viewing-booked': 'bg-champagne/15 text-champagne',
  dormant: 'bg-smoke text-pewter',
  'past-due': 'bg-amber-500/15 text-amber-400',
};

const tierStyle: Record<ClientTier, string> = {
  Patron: 'text-champagne',
  Collector: 'text-violet-400',
  Member: 'text-sky-400',
  Prospect: 'text-pewter',
};

export default function Clients({ clients, onAdd, onDelete, onStatusChange, toast }: ClientsProps) {
  const [q, setQ] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | ClientTier>('All');
  const [sortKey, setSortKey] = useState<SortKey>('lifetimeValue');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: '', email: '', city: '', tier: 'Member' as ClientTier });
  const [err, setErr] = useState('');

  const filtered = useMemo(() => {
    let list = [...clients];
    if (tierFilter !== 'All') list = list.filter((c) => c.tier === tierFilter);
    if (q.trim()) {
      const query = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(query) || c.city.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'lifetimeValue') cmp = a.lifetimeValue - b.lifetimeValue;
      else if (sortKey === 'joined') cmp = a.joined.localeCompare(b.joined);
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return cmp * sortDir;
    });
    return list;
  }, [clients, tierFilter, q, sortKey, sortDir]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(key === 'lifetimeValue' || key === 'joined' ? -1 : 1); }
  };

  const submitAdd = () => {
    if (!form.name.trim() || !form.city.trim()) { setErr('Name and city are required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Enter a valid email.'); return; }
    onAdd({
      id: uid('cl'),
      name: form.name.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      tier: form.tier,
      status: 'active',
      lifetimeValue: 0,
      pieces: 0,
      lastContact: 'Just now',
      joined: new Date().toISOString().slice(0, 10),
    });
    setForm({ name: '', email: '', city: '', tier: 'Member' });
    setErr('');
    setAddOpen(false);
    toast(`Welcome ${form.name.split(' ')[0]} to the house`);
  };

  const exportCsv = () => {
    const rows = [['Name', 'Email', 'City', 'Tier', 'Status', 'Lifetime Value', 'Pieces', 'Joined'].join(',')];
    filtered.forEach((c) => rows.push([c.name, c.email, c.city, c.tier, c.status, c.lifetimeValue, c.pieces, c.joined].join(',')));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumiere-clients.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Client registry exported');
  };

  const totalLtv = clients.reduce((s, c) => s + c.lifetimeValue, 0);

  const SortBtn = ({ id, label }: { id: SortKey; label: string }) => (
    <button onClick={() => toggleSort(id)} className="flex items-center gap-1 cursor-pointer hover:text-sand transition-colors">
      {label} <ArrowUpDown size={11} className={sortKey === id ? 'text-champagne' : 'text-ash'} />
    </button>
  );

  return (
    <div>
      <PageHeader
        title="Private Clients"
        subtitle={`${clients.length} in the house registry · ${fmtMoney(totalLtv)} lifetime value`}
        actions={
          <>
            <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl border border-smoke bg-onyx px-4 py-2.5 text-sm text-sand hover:border-champagne/50 hover:text-champagne transition-colors cursor-pointer">
              <Download size={14} /> Export
            </button>
            <button onClick={() => setAddOpen(true)} className="btn-gold flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-obsidian shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}>
              <Plus size={15} /> Register Client
            </button>
          </>
        }
      />

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5 anim-fade-up">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pewter" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); }}
            placeholder="Search name, city, email…"
            className="luxury-input w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory placeholder:text-pewter/60"
          />
        </div>
        <div className="flex gap-1.5">
          {(['All', 'Patron', 'Collector', 'Member', 'Prospect'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTierFilter(t); setPage(0); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                tierFilter === t
                  ? 'bg-champagne text-obsidian font-semibold shadow-md shadow-champagne/25'
                  : 'bg-onyx border border-smoke text-pewter hover:border-champagne/40 hover:text-sand'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="rounded-2xl border border-smoke bg-onyx overflow-hidden anim-fade-up stagger-2">
        {pageItems.length === 0 ? (
          <EmptyState icon={Users2} title="No clients found" hint="Adjust your search or registry filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-pewter border-b border-smoke">
                  <th className="px-5 py-3.5"><SortBtn id="name" label="Client" /></th>
                  <th className="px-5 py-3.5 hidden md:table-cell"><SortBtn id="tier" label="City" /></th>
                  <th className="px-5 py-3.5">Tier</th>
                  <th className="px-5 py-3.5"><SortBtn id="status" label="Status" /></th>
                  <th className="px-5 py-3.5 text-right"><SortBtn id="lifetimeValue" label="Lifetime Value" /></th>
                  <th className="px-5 py-3.5 hidden lg:table-cell"><SortBtn id="joined" label="Since" /></th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setDetail(c)}
                    className="border-b border-smoke/50 last:border-0 hover:bg-charcoal/40 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-charcoal to-smoke border border-smoke flex items-center justify-center text-[11px] font-bold text-champagne">
                          {c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ivory">{c.name}</div>
                          <div className="text-[11px] text-pewter hidden sm:block">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-linen">{c.city}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold flex items-center gap-1 ${tierStyle[c.tier]}`}>
                        {c.tier === 'Patron' && <Crown size={11} />}
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${statusStyle[c.status]}`}>
                        {c.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-ivory">
                      {c.lifetimeValue > 0 ? fmtMoney(c.lifetimeValue) : '—'}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-xs text-pewter">{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-smoke bg-charcoal/30">
          <span className="text-xs text-pewter">
            {filtered.length} client{filtered.length !== 1 ? 's' : ''} · Page {page + 1} of {pages}
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="w-8 h-8 rounded-lg border border-smoke flex items-center justify-center text-pewter hover:border-champagne/50 hover:text-champagne disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  page === i ? 'bg-champagne text-obsidian shadow-md shadow-champagne/25' : 'text-pewter hover:bg-charcoal hover:text-sand'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(pages - 1, page + 1))} disabled={page >= pages - 1} className="w-8 h-8 rounded-lg border border-smoke flex items-center justify-center text-pewter hover:border-champagne/50 hover:text-champagne disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Next">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ---- Add modal ---- */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Register a Private Client">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Full name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Charlotte du Pont" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">City *</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Paris" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Private email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="charlotte@dupont.fr" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">House tier</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Prospect', 'Member', 'Collector', 'Patron'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, tier: t })}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    form.tier === t ? 'bg-champagne text-obsidian' : 'border border-smoke text-pewter hover:border-champagne/40 hover:text-sand'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {err && <p className="text-xs font-medium text-rose-400 anim-fade-in">{err}</p>}
          <div className="flex justify-end gap-2.5">
            <button onClick={() => setAddOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-pewter hover:text-ivory hover:bg-charcoal transition-colors cursor-pointer">Cancel</button>
            <button onClick={submitAdd} className="btn-gold px-5 py-2.5 rounded-xl text-obsidian text-sm font-semibold shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>Register</button>
          </div>
        </div>
      </Modal>

      {/* ---- Detail drawer ---- */}
      {detail && (
        <div className="fixed inset-0 z-[85] bg-obsidian/70 backdrop-blur-sm anim-fade-in" onClick={() => setDetail(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-onyx border-l border-smoke anim-slider-in-right flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-smoke">
              <h3 className="font-display text-lg font-semibold text-ivory">Client Dossier</h3>
              <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-pewter hover:text-ivory hover:bg-charcoal cursor-pointer" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border border-champagne/40 flex items-center justify-center font-display text-lg text-champagne bg-charcoal shadow-lg shadow-black/40">
                  {detail.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-ivory">{detail.name}</div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusStyle[detail.status]}`}>{detail.status.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-smoke p-3.5">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-pewter mb-1">Tier</div>
                  <div className={`text-sm font-semibold flex items-center gap-1 ${tierStyle[detail.tier]}`}>
                    {detail.tier === 'Patron' && <Crown size={12} />}
                    {detail.tier}
                  </div>
                </div>
                <div className="rounded-xl border border-smoke p-3.5">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-pewter mb-1">Lifetime value</div>
                  <div className="text-sm font-semibold text-champagne">{detail.lifetimeValue > 0 ? fmtMoney(detail.lifetimeValue) : '—'}</div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { icon: Mail, label: 'Private email', value: detail.email },
                  { icon: MapPin, label: 'Residence', value: detail.city },
                  { icon: Gem, label: 'Pieces in collection', value: String(detail.pieces) },
                  { icon: Calendar, label: 'House member since', value: detail.joined },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-charcoal border border-smoke flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-champagne/80" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wide text-pewter">{label}</div>
                      <div className="text-[13px] text-ivory">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-pewter mb-2">Concierge status</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['active', 'viewing-booked', 'dormant', 'past-due'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(detail.id, s); setDetail({ ...detail, status: s }); toast(`${detail.name.split(' ')[0]} → ${s.replace('-', ' ')}`); }}
                      className={`py-2 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                        detail.status === s ? 'bg-champagne text-obsidian' : 'border border-smoke text-pewter hover:border-champagne/40 hover:text-sand'
                      }`}
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-champagne/25 bg-champagne/5 p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-champagne mb-1">Last contact</div>
                <div className="text-sm text-sand">{detail.lastContact}</div>
              </div>
            </div>
            <div className="p-5 border-t border-smoke">
              <button
                onClick={() => { onDelete(detail.id); toast(`${detail.name} removed from registry`); setDetail(null); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 text-rose-400 text-sm py-2.5 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Remove from registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
