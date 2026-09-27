# 💎 LUMIÈRE — Boutique & Maison OS
### *A Luxury Jewelry House, Fully Digitized.*

> **Project Title:** **LUMIÈRE Maison OS** — a dual-experience platform combining a cinematic public luxury boutique with a private, fully-working SaaS operating console for the maison itself.

---

## 📖 Overview

**LUMIÈRE** is a complete, production-grade digital ecosystem for a high-jewelry house (think *Cartier / Bvlgari / Van Cleef & Arpels*). It's not just a website, and it's not just an admin panel — it's **two connected products in one codebase**:

1. **The Public Boutique** — a cinematic, award-worthy public-facing jewelry e-commerce site where private clients browse collections, view pieces, build wishlists, and place acquisitions.
2. **The Maison Console** — a gated, login-protected internal SaaS application where the maison's team manages commissions, private clients, artisans, analytics, subscriptions, and an AI concierge.

Every acquisition placed on the website **automatically opens a commission** on the console's atelier board and **registers the client** in the house registry — proving the bridge between front-of-house commerce and back-of-house craft.

---

## 🎯 What This Platform Does

### 🌐 The Public Boutique (Client-Facing)
A luxury jewelry e-commerce experience where **any visitor** can:
- **Explore cinematic collections** — auto-rotating hero slideshow with Ken Burns animation on emerald jewelry photography
- **Browse 12 master craft pieces** — rings, necklaces, watches, earrings, fragrance — each with real jewelry photography, prices, materials, ratings
- **Filter & discover** — by collection or category (Rings / Necklaces / Watches / Earrings / Fragrance), with animated product grids
- **Quick View** any piece in a luxury modal (details, materials, provenance, delivery & insurance info)
- **Wishlist** pieces (heart toggles with toast feedback)
- **Add to Collection (cart)** — slide-in drawer with quantity controls, live totals
- **Checkout (Request Acquisition)** — enter name, private email, delivery city → order is placed with confirmation ceremony
- **Explore the Lookbook** — masonry gallery of editorial campaigns with full-screen lightbox navigation
- **Read Client Voices** — auto-playing testimonial carousel with pause-on-hover
- **Reach the concierge** — contact form, newsletter subscription, atelier cards
- **Enter the Maison Console** via prominent "Maison Console" bridges (navbar, hero, footer)

### 💎 The Maison Console (Team-Facing, Login-Gated)
A full operational SaaS where the **maison staff** can manage the entire business:

#### 🔐 Access & Security
- Cinematic animated login (gold particles, rotating ornament rings, typewriter autofill demo)
- Validated sign-in (email format, key strength) with loading ceremony + personalized welcome overlay
- Session persists across refreshes; **Sign Out returns to the boutique**
- Two-key (2FA) ceremony toggle, per-consoles sign-out, and maison key rotation with strength rules

#### 📊 Maison Dashboard
- Live KPI cards — monthly sales ($1.86M), active commissions, Patron count, pipeline value with animated sparklines
- Sales & private viewing charts (7D / 30D / 12M toggles) with duel-axis gold theme
- Production pipeline donut (by stage), upcoming deliveries with jewelry thumbnails & countdown badges
- Atelier activity feed, "Artisans at Bench" live presence, atelier roster
- Quick-launch Maison AI card and New Commission CTA

#### 🛠 Commissions (Production Kanban)
- **True drag & drop** jewelry pieces across **Sketch & Estimate → Crafting → Finishing & QA → Delivered**
- Rich cards: real jewelry photos, client, value ($k), priority (Royal 👑 / Urgent / Standard), delivery date, artisan avatar
- Filter by atelier (Paris / Genève / Milano / Tokyo), per-column add button
- **"Open Commission" modal** — create a piece with title, notes, client, atelier, category, artisan, priority, value, delivery date
- **Dossier modal** — view full piece dossier with image, stage mover (forward / back), meta grid, artisan card, "Mark Delivered" ceremony, archive action
- Everything persists — changes survive refresh and appear in dashboard, assignments, and AI

#### 📋 Assignments
- Full piece register with photos, values, priorities, delivery countdowns
- Filters: All / Royal / Urgent / Overdue / Delivered with live counts + search
- One-tap deliver / reopen toggles

#### 👑 Private Clients (CRM)
- Registry of the house's private clientele with **tier system** — **Patron 👑 / Collector / Member / Prospect**
- Sortable, searchable, paginated table (city, tier, status, lifetime value, since)
- **Register Client** modal with tier picker and validation
- Slide-in **Client Dossier** — lifetime value, pieces owned, concierge status control (active / viewing-booked / dormant / past-due), contact history
- **CSV export** of the registry
- New boutique purchases automatically create / enrich clients here

