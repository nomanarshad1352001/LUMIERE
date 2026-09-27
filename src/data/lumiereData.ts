// ============ LUMIÈRE MAISON OS — DUMMY DATA (no backend) ============

export type View = 'dashboard' | 'commissions' | 'assignments' | 'clients' | 'artisans' | 'analytics' | 'billing' | 'assistant' | 'settings';

export interface User { name: string; email: string; maison: string; role: string }

// ---------- COMMISSIONS (bespoke pieces in production) ----------
export type CommStatus = 'sketch' | 'crafting' | 'finishing' | 'delivered';
export type PieceCategory = 'Rings' | 'Necklaces' | 'Watches' | 'Earrings' | 'Fragrance';

export interface Commission {
  id: string;
  title: string;
  description: string;
  client: string;
  atelier: string;
  category: PieceCategory;
  status: CommStatus;
  priority: 'standard' | 'urgent' | 'royal';
  value: number;
  due: string; // ISO date
  artisan: string; // initials
  image: string;
  delivered: boolean;
}

// ---------- ARTISANS ----------
export interface Artisan {
  id: string;
  name: string;
  speciality: string;
  email: string;
  initials: string;
  color: string;
  status: 'at bench' | 'viewing' | 'offline';
  activePieces: number;
}

// ---------- ATELIERS ----------
export interface Atelier {
  id: string;
  name: string;
  city: string;
  color: string;
  craftspeople: number;
}

// ---------- PRIVATE CLIENTS ----------
export type ClientTier = 'Patron' | 'Collector' | 'Member' | 'Prospect';
export type ClientStatus = 'active' | 'viewing-booked' | 'dormant' | 'past-due';

export interface Client {
  id: string;
  name: string;
  email: string;
  city: string;
  tier: ClientTier;
  status: ClientStatus;
  lifetimeValue: number;
  pieces: number;
  lastContact: string;
  joined: string;
}

// ---------- BILLING ----------
export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
}

export interface Plan {
  name: string;
  priceM: number;
  priceY: number;
  seats: number;
  tagline: string;
  features: string[];
  highlight?: boolean;
}

// ---------- NOTIFICATIONS ----------
export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  type: 'commission' | 'client' | 'billing' | 'system' | 'atelier';
}

// ---------- IMAGE LIBRARY (Pexels) ----------
export const IMG = {
  ringSolitaire: 'https://images.pexels.com/photos/30541171/pexels-photo-30541171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ringRoseGold: 'https://images.pexels.com/photos/17068457/pexels-photo-17068457.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ringBox: 'https://images.pexels.com/photos/19525067/pexels-photo-19525067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ringDuo: 'https://images.pexels.com/photos/12427696/pexels-photo-12427696.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ringModern: 'https://images.pexels.com/photos/30541177/pexels-photo-30541177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  neckEmerald: 'https://images.pexels.com/photos/32988525/pexels-photo-32988525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  neckEmerald2: 'https://images.pexels.com/photos/32988539/pexels-photo-32988539.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  neckDiamond: 'https://images.pexels.com/photos/19820886/pexels-photo-19820886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  neckDark: 'https://images.pexels.com/photos/32988530/pexels-photo-32988530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  watchGold: 'https://images.pexels.com/photos/28135838/pexels-photo-28135838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  watchFabric: 'https://images.pexels.com/photos/36475261/pexels-photo-36475261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  watchRock: 'https://images.pexels.com/photos/10436602/pexels-photo-10436602.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  watchRose: 'https://images.pexels.com/photos/19810831/pexels-photo-19810831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  earSnake: 'https://images.pexels.com/photos/15743962/pexels-photo-15743962.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  earSun: 'https://images.pexels.com/photos/34372558/pexels-photo-34372558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  earPearl: 'https://images.pexels.com/photos/34372563/pexels-photo-34372563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  earModel: 'https://images.pexels.com/photos/15785485/pexels-photo-15785485.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  perfumeNoir: 'https://images.pexels.com/photos/36834015/pexels-photo-36834015.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  modelPearl: 'https://images.pexels.com/photos/9429429/pexels-photo-9429429.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  heroLogin: 'https://images.pexels.com/photos/32988530/pexels-photo-32988530.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1600',
};

