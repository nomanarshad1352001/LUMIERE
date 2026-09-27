import { useState } from 'react';
import {
  User, Bell, Palette, Shield, Database, Download, Trash2,
  Save, CheckCircle2, LogOut, Gem
} from 'lucide-react';
import { User as UserType } from '../data/lumiereData';
import { PageHeader, Toggle, inputCls } from '../components/ui';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (u: UserType) => void;
  onResetData: () => void;
  onLogout: () => void;
  toast: (msg: string) => void;
  exportData: () => void;
}

type Tab = 'profile' | 'notifications' | 'appearance' | 'security' | 'data';

export default function Settings({ user, onUpdateUser, onResetData, onLogout, toast, exportData }: SettingsProps) {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState(user);
  const [notifs, setNotifs] = useState({ commissions: true, viewings: true, clients: true, billing: true, digest: true, press: false });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwDone, setPwDone] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [accent, setAccent] = useState<'champagne' | 'ivory' | 'jade'>('champagne');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Vault', icon: Database },
  ];

  const saveProfile = () => {
    if (!profile.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast('A name and valid email are required');
      return;
    }
    onUpdateUser(profile);
    toast('Profile elegantly updated');
  };

  const changePassword = () => {
    setPwDone(false);
    if (!pw.current) { setPwError('Enter your current maison key.'); return; }
    if (pw.next.length < 8) { setPwError('The new key must be at least 8 characters.'); return; }
    if (pw.next !== pw.confirm) { setPwError('The keys do not match.'); return; }
    setPwError('');
    setPwDone(true);
    setPw({ current: '', next: '', confirm: '' });
    toast('Maison key rotated');
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Your console, your rituals, your vault" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* tab rail */}
        <div className="lg:col-span-1 anim-fade-up">
          <div className="rounded-2xl border border-smoke bg-onyx p-2 space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                  tab === id
                    ? 'bg-champagne/10 text-champagne border border-champagne/25'
                    : 'text-linen hover:bg-charcoal hover:text-ivory border border-transparent'
                }`}
              >
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="lg:col-span-3 anim-fade-up stagger-2">
          <div className="rounded-2xl border border-smoke bg-onyx p-6 sm:p-8">

            {/* PROFILE */}
            {tab === 'profile' && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-5 border-b border-smoke">
                  <div className="w-16 h-16 rounded-full border border-champagne/40 flex items-center justify-center font-display text-xl text-obsidian shadow-lg shadow-champagne/20" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
                    {profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-display text-xl font-semibold text-ivory">{profile.name}</div>
                    <div className="text-xs text-pewter">{profile.role} · {profile.maison}</div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Full name</label>
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Maison email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">House</label>
                    <input value={profile.maison} onChange={(e) => setProfile({ ...profile, maison: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Title</label>
                    <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className={inputCls} />
                  </div>
                </div>
                <button onClick={saveProfile} className="btn-gold flex items-center gap-2 rounded-xl text-obsidian text-sm font-semibold px-5 py-2.5 shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {tab === 'notifications' && (
              <div className="space-y-1">
                {[
                  { key: 'commissions' as const, label: 'Commission movement', desc: 'When a piece changes production stage' },
                  { key: 'viewings' as const, label: 'Private viewings', desc: 'New bookings, confirmations, cancellations' },
                  { key: 'clients' as const, label: 'Client moments', desc: 'New registrations, tier changes, milestones' },
                  { key: 'billing' as const, label: 'Subscription receipts', desc: 'Invoices and payment confirmations' },
                  { key: 'digest' as const, label: 'Weekly maison digest', desc: 'A curated summary every Monday morning' },
                  { key: 'press' as const, label: 'Press & partnerships', desc: 'Media mentions and collaboration requests' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-smoke/70 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-ivory">{n.label}</div>
                      <div className="text-xs text-pewter mt-0.5">{n.desc}</div>
                    </div>
                    <Toggle on={notifs[n.key]} onChange={(v) => { setNotifs({ ...notifs, [n.key]: v }); toast(`${n.label} ${v ? 'enabled' : 'silenced'}`); }} />
                  </div>
                ))}
              </div>
            )}

            {/* APPEARANCE */}
            {tab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-ivory mb-3">Accent</div>
                  <div className="grid grid-cols-3 gap-3 max-w-md">
                    {[
                      { id: 'champagne' as const, label: 'Champagne', bg: 'linear-gradient(135deg,#d4af6a,#f0dfae)' },
                      { id: 'ivory' as const, label: 'Ivory', bg: 'linear-gradient(135deg,#f5f0e8,#a8a29e)' },
                      { id: 'jade' as const, label: 'Jade', bg: 'linear-gradient(135deg,#34d399,#065f46)' },
                    ].map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setAccent(a.id); toast(`Accent set to ${a.label}`); }}
                        className={`rounded-xl border-2 p-4 text-left transition-all cursor-pointer ${
                          accent === a.id ? 'border-champagne bg-champagne/10' : 'border-smoke hover:border-ash'
                        }`}
                      >
                        <div className="w-full h-10 rounded-lg mb-2.5" style={{ background: a.bg }} />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-ivory">{a.label}</span>
                          {accent === a.id && <CheckCircle2 size={14} className="text-champagne" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-ivory mb-3">Density</div>
                  <div className="flex gap-2">
                    {(['comfortable', 'compact'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => { setDensity(d); toast(`Density set to ${d}`); }}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${
                          density === d
                            ? 'bg-champagne text-obsidian font-semibold shadow-lg shadow-champagne/20'
                            : 'border border-smoke text-pewter hover:border-champagne/40 hover:text-sand'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-pewter leading-relaxed max-w-md">
                  The Maison OS is dressed in obsidian by design — our consoles live in dim ateliers and evening viewings. The accent is yours to choose.
                </p>
              </div>
            )}

            {/* SECURITY */}
            {tab === 'security' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-ivory mb-4">
                    <Gem size={15} className="text-champagne" /> Rotate your maison key
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Current key</label>
                      <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} placeholder="••••••••" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">New key</label>
                      <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} placeholder="Min. 8 chars" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-widest text-pewter mb-1.5">Confirm new</label>
                      <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} placeholder="Repeat" className={inputCls} />
                    </div>
                  </div>
                  {pwError && <p className="text-xs font-medium text-rose-400 mt-3 anim-fade-in">{pwError}</p>}
                  {pwDone && <p className="text-xs font-medium text-emerald-400 mt-3 anim-fade-in flex items-center gap-1.5"><CheckCircle2 size={13} /> Maison key rotated</p>}
                  <button onClick={changePassword} className="btn-gold mt-4 rounded-xl text-obsidian text-sm font-semibold px-5 py-2.5 shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
                    Rotate Key
                  </button>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-smoke max-w-2xl">
                  <div>
                    <div className="text-sm font-medium text-ivory">Two-key ceremony (2FA)</div>
                    <div className="text-xs text-pewter mt-0.5">An authenticator confirms every entry to the console</div>
                  </div>
                  <Toggle on={twoFA} onChange={(v) => { setTwoFA(v); toast(`Two-key ceremony ${v ? 'enabled' : 'disabled'}`); }} />
                </div>
                <div className="pt-4 border-t border-smoke">
                  <button onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-semibold px-5 py-2.5 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <LogOut size={14} /> Sign out of all consoles
                  </button>
                </div>
              </div>
            )}

            {/* DATA */}
            {tab === 'data' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-smoke p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-champagne" />
                    <div>
                      <div className="text-sm font-medium text-ivory">Export the maison ledger</div>
                      <div className="text-xs text-pewter">Commissions, clients, artisans — everything as JSON</div>
                    </div>
                  </div>
                  <button onClick={() => { exportData(); toast('Ledger exported'); }} className="btn-gold rounded-xl text-obsidian text-sm font-semibold px-4 py-2.5 shadow-lg shadow-champagne/20 cursor-pointer" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>
                    Download JSON
                  </button>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Trash2 size={18} className="text-rose-400" />
                      <div>
                        <div className="text-sm font-medium text-rose-400">Reset the maison</div>
                        <div className="text-xs text-rose-400/70">Restore all commissions, clients, and artisans to defaults</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { onResetData(); toast('Maison restored to its first light'); }}
                      className="rounded-xl border border-rose-500/40 text-rose-400 text-sm font-semibold px-4 py-2.5 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Reset Everything
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-pewter leading-relaxed">
                  LUMIÈRE Maison OS demo stores everything in this browser's local vault. No servers, no third parties, no compromise.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
