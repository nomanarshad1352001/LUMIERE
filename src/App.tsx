import { useState, useEffect, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SiteApp from './components/site/SiteApp';
import { CartItem, OrderInfo } from './components/site/SiteShop';
import { Toasts, ToastMsg } from './components/ui';
import Dashboard from './views/Dashboard';
import Commissions from './views/Commissions';
import Assignments from './views/Assignments';
import Clients from './views/Clients';
import Artisans from './views/Artisans';
import Analytics from './views/Analytics';
import Billing from './views/Billing';
import MaisonAI from './views/MaisonAI';
import Settings from './views/Settings';
import {
  View, User, Commission, Artisan, Atelier, Client, Invoice,
  AppNotification, Plan, plans, uid,
  seedCommissions, seedArtisans, seedAteliers, seedClients, seedInvoices, seedNotifications,
} from './data/lumiereData';

// ---------- localStorage (the maison vault) ----------
const LS = 'lumiere-os-v1';
const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`${LS}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const persist = (key: string, value: unknown) => {
  try { localStorage.setItem(`${LS}:${key}`, JSON.stringify(value)); } catch { /* vault full */ }
};

type Mode = 'site' | 'login' | 'console';

export default function App() {
  // ----- session & mode (website ↔ login ↔ console) -----
  const [user, setUser] = useState<User | null>(() => load('user', null));
  const [mode, setMode] = useState<Mode>(() => (load('user', null) ? 'console' : 'site'));

  // ----- console domain data -----
  const [view, setView] = useState<View>('dashboard');
  const [commissions, setCommissions] = useState<Commission[]>(() => load('commissions', seedCommissions));
  const [artisans, setArtisans] = useState<Artisan[]>(() => load('artisans', seedArtisans));
  const [ateliers] = useState<Atelier[]>(() => load('ateliers', seedAteliers));
  const [clients, setClients] = useState<Client[]>(() => load('clients', seedClients));
  const [invoices, setInvoices] = useState<Invoice[]>(() => load('invoices', seedInvoices));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => load('notifications', seedNotifications));
  const [plan, setPlan] = useState<Plan>(() => load('plan', plans[1]));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  // persist
  useEffect(() => persist('user', user), [user]);
  useEffect(() => persist('commissions', commissions), [commissions]);
  useEffect(() => persist('artisans', artisans), [artisans]);
  useEffect(() => persist('clients', clients), [clients]);
  useEffect(() => persist('invoices', invoices), [invoices]);
  useEffect(() => persist('notifications', notifications), [notifications]);
  useEffect(() => persist('plan', plan), [plan]);

  const toast = useCallback((text: string, kind: ToastMsg['kind'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, text, kind }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3400);
  }, []);

  const notify = useCallback((title: string, detail: string, type: AppNotification['type']) => {
    setNotifications((prev) => [{ id: `nt-${Date.now()}`, title, detail, time: 'just now', read: false, type }, ...prev].slice(0, 12));
  }, []);

  // ============ AUTH & MODE BRIDGE ============
  const openConsole = useCallback(() => {
    if (user) setMode('console');
    else setMode('login');
  }, [user]);

  const handleLogin = useCallback((u: User) => {
    setUser(u);
    setMode('console');
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(`${LS}:user`);
    setView('dashboard');
    setMode('site');
  }, []);

  // ============ BOUTIQUE → CONSOLE BRIDGE ============
  // When a visitor acquires pieces on the website, create a client + commission in the console
  const handleSiteAcquire = useCallback((items: CartItem[], order: OrderInfo, total: number) => {
    // 1. register the client if new
    let clientId: string;
    let existingCustomer = clients.find((c) => c.email.toLowerCase() === order.email.toLowerCase());
    if (existingCustomer) {
      clientId = existingCustomer.id;
      setClients((prev) => prev.map((c) => c.id === clientId ? { ...c, lifetimeValue: c.lifetimeValue + total, pieces: c.pieces + items.reduce((a, i) => a + i.qty, 0), lastContact: 'Just now', status: 'active' } : c));
    } else {
      clientId = uid('cl');
      setClients((prev) => [...prev, {
        id: clientId,
        name: order.name,
        email: order.email,
        city: order.city,
        tier: 'Member',
        status: 'active',
        lifetimeValue: total,
        pieces: items.reduce((a, i) => a + i.qty, 0),
        lastContact: 'Just now',
        joined: new Date().toISOString().slice(0, 10),
      }]);
      notify('New boutique client', `${order.name} (${order.city}) joined via the boutique`, 'client');
    }

    // 2. open a commission for the order
    const first = items[0];
    const nameStr = items.length > 1 ? `${first.product.name} +${items.length - 1}` : first.product.name;
    const newCommission: Commission = {
      id: uid('cm'),
      title: `Boutique Acquisition — ${nameStr}`,
      description: `Online boutique order for ${order.name} (${order.city}). Contents: ${items.map((i) => `${i.qty} × ${i.product.name}`).join(', ')}. Concierge contact: ${order.email}.`,
      client: order.name,
      atelier: `${ateliers[0].name}, ${ateliers[0].city}`,
      category: first.product.category,
      status: 'sketch',
      priority: 'urgent',
      value: total,
      due: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      artisan: 'HO',
      image: first.product.image,
      delivered: false,
    };
    setCommissions((prev) => [...prev, newCommission]);
    notify('Boutique acquisition', `$${total.toLocaleString()} order for “${nameStr}” opened as commission`, 'commission');
    toast(`Acquisition recorded — follow it in the Maison Console`, 'info');
  }, [clients, ateliers, notify, toast]);

  // ---------- commissions ----------
  const addCommission = useCallback((c: Commission) => {
    setCommissions((prev) => [...prev, c]);
    notify('Commission opened', `"${c.title}" opened at ${c.atelier}`, 'commission');
  }, [notify]);
  const updateCommissions = useCallback((next: Commission[]) => setCommissions(next), []);
  const deleteCommission = useCallback((id: string) => {
    setCommissions((prev) => prev.filter((c) => c.id !== id));
  }, []);
  const toggleCommission = useCallback((id: string) => {
    setCommissions((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const delivered = !c.delivered;
      return { ...c, delivered, status: delivered ? 'delivered' : 'sketch' };
    }));
  }, []);

  // ---------- artisans ----------
  const addArtisan = useCallback((a: Artisan) => {
    setArtisans((prev) => [...prev, a]);
    notify('Artisan key sent', `${a.name} was invited to join the maison`, 'atelier');
  }, [notify]);
  const removeArtisan = useCallback((id: string) => {
    setArtisans((prev) => prev.filter((a) => a.id !== id));
  }, []);
  const changeArtisanStatus = useCallback((id: string, status: Artisan['status']) => {
    setArtisans((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  // ---------- clients ----------
  const addClient = useCallback((c: Client) => {
    setClients((prev) => [...prev, c]);
    notify('Client registered', `${c.name} joined the house registry`, 'client');
  }, [notify]);
  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);
  const changeClientStatus = useCallback((id: string, status: Client['status']) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  // ---------- billing ----------
  const addInvoice = useCallback((inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);
    notify('Invoice generated', `${inv.id} — $${inv.amount} (${inv.plan})`, 'billing');
  }, [notify]);

  // ---------- notifications ----------
  const markAllRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);
  const markRead = useCallback((id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))), []);
  const clearNotifications = useCallback(() => setNotifications([]), []);

  // ---------- settings ----------
  const updateUser = useCallback((u: User) => setUser(u), []);
  const resetData = useCallback(() => {
    setCommissions(seedCommissions);
    setArtisans(seedArtisans);
    setClients(seedClients);
    setInvoices(seedInvoices);
    setNotifications(seedNotifications);
    setPlan(plans[1]);
  }, []);

  const exportData = useCallback(() => {
    const payload = { exportedAt: new Date().toISOString(), user, plan: plan.name, commissions, clients, artisans, invoices };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumiere-maison-ledger.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [user, plan, commissions, clients, artisans, invoices]);

  const openCount = commissions.filter((c) => !c.delivered).length;

  // ================= RENDER =================
  // ---- 1. PUBLIC WEBSITE ----
  if (mode === 'site') {
    return (
      <>
        <SiteApp onOpenConsole={openConsole} onAcquire={handleSiteAcquire} toast={toast} />
        <Toasts toasts={toasts} />
      </>
    );
  }

  // ---- 2. LOGIN GATE ----
  if (mode === 'login') {
    return <LoginPage onLogin={handleLogin} onBackToSite={() => setMode('site')} />;
  }

  // ---- 3. MAISON CONSOLE ----
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard user={user!} commissions={commissions} artisans={artisans} clients={clients} ateliers={ateliers} onNavigate={setView} />;
      case 'commissions':
        return <Commissions commissions={commissions} ateliers={ateliers} artisans={artisans} onUpdateAll={updateCommissions} onAdd={addCommission} onDelete={deleteCommission} toast={toast} />;
      case 'assignments':
        return <Assignments commissions={commissions} onToggle={toggleCommission} />;
      case 'clients':
        return <Clients clients={clients} onAdd={addClient} onDelete={deleteClient} onStatusChange={changeClientStatus} toast={toast} />;
      case 'artisans':
        return <Artisans artisans={artisans} onAdd={addArtisan} onRemove={removeArtisan} onStatusChange={changeArtisanStatus} toast={toast} />;
      case 'analytics':
        return <Analytics clients={clients} />;
      case 'billing':
        return <Billing plan={plan} onChangePlan={setPlan} invoices={invoices} onAddInvoice={addInvoice} artisans={artisans} toast={toast} />;
      case 'assistant':
        return <MaisonAI commissions={commissions} clients={clients} artisans={artisans} user={user!} planName={plan.name} />;
      case 'settings':
        return <Settings user={user!} onUpdateUser={updateUser} onResetData={resetData} onLogout={handleLogout} toast={toast} exportData={exportData} />;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-body">
      {/* sidebar — desktop */}
      <div className="hidden lg:block">
        <Sidebar view={view} onNavigate={setView} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} plan={plan} openCount={openCount} />
      </div>

      {/* sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm anim-fade-in" />
          <div className="absolute left-0 top-0 h-full w-64 anim-drawer-in" onClick={(e) => e.stopPropagation()}>
            <Sidebar view={view} onNavigate={(v) => { setView(v); setMobileOpen(false); }} collapsed={false} onToggle={() => setMobileOpen(false)} plan={plan} openCount={openCount} />
          </div>
        </div>
      )}

      {/* main */}
      <div className={`transition-all duration-300 min-h-screen ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}`}>
        <Topbar
          view={view}
          user={user!}
          onViewSite={() => setMode('site')}
          notifications={notifications}
          onMarkAllRead={markAllRead}
          onMarkRead={markRead}
          onClearNotifications={clearNotifications}
          onNavigate={setView}
          onLogout={handleLogout}
          commissions={commissions}
          clients={clients}
          artisans={artisans}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
          {renderView()}
        </main>
      </div>

      <Toasts toasts={toasts} />
    </div>
  );
}