// ---------- AUTH ----------
export const DEMO_CREDS = {
  email: 'guest@lumiere.com',
  password: 'lumiere2024',
  name: 'Alexandra Laurent',
  maison: 'Maison Lumière',
  role: 'Directrice de Maison',
};

// ---------- ATELIERS ----------
export const seedAteliers: Atelier[] = [
  { id: 'at-1', name: 'Place Vendôme', city: 'Paris', color: '#d4af6a', craftspeople: 18 },
  { id: 'at-2', name: 'Rue du Rhône', city: 'Genève', color: '#a5b4fc', craftspeople: 12 },
  { id: 'at-3', name: 'Via Montenapoleone', city: 'Milano', color: '#e8a5b7', craftspeople: 9 },
  { id: 'at-4', name: 'Ginza', city: 'Tokyo', color: '#7dd3fc', craftspeople: 7 },
];

// ---------- ARTISANS ----------
export const seedArtisans: Artisan[] = [
  { id: 'ar-1', name: 'Alexandra Laurent', speciality: 'Directrice de Maison', email: 'alexandra@lumiere.com', initials: 'AL', color: 'bg-amber-500', status: 'viewing', activePieces: 2 },
  { id: 'ar-2', name: 'Mathias Dubois', speciality: 'Master Jeweler', email: 'mathias@lumiere.com', initials: 'MD', color: 'bg-violet-500', status: 'at bench', activePieces: 4 },
  { id: 'ar-3', name: 'Yuki Tanaka', speciality: 'Master Gemologist', email: 'yuki@lumiere.com', initials: 'YT', color: 'bg-sky-500', status: 'at bench', activePieces: 3 },
  { id: 'ar-4', name: 'Elise Fontaine', speciality: 'Stone Setter', email: 'elise@lumiere.com', initials: 'EF', color: 'bg-rose-500', status: 'at bench', activePieces: 5 },
  { id: 'ar-5', name: 'Marco Bellini', speciality: 'Master Horologist', email: 'marco@lumiere.com', initials: 'MB', color: 'bg-emerald-500', status: 'offline', activePieces: 2 },
  { id: 'ar-6', name: 'Claire Dubonnet', speciality: 'Engraver & Polisher', email: 'claire@lumiere.com', initials: 'CD', color: 'bg-cyan-500', status: 'at bench', activePieces: 3 },
  { id: 'ar-7', name: 'Henrik Olsen', speciality: 'Concierge Director', email: 'henrik@lumiere.com', initials: 'HO', color: 'bg-indigo-500', status: 'viewing', activePieces: 1 },
  { id: 'ar-8', name: 'Amira Saadi', speciality: 'Archive & Provenance', email: 'amira@lumiere.com', initials: 'AS', color: 'bg-fuchsia-500', status: 'offline', activePieces: 1 },
];