#### 🔨 Artisans
- The maison's hands: Master Jewelers, Gemologists, Horologists, Setters, Engravers, Archivists, Concierge
- Live presence (at bench / in a viewing / offline) with color-coded avatars
- Invite Artisan flow with "atelier key" invite validation

#### 📈 Maison Analytics
- KPIs: pieces delivered / viewings / viewing→commission rate / crafting time
- Sales trend line, registry tier donut, acquisition funnel (Inquiries → Viewings → Commissions → Delivered), channel bars (boutique/viewing/gala/referral/online), category share areas
- **Export Report** downloads a formatted maison summary

#### 💳 Subscription & Billing
- Maison OS plan management — **Boutique / Maison / Haute Maison / Grand Maison** with luxury pricing tiers
- Monthly ↔ Annual toggle (17% savings indicator), per-plan seat usage bars, feature lists
- **Plan switching generates real invoices** in the receipts table
- Payment method card (masked), update modal with auto-formatting (XXXX XXXX XXXX XXXX, MM/YY)
- Invoice detail modals + **downloadable invoice receipts**

#### ✨ Maison AI (Concierge Assistant)
- AI assistant grounded in the **live ledger** — never generic chat filler
- Answers ("How is the maison doing?", "Which pieces are at risk?", "Which clients need attention?", "Summarize atelier workload") using *actual* commissions, clients, and artisan data
- Can **draft a hand-written Patron follow-up letter** referencing real pieces & clients
- Quick prompt chips, bullet-dot typing indicator, source attribution badges, copy-to-clipboard, reset.chat

#### ⚙️ Settings & Vault
- Profile console, maison alert toggles (commission movement, viewings, clients, billing, digest, press)
- Appearance — Champagne / Ivory / Jade accent picker + density preference
- Security — "Rotate the maison key" (current/next/confirm validation), two-key ceremony toggle, sign-out of all consoles
- Data vault — **export the complete maison ledger as JSON**, one-click "Reset the maison" to restore dummy data

---

## 🔗 The Connected Layer (What Makes It Unique)

This is not two apps stitched together — it's one nervous system:

| Flow | What Happens |
|---|---|
| **Boutique visitor places an acquisition** | The order** automatically registers a private client** in the console CRM (or enriches lifetime value & pieces if returning) |
| **Same acquisition** | **Opens an urgent commission** on the atelier kanban board with the order details, value, client, and delivery window — visible in dashboard KPIs, assignments, and Maison AI |
| **Website → Console button** | If logged out → animated login. If logged in → skips login entirely and drops into the console |
| **Console → "The Boutique" button** | Jumps back to the public site (session preserved internally) |
| **Sign out** | Returns you gracefully to the boutique |
| **Reset the maison** | Both experiences restore their dummy datasets |

---

## 🛠 Tech Stack

### Core
| Technology | Version | Purpose |
|---|---|---|
| **React** | `19.2.6` | UI framework with concurrent features |
| **TypeScript** | `5.9.3` | Full type safety across all data models |
| **Vite** | `7.3.2` | Build tool + dev server with HMR |
| **Tailwind CSS** | `4.1.17` | Utility-first styling with custom luxury design tokens |
| **@tailwindcss/vite** | `4.1.17` | Tailwind V4 Vite integration |

### Libraries
| Library | Version | Purpose |
|---|---|---|
| **recharts** | `3.8.1` | All charts: area, line, bar, pie/donut, sparklines (dashboard + analytics) |
| **lucide-react** | `1.21.0` | Luxury-grade icon system (300+ icons used) |
| **clsx** | `2.1.1` + **tailwind-merge** | Conditional class composition utility |

### Tooling
| Tool | Version | Purpose |
|---|---|---|
| **vite-plugin-singlefile** | `2.3.0` | Packages the entire app into one deployable HTML file |
| **@vitejs/plugin-react** | `5.1.1` | React fast-refresh for Vite |
| **@types/react / @types/react-dom** | `19.2.x` | TypeScript definitions |

### Design System (custom-built in Tailwind)
- **Obsidian-black theme** with a champagne-gold accent palette (`obsidian`, `onyx`, `charcoal`, `smoke`, `champagne`, `gold`, `bronze`, `sand`, `ivory`, `cream`)
- **Typography:** *Cormorant Garamond* (display serif for luxury headlines) + *Jost* (geometric body font)
- **Custom animations:** Ken Burns hero zoom, gold particle drift, rotating ornament rings, shimmer gradient text, border gradient flow, stage fade/slide/scale reveals, scroll-triggered reveals via IntersectionObserver, marquee infinity scroll, toast slide-ins, playlist-level stagger delays
- **Luxury primitives:** glass-morphism panels, gradient-border cards, gold-ripple glows, animated gradient buttons, numbered kanban drop-target outlines

