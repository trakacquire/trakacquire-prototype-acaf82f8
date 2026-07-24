import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Link2, Building2, Activity, Zap, Radio } from 'lucide-react';
import { useLocation } from 'wouter';
import { db } from '@/lib/fake/db';
import { tenants } from '@/lib/fake/extra';

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const RE_EMAIL     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const RE_PHONE     = /^\+?\d[\d\s()-]{6,}$/;
const RE_TELEGRAM  = /^tg_[0-9a-z]+$/i;
const RE_PERSON    = /^p_[0-9]+$/i;
const RE_CLICK     = /^clk_[0-9a-z]+$/i;
const RE_EVENT     = /^evt_[0-9a-z]+$/i;
const RE_CUSTOMER  = /^cust_[0-9a-z]+$/i;

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [, navigate] = useLocation();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 120);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = useMemo(() => {
    if (debouncedQuery.length < 2) return null;
    const raw = debouncedQuery.trim();
    const q = raw.toLowerCase();

    // ── E3 · match direto por ID/padrão — leva ao objeto sem cliques extras.
    const direct: { label: string; hint: string; path: string; icon: React.ReactNode }[] = [];

    if (RE_PERSON.test(raw))    direct.push({ label: raw, hint: 'Pessoa', path: `/players/${raw}`,   icon: <Search className="w-3.5 h-3.5" /> });
    if (RE_EVENT.test(raw))     direct.push({ label: raw, hint: 'Evento (Ledger)', path: `/ledger/${raw}`, icon: <Activity className="w-3.5 h-3.5" /> });
    if (RE_CLICK.test(raw))     direct.push({ label: raw, hint: 'Click ID → Ledger', path: `/ledger?click=${raw}`, icon: <Link2 className="w-3.5 h-3.5" /> });
    if (RE_TELEGRAM.test(raw))  direct.push({ label: raw, hint: 'Telegram ID → Identity', path: `/identity?telegram=${raw}`, icon: <Radio className="w-3.5 h-3.5" /> });
    if (RE_CUSTOMER.test(raw))  direct.push({ label: raw, hint: 'Customer ID → Ledger', path: `/ledger?customer=${raw}`, icon: <Activity className="w-3.5 h-3.5" /> });

    if (RE_EMAIL.test(raw)) {
      const person = db.persons.find((p) => p.email?.toLowerCase() === q);
      direct.push({
        label: raw,
        hint: person ? `Pessoa · ${person.name}` : 'Email → Players',
        path: person ? `/players/${person.id}` : `/players?q=${encodeURIComponent(raw)}`,
        icon: <Search className="w-3.5 h-3.5" />,
      });
    }
    if (RE_PHONE.test(raw)) {
      direct.push({ label: raw, hint: 'Telefone → Players', path: `/players?q=${encodeURIComponent(raw)}`, icon: <Search className="w-3.5 h-3.5" /> });
    }

    const persons = db.persons
      .filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q),
      )
      .slice(0, 4);

    const campaigns = db.campaigns.filter((c) => c.name?.toLowerCase().includes(q)).slice(0, 4);
    const flows     = db.flows.filter((f) => f.name?.toLowerCase().includes(q)).slice(0, 4);
    const links     = db.links.filter((l) => l.name?.toLowerCase().includes(q) || l.url?.toLowerCase().includes(q)).slice(0, 4);
    const clients   = tenants.filter((t) => t.name?.toLowerCase().includes(q)).slice(0, 4);
    const events    = db.events
      .filter((e) => e.id.toLowerCase().includes(q) || e.person_id?.toLowerCase().includes(q))
      .slice(0, 4);

    // Ações contextuais (E3 · também navegáveis por ⌘K)
    const actionCatalog = [
      { label: 'Criar novo link de tracking', path: '/tracking?new=1', tokens: ['link', 'utm', 'novo', 'criar'] },
      { label: 'Testar postback (TAP)',       path: '/integrations/tap?test=1', tokens: ['test', 'postback', 'tap'] },
      { label: 'Abrir Signal Ledger ao vivo', path: '/ledger?live=1', tokens: ['ao vivo', 'live', 'ledger', 'stream'] },
      { label: 'Ver reconciliação (D+1)',     path: '/revenue/reconciliation', tokens: ['reconcili', 'divergent'] },
      { label: 'Abrir Radar (Command)',       path: '/command', tokens: ['radar', 'anomalia', 'alerta'] },
    ];
    const actions = actionCatalog.filter((a) =>
      a.label.toLowerCase().includes(q) || a.tokens.some((t) => q.includes(t)),
    ).slice(0, 4);

    return { direct, persons, campaigns, flows, links, clients, events, actions };
  }, [debouncedQuery]);

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    setDebouncedQuery('');
  };

  const goTo = (path: string) => {
    navigate(path);
    handleClose();
  };

  const quickActions = [
    { label: 'Abrir Command', path: '/command' },
    { label: 'Novo link de tracking', path: '/tracking?new=1' },
    { label: 'Signal Ledger ao vivo', path: '/ledger?live=1' },
    { label: 'Ver P&L', path: '/revenue' },
  ];

  const hasResults = results && (
    results.direct.length > 0 ||
    results.persons.length > 0 ||
    results.campaigns.length > 0 ||
    results.flows.length > 0 ||
    results.links.length > 0 ||
    results.clients.length > 0 ||
    results.events.length > 0 ||
    results.actions.length > 0
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone bg-zinc border border-line rounded-md hover:text-eggshell hover:border-stone transition-colors w-full"
      >
        <Search className="w-4 h-4" />
        <span>Buscar pessoa, evento, link, ação…</span>
        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border border-line bg-graphite px-1.5 font-mono text-[10px] font-medium text-stone">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="p-0 border-line bg-graphite shadow-2xl max-w-2xl gap-0">
          <Command className="bg-transparent border-none" shouldFilter={false}>
            <CommandInput
              placeholder="Email, telegram_id, click_id, event_id, campanha, ação…"
              className="h-12 border-b border-line px-4 text-eggshell font-sans"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[420px] overflow-y-auto p-2">
              {!results && (
                <CommandGroup heading="Ações Rápidas" className="text-stone">
                  {quickActions.map((a) => (
                    <CommandItem
                      key={a.path}
                      onSelect={() => goTo(a.path)}
                      className="flex items-center gap-2 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      {a.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && !hasResults && (
                <CommandEmpty className="py-6 text-center text-sm text-stone">
                  Nenhum resultado encontrado.
                </CommandEmpty>
              )}

              {results && results.direct.length > 0 && (
                <CommandGroup heading="Direto para o objeto" className="text-stone">
                  {results.direct.map((d, i) => (
                    <CommandItem
                      key={`d${i}`}
                      onSelect={() => goTo(d.path)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <span className="text-stone">{d.icon}</span>
                      <div className="min-w-0">
                        <div className="text-13 font-mono truncate">{d.label}</div>
                        <div className="text-11 text-stone truncate">{d.hint}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.actions.length > 0 && (
                <CommandGroup heading="Ações" className="text-stone mt-2">
                  {results.actions.map((a) => (
                    <CommandItem
                      key={a.path}
                      onSelect={() => goTo(a.path)}
                      className="flex items-center gap-2 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <Zap className="w-3.5 h-3.5 text-proof-blue" />
                      <span className="text-13">{a.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.persons.length > 0 && (
                <CommandGroup heading="Pessoas" className="text-stone mt-2">
                  {results.persons.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => goTo(`/players/${p.id}`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <div className="w-7 h-7 rounded-full bg-proof-blue/20 text-proof-blue flex items-center justify-center text-11 font-bold flex-shrink-0">
                        {getInitials(p.name || p.id)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-13 font-medium truncate">{p.name || p.id}</div>
                        <div className="text-11 text-stone truncate font-mono">{p.email} · {p.id}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.events.length > 0 && (
                <CommandGroup heading="Eventos (Ledger)" className="text-stone mt-2">
                  {results.events.map((e) => (
                    <CommandItem
                      key={e.id}
                      onSelect={() => goTo(`/ledger/${e.id}`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <Activity className="w-4 h-4 text-stone flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-13 font-mono truncate">{e.id} · {e.type}</div>
                        <div className="text-11 text-stone truncate font-mono">{e.person_id ?? '—'} · {e.status}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.campaigns.length > 0 && (
                <CommandGroup heading="Campanhas" className="text-stone mt-2">
                  {results.campaigns.map((c) => (
                    <CommandItem
                      key={c.id}
                      onSelect={() => goTo(`/media/${c.id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <span className="text-13">{c.name}</span>
                      <span className="text-11 text-stone ml-1">({c.source})</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.flows.length > 0 && (
                <CommandGroup heading="Fluxos" className="text-stone mt-2">
                  {results.flows.map((f) => (
                    <CommandItem
                      key={f.id}
                      onSelect={() => goTo(`/automations/${f.id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <span className="text-13">{f.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.links.length > 0 && (
                <CommandGroup heading="Links" className="text-stone mt-2">
                  {results.links.map((l) => (
                    <CommandItem
                      key={l.id}
                      onSelect={() => goTo(`/tracking/${l.id}`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <Link2 className="w-4 h-4 text-stone flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-13 font-medium truncate">{l.name}</div>
                        <div className="text-11 text-stone truncate font-mono">{l.url}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results && results.clients.length > 0 && (
                <CommandGroup heading="Clientes" className="text-stone mt-2">
                  {results.clients.map((t) => (
                    <CommandItem
                      key={t.id}
                      onSelect={() => goTo(`/platform/tenants/${t.id}`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <Building2 className="w-4 h-4 text-stone flex-shrink-0" />
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-13 font-medium truncate">{t.name}</span>
                        <span className="text-10 font-mono uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 border border-proof-blue/40 bg-proof-blue/10 text-proof-blue">
                          {t.plan}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