// ---------- COMMISSIONS ----------
export const seedCommissions: Commission[] = [
  { id: 'cm-1', title: 'Éternelle Royale — Emerald Tiara', description: 'Colombian emerald tiara commission for the House of Moreau gala. 43 stones, platinum lattice.', client: 'House of Moreau', atelier: 'Place Vendôme, Paris', category: 'Necklaces', status: 'crafting', priority: 'royal', value: 184000, due: '2025-07-12', artisan: 'MD', image: IMG.neckEmerald, delivered: false },
  { id: 'cm-2', title: 'Céleste No. 26 of 50', description: 'Numbered edition chronograph — hand-finished movement, obsidian dial, for Mr. Vale', client: 'Adrian Vale', atelier: 'Rue du Rhône, Genève', category: 'Watches', status: 'finishing', priority: 'urgent', value: 49500, due: '2025-06-30', artisan: 'MB', image: IMG.watchGold, delivered: false },
  { id: 'cm-3', title: 'Bespoke Solitaire — House of Al-Farsi', description: '4.2ct D-flawless oval diamond on knife-edge gold band. Family crest engraving inside.', client: 'Noor Al-Farsi', atelier: 'Place Vendôme, Paris', category: 'Rings', status: 'crafting', priority: 'urgent', value: 96000, due: '2025-07-05', artisan: 'EF', image: IMG.ringSolitaire, delivered: false },
  { id: 'cm-4', title: 'Serpent d\'Or — Anniversary Pair', description: 'Matching serpent hoops for the Cheong anniversary — ruby eyes, hand-sculpted scales.', client: 'Mei-Lin Cheong', atelier: 'Ginza, Tokyo', category: 'Earrings', status: 'sketch', priority: 'standard', value: 12800, due: '2025-08-02', artisan: 'YT', image: IMG.earSnake, delivered: false },
  { id: 'cm-5', title: 'Verdant Empress Remount', description: 'Re-polish and re-mount of the Verdant Empress necklace — Patron care program.', client: 'Isabelle Moreau', atelier: 'Place Vendôme, Paris', category: 'Necklaces', status: 'finishing', priority: 'standard', value: 0, due: '2025-06-27', artisan: 'CD', image: IMG.neckEmerald2, delivered: false },
  { id: 'cm-6', title: 'Heritage Rose Gold Nº 9', description: 'Rose gold automatic with sapphire case-back. Delivery via armored courier to Singapore.', client: 'Marcus Lee', atelier: 'Rue du Rhône, Genève', category: 'Watches', status: 'sketch', priority: 'standard', value: 31200, due: '2025-07-20', artisan: 'MB', image: IMG.watchRose, delivered: false },
  { id: 'cm-7', title: 'Promesse Wedding Set', description: 'Twin rose-gold bands with micro pavé — Reyes-Alvarez wedding in Milan, September.', client: 'Sofia Reyes-Alvarez', atelier: 'Via Montenapoleone, Milano', category: 'Rings', status: 'crafting', priority: 'standard', value: 18400, due: '2025-07-28', artisan: 'MD', image: IMG.ringRoseGold, delivered: false },
  { id: 'cm-8', title: 'Lumière Cascade Restoration', description: 'Archive restoration: 1927 art-deco diamond cascade necklace. Provenance review required.', client: 'Private Archive', atelier: 'Place Vendôme, Paris', category: 'Necklaces', status: 'sketch', priority: 'royal', value: 0, due: '2025-08-15', artisan: 'AS', image: IMG.neckDiamond, delivered: false },
  { id: 'cm-9', title: 'Aurum Sun Drops — Bridal Suite', description: 'Complete bridal earring suite — sun drops, pearl studs, and hair pins.', client: 'Grace Kim', atelier: 'Ginza, Tokyo', category: 'Earrings', status: 'delivered', priority: 'standard', value: 9400, due: '2025-06-18', artisan: 'CD', image: IMG.earSun, delivered: true },
  { id: 'cm-10', title: 'Noir Absolu Bespoke Flacon', description: 'Hand-blown crystal flacon with gold thread, engraved monogram — Kimura commission.', client: 'Ren Kimura', atelier: 'Ginza, Tokyo', category: 'Fragrance', status: 'finishing', priority: 'urgent', value: 7900, due: '2025-06-25', artisan: 'YT', image: IMG.perfumeNoir, delivered: false },
  { id: 'cm-11', title: 'Obsidian Automatic Nº 14', description: 'Matte black dial, gold bezel — reserved for Patron tier. Quality inspection pending.', client: 'Victor Hugo', atelier: 'Rue du Rhône, Genève', category: 'Watches', status: 'crafting', priority: 'urgent', value: 53800, due: '2025-07-08', artisan: 'MB', image: IMG.watchRock, delivered: false },
  { id: 'cm-12', title: 'Rosé Blanche Vow Renewal', description: 'Restack and re-rhodium of Rosé Blanche set for the Petrova vow renewal — gift service.', client: 'Anna Petrova', atelier: 'Via Montenapoleone, Milano', category: 'Rings', status: 'delivered', priority: 'standard', value: 3600, due: '2025-06-10', artisan: 'EF', image: IMG.ringDuo, delivered: true },
];

