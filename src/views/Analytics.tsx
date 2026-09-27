import { useState } from 'react';
import { Download, Gem, Eye, Handshake, Clock } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { salesSeries, channelData, categorySales, funnelData, Client, fmtMoney } from '../data/lumiereData';
import { PageHeader, TrendPill } from '../components/ui';

const pieColors = ['#d4af6a', '#a5b4fc', '#7dd3fc', '#e8a5b7', '#10b981'];

export default function Analytics({ clients }: { clients: Client[] }) {
  const [range, setRange] = useState<'7D' | '30D' | '12M'>('12M');

  const tierDist = (['Patron', 'Collector', 'Member', 'Prospect'] as const).map((t) => ({
    name: t,
    value: clients.filter((c) => c.tier === t).length,
  }));

  const kpis = [
    { icon: Gem, label: 'Pieces delivered (Q)', value: '38', trend: 12.5, color: '#d4af6a' },
    { icon: Eye, label: 'Private viewings (Q)', value: '155', trend: 9.3, color: '#a5b4fc' },
    { icon: Handshake, label: 'Viewing → commission', value: '50%', trend: 4.1, color: '#10b981' },
    { icon: Clock, label: 'Avg. crafting time', value: '66 days', trend: -6.8, color: '#e8a5b7' },
  ];

  const TooltipBox = ({ active, payload, label }: any) =>
    active && payload?.length ? (
      <div className="rounded-xl border border-smoke bg-onyx px-3.5 py-2.5 shadow-xl text-xs">
        {label && <div className="font-semibold text-ivory mb-1">{label}</div>}
        {payload.map((p: any) => (
          <div key={p.name ?? p.dataKey} className="flex items-center gap-2 text-pewter">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
            {p.name}: <b className="text-ivory">{Number(p.value).toLocaleString()}{p.dataKey === 'sales' ? '' : ''}</b>
          </div>
        ))}
      </div>
    ) : null;

  const exportReport = () => {
    const blob = new Blob([
      `LUMIÈRE — MAISON REPORT\nGenerated: ${new Date().toLocaleDateString()}\n\nMonthly sales: $1.86M\nPrivate clients: ${clients.length}\nPatrons: ${clients.filter((c) => c.tier === 'Patron').length}\n\nSales funnel:\n${funnelData.map((f) => `  ${f.stage}: ${f.value}`).join('\n')}`,
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumiere-maison-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Maison Analytics"
        subtitle="Sales cadence, client composition, and the art of conversion"
        actions={
          <button onClick={exportReport} className="flex items-center gap-2 rounded-xl border border-smoke bg-onyx px-4 py-2.5 text-sm text-sand hover:border-champagne/50 hover:text-champagne transition-colors cursor-pointer">
            <Download size={14} /> Export Report
          </button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {kpis.map((k, i) => (
          <div key={k.label} className={`anim-fade-up stagger-${i + 1} lift rounded-2xl border border-smoke bg-onyx p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}18` }}>
                <k.icon size={16} style={{ color: k.color }} />
              </div>
              <TrendPill value={k.trend} />
            </div>
            <div className="font-display text-[26px] font-semibold text-ivory tracking-tight">{k.value}</div>
            <div className="text-[11px] text-pewter uppercase tracking-widest mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        {/* Sales line */}
        <div className="xl:col-span-2 anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-ivory">Maison Sales</h3>
              <p className="text-xs text-pewter mt-0.5">All ateliers, nominal USD</p>
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesSeries[range]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} tickFormatter={(v) => fmtMoney(v)} />
              <Tooltip content={<TooltipBox />} />
              <Line type="monotone" dataKey="sales" name="Sales" stroke="#d4af6a" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client tiers */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <h3 className="font-display text-lg font-semibold text-ivory">House Registry by Tier</h3>
          <p className="text-xs text-pewter mt-0.5 mb-2">Current client composition</p>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={tierDist} cx="50%" cy="50%" innerRadius={48} outerRadius={74} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {tierDist.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip content={<TooltipBox />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2">
            {tierDist.map((p, i) => (
              <div key={p.name} className="flex items-center gap-2 text-xs text-pewter">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: pieColors[i] }} />
                {p.name}
                <b className="text-ivory ml-auto">{p.value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        {/* Funnel */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <h3 className="font-display text-lg font-semibold text-ivory">The Maison Funnel</h3>
          <p className="text-xs text-pewter mt-0.5 mb-5">From first inquiry to ceremonial delivery</p>
          <div className="space-y-3">
            {funnelData.map((f, i) => {
              const pct = Math.round((f.value / funnelData[0].value) * 100);
              const prev = i > 0 ? Math.round((f.value / funnelData[i - 1].value) * 100) : 100;
              return (
                <div key={f.stage} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-sand">{f.stage}</span>
                    <span className="text-pewter">
                      {f.value} · <b className="text-sand">{prev}%</b>{i > 0 && ' conv.'}
                    </span>
                  </div>
                  <div className="w-full h-8 rounded-xl bg-charcoal overflow-hidden border border-smoke/60">
                    <div
                      className="h-full rounded-xl progress-anim transition-all duration-500 group-hover:brightness-110"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${pieColors[i % pieColors.length]}, ${pieColors[(i + 1) % pieColors.length]})` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels */}
        <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
          <h3 className="font-display text-lg font-semibold text-ivory">Acquisition Channels</h3>
          <p className="text-xs text-pewter mt-0.5 mb-5">New commissions by source, this quarter</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
              <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipBox />} cursor={{ fill: 'rgba(212,175,106,0.06)' }} />
              <Bar dataKey="value" name="Commissions" radius={[8, 8, 0, 0]}>
                {channelData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category sales */}
      <div className="anim-fade-up rounded-2xl border border-smoke bg-onyx p-6">
        <h3 className="font-display text-lg font-semibold text-ivory">Sales by Category</h3>
        <p className="text-xs text-pewter mt-0.5 mb-5">Share of communal revenue</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={categorySales}>
            <defs>
              <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af6a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#d4af6a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#44403c" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<TooltipBox />} />
            <Area type="monotone" dataKey="value" name="Share %" stroke="#d4af6a" strokeWidth={2.5} fill="url(#catGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
