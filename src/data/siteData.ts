// ============ LUMIÈRE PUBLIC BOUTIQUE — DUMMY CATALOG ============
import { IMG, PieceCategory } from './lumiereData';

export interface SiteProduct {
  id: string;
  name: string;
  category: PieceCategory;
  price: number;
  image: string;
  description: string;
  material?: string;
  badge?: 'New' | 'Iconic' | 'Limited' | 'Bestseller';
  rating: number;
}

export const products: SiteProduct[] = [
  { id: 'p1', name: 'Éternelle Royale', category: 'Rings', price: 12400, image: IMG.ringSolitaire, description: 'An 18k gold solitaire crowned with a 2.4ct brilliant-cut diamond, hand-set in Parisian ateliers.', material: '18K Yellow Gold · Diamond 2.4ct', rating: 5, badge: 'Iconic' },
  { id: 'p2', name: 'Verdant Empress', category: 'Necklaces', price: 28900, image: IMG.neckEmerald, description: 'Colombian emeralds cascading through a lattice of pavé diamonds — worn once, remembered forever.', material: '18K Gold · Emerald & Diamond', rating: 5, badge: 'Limited' },
  { id: 'p3', name: 'Céleste Chronograph', category: 'Watches', price: 18750, image: IMG.watchGold, description: 'A masterpiece of horology — gold case, obsidian dial, movement finished by hand over six months.', material: '18K Gold', rating: 5, badge: 'Bestseller' },
  { id: 'p4', name: "Serpent d'Or Hoops", category: 'Earrings', price: 4200, image: IMG.earSnake, description: 'Hand-sculpted serpent hoops in polished gold — an homage to eternal renewal and quiet power.', material: '18K Gold', rating: 4.8 },
  { id: 'p5', name: 'Lumière Diamond Cascade', category: 'Necklaces', price: 34500, image: IMG.neckDiamond, description: 'A river of 210 round-cut diamonds flowing in perfect symmetry around the collarbone.', material: 'Platinum · Diamond 18.6ct', rating: 5, badge: 'New' },
  { id: 'p6', name: 'Obsidian Automatic', category: 'Watches', price: 14200, image: IMG.watchRock, description: 'Matte black dial encircled by a gold bezel — engineered for those who arrive first.', material: 'Gold & Sapphire', rating: 4.9 },
  { id: 'p7', name: 'Rosé Blanche Bands', category: 'Rings', price: 6900, image: IMG.ringRoseGold, description: 'Twin rose-gold bands pavé-set with micro diamonds — engagement and eternity in one gesture.', material: '18K Rose Gold · Diamond 1.2ct', rating: 4.9, badge: 'Bestseller' },
  { id: 'p8', name: 'Aurum Sun Drops', category: 'Earrings', price: 3850, image: IMG.earSun, description: 'Sunburst pendants catching light with every turn, suspended from hand-forged gold hoops.', material: '18K Gold', rating: 4.7 },
  { id: 'p9', name: 'Noir Absolu Parfum', category: 'Fragrance', price: 890, image: IMG.perfumeNoir, description: 'Black oud, Bulgarian rose, and smoked amber in a hand-blown crystal flacon.', material: 'Crystal Flacon 100ml', rating: 4.8, badge: 'New' },
  { id: 'p10', name: 'Heritage Rose Gold', category: 'Watches', price: 16900, image: IMG.watchRose, description: 'Rose gold case with an in-house automatic calibre — 72-hour reserve through sapphire.', material: '18K Rose Gold', rating: 4.9 },
  { id: 'p11', name: "Jardin d'Émeraude", category: 'Necklaces', price: 31200, image: IMG.neckEmerald2, description: 'An emerald garden suspended in gold — stones matched over two years of selection.', material: '18K Gold · Emerald 12.4ct', rating: 5, badge: 'Limited' },
  { id: 'p12', name: 'Promesse Solitaire', category: 'Rings', price: 9800, image: IMG.ringBox, description: 'A whisper of a promise — brilliant diamond rising from a knife-edge band, boxed in ebony.', material: '18K Gold · Diamond 1.8ct', rating: 4.8 },
];