// ---------- CLIENTS ----------
export const seedClients: Client[] = [
  { id: 'cl-1', name: 'Isabelle Moreau', email: 'i.moreau@maison-moreau.fr', city: 'Paris', tier: 'Patron', status: 'active', lifetimeValue: 486000, pieces: 14, lastContact: '2 days ago', joined: '2016-03-11' },
  { id: 'cl-2', name: 'Adrian Vale', email: 'a.vale@valeholdings.ch', city: 'Geneva', tier: 'Patron', status: 'viewing-booked', lifetimeValue: 392000, pieces: 9, lastContact: '1 week ago', joined: '2018-07-02' },
  { id: 'cl-3', name: 'Noor Al-Farsi', email: 'noor@alfarsi.ae', city: 'Dubai', tier: 'Patron', status: 'active', lifetimeValue: 540000, pieces: 11, lastContact: 'Yesterday', joined: '2015-11-20' },
  { id: 'cl-4', name: 'Mei-Lin Cheong', email: 'meilin@cheong.sg', city: 'Singapore', tier: 'Collector', status: 'viewing-booked', lifetimeValue: 214000, pieces: 7, lastContact: '3 days ago', joined: '2019-05-16' },
  { id: 'cl-5', name: 'Sofia Reyes-Alvarez', email: 'sofia@reyes.it', city: 'Milan', tier: 'Collector', status: 'active', lifetimeValue: 168000, pieces: 6, lastContact: '5 days ago', joined: '2020-02-14' },
  { id: 'cl-6', name: 'Marcus Lee', email: 'm.lee@brightagency.co', city: 'London', tier: 'Member', status: 'past-due', lifetimeValue: 41800, pieces: 2, lastContact: '3 weeks ago', joined: '2022-09-01' },
  { id: 'cl-7', name: 'Anna Petrova', email: 'anna@cloudnine.dev', city: 'Zurich', tier: 'Member', status: 'active', lifetimeValue: 36500, pieces: 3, lastContact: '1 week ago', joined: '2021-06-22' },
  { id: 'cl-8', name: 'Victor Hugo', email: 'victor@lexalytics.ai', city: 'New York', tier: 'Patron', status: 'active', lifetimeValue: 455000, pieces: 8, lastContact: '4 days ago', joined: '2017-01-30' },
  { id: 'cl-9', name: 'Ren Kimura', email: 'ren@kimura.jp', city: 'Tokyo', tier: 'Collector', status: 'viewing-booked', lifetimeValue: 182000, pieces: 5, lastContact: '2 days ago', joined: '2019-10-08' },
  { id: 'cl-10', name: 'Grace Kim', email: 'grace@urbanfork.com', city: 'Seoul', tier: 'Member', status: 'active', lifetimeValue: 52900, pieces: 4, lastContact: '6 days ago', joined: '2022-03-19' },
  { id: 'cl-11', name: 'Paul Adeyemi', email: 'paul@learnloop.app', city: 'Lagos', tier: 'Prospect', status: 'dormant', lifetimeValue: 0, pieces: 0, lastContact: '2 months ago', joined: '2024-11-05' },
  { id: 'cl-12', name: 'Julia Brandt', email: 'julia@trendhaus.de', city: 'Munich', tier: 'Collector', status: 'active', lifetimeValue: 156000, pieces: 5, lastContact: '1 week ago', joined: '2020-08-12' },
  { id: 'cl-13', name: 'Omar Farouk', email: 'omar@saharatravel.com', city: 'Cairo', tier: 'Prospect', status: 'dormant', lifetimeValue: 0, pieces: 0, lastContact: '6 weeks ago', joined: '2025-02-10' },
  { id: 'cl-14', name: 'Kate Sullivan', email: 'kate@bloomretail.com', city: 'Sydney', tier: 'Member', status: 'active', lifetimeValue: 61200, pieces: 3, lastContact: '4 days ago', joined: '2021-12-03' },
  { id: 'cl-15', name: 'Nina Kowalski', email: 'nina@greentech.eco', city: 'Stockholm', tier: 'Patron', status: 'active', lifetimeValue: 398000, pieces: 10, lastContact: 'Yesterday', joined: '2016-12-04' },
  { id: 'cl-16', name: 'Dana Weiss', email: 'dana@orbitspace.co', city: 'Tel Aviv', tier: 'Member', status: 'past-due', lifetimeValue: 28400, pieces: 1, lastContact: '1 month ago', joined: '2023-04-12' },
];

