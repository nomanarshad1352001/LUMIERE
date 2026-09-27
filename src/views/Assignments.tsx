import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Calendar, Search, Filter, ClipboardList, Crown } from 'lucide-react';
import { Commission, PRIORITY_STYLE, todayISO, fmtMoney } from '../data/lumiereData';
import { PageHeader, EmptyState } from '../components/ui';

interface AssignmentsProps {
  commissions: Commission[];
  onToggle: (id: string) => void;
}

type FilterKey = 'all' | 'urgent' | 'royal' | 'overdue' | 'delivered';

export default function Assignments({ commissions, onToggle }: AssignmentsProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [q, setQ] = useState('');

  const open = commissions.filter((c) => !c.delivered);

  const filtered = useMemo(() => {
    let list = [...commissions];
    const today = todayISO();
    if (filter === 'urgent') list = list.filter((c) => c.priority === 'urgent' && !c.delivered);
    else if (filter === 'royal') list = list.filter((c) => c.priority === 'royal' && !c.delivered);
    else if (filter === 'overdue') list = list.filter((c) => c.due < today && !c.delivered);
    else if (filter === 'delivered') list = list.filter((c) => c.delivered);
    if (q.trim()) {
      const query = q.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(query) || c.client.toLowerCase().includes(query) || c.atelier.toLowerCase().includes(query));
    }
    return list.sort((a, b) => Number(a.delivered) - Number(b.delivered) || a.due.localeCompare(b.due));
  }, [commissions, filter, q]);

  const counts: Record<FilterKey, number> = {
    all: commissions.length,
    urgent: open.filter((c) => c.priority === 'urgent').length,
    royal: open.filter((c) => c.priority === 'royal').length,
    overdue: open.filter((c) => c.due < todayISO()).length,
    delivered: commissions.filter((c) => c.delivered).length,
  };

  const tabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All Pieces' },
    { key: 'royal', label: 'Royal' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const daysUntil = (due: string) => Math.ceil((new Date(due + 'T00:00:00').getTime() - new Date(todayISO() + 'T00:00:00').getTime()) / 86400000);

  return (
    <div>
      <PageHeader title="Assignments" subtitle={`${open.length} pieces in production · ${counts.delivered} delivered this season`} />

      {/* filters + search */}
      <div className="flex flex-wrap items-center gap-3 mb-5 anim-fade-up">
        <div className="flex p-1 rounded-xl bg-charcoal/80 border border-smoke">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                filter === t.key
                  ? 'bg-onyx text-champagne shadow-sm'
                  : 'text-pewter hover:text-sand'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-[10px] ${filter === t.key ? 'text-champagne' : 'text-pewter/70'}`}>{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pewter" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search pieces, clients, ateliers…"
            className="luxury-input w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory placeholder:text-pewter/60"
          />
        </div>
      </div>

      {/* list */}
      <div className="rounded-2xl border border-smoke bg-onyx overflow-hidden anim-fade-up stagger-2">
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No pieces match" hint="Try a different filter or search term." />
        ) : (
          filtered.map((c, i) => {
            const d = daysUntil(c.due);
            const p = PRIORITY_STYLE[c.priority];
            return (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-4 border-b border-smoke/60 last:border-0 hover:bg-charcoal/40 transition-colors anim-fade-up"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              >
                {/* toggle */}
                <button
                  onClick={() => onToggle(c.id)}
                  className="shrink-0 cursor-pointer transition-transform hover:scale-110"
                  aria-label={c.delivered ? 'Reopen piece' : 'Mark delivered'}
                >
                  {c.delivered
                    ? <CheckCircle2 size={22} className="text-emerald-400" />
                    : <Circle size={22} className="text-ash hover:text-champagne" />}
                </button>

                {/* thumb */}
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-smoke shrink-0 hidden sm:block">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${c.delivered ? 'line-through text-pewter' : 'text-ivory'}`}>
                    {c.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-pewter">
                    <span>{c.client}</span>
                    <span className="hidden md:inline">·</span>
                    <span className="hidden md:inline">{c.atelier}</span>
                  </div>
                </div>

                {/* right meta */}
                <div className="hidden sm:flex items-center gap-2.5 shrink-0">
                  {c.value > 0 && <span className="text-xs text-champagne font-semibold">{fmtMoney(c.value)}</span>}
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${p.cls}`}>
                    {c.priority === 'royal' && <Crown size={9} />}
                    {p.label}
                  </span>
                  {!c.delivered && (
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                      d < 0 ? 'bg-rose-500/15 text-rose-400' : d <= 3 ? 'bg-champagne/15 text-champagne' : 'bg-smoke text-linen'
                    }`}>
                      <Calendar size={10} />
                      {d < 0 ? `${Math.abs(d)}d late` : d === 0 ? 'Today' : `in ${d}d`}
                    </span>
                  )}
                  <div className="w-7 h-7 rounded-full bg-smoke flex items-center justify-center text-[9px] font-bold text-sand">
                    {c.artisan}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-pewter anim-fade-up stagger-3">
        <Filter size={12} />
        Showing {filtered.length} of {commissions.length} pieces
      </div>
    </div>
  );
}
