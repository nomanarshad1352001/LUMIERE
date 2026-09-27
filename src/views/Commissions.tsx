import { useState, DragEvent } from 'react';
import {
  Plus, Calendar, Trash2, ArrowLeft, ArrowRight, CheckCircle2,
  MoveRight, Gem, Building2, Crown
} from 'lucide-react';
import {
  Commission, CommStatus, PieceCategory, Atelier, Artisan,
  COMM_STAGES, PRIORITY_STYLE, CATEGORY_IMAGES, uid, fmtMoney,
  seedClients
} from '../data/lumiereData';
import { Modal, PageHeader, inputCls } from '../components/ui';

interface CommissionsProps {
  commissions: Commission[];
  ateliers: Atelier[];
  artisans: Artisan[];
  onUpdateAll: (c: Commission[]) => void;
  onAdd: (c: Commission) => void;
  onDelete: (id: string) => void;
  toast: (msg: string) => void;
}

const emptyForm = { title: '', description: '', client: '', atelier: '', category: 'Rings' as PieceCategory, priority: 'standard' as Commission['priority'], value: '', due: '', artisan: 'MD' };

const cats: PieceCategory[] = ['Rings', 'Necklaces', 'Watches', 'Earrings', 'Fragrance'];

export default function Commissions({ commissions, ateliers, artisans, onUpdateAll, onAdd, onDelete, toast }: CommissionsProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropCol, setDropCol] = useState<CommStatus | null>(null);
  const [addModal, setAddModal] = useState<CommStatus | null>(null);
  const [detail, setDetail] = useState<Commission | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [atelierFilter, setAtelierFilter] = useState<'All' | string>('All');

  const visible = atelierFilter === 'All' ? commissions : commissions.filter((c) => c.atelier.startsWith(atelierFilter));

  // ----- drag & drop -----
  const handleDragStart = (e: DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };
  const handleDragOver = (e: DragEvent, status: CommStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropCol(status);
  };
  const handleDrop = (e: DragEvent, status: CommStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    const piece = commissions.find((c) => c.id === id);
    if (piece && piece.status !== status) {
      onUpdateAll(commissions.map((c) => c.id === id ? { ...c, status, delivered: status === 'delivered' } : c));
      toast(`“${piece.title.slice(0, 30)}” → ${COMM_STAGES.find((s) => s.id === status)?.label}`);
    }
    setDragId(null);
    setDropCol(null);
  };
  const handleDragEnd = () => { setDragId(null); setDropCol(null); };

  // ----- add -----
  const openAdd = (status: CommStatus) => {
    setForm({ ...emptyForm, atelier: `${ateliers[0].name}, ${ateliers[0].city}`, client: seedClients[0].name, due: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
    setFormError('');
    setAddModal(status);
  };

  const submitAdd = () => {
    if (!form.title.trim()) { setFormError('A piece needs a title.'); return; }
    if (!form.client.trim()) { setFormError('Select or enter a client.'); return; }
    const valueNum = parseFloat(form.value.replace(/,/g, '')) || 0;
    const newPiece: Commission = {
      id: uid('cm'),
      title: form.title.trim(),
      description: form.description.trim() || 'A bespoke piece, details to follow.',
      client: form.client.trim(),
      atelier: form.atelier,
      category: form.category,
      status: addModal ?? 'sketch',
      priority: form.priority,
      value: valueNum,
      due: form.due || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      artisan: form.artisan,
      image: CATEGORY_IMAGES[form.category],
      delivered: addModal === 'delivered',
    };
    onAdd(newPiece);
    setAddModal(null);
    toast(`Commission “${newPiece.title.slice(0, 26)}” opened`);
  };

  // ----- detail actions -----
  const moveDetail = (dir: 1 | -1) => {
    if (!detail) return;
    const idx = COMM_STAGES.findIndex((s) => s.id === detail.status);
    const next = COMM_STAGES[Math.min(Math.max(idx + dir, 0), COMM_STAGES.length - 1)];
    const updated = { ...detail, status: next.id, delivered: next.id === 'delivered' };
    onUpdateAll(commissions.map((c) => (c.id === detail.id ? updated : c)));
    setDetail(updated);
  };

  const completeDetail = () => {
    if (!detail) return;
    const updated = { ...detail, status: 'delivered' as CommStatus, delivered: true };
    onUpdateAll(commissions.map((c) => (c.id === detail.id ? updated : c)));
    setDetail(updated);
    toast('Delivered with ceremony 🥂');
  };

  const deleteDetail = () => {
    if (!detail) return;
    onDelete(detail.id);
    setDetail(null);
    toast('Commission archived');
  };

  const artisanOf = (initials: string) => artisans.find((a) => a.initials === initials);
  const clientNames = seedClients.map((c) => c.name);

  return (
    <div>
      <PageHeader
        title="Commissions"
        subtitle="Drag pieces between stages to record progress. All changes persist locally."
        actions={
          <button
            onClick={() => openAdd('sketch')}
            className="btn-gold flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-obsidian shadow-lg shadow-champagne/20 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}
          >
            <Plus size={15} /> New Commission
          </button>
        }
      />

      {/* atelier filter chips */}
      <div className="flex flex-wrap gap-2 mb-6 anim-fade-up">
        {(['All', ...ateliers.map((a) => a.name)] as string[]).map((a) => (
          <button
            key={a}
            onClick={() => setAtelierFilter(a)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              atelierFilter === a
                ? 'bg-champagne text-obsidian font-semibold shadow-md shadow-champagne/25'
                : 'bg-onyx border border-smoke text-linen hover:border-champagne/50 hover:text-champagne'
            }`}
          >
            {a !== 'All' && <Building2 size={11} />}
            {a}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 anim-fade-up stagger-2">
        {COMM_STAGES.map((col) => {
          const colPieces = visible.filter((c) => c.status === col.id);
          const colValue = colPieces.reduce((s, c) => s + c.value, 0);
          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => setDropCol(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border bg-charcoal/40 border-smoke p-3 min-h-[300px] flex flex-col transition-all ${dropCol === col.id && dragId ? 'kanban-drop-target' : ''}`}
            >
              <div className="flex items-center gap-2 px-1.5 pb-3">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-[10px] font-bold uppercase tracking-luxe text-linen">{col.label}</span>
                <span className="text-[10px] font-bold text-sand bg-onyx border border-smoke rounded-md px-1.5 py-0.5">{colPieces.length}</span>
                <button
                  onClick={() => openAdd(col.id)}
                  className="ml-auto w-6 h-6 rounded-md flex items-center justify-center text-pewter hover:text-champagne hover:bg-champagne/10 transition-colors cursor-pointer"
                  title="Open commission here"
                >
                  <Plus size={14} />
                </button>
              </div>
              {colValue > 0 && (
                <div className="px-1.5 pb-2 text-[10px] text-champagne/80 tracking-wide">{fmtMoney(colValue)} in play</div>
              )}

              <div className="space-y-2.5 flex-1">
                {colPieces.map((c) => {
                  const a = artisanOf(c.artisan);
                  const p = PRIORITY_STYLE[c.priority];
                  return (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setDetail(c)}
                      className={`kanban-card rounded-xl border border-smoke bg-onyx overflow-hidden hover:border-champagne/40 transition-all shadow-md shadow-black/30 ${dragId === c.id ? 'kanban-dragging' : ''}`}
                    >
                      <div className="relative h-24">
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-onyx to-transparent" />
                        {c.priority !== 'standard' && (
                          <span className={`absolute top-2 left-2 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${p.cls}`}>
                            {c.priority === 'royal' && <Crown size={9} />}
                            {p.label}
                          </span>
                        )}
                        {c.value > 0 && (
                          <span className="absolute bottom-2 right-2 text-[10px] font-bold text-champagne bg-obsidian/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {fmtMoney(c.value)}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5">
                        <h4 className={`text-[13px] font-medium leading-snug ${c.delivered ? 'line-through text-pewter' : 'text-ivory'}`}>
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-pewter">
                          <Gem size={10} />
                          <span className="truncate">{c.client}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-smoke/70">
                          <span className="flex items-center gap-1 text-[10px] text-pewter">
                            <Calendar size={10} /> {c.due.slice(5)}
                          </span>
                          <div className={`w-6 h-6 rounded-full ${a?.color ?? 'bg-ash'} flex items-center justify-center text-[9px] font-bold text-white`} title={a?.name}>
                            {c.artisan}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {colPieces.length === 0 && (
                  <div className="rounded-xl border border-dashed border-smoke py-8 text-center text-xs text-pewter">
                    No pieces — drop one here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ------ Add Modal ------ */}
      <Modal open={addModal !== null} onClose={() => setAddModal(null)} title="Open a Commission" wide>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Piece title *</label>
            <input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Emerald riviere for Madame Duval" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Notes & requirements</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Stones, materials, sizing, engraving…" className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Client *</label>
              <select value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={`${inputCls} cursor-pointer`}>
                {clientNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Atelier</label>
              <select value={form.atelier} onChange={(e) => setForm({ ...form, atelier: e.target.value })} className={`${inputCls} cursor-pointer`}>
                {ateliers.map((a) => <option key={a.id} value={`${a.name}, ${a.city}`}>{a.name}, {a.city}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PieceCategory })} className={`${inputCls} cursor-pointer`}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Master artisan</label>
              <select value={form.artisan} onChange={(e) => setForm({ ...form, artisan: e.target.value })} className={`${inputCls} cursor-pointer`}>
                {artisans.map((a) => <option key={a.id} value={a.initials}>{a.name} — {a.speciality}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Priority</label>
              <div className="grid grid-cols-1 gap-1.5">
                {(['standard', 'urgent', 'royal'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setForm({ ...form, priority: p })}
                    className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                      form.priority === p ? 'bg-champagne text-obsidian border-champagne' : 'border-smoke text-linen hover:border-champagne/40'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Value (USD)</label>
              <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value.replace(/[^\d]/g, '') })} placeholder="48000" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Delivery date</label>
              <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} className={`${inputCls} cursor-pointer`} />
            </div>
          </div>
          {formError && <p className="text-xs font-medium text-rose-400 anim-fade-in">{formError}</p>}
          <div className="flex justify-end gap-2.5 pt-1">
            <button onClick={() => setAddModal(null)} className="px-4 py-2.5 rounded-xl text-sm text-pewter hover:text-ivory hover:bg-charcoal transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={submitAdd} className="btn-gold px-5 py-2.5 rounded-xl text-obsidian text-sm font-semibold shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
              Open Commission
            </button>
          </div>
        </div>
      </Modal>

      {/* ------ Detail Modal ------ */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Commission Dossier" wide>
        {detail && (
          <div className="space-y-5">
            <div className="relative h-44 rounded-xl overflow-hidden border border-smoke">
              <img src={detail.image} alt={detail.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <h3 className="font-display text-2xl font-semibold text-ivory">{detail.title}</h3>
                {detail.value > 0 && <span className="font-display text-xl text-champagne">{fmtMoney(detail.value)}</span>}
              </div>
            </div>

            <p className="text-sm text-linen/90 leading-relaxed font-light">{detail.description}</p>

            {/* stage mover */}
            <div className="rounded-xl bg-charcoal/60 border border-smoke p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-pewter mb-3 flex items-center gap-1.5">
                <MoveRight size={13} className="text-champagne" /> Production stage
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveDetail(-1)} disabled={detail.status === 'sketch'} className="w-9 h-9 rounded-lg border border-smoke flex items-center justify-center text-linen hover:text-champagne hover:border-champagne/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer" aria-label="Back">
                  <ArrowLeft size={14} />
                </button>
                <div className="flex-1 grid grid-cols-4 gap-1.5">
                  {COMM_STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        const updated = { ...detail, status: s.id, delivered: s.id === 'delivered' };
                        onUpdateAll(commissions.map((c) => (c.id === detail.id ? updated : c)));
                        setDetail(updated);
                      }}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                        detail.status === s.id
                          ? 'bg-champagne text-obsidian shadow-md shadow-champagne/25'
                          : 'bg-onyx border border-smoke text-pewter hover:border-champagne/40 hover:text-sand'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => moveDetail(1)} disabled={detail.status === 'delivered'} className="w-9 h-9 rounded-lg border border-smoke flex items-center justify-center text-linen hover:text-champagne hover:border-champagne/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer" aria-label="Forward">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { label: 'Client', value: detail.client },
                { label: 'Atelier', value: detail.atelier },
                { label: 'Category', value: detail.category },
                { label: 'Delivers', value: detail.due },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-smoke p-3">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-pewter mb-1">{label}</div>
                  <div className="text-[13px] text-ivory truncate">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-smoke p-3">
              <div className={`w-9 h-9 rounded-full ${artisanOf(detail.artisan)?.color ?? 'bg-ash'} flex items-center justify-center text-[11px] font-bold text-white`}>
                {detail.artisan}
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-pewter">Master artisan</div>
                <div className="text-[13px] text-ivory">{artisanOf(detail.artisan)?.name} · {artisanOf(detail.artisan)?.speciality}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button onClick={deleteDetail} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
                <Trash2 size={14} /> Archive
              </button>
              <button
                onClick={completeDetail}
                disabled={detail.delivered}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-emerald-600/25 transition-colors cursor-pointer"
              >
                <CheckCircle2 size={14} /> {detail.delivered ? 'Delivered' : 'Mark Delivered'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
