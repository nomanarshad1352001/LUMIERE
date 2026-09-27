import { useState } from 'react';
import {
  Banknote, Gem, Handshake, Plus, ArrowRight,
  Sparkles, Clock, Crown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { View, Commission, Artisan, Client, Atelier, salesSeries, activitySeed, COMM_STAGES, User, fmtMoney } from '../data/lumiereData';
import { TrendPill } from '../components/ui';

interface DashboardProps {
  user: User;
  commissions: Commission[];
  artisans: Artisan[];
  clients: Client[];
  ateliers: Atelier[];
  onNavigate: (v: View) => void;
}

const stageColors = ['#78716c', '#d4af6a', '#fbbf24', '#10b981'];

function Spark({ data, color }: { data: number[]; color: string }) {
  const pts = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={38}>
      <AreaChart data={pts}>
        <defs>
          <linearGradient id={`sp-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sp-${color.slice(1)})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard({ user, commissions, artisans, clients, ateliers, onNavigate }: DashboardProps) {
  const [range, setRange] = useState<'7D' | '30D' | '12M'>('12M');

  const openPieces = commissions.filter((c) => !c.delivered);
  const delivered = commissions.filter((c) => c.delivered);
  const patrons = clients.filter((c) => c.tier === 'Patron');
  const pipelineValue = openPieces.reduce((s, c) => s + c.value, 0);

  const stageDist = COMM_STAGES.map((s) => ({
    name: s.label,
    value: commissions.filter((c) => c.status === s.id).length,
  }));

  const upcoming = openPieces.sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4);

  const stats = [
    { icon: Banknote, label: 'Monthly Maison Sales', value: fmtMoney(1860000), trend: 7.4, spark: [1.18, 1.29, 1.41, 1.54, 1.61, 1.73, 1.86], color: '#d4af6a' },
    { icon: Gem, label: 'Active Commissions', value: String(openPieces.length), trend: 9.1, spark: [6, 7, 7, 8, 8, 9, 10], color: '#a5b4fc' },
    { icon: Crown, label: 'Patron Clients', value: String(patrons.length), trend: 11.5, spark: [3, 3, 4, 4, 5, 5, 6], color: '#fbbf24' },
    { icon: Handshake, label: 'Pipeline Value', value: fmtMoney(pipelineValue), trend: -3.2, spark: [423, 402, 415, 395, 388, 374, pipelineValue / 1000], color: '#e8a5b7' },
  ];

  const ChartTooltip = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div className="rounded-xl border border-smoke bg-onyx px-3.5 py-2.5 shadow-xl text-xs">
        <div className="font-semibold text-ivory mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-pewter">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey === 'sales' ? 'Sales' : 'Private viewings'}:{' '}
            <b className="text-ivory">{p.dataKey === 'sales' ? fmtMoney(Number(p.value)) : Number(p.value)}</b>
          </div>
        ))}
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="anim-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ivory tracking-wide">
            Bonjour, Madame {user.name.split(' ')[1] ?? user.name}
          </h1>
          <p className="text-sm text-pewter mt-1 font-light">
            A quiet day of brilliance at <span className="text-sand">{user.maison}</span>.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center gap-2 rounded-xl border border-smoke bg-onyx px-4 py-2.5 text-sm text-sand hover:border-champagne/50 hover:text-champagne transition-colors cursor-pointer"
          >
            <Sparkles size={15} className="text-champagne" /> Ask Maison AI
          </button>
          <button
            onClick={() => onNavigate('commissions')}
            className="btn-gold flex items-center gap-2 rounded-xl text-obsidian text-sm font-semibold px-4 py-2.5 shadow-lg shadow-champagne/20 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae,#c9a962)' }}
          >
            <Plus size={15} /> New Commission
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`anim-fade-up stagger-${i + 1} lift rounded-2xl border border-smoke bg-onyx p-5`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <TrendPill value={s.trend} />
            </div>
            <div className="font-display text-[26px] font-semibold text-ivory tracking-tight">{s.value}</div>
            <div className="text-[11px] text-pewter uppercase tracking-widest mt-0.5 mb-2">{s.label}</div>
            <Spark data={s.spark} color={s.color} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales chart */}
        <div className="xl:col-span-2 anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-ivory">Sales & Private Viewings</h3>
              <p className="text-xs text-pewter mt-0.5">Across all four ateliers</p>
            </div>
            <div className="flex p-1 rounded-lg bg-charcoal">
              {(['7D', '30D', '12M'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    range === r ? 'bg-onyx text-champagne shadow-sm' : 'text-pewter hover:text-sand'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesSeries[range]}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af6a" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#d4af6a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a5b4fc" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#d4af6a" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} />
              <Area yAxisId="right" type="monotone" dataKey="viewings" stroke="#a5b4fc" strokeWidth={1.8} fill="url(#viewGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-pewter"><span className="w-2.5 h-2.5 rounded-full bg-champagne" /> Maison sales</span>
            <span className="flex items-center gap-1.5 text-xs text-pewter"><span className="w-2.5 h-2.5 rounded-full" style={{ background: '#a5b4fc' }} /> Private viewings</span>
          </div>
        </div>

        {/* Pipeline donut */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6 flex flex-col">
          <h3 className="font-display text-lg font-semibold text-ivory">Commission Pipeline</h3>
          <p className="text-xs text-pewter mt-0.5">By production stage</p>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={stageDist} cx="50%" cy="50%" innerRadius={54} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {stageDist.map((_, i) => <Cell key={i} fill={stageColors[i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display text-[26px] font-semibold text-ivory">{delivered.length}/{commissions.length}</span>
              <span className="text-[10px] text-pewter uppercase tracking-widest">delivered</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stageDist.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs text-pewter">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stageColors[i] }} />
                {s.name} <b className="text-ivory ml-auto">{s.value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Upcoming deliveries */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-ivory">Upcoming Deliveries</h3>
            <button onClick={() => onNavigate('commissions')} className="text-xs font-semibold text-champagne hover:underline flex items-center gap-1 cursor-pointer">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcoming.map((c) => {
              const days = Math.ceil((new Date(c.due).getTime() - Date.now()) / 86400000);
              return (
                <button
                  key={c.id}
                  onClick={() => onNavigate('commissions')}
                  className="w-full flex items-center gap-3 rounded-xl border border-smoke p-3 hover:border-champagne/40 transition-colors cursor-pointer text-left"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-smoke">
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-ivory truncate">{c.title}</div>
                    <div className="text-[11px] text-pewter">{c.client} · {c.artisan}</div>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                    days > 14 ? 'bg-smoke text-linen' : days > 6 ? 'bg-amber-500/15 text-amber-400' : 'bg-champagne/15 text-champagne'
                  }`}>
                    <Clock size={10} /> {days}d
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Atelier activity */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <h3 className="font-display text-lg font-semibold text-ivory mb-4">Atelier Activity</h3>
          <div className="space-y-4">
            {activitySeed.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                  {a.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] text-sand leading-snug">
                    <b className="font-medium text-ivory">{a.who}</b> {a.what}
                  </p>
                  <span className="text-[11px] text-pewter">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artisans + AI card */}
        <div className="anim-fade-up space-y-4">
          <div className="rounded-2xl border border-smoke bg-onyx p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-ivory">Artisans at Bench</h3>
              <button onClick={() => onNavigate('artisans')} className="text-xs font-semibold text-champagne hover:underline cursor-pointer">
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {artisans.filter((a) => a.status === 'at bench').slice(0, 4).map((m) => (
                <button key={m.id} onClick={() => onNavigate('artisans')} className="w-full flex items-center gap-3 cursor-pointer hover:bg-charcoal/60 rounded-xl p-1.5 -m-1.5 transition-colors">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full ${m.color} flex items-center justify-center text-[11px] font-bold text-white`}>{m.initials}</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-onyx bg-emerald-500" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-[13px] font-medium text-ivory truncate">{m.name}</div>
                    <div className="text-[11px] text-pewter">{m.speciality}</div>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-pewter">{m.activePieces} pieces</span>
                </button>
              ))}
            </div>
            {/* atelier list */}
            <div className="mt-4 pt-4 border-t border-smoke grid grid-cols-2 gap-2">
              {ateliers.map((a) => (
                <div key={a.id} className="rounded-xl bg-charcoal/60 px-3 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: a.color }} />
                  <span className="text-[11px] text-sand">{a.city}</span>
                  <span className="text-[10px] text-pewter ml-auto">{a.craftspeople}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('assistant')}
            className="w-full rounded-2xl p-5 text-left lift cursor-pointer relative overflow-hidden border border-champagne/30"
            style={{ background: 'linear-gradient(135deg,#1c1917,#292524)' }}
          >
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-champagne/10 blur-2xl" />
            <Sparkles size={20} className="text-champagne mb-2.5" />
            <div className="font-display text-lg font-semibold text-ivory">Maison AI</div>
            <p className="text-xs text-linen/80 mt-1 leading-relaxed">Concierge-grade insights on clients, commissions, and atelier rhythm.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-champagne border border-champagne/30 rounded-lg px-3 py-1.5">
              Open assistant <ArrowRight size={11} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