### Data Architecture (no backend required)
- **In-memory + localStorage persistence** ("the maison vault") — every task, client, artisan, commission, invoice, notification, and plan persists across refreshes
- **Seeded dummy dataset** of 12+ commissions (real jewelry photos from Pexels), 16 private clients, 8 artisans, 4 ateliers, invoices, notifications
- **Deterministic demo data** for analytics series (sales, viewings, funnel, channels)
- Full CRUD via useState + useCallback with type-safe models

---

## 👥 Who Will Buy This?

### 🎯 Primary Buyers
1. **Independent luxury maisons & jewelers** — small-to-mid-size high-end houses (5-50 artisans) who need a modern client-facing boutique + internal operations tool, without enterprise bloat
2. **High-end watch & jewelry retailers** — multi-city showrooms needing a private client registry, viewings coordination, and commissioned work tracking
3. **Luxury brand consultants & agencies** — firms that build digital experiences for luxury maison clients and want a ready-made, award-caliber template to customize

### 🎯 Secondary Buyers
4. **Private wealth / concierge services** needing white-glove CRM tooling
5. **Hotel & hospitality luxury groups** managing in-house boutique operations
6. **bootstrapped luxury startups** launching with a fraction of an enterprise budget

### Why They'll Buy
- **Zero backend infrastructure** — deploy as a single HTML file to any static host (Netlify, Vercel, S3, internal intranet)
- **No database or server costs** — the entire operational model runs client-side
- **Luxury-first design language** — competitors build dashboards; this is a *maison experience*
- **Fully working, not a prototype** — drag & drop, checkout, invoices, AI concierge, persistence, exports — it actually works out of the box
- **A provable story** — the website-to-console order pipeline demos to stakeholders in under a minute

---

## ✨ Signature Qualities

- 💎 **Luxury Obsidian Design** — cinematic dark theme, champagne-gold palette, serif display type
- 🎬 **Award-caliber animation** — Ken Burns hero, particle fields, ornament rings, staggered reveals, scroll-triggered entrances
- 🔐 **Login-gated playground** — cinematic auth with typewriter autofill demo
- 🛍 **True e-commerce flow** — browse → wishlist → cart → checkout → order fulfillment
- 📊 **Real dashboard & analytics** — 6 chart types across 2 analytics modules with export
- 🧠 **Data-grounded AI** — AI assistant answers from live ledger, can draft client letters
- 📦 **Production Kanban** — real HTML5 drag & drop with drop highlighting
- 💳 **Subscription engine** — plan tiers, invoice generation, payment method management, receipt downloads
- 📤 **Data portability** — full JSON export + CSV export + reset-to-demo
- 📱 **Responsive** — mobile drawer, adaptive grids, touch-friendly controls

---

## 🚀 Quick Start

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # produce single-file production build in dist/
```

### Demo Access
Once on the website, click **Maison Console** → use **"Autofill Demo Login"**:
- **Email:** `guest@lumiere.com`
- **Maison Key:** `lumiere2024`

---

## 📂 Project Structure

```
src/
├── App.tsx                  # Router: site ↔ login ↔ console mode bridge + all wiring
├── index.css                # Luxury design tokens, fonts, 15+ custom animations
├── data/
│   ├── siteData.ts          # Public boutique catalog (products, collections, testimonials)
│   └── lumiereData.ts       # Console domain: commissions, clients, artisans, plans, analytics
├── components/
│   ├── LoginPage.tsx        # Cinematic animated login with autofill
│   ├── Sidebar.tsx          # Console navigation rail + plan card
│   ├── Topbar.tsx           # Console header with search, notifications, boutique bridge
│   ├── ui.tsx               # Modal, Toasts, Toggle, PageHeader, EmptyState, luxury buttons
│   └── site/
│       ├── SiteApp.tsx      # The entire public boutique shell (hero, collections, story, lookbook, voices, contact, footer)
│       └── SiteShop.tsx     # Boutique product grid + wishlist + cart + checkout → console bridge
└── views/                   # Console pages
    ├── Dashboard.tsx        # Maison overview KPIs, charts, pipeline, activity
    ├── Commissions.tsx      # Production kanban with drag & drop + dossier
    ├── Assignments.tsx      # Piece register with filters & delivery toggles
    ├── Clients.tsx          # Private client CRM with dossier drawer
    ├── Artisans.tsx         # Artisan roster with presence management
    ├── Analytics.tsx        # Maison analytics suite
    ├── Billing.tsx          # Subscription plans, payment method, receipts
    ├── MaisonAI.tsx         # AI concierge grounded in live data
    └── Settings.tsx         # Console settings, security, vault controls
```

---

*LUMIÈRE Maison OS — where commerce meets craft, and data shines like light.*