// ---------- INVOICES (Maison OS subscription) ----------
export const seedInvoices: Invoice[] = [
  { id: 'LUM-2041', date: '2025-06-01', amount: 189, status: 'paid', plan: 'Maison — Monthly' },
  { id: 'LUM-2020', date: '2025-05-01', amount: 189, status: 'paid', plan: 'Maison — Monthly' },
  { id: 'LUM-1998', date: '2025-04-01', amount: 189, status: 'paid', plan: 'Maison — Monthly' },
  { id: 'LUM-1977', date: '2025-03-01', amount: 189, status: 'paid', plan: 'Maison — Monthly' },
  { id: 'LUM-1959', date: '2025-02-01', amount: 171, status: 'paid', plan: 'Atelier — Monthly' },
  { id: 'LUM-1944', date: '2025-01-01', amount: 189, status: 'failed', plan: 'Maison — Monthly' },
];

// ---------- PLANS ----------
export const plans: Plan[] = [
  {
    name: 'Boutique', priceM: 0, priceY: 0, seats: 3, tagline: 'For a single storefront atelier',
    features: ['3 artisan seats', '1 atelier workspace', 'Client registry', 'Basic revenue view'],
  },
  {
    name: 'Maison', priceM: 189, priceY: 1890, seats: 15, tagline: 'For an established maison',
    features: ['15 artisan seats', '4 atelier workspaces', 'Commission board', 'Private client CRM', 'Maison AI (1k msgs/mo)', 'Provenance ledger'],
    highlight: true,
  },
  {
    name: 'Haute Maison', priceM: 389, priceY: 3890, seats: 50, tagline: 'For multi-city houses',
    features: ['50 artisan seats', 'Unlimited workspaces', 'Everything in Maison', 'Maison AI unlimited', 'Concierge scheduling', 'Analytics suite'],
  },
  {
    name: 'Grand Maison', priceM: 990, priceY: 9900, seats: 999, tagline: 'For heritage maisons at scale',
    features: ['Unlimited seats', 'Everything in Haute', 'Private cloud vault', 'Signature support 24/7', 'On-site training', 'Custom integrations'],
  },
];

// ---------- NOTIFICATIONS ----------
export const seedNotifications: AppNotification[] = [
  { id: 'nt-1', title: 'Royal commission updated', detail: 'Éternelle Royale tiara moved to Crafting by Mathias', time: '25 min ago', read: false, type: 'commission' },
  { id: 'nt-2', title: 'Patron viewing booked', detail: 'Adrian Vale confirmed a private viewing for Friday, 3 PM', time: '1 hr ago', read: false, type: 'client' },
  { id: 'nt-3', title: 'Subscription invoice paid', detail: 'LUM-2041 — $189.00 settled successfully', time: '3 hrs ago', read: false, type: 'billing' },
  { id: 'nt-4', title: 'Gem shipment arrived', detail: 'Colombian emeralds cleared customs — Place Vendôme vault', time: '5 hrs ago', read: true, type: 'atelier' },
  { id: 'nt-5', title: 'Concierge note', detail: 'Noor Al-Farsi requested champagne service for her viewing', time: '1 day ago', read: true, type: 'client' },
  { id: 'nt-6', title: 'Weekly digest ready', detail: 'Maison performance digest is ready to review', time: '2 days ago', read: true, type: 'system' },
];

