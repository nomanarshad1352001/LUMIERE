import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Sparkles, Zap, RotateCcw, Copy, User as UserIcon, Database, TrendingUp } from 'lucide-react';
import { Commission, Client, Artisan, User, todayISO, fmtMoney } from '../data/lumiereData';

interface Msg { id: string; role: 'user' | 'assistant'; content: string; sources?: string[] }

interface MaisonAIProps {
  commissions: Commission[];
  clients: Client[];
  artisans: Artisan[];
  user: User;
  planName: string;
}

const quickPrompts = [
  'How is the maison doing?',
  'Which pieces are at risk?',
  'Which clients need attention?',
  'Draft a Patron follow-up',
  'Summarize atelier workload',
];

export default function MaisonAI({ commissions, clients, artisans, user, planName }: MaisonAIProps) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bonjour ${user.name.split(' ')[0]} — I am the **Maison AI**. I have live access to your **commissions**, **private clients**, and **artisans**. Ask me anything about the house, and I will answer with grace and real numbers.`,
      sources: ['Live maison ledger'],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const buildResponse = (q: string): Msg => {
    const query = q.toLowerCase();
    const open = commissions.filter((c) => !c.delivered);
    const delivered = commissions.filter((c) => c.delivered);
    const overdue = open.filter((c) => c.due < todayISO());
    const pipeline = open.reduce((s, c) => s + c.value, 0);
    const patrons = clients.filter((c) => c.tier === 'Patron');
    const needsAttention = clients.filter((c) => c.status === 'past-due' || c.status === 'dormant');
    const ltv = clients.reduce((s, c) => s + c.lifetimeValue, 0);

    if (query.includes('how') && (query.includes('maison') || query.includes('doing')) || query.includes('overview')) {
      return {
        id: String(Date.now()), role: 'assistant',
        content: `## The Maison at a Glance\n\n**Pipeline:** ${fmtMoney(pipeline)} across ${open.length} active pieces\n**Clients:** ${clients.length} in the registry · ${fmtMoney(ltv)} lifetime value\n**Artisans:** ${artisans.length} hands · ${artisans.filter((a) => a.status === 'at bench').length} at the bench\n**Plan:** Maison OS · ${planName}\n\n### Observations\n1. **Royal commissions** — ${open.filter((c) => c.priority === 'royal').length} royal piece${open.filter((c) => c.priority === 'royal').length !== 1 ? 's' : ''} in play, worth ${fmtMoney(open.filter((c) => c.priority === 'royal').reduce((s, c) => s + c.value, 0))}. These deserve daily ceremony.\n2. **Delivery risk** — ${overdue.length} piece${overdue.length !== 1 ? 's are' : ' is'} overdue; ${overdue.length ? `“${overdue[0].title}” is the oldest.` : 'the floor is clean.'}\n3. **Quiet clients** — ${needsAttention.length} registry entr${needsAttention.length !== 1 ? 'ies need' : 'y needs'} a personal note (past-due or dormant).\n\n**Verdict:** The house hums beautifully. Mind the overdue bench and keep Patrons close.`,
        sources: ['Commission ledger', 'Client registry', 'Atelier roster'],
      };
    }
    if (query.includes('risk') || query.includes('risky') || query.includes('overdue')) {
      return {
        id: String(Date.now()), role: 'assistant',
        content: `## Pieces at Risk\n\n**${overdue.length} overdue · ${open.filter((c) => c.priority !== 'standard').length} high ceremony**\n\n${overdue.length ? overdue.map((c) => `- **${c.title}** — ${c.client} · due ${c.due} · ${c.artisan} at ${c.atelier}`).join('\n') : '- Nothing overdue — the bench is perfectly on rhythm.'}\n\n### High Ceremony (urgent + royal)\n${open.filter((c) => c.priority !== 'standard').map((c) => `- **${c.title}** — ${fmtMoney(c.value)} · ${c.priority.toUpperCase()} · due ${c.due}`).join('\n')}\n\n### Counsel\n1. Face-time with the most senior artisan on each overdue piece — no emails.\n2. Offer the client a private progress viewing; anticipation is sweeter than apology.\n3. Anything royal should be personally supervised until delivery.`,
        sources: ['Commission ledger'],
      };
    }
    if (query.includes('client') || query.includes('patron') || query.includes('attention')) {
      return {
        id: String(Date.now()), role: 'assistant',
        content: `## Clients to Court This Week\n\n**${patrons.length} Patrons** hold ${fmtMoney(patrons.reduce((s, c) => s + c.lifetimeValue, 0))} in lifetime value. Several relationships deserve ceremony:\n\n${needsAttention.map((c) => `- **${c.name}** (${c.tier}, ${c.city}) — ${c.status.replace('-', ' ')} · last contact ${c.lastContact}`).join('\n')}\n\n### Patron Moments\n- **Isabelle Moreau** — her remount finishes soon; invite her for the unveiling with champagne.\n- **Noor Al-Farsi** — solitaire in crafting; send a photo of the setting at golden hour.\n- **Adrian Vale** — viewing-booked; ensure the Céleste room is prepared.\n\nShall I draft the Patron follow-ups?`,
        sources: ['Client registry', 'Concierge notes'],
      };
    }
    if (query.includes('draft') || query.includes('letter') || query.includes('write') || query.includes('follow-up') || query.includes('follow up')) {
      return {
        id: String(Date.now()), role: 'assistant',
        content: `## Patron Follow-Up — Ready to Sign\n\nDear Madame Moreau,\n\nI hope this note finds you as radiant as the pieces you house.\n\nI write with quiet delight: your **Verdant Empress** has completed its remount, and the stones have never caught light quite like this. We would be honored to present it to you at Place Vendôme, at your convenience — champagne chilled, as you prefer.\n\nAlso, a whisper: our winter atelier has begun sketching something with your name in the margins. Say the word and I will walk you through the sketches before anyone else sees them.\n\nWith warmth and devotion to your collection,\n\n${user.name}\n${user.role}, ${user.maison}\n\n*Adjust the tone or specifics as you wish before sending.*`,
        sources: ['Client registry', 'Commission ledger'],
      };
    }
    if (query.includes('workload') || query.includes('workoad') || query.includes('bench') || query.includes('artisan')) {
      const byArtisan = artisans.map((a) => ({ a, count: open.filter((c) => c.artisan === a.initials).length })).sort((x, y) => y.count - x.count);
      return {
        id: String(Date.now()), role: 'assistant',
        content: `## Atelier Workload\n\n| Artisan | Active pieces | Whereabouts |\n|---------|--------------|-------------|\n${byArtisan.map(({ a, count }) => `| ${a.name} | ${count} | ${a.status} |`).join('\n')}\n\n### Diagnosis\n- **${byArtisan[0]?.a.name}** carries the heaviest bench (${byArtisan[0]?.count} pieces). ${byArtisan[byArtisan.length - 1]?.a.name} has room at ${byArtisan[byArtisan.length - 1]?.count}.\n- ${open.filter((c) => c.priority !== 'standard').length} high-ceremony pieces are spread across ${new Set(open.filter((c) => c.priority !== 'standard').map((c) => c.artisan)).size} hands — keep them focused.\n\n**Counsel:** Rebalance one urgent piece to the lightest bench before Friday's viewing season.`,
        sources: ['Commission ledger', 'Atelier roster'],
      };
    }

    return {
      id: String(Date.now()), role: 'assistant',
      content: `## A Quick Whisper of Numbers\n\nGrounded in your live ledger:\n\n- **${open.length} pieces in production** — ${fmtMoney(pipeline)} in play\n- **${clients.length} private clients** — ${patrons.length} Patrons among them\n- **${delivered.length} pieces delivered** this season\n- **${overdue.length} overdue** on the bench\n\nAsk me things like:\n- “Which clients need attention?”\n- “Which pieces are at risk?”\n- “Draft a Patron follow-up”`,
      sources: ['Live maison ledger'],
    };
  };

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || typing) return;
    setMessages((prev) => [...prev, { id: String(Date.now()), role: 'user', content: msg }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, buildResponse(msg)]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  };

  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => {
      const bold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') ? <b key={j} className="font-semibold text-ivory">{part.slice(2, -2)}</b> : part
      );
      if (line.startsWith('## ')) return <h3 key={i} className="font-display font-semibold text-ivory text-lg mt-3 mb-1.5">{line.slice(3)}</h3>;
      if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sand text-sm mt-2.5 mb-1 tracking-wide">{line.slice(4)}</h4>;
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 text-sm text-linen leading-relaxed pl-1"><span className="text-champagne mt-2 shrink-0 w-1 h-1 rounded-full bg-champagne inline-block" />{bold(line.slice(2))}</div>;
      if (/^\d+\. /.test(line)) return <div key={i} className="text-sm text-linen leading-relaxed pl-1">{bold(line)}</div>;
      if (line.startsWith('| ')) {
        const cells = line.split('|').filter((c) => c.trim());
        if (cells.every((c) => /^[-\s]+$/.test(c))) return null;
        return <div key={i} className="grid grid-cols-3 gap-2 text-xs text-sand py-0.5 border-b border-smoke/60 last:border-0">{cells.map((c, j) => <span key={j} className={j === 0 ? 'font-medium text-ivory' : ''}>{bold(c.trim())}</span>)}</div>;
      }
      if (!line.trim()) return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-sm text-linen leading-relaxed">{bold(line)}</p>;
    });

  return (
    <div className="h-[calc(100vh-9.5rem)] flex flex-col anim-fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ivory tracking-wide flex items-center gap-3">
            Maison AI
            <span className="text-[10px] font-body font-bold uppercase tracking-widest text-obsidian px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}>Concierge</span>
          </h1>
          <p className="text-sm text-pewter mt-1 font-light">Grounded in your live maison ledger — never guesswork.</p>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center gap-1.5 text-xs font-medium text-pewter hover:text-champagne border border-smoke rounded-lg px-3 py-2 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} /> New conversation
        </button>
      </div>

      {/* chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-smoke bg-onyx p-5 space-y-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full border border-champagne/40 flex items-center justify-center shrink-0 bg-charcoal">
                <Sparkles size={15} className="text-champagne" />
              </div>
            )}
            <div className={`max-w-[82%] ${m.role === 'user' ? 'order-first' : ''}`}>
              <div className={`rounded-2xl px-5 py-3.5 ${
                m.role === 'user'
                  ? 'text-obsidian rounded-br-md shadow-lg shadow-champagne/20'
                  : 'bg-charcoal/70 border border-smoke rounded-bl-md'
              }`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' } : undefined}
              >
                {m.role === 'user'
                  ? <p className="text-sm leading-relaxed font-medium">{m.content}</p>
                  : <div className="space-y-0.5">{renderContent(m.content)}</div>}
              </div>
              {m.role === 'assistant' && m.sources && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.sources.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-champagne/10 text-champagne border border-champagne/25">
                      <Database size={9} /> {s}
                    </span>
                  ))}
                  <button
                    onClick={() => navigator.clipboard?.writeText(m.content)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full text-pewter hover:text-sand transition-colors cursor-pointer"
                  >
                    <Copy size={9} /> Copy
                  </button>
                </div>
              )}
            </div>
            {m.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-smoke flex items-center justify-center shrink-0">
                <UserIcon size={15} className="text-sand" />
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full border border-champagne/40 flex items-center justify-center shrink-0 bg-charcoal">
              <Sparkles size={15} className="text-champagne" />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-charcoal/70 border border-smoke px-5 py-4 flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-2 h-2 rounded-full bg-champagne" style={{ animation: `typingDot 1.2s ${i * 0.18}s infinite` }} />
                ))}
              </div>
              <span className="text-xs text-pewter flex items-center gap-1.5">
                <TrendingUp size={11} className="text-champagne" /> Reading the maison ledger…
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* quick prompts */}
      <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={typing}
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-sand bg-onyx border border-smoke rounded-full px-4 py-2 hover:border-champagne/50 hover:text-champagne transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap size={11} className="text-champagne" /> {p}
          </button>
        ))}
      </div>

      {/* input */}
      <form onSubmit={(e: FormEvent) => { e.preventDefault(); send(); }} className="flex gap-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about pieces, clients, artisans, or the house…"
          className="luxury-input flex-1 rounded-2xl px-5 py-3.5 text-sm text-ivory placeholder:text-pewter/60 shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="btn-gold w-[52px] h-[52px] rounded-2xl text-obsidian flex items-center justify-center shadow-lg shadow-champagne/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(135deg,#d4af6a,#f0dfae)' }}
          aria-label="Send"
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
