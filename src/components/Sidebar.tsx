import {
  LayoutDashboard, Gem, ClipboardList, Users2, Hammer,
  BarChart3, CreditCard, Sparkles, Settings, ChevronLeft, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { View, Plan } from '../data/lumiereData';

interface SidebarProps {
  view: View;
  onNavigate: (v: View) => void;
  collapsed: boolean;
  onToggle: () => void;
  plan: Plan;
  openCount: number;
}

const groups: { label: string; items: { id: View; label: string; icon: any; badge?: boolean }[] }[] = [
  {
    label: 'Atelier',
    items: [
      { id: 'dashboard', label: 'Maison Overview', icon: LayoutDashboard },
      { id: 'commissions', label: 'Commissions', icon: Gem },
      { id: 'assignments', label: 'Assignments', icon: ClipboardList, badge: true },
    ],
  },
  {
    label: 'Relations',
    items: [
      { id: 'clients', label: 'Private Clients', icon: Users2 },
      { id: 'artisans', label: 'Artisans', icon: Hammer },
      { id: 'analytics', label: 'Maison Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Console',
    items: [
      { id: 'assistant', label: 'Maison AI', icon: Sparkles },
      { id: 'billing', label: 'Subscription', icon: CreditCard },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ view, onNavigate, collapsed, onToggle, plan, openCount }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 z-40 h-full flex flex-col bg-onyx border-r border-smoke transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-smoke shrink-0">
        <div className="w-9 h-9 rounded-full border border-champagne/50 flex items-center justify-center shrink-0 shadow-lg shadow-champagne/10">
          <Gem size={16} className="text-champagne" strokeWidth={1.25} />
        </div>
        {!collapsed && (
          <div className="anim-fade-in min-w-0">
            <div className="font-display font-semibold text-ivory text-[15px] leading-none tracking-wide-luxe">LUMIÈRE</div>
            <div className="text-[10px] text-pewter mt-1 tracking-widest uppercase">Maison OS</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {groups.map((g) => (
          <div key={g.label}>
            {!collapsed && (
              <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-luxe text-pewter/70">
                {g.label}
              </div>
            )}
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-champagne/10 text-champagne border border-champagne/25'
                        : 'text-linen hover:bg-charcoal hover:text-ivory border border-transparent'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon size={17} strokeWidth={active ? 2 : 1.6} />
                    {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                    {!collapsed && item.badge && openCount > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-champagne text-obsidian' : 'bg-smoke text-sand'}`}>
                        {openCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Plan card */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl border border-champagne/25 bg-gradient-to-br from-charcoal to-onyx p-4 anim-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-sm text-ivory">{plan.name}</span>
            <span className="text-[9px] font-bold text-champagne bg-champagne/10 border border-champagne/30 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-smoke overflow-hidden mb-1.5">
            <div className="h-full rounded-full progress-anim" style={{ width: '68%', background: 'linear-gradient(90deg,#c9a962,#f0dfae)' }} />
          </div>
          <p className="text-[11px] text-pewter mb-3">680 / 1,000 Maison AI messages</p>
          <button
            onClick={() => onNavigate('billing')}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg text-obsidian text-xs font-semibold py-2 cursor-pointer btn-gold"
            style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}
          >
            Upgrade <ArrowUpRight size={12} />
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-12 border-t border-smoke flex items-center justify-center text-pewter hover:text-champagne hover:bg-charcoal transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
