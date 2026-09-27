import { useState } from 'react';
import { Plus, Mail, Trash2, Hammer, Search } from 'lucide-react';
import { Artisan, uid } from '../data/lumiereData';
import { Modal, PageHeader, EmptyState, inputCls } from '../components/ui';

interface ArtisansProps {
  artisans: Artisan[];
  onAdd: (m: Artisan) => void;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: Artisan['status']) => void;
  toast: (msg: string) => void;
}

const avatarColors = ['bg-amber-500', 'bg-violet-500', 'bg-sky-500', 'bg-rose-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-indigo-500'];

export default function Artisans({ artisans, onAdd, onRemove, onStatusChange, toast }: ArtisansProps) {
  const [q, setQ] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState({ name: '', speciality: '', email: '' });
  const [err, setErr] = useState('');

  const filtered = artisans.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()) || m.speciality.toLowerCase().includes(q.toLowerCase()));
  const atBench = artisans.filter((m) => m.status === 'at bench').length;

  const submitInvite = () => {
    if (!form.name.trim()) { setErr('Name is required.'); return; }
    if (!form.speciality.trim()) { setErr('Speciality is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr('Enter a valid maison email.'); return; }
    const initials = form.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    onAdd({
      id: uid('ar'),
      name: form.name.trim(),
      speciality: form.speciality.trim(),
      email: form.email.trim(),
      initials,
      color: avatarColors[artisans.length % avatarColors.length],
      status: 'at bench',
      activePieces: 0,
    });
    setForm({ name: '', speciality: '', email: '' });
    setErr('');
    setInviteOpen(false);
    toast(`Atelier key sent to ${form.email}`);
  };

  const statusMeta = {
    'at bench': { dot: 'bg-emerald-500', label: 'At the Bench', pill: 'bg-emerald-500/15 text-emerald-400' },
    viewing: { dot: 'bg-champagne', label: 'In a Viewing', pill: 'bg-champagne/15 text-champagne' },
    offline: { dot: 'bg-ash', label: 'Away', pill: 'bg-smoke text-pewter' },
  } as const;

  return (
    <div>
      <PageHeader
        title="Artisans"
        subtitle={`${artisans.length} hands of the maison · ${atBench} at the bench now`}
        actions={
          <button onClick={() => setInviteOpen(true)} className="btn-gold flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-obsidian shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}>
            <Plus size={15} /> Invite Artisan
          </button>
        }
      />

      <div className="relative max-w-sm mb-6 anim-fade-up">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pewter" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search hands or specialities…"
          className="luxury-input w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory placeholder:text-pewter/60"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-smoke bg-onyx">
          <EmptyState icon={Hammer} title="No artisans found" hint="Invite a master hand to the maison." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m, i) => {
            const st = statusMeta[m.status];
            return (
              <div key={m.id} className="lift rounded-2xl border border-smoke bg-onyx p-5 anim-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className={`w-[52px] h-[52px] rounded-full ${m.color} flex items-center justify-center text-base font-bold text-white shadow-md`}>
                      {m.initials}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${st.dot} border-2 border-onyx`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[17px] font-semibold text-ivory truncate">{m.name}</div>
                    <div className="text-xs text-pewter mt-0.5">{m.speciality}</div>
                    <span className={`inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.pill}`}>{st.label}</span>
                  </div>
                  <button
                    onClick={() => { onRemove(m.id); toast(`${m.name} retired from the maison`); }}
                    className="text-ash hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove artisan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-smoke flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-pewter min-w-0">
                    <Mail size={12} className="shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-sand bg-smoke px-2 py-1 rounded-lg shrink-0">
                    {m.activePieces} pieces
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-1">
                  {(['at bench', 'viewing', 'offline'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onStatusChange(m.id, s)}
                      className={`py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                        m.status === s ? 'bg-champagne text-obsidian' : 'bg-charcoal text-pewter hover:text-sand'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite an Artisan">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Full name *</label>
            <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Élise Moretti" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Speciality *</label>
            <input value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} placeholder="e.g. Master Engraver" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Maison email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="elise@lumiere.com" className={inputCls} />
          </div>
          {err && <p className="text-xs font-medium text-rose-400 anim-fade-in">{err}</p>}
          <div className="flex justify-end gap-2.5 pt-1">
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2.5 rounded-xl text-sm text-pewter hover:text-ivory hover:bg-charcoal transition-colors cursor-pointer">Cancel</button>
            <button onClick={submitInvite} className="btn-gold px-5 py-2.5 rounded-xl text-obsidian text-sm font-semibold shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>Send Atelier Key</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
