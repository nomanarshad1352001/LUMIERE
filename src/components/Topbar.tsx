import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, ChevronDown, LogOut, Settings, User,
  Gem, Users2, Hammer, X, CheckCheck, ClipboardList, Trash2, Store
} from 'lucide-react';
import { View, AppNotification, Commission, Client, Artisan, User as UserType } from '../data/lumiereData';

interface TopbarProps {
  view: View;
  user: UserType;
  onViewSite: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onClearNotifications: () => void;
  onNavigate: (v: View) => void;
  onLogout: () => void;
  commissions: Commission[];
  clients: Client[];
  artisans: Artisan[];
  onOpenMobileMenu: () => void;
}

const viewTitles: Record<View, { title: string; crumb: string }> = {
  dashboard: { title: 'Maison Overview', crumb: 'Atelier' },
  commissions: { title: 'Commissions', crumb: 'Atelier' },
  assignments: { title: 'Assignments', crumb: 'Atelier' },
  clients: { title: 'Private Clients', crumb: 'Relations' },
  artisans: { title: 'Artisans', crumb: 'Relations' },
  analytics: { title: 'Maison Analytics', crumb: 'Relations' },
  billing: { title: 'Subscription', crumb: 'Console' },
  assistant: { title: 'Maison AI', crumb: 'Console' },
  settings: { title: 'Settings', crumb: 'Console' },
};

export default function Topbar({
  view, user, onViewSite, notifications, onMarkAllRead, onMarkRead,
  onClearNotifications, onNavigate, onLogout, commissions, clients, artisans, onOpenMobileMenu
}: TopbarProps) {
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const query = q.trim().toLowerCase();
  const searchResults = query.length >= 2
    ? [
        ...commissions.filter((t) => t.title.toLowerCase().includes(query)).slice(0, 4).map((t) => ({ icon: Gem, label: t.title, sub: `Commission · ${t.atelier}`, view: 'commissions' as View })),
        ...clients.filter((c) => c.name.toLowerCase().includes(query) || c.city.toLowerCase().includes(query)).slice(0, 4).map((c) => ({ icon: Users2, label: c.name, sub: `${c.tier} · ${c.city}`, view: 'clients' as View })),
        ...artisans.filter((m) => m.name.toLowerCase().includes(query)).slice(0, 3).map((m) => ({ icon: Hammer, label: m.name, sub: `Artisan · ${m.speciality}`, view: 'artisans' as View })),
      ]
    : [];

  const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-obsidian/85 backdrop-blur-xl border-b border-smoke flex items-center gap-3 px-4 sm:px-6">
      {/* mobile menu */}
      <button onClick={onOpenMobileMenu} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-pewter hover:bg-charcoal cursor-pointer" aria-label="Menu">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-2 text-sm">
        <span className="text-pewter">{viewTitles[view].crumb}</span>
        <span className="text-smoke">/</span>
        <span className="font-display text-base text-ivory">{viewTitles[view].title}</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md ml-auto lg:ml-8" ref={searchRef}>
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pewter" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search commissions, clients, artisans…"
          className="luxury-input w-full rounded-xl pl-10 pr-9 py-2.5 text-sm text-ivory placeholder:text-pewter/60"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-pewter hover:text-ivory cursor-pointer" aria-label="Clear">
            <X size={13} />
          </button>
        )}

        {searchOpen && query.length >= 2 && (
          <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl border border-smoke bg-onyx shadow-2xl overflow-hidden anim-drop-in">
            {searchResults.length === 0 ? (
              <div className="px-4 py-6 text-sm text-pewter text-center">Nothing found for “{q}”</div>
            ) : (
              <div className="py-1.5">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => { onNavigate(r.view); setQ(''); setSearchOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-charcoal transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-champagne/10 border border-champagne/20 flex items-center justify-center shrink-0">
                      <r.icon size={14} className="text-champagne" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium text-ivory truncate">{r.label}</div>
                      <div className="text-[11px] text-pewter">{r.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Boutique bridge */}
      <button
        onClick={onViewSite}
        className="hidden md:flex items-center gap-2 rounded-xl border border-champagne/30 px-3.5 py-2 text-xs font-semibold tracking-wide-luxe uppercase text-champagne hover:bg-champagne/10 hover:border-champagne/60 transition-all cursor-pointer"
      >
        <Store size={13} />
        The Boutique
      </button>
      <button
        onClick={onViewSite}
        className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-pewter hover:text-champagne hover:bg-charcoal transition-colors cursor-pointer"
        aria-label="View boutique"
      >
        <Store size={17} />
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-pewter hover:text-champagne hover:bg-charcoal transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-champagne text-obsidian text-[9px] font-bold flex items-center justify-center ring-2 ring-obsidian">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl border border-smoke bg-onyx shadow-2xl overflow-hidden anim-drop-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-smoke">
              <span className="font-display text-base text-ivory">Maison Alerts</span>
              <div className="flex items-center gap-1">
                <button onClick={onMarkAllRead} className="p-1.5 rounded-lg text-pewter hover:text-champagne hover:bg-champagne/10 cursor-pointer" title="Mark all read">
                  <CheckCheck size={15} />
                </button>
                <button onClick={onClearNotifications} className="p-1.5 rounded-lg text-pewter hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer" title="Clear all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-pewter">The maison is quiet ✨</div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-smoke/50 hover:bg-charcoal/70 transition-colors cursor-pointer ${!n.read ? 'bg-champagne/5' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-champagne' : 'bg-smoke'}`} />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-ivory">{n.title}</div>
                        <div className="text-xs text-pewter mt-0.5 leading-relaxed">{n.detail}</div>
                        <div className="text-[10px] text-pewter/70 mt-1">{n.time}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2.5 rounded-xl pl-1.5 pr-2.5 py-1.5 hover:bg-charcoal transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-obsidian shadow-md shadow-champagne/20" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-[13px] font-medium text-ivory leading-tight">{user.name}</div>
            <div className="text-[10px] text-pewter leading-tight">{user.role}</div>
          </div>
          <ChevronDown size={13} className={`text-pewter transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-smoke bg-onyx shadow-2xl overflow-hidden anim-drop-in">
            <div className="px-4 py-3.5 border-b border-smoke">
              <div className="text-sm font-medium text-ivory">{user.name}</div>
              <div className="text-[11px] text-pewter">{user.email}</div>
            </div>
            {[
              { icon: User, label: 'My Console', view: 'settings' as View },
              { icon: Gem, label: 'Commissions', view: 'commissions' as View },
              { icon: ClipboardList, label: 'Assignments', view: 'assignments' as View },
              { icon: Settings, label: 'Maison Settings', view: 'settings' as View },
            ].map(({ icon: Icon, label, view: v }) => (
              <button
                key={label}
                onClick={() => { onNavigate(v); setProfileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-linen hover:bg-charcoal hover:text-ivory transition-colors cursor-pointer"
              >
                <Icon size={14} className="text-pewter" /> {label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 border-t border-smoke transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Leave the console
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
