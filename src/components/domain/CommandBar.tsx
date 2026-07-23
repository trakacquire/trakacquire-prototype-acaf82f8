import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, Link2, Building2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { db } from '@/lib/fake/db';
import { tenants } from '@/lib/fake/extra';

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [, navigate] = useLocation();

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = useMemo(() => {
    if (debouncedQuery.length < 2) return null;
    const q = debouncedQuery.toLowerCase();

    const persons = db.persons
      .filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const campaigns = db.campaigns
      .filter(c => c.name?.toLowerCase().includes(q))
      .slice(0, 4);

    const flows = db.flows
      .filter(f => f.name?.toLowerCase().includes(q))
      .slice(0, 4);

    const links = db.links
      .filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.url?.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const clients = tenants
      .filter(t => t.name?.toLowerCase().includes(q))
      .slice(0, 4);

    return { persons, campaigns, flows, links, clients };
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
    { label: 'Ver Command', path: '/command' },
    { label: 'Novo Link', path: '/tracking' },
    { label: 'Ver P&L', path: '/revenue' },
  ];

  const hasResults = results && (
    results.persons.length > 0 ||
    results.campaigns.length > 0 ||
    results.flows.length > 0 ||
    results.links.length > 0 ||
    results.clients.length > 0
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-stone bg-zinc border border-line rounded-md hover:text-eggshell hover:border-stone transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Buscar...</span>
        <kbd className="ml-auto inline-flex h-5 items-center gap-1 rounded border border-line bg-graphite px-1.5 font-mono text-[10px] font-medium text-stone">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="p-0 border-line bg-graphite shadow-2xl max-w-2xl gap-0">
          <Command className="bg-transparent border-none" shouldFilter={false}>
            <CommandInput
              placeholder="Buscar por nome, email, campanha, fluxo, link..."
              className="h-12 border-b border-line px-4 text-eggshell font-sans"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList className="max-h-[400px] overflow-y-auto p-2">
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

              {results && results.persons.length > 0 && (
                <CommandGroup heading="Pessoas" className="text-stone">
                  {results.persons.map((p) => (
                    <CommandItem
                      key={p.id}
                      onSelect={() => goTo(`/players/${p.id}`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <div className="w-7 h-7 rounded-full bg-[var(--proof-blue)]/20 text-[var(--proof-blue)] flex items-center justify-center text-11 font-bold flex-shrink-0">
                        {getInitials(p.name || p.id)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-13 font-medium truncate">{p.name || p.id}</div>
                        <div className="text-11 text-stone truncate">{p.email}</div>
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
                      onSelect={() => goTo(`/tracking`)}
                      className="flex items-center gap-3 px-3 py-2 text-eggshell hover:bg-zinc rounded-md cursor-pointer data-[selected=true]:bg-zinc"
                    >
                      <Link2 className="w-4 h-4 text-stone flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-13 font-medium truncate">{l.name}</div>
                        <div className="text-11 text-stone truncate">{l.url}</div>
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
                        <span
                          className="text-10 font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{
                            background: '#7C91FF20',
                            color: '#7C91FF',
                            border: '1px solid #7C91FF40',
                          }}
                        >
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