export const collections = [
  { id: 'c1', name: 'High Jewelry Rings', tagline: 'Promises cast in gold and light', image: IMG.ringSolitaire, filter: 'Rings' as PieceCategory, items: 24 },
  { id: 'c2', name: 'Emerald Ode', tagline: 'The deepest green this side of paradise', image: IMG.neckEmerald, filter: 'Necklaces' as PieceCategory, items: 18 },
  { id: 'c3', name: 'Horology Masters', tagline: 'Time, measured in perfection', image: IMG.watchGold, filter: 'Watches' as PieceCategory, items: 12 },
  { id: 'c4', name: 'Golden Atelier', tagline: 'Sculpted earrings from the archive', image: IMG.earSnake, filter: 'Earrings' as PieceCategory, items: 30 },
];

export const gallery = [
  { id: 'g1', image: IMG.modelPearl, title: 'Pearl Reverie', h: 440 },
  { id: 'g2', image: IMG.ringDuo, title: 'Twin Vows', h: 280 },
  { id: 'g3', image: IMG.watchRose, title: 'Golden Hour', h: 320 },
  { id: 'g4', image: IMG.earModel, title: 'The Serpent Portrait', h: 440 },
  { id: 'g5', image: IMG.neckDark, title: 'Obsidian Light', h: 280 },
  { id: 'g6', image: IMG.watchFabric, title: 'Woven Hours', h: 320 },
  { id: 'g7', image: IMG.ringBox, title: 'The Yes Box', h: 360 },
  { id: 'g8', image: IMG.earPearl, title: 'Moonwater', h: 320 },
];

export const testimonials = [
  { id: 't1', name: 'Isabelle Moreau', title: 'Art Collector, Paris', quote: 'The Verdant Empress arrived in an ebony coffret lined with velvet. I have collected for twenty years — this is the first piece that made me hold my breath.', image: IMG.modelPearl },
  { id: 't2', name: 'Adrian Vale', title: 'Horology Enthusiast, Geneva', quote: 'I own pieces from maisons with three centuries of history. The Céleste stands beside them with absolute confidence.', image: IMG.watchGold },
  { id: 't3', name: 'Mei-Lin Cheong', title: 'Creative Director, Singapore', quote: 'From the private viewing to the hand-delivered unveiling, every touchpoint felt considered. Lumière understands that luxury is time and attention.', image: IMG.earModel },
  { id: 't4', name: 'Sofia Reyes-Alvarez', title: 'Philanthropist, Milan', quote: 'Their atelier resized my grandmother\'s setting into a modern masterpiece while preserving every original stone. Legacy, honored and reimagined.', image: IMG.neckEmerald2 },
];

export const heroSlides = [
  { id: 'h1', image: IMG.neckDark, kicker: 'Haute Joaillerie · Est. 1987', title: 'Where Light Becomes Legacy' },
  { id: 'h2', image: IMG.watchGold, kicker: 'Horology · Hand-Finished', title: 'Time, Perfected by Hand' },
  { id: 'h3', image: IMG.ringSolitaire, kicker: 'The Bridal Atelier', title: 'Promises in Gold & Diamond' },
];

export const marqueeItems = [
  'Hand-Set Diamonds',
  'Certified Colombian Emeralds',
  'Swiss Haute Horlogerie',
  'Numbered Ateliers',
  'Lifetime Guarantee',
  'Conflict-Free Provenance',
  'Private Vault Delivery',
];

export const siteNavLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'The Boutique', href: '#shop' },
  { label: 'Maison', href: '#maison' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Voices', href: '#voices' },
  { label: 'Contact', href: '#contact' },
];

export const formatPrice = (n: number) => '$' + n.toLocaleString('en-US');