// ---------- ANALYTICS SERIES ----------
export const salesSeries: Record<string, { label: string; sales: number; viewings: number }[]> = {
  '7D': [
    { label: 'Mon', sales: 98400, viewings: 6 }, { label: 'Tue', sales: 121300, viewings: 8 },
    { label: 'Wed', sales: 87200, viewings: 5 }, { label: 'Thu', sales: 156800, viewings: 9 },
    { label: 'Fri', sales: 184500, viewings: 11 }, { label: 'Sat', sales: 132400, viewings: 7 },
    { label: 'Sun', sales: 64200, viewings: 3 },
  ],
  '30D': [
    { label: 'W1', sales: 612000, viewings: 34 }, { label: 'W2', sales: 748000, viewings: 41 },
    { label: 'W3', sales: 693000, viewings: 38 }, { label: 'W4', sales: 84400 + 602000, viewings: 45 },
  ],
  '12M': [
    { label: 'Jul', sales: 1180000, viewings: 122 }, { label: 'Aug', sales: 1290000, viewings: 128 },
    { label: 'Sep', sales: 1410000, viewings: 136 }, { label: 'Oct', sales: 1540000, viewings: 145 },
    { label: 'Nov', sales: 1480000, viewings: 140 }, { label: 'Dec', sales: 1890000, viewings: 162 },
    { label: 'Jan', sales: 1320000, viewings: 118 }, { label: 'Feb', sales: 1440000, viewings: 126 },
    { label: 'Mar', sales: 1520000, viewings: 133 }, { label: 'Apr', sales: 1610000, viewings: 139 },
    { label: 'May', sales: 1730000, viewings: 148 }, { label: 'Jun', sales: 1860000, viewings: 155 },
  ],
};

export const categorySales = [
  { name: 'Rings', value: 38 },
  { name: 'Necklaces', value: 26 },
  { name: 'Watches', value: 22 },
  { name: 'Earrings', value: 9 },
  { name: 'Fragrance', value: 5 },
];

export const channelData = [
  { channel: 'Boutique', value: 62 },
  { channel: 'Viewing', value: 28 },
  { channel: 'Referral', value: 18 },
  { channel: 'Gala', value: 12 },
  { channel: 'Online', value: 9 },
];

export const funnelData = [
  { stage: 'Inquiries', value: 148 },
  { stage: 'Private Viewings', value: 62 },
  { stage: 'Commissions', value: 31 },
  { stage: 'Delivered', value: 18 },
];

export const activitySeed = [
  { id: 'ac-1', who: 'Mathias Dubois', avatar: 'MD', color: 'bg-violet-500', what: 'set the 43rd emerald in the Moreau tiara', time: '18 min ago' },
  { id: 'ac-2', who: 'Elise Fontaine', avatar: 'EF', color: 'bg-rose-500', what: 'completed the pavé setting on the Al-Farsi solitaire', time: '46 min ago' },
  { id: 'ac-3', who: 'Henrik Olsen', avatar: 'HO', color: 'bg-indigo-500', what: 'arranged a private viewing for Adrian Vale', time: '2 hrs ago' },
  { id: 'ac-4', who: 'Yuki Tanaka', avatar: 'YT', color: 'bg-sky-500', what: 'certified the ruby eyes batch (Tokyo)', time: '3 hrs ago' },
  { id: 'ac-5', who: 'Claire Dubonnet', avatar: 'CD', color: 'bg-cyan-500', what: 'delivered the Aurum bridal suite to Seoul', time: 'yesterday' },
  { id: 'ac-6', who: 'Amira Saadi', avatar: 'AS', color: 'bg-fuchsia-500', what: 'filed provenance for the 1927 cascade restoration', time: 'yesterday' },
];

// ---------- META ----------
export const COMM_STAGES: { id: CommStatus; label: string; dot: string }[] = [
  { id: 'sketch', label: 'Sketch & Estimate', dot: 'bg-pewter' },
  { id: 'crafting', label: 'Crafting', dot: 'bg-champagne' },
  { id: 'finishing', label: 'Finishing & QA', dot: 'bg-amber-400' },
  { id: 'delivered', label: 'Delivered', dot: 'bg-emerald-500' },
];

export const PRIORITY_STYLE: Record<Commission['priority'], { label: string; cls: string }> = {
  royal: { label: 'Royal', cls: 'bg-champagne/15 text-champagne border border-champagne/40' },
  urgent: { label: 'Urgent', cls: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
  standard: { label: 'Standard', cls: 'bg-smoke text-linen border border-smoke' },
};

export const CATEGORY_IMAGES: Record<PieceCategory, string> = {
  Rings: IMG.ringSolitaire,
  Necklaces: IMG.neckEmerald,
  Watches: IMG.watchGold,
  Earrings: IMG.earSnake,
  Fragrance: IMG.perfumeNoir,
};

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const fmtMoney = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
