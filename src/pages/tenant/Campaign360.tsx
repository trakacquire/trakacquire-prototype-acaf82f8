import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useParams } from 'wouter';
import { Link } from 'wouter';
import { MetricCard } from '@/components/data/MetricCard';
import { DataTable } from '@/components/data/DataTable';
import { StatusChip } from '@/components/domain/StatusChip';
import ConfirmDialog from '@/components/domain/ConfirmDialog';
import { db } from '@/lib/fake/db';
import { useAppState } from '@/lib/context/AppStateContext';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Pause, Play } from 'lucide-react';

const fmtMoney = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--graphite)',
    border: '1px solid var(--line)',
    color: 'var(--eggshell)',
    borderRadius: '8px',
    fontFamily: 'inherit',
  },
};

const SOURCE_LABELS: Record<string, string> = {
  meta: 'Meta Ads',
  tiktok: 'TikTok Ads',
};

const FORMAT_LABELS: Record<string, string> = {
  video: 'Vídeo',
  image: 'Imagem',
  carousel: 'Carrossel',
};

export default function Campaign360Page() {
  const params = useParams<{ id: string }>();
  const { dispatch } = useAppState();

  const campaign = db.getCampaign(params.id ?? '') ?? db.campaigns[0];

  // Persons attributed to this campaign
  const campaignPersons = db.persons.filter(p => p.campaign_id === campaign.id);
  const ftds = campaignPersons.filter(p => p.ftd_at);

  // Links for this campaign
  const campaignLinks = db.links.filter(l => l.campaign_id === campaign.id);
  const totalClicks = campaignLinks.reduce((s, l) => s + l.clicks, 0) || campaignPersons.length * 3;
  const totalRegistrations = campaignPersons.filter(p => p.registered_at).length;
  const totalFTDs = ftds.length;
  const grossRevenue = ftds.reduce((s, p) => s + p.total_deposited, 0);

  // 30-day spend estimate
  const spend = campaign.budget_daily * 30;
  const cpftd = totalFTDs > 0 ? spend / totalFTDs : 0;
  const cpc = totalClicks > 0 ? spend / totalClicks : 0;
  const cpr = totalRegistrations > 0 ? spend / totalRegistrations : 0;
  const crPct = totalClicks > 0 ? (totalRegistrations / totalClicks) * 100 : 0;
  const rftdPct = totalRegistrations > 0 ? (totalFTDs / totalRegistrations) * 100 : 0;

  // Daily series: group campaign-person events by date (last 14 days)
  const personIds = new Set(campaignPersons.map(p => p.id));
  const campEvents = db.events.filter(e => personIds.has(e.person_id));

  const dailyMap: Record<string, { date: string; cliques: number; ftds: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date('2026-07-23T12:00:00.000Z');
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { date: key, cliques: 0, ftds: 0 };
  }
  for (const e of campEvents) {
    const key = e.timestamp.slice(0, 10);
    if (dailyMap[key]) {
      if (e.type === 'click') dailyMap[key].cliques++;
      if (e.type === 'ftd') dailyMap[key].ftds++;
    }
  }
  const dailyData = Object.values(dailyMap).map(d => ({
    ...d,
    date: new Date(d.date + 'T12:00:00Z').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  }));

  // Pause state
  const [isPaused, setIsPaused] = useState(campaign.status === 'paused');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handlePauseConfirm = () => {
    setIsPaused(true);
    dispatch({
      type: 'APPEND_AUDIT',
      entry: {
        timestamp: new Date().toISOString(),
        user: 'operador@trakacquire.io',
        action: 'PAUSE_CAMPAIGN',
        object: campaign.id,
        detail: `Campanha "${campaign.name}" pausada manualmente.`,
      },
    });
    toast('Campanha pausada. Alteração refletirá na plataforma em até 2 minutos.');
  };

  // Tabs
  const TABS = ['Adsets', 'Criativos', 'Links', 'Pessoas'] as const;
  type Tab = typeof TABS[number];
  const [activeTab, setActiveTab] = useState<Tab>('Adsets');

  // Adsets table
  const adsetCols = [
    {
      header: 'Nome',
      accessorKey: 'name' as const,
      cell: (a: typeof campaign.adsets[0]) => (
        <span className="text-14 text-[var(--eggshell)] font-medium">{a.name}</span>
      ),
    },
    {
      header: 'Anúncios',
      accessorKey: 'id' as const,
      cell: (a: typeof campaign.adsets[0]) => (
        <span className="font-mono text-13 text-[var(--stone)]">
          {campaign.ads.filter(ad => ad.adset_id === a.id).length}
        </span>
      ),
    },
    {
      header: 'Budget Diário',
      accessorKey: 'budget_daily' as const,
      cell: (a: typeof campaign.adsets[0]) => (
        <span className="font-mono text-13">{fmtMoney(a.budget_daily)}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'id' as const,
      cell: (_: typeof campaign.adsets[0]) => (
        <StatusChip status={(isPaused ? 'Pending' : 'Confirmed') as any} />
      ),
    },
  ];

  // Creatives table
  type ArchiveState = Record<string, boolean>;
  const [archivedCreatives, setArchivedCreatives] = useState<ArchiveState>({});
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);

  const creativeCols = [
    {
      header: 'Nome',
      accessorKey: 'id' as const,
      cell: (c: typeof campaign.creatives[0]) => (
        <div>
          <div className="text-14 text-[var(--eggshell)] font-medium">
            {campaign.name} — {c.id}
          </div>
          <div className="text-11 text-[var(--stone)] font-mono">{c.name}</div>
        </div>
      ),
    },
    {
      header: 'Formato',
      accessorKey: 'type' as const,
      cell: (c: typeof campaign.creatives[0]) => (
        <span className="px-2 py-0.5 rounded border border-[var(--line)] text-11 text-[var(--stone)] bg-[var(--zinc)]">
          {FORMAT_LABELS[c.type] ?? c.type}
        </span>
      ),
    },
    {
      header: 'Pessoas',
      accessorKey: 'id' as const,
      cell: (c: typeof campaign.creatives[0]) => (
        <span className="font-mono text-13">
          {campaignPersons.filter(p => p.creative_id === c.id).length}
        </span>
      ),
    },
    {
      header: 'FTDs',
      accessorKey: 'id' as const,
      cell: (c: typeof campaign.creatives[0]) => (
        <span className="font-mono text-13 text-[var(--verified)]">
          {ftds.filter(p => p.creative_id === c.id).length}
        </span>
      ),
    },
    {
      header: 'Ações',
      accessorKey: 'id' as const,
      cell: (c: typeof campaign.creatives[0]) => (
        <div className="flex gap-2">
          <button
            className="text-12 px-2 py-1 rounded bg-[var(--zinc)] border border-[var(--line)] text-[var(--stone)] hover:text-[var(--eggshell)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toast('Criativo duplicado.');
            }}
          >
            Duplicar
          </button>
          <button
            className="text-12 px-2 py-1 rounded bg-[var(--zinc)] border border-[var(--line)] text-[var(--stone)] hover:text-[var(--critical)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setArchiveTarget(c.id);
            }}
          >
            Arquivar
          </button>
        </div>
      ),
    },
  ];

  // Links table
  const linkCols = [
    {
      header: 'Nome',
      accessorKey: 'name' as const,
      cell: (l: typeof campaignLinks[0]) => (
        <span className="text-14 text-[var(--eggshell)]">{l.name}</span>
      ),
    },
    {
      header: 'URL',
      accessorKey: 'url' as const,
      cell: (l: typeof campaignLinks[0]) => (
        <span className="font-mono text-12 text-[var(--proof-blue)] truncate max-w-[160px] block">{l.url}</span>
      ),
    },
    {
      header: 'Cliques',
      accessorKey: 'clicks' as const,
      cell: (l: typeof campaignLinks[0]) => (
        <span className="font-mono text-13">{l.clicks.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'Registros',
      accessorKey: 'registrations' as const,
      cell: (l: typeof campaignLinks[0]) => (
        <span className="font-mono text-13">{l.registrations.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'FTDs',
      accessorKey: 'ftds' as const,
      cell: (l: typeof campaignLinks[0]) => (
        <span className="font-mono text-13 text-[var(--verified)]">{l.ftds}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status' as const,
      cell: (l: typeof campaignLinks[0]) => {
        const s =
          l.status === 'active' ? 'Confirmed'
          : l.status === 'paused' ? 'Divergent'
          : 'Orphan';
        return <StatusChip status={s as any} />;
      },
    },
  ];

  // Persons table
  const personCols = [
    {
      header: 'ID',
      accessorKey: 'id' as const,
      cell: (p: typeof campaignPersons[0]) => (
        <Link href={`/players/${p.id}`}>
          <span className="font-mono text-12 text-[var(--proof-blue)] hover:underline cursor-pointer">{p.id}</span>
        </Link>
      ),
    },
    {
      header: 'Nome',
      accessorKey: 'name' as const,
      cell: (p: typeof campaignPersons[0]) => (
        <span className="text-14 text-[var(--eggshell)]">{p.name}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status' as const,
      cell: (p: typeof campaignPersons[0]) => <StatusChip status={p.status} />,
    },
    {
      header: 'FTD',
      accessorKey: 'ftd_at' as const,
      cell: (p: typeof campaignPersons[0]) => (
        <span className={p.ftd_at ? 'text-[var(--verified)]' : 'text-[var(--stone)]'}>
          {p.ftd_at ? '✓' : '–'}
        </span>
      ),
    },
    {
      header: 'Total Depositado',
      accessorKey: 'total_deposited' as const,
      cell: (p: typeof campaignPersons[0]) => (
        <span className="font-mono text-13">{fmtMoney(p.total_deposited)}</span>
      ),
    },
  ];

  return (
    <AppShell
      breadcrumb={[
        { label: 'Mídia', href: '/media' },
        { label: campaign.name },
      ]}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-24 font-bold text-[var(--eggshell)]">{campaign.name}</h1>
              <span className="px-2 py-0.5 rounded border border-[var(--line)] text-11 font-medium text-[var(--stone)] bg-[var(--zinc)]">
                {SOURCE_LABELS[campaign.source] ?? campaign.source}
              </span>
              <StatusChip status={(isPaused ? 'Divergent' : 'Confirmed') as any} />
            </div>
            <p className="text-13 text-[var(--stone)]">
              Budget diário: <span className="font-mono text-[var(--eggshell)]">{fmtMoney(campaign.budget_daily)}</span>
            </p>
          </div>

          <button
            onClick={() => {
              if (isPaused) {
                setIsPaused(false);
                toast('Campanha reativada.');
              } else {
                setConfirmOpen(true);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-14 font-medium transition-colors ${
              isPaused
                ? 'bg-[var(--verified)]/20 text-[var(--verified)] hover:bg-[var(--verified)]/30'
                : 'bg-[var(--warning)]/20 text-[var(--warning)] hover:bg-[var(--warning)]/30'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Reativar campanha' : 'Pausar campanha'}
          </button>
        </div>

        {/* 4 MetricCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Cliques"
            value={totalClicks.toLocaleString('pt-BR')}
          />
          <MetricCard
            label="Registros"
            value={totalRegistrations.toLocaleString('pt-BR')}
          />
          <MetricCard
            label="FTDs"
            value={totalFTDs.toLocaleString('pt-BR')}
          />
          <MetricCard
            label="CPFTD"
            value={cpftd > 0 ? fmtMoney(cpftd) : '—'}
          />
        </div>

        {/* Daily chart */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6">
          <h2 className="text-16 font-medium text-[var(--eggshell)] mb-4">Performance Diária (últimos 14 dias)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="date" stroke="var(--stone)" style={{ fontSize: 11 }} />
              <YAxis stroke="var(--stone)" style={{ fontSize: 11 }} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="cliques" stroke="var(--proof-blue)" strokeWidth={2} dot={false} name="Cliques" />
              <Line type="monotone" dataKey="ftds" stroke="var(--verified)" strokeWidth={2} dot={false} name="FTDs" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Efficiency row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CPC', value: fmtMoney(cpc) },
            { label: 'CPR', value: fmtMoney(cpr) },
            { label: 'C→R%', value: crPct.toFixed(1) + '%' },
            { label: 'R→FTD%', value: rftdPct.toFixed(1) + '%' },
          ].map(m => (
            <div key={m.label} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
              <div className="text-11 font-mono text-[var(--stone)] uppercase tracking-wider mb-1">{m.label}</div>
              <div className="text-22 font-mono font-semibold text-[var(--eggshell)]">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="border-b border-[var(--line)] flex gap-6 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-[var(--eggshell)] border-[var(--proof-blue)]'
                    : 'text-[var(--stone)] border-transparent hover:text-[var(--eggshell)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'Adsets' && (
              campaign.adsets.length > 0 ? (
                <DataTable data={campaign.adsets} columns={adsetCols} searchPlaceholder="Buscar adsets..." />
              ) : (
                <div className="py-12 text-center text-[var(--stone)] text-14">Nenhum adset encontrado para esta campanha.</div>
              )
            )}

            {activeTab === 'Criativos' && (
              campaign.creatives.length > 0 ? (
                <DataTable
                  data={campaign.creatives.filter(c => !archivedCreatives[c.id])}
                  columns={creativeCols}
                  searchPlaceholder="Buscar criativos..."
                />
              ) : (
                <div className="py-12 text-center text-[var(--stone)] text-14">Nenhum criativo encontrado para esta campanha.</div>
              )
            )}

            {activeTab === 'Links' && (
              campaignLinks.length > 0 ? (
                <DataTable data={campaignLinks} columns={linkCols} searchPlaceholder="Buscar links..." />
              ) : (
                <div className="py-12 text-center text-[var(--stone)] text-14">Nenhum link rastreado para esta campanha.</div>
              )
            )}

            {activeTab === 'Pessoas' && (
              campaignPersons.length > 0 ? (
                <DataTable
                  data={campaignPersons.slice(0, 50)}
                  columns={personCols}
                  searchPlaceholder="Buscar pessoas..."
                />
              ) : (
                <div className="py-12 text-center text-[var(--stone)] text-14">Nenhuma pessoa atribuída a esta campanha.</div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Pause confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handlePauseConfirm}
        title="Pausar campanha?"
        description="A campanha será pausada na plataforma de origem. Confirme para prosseguir."
        confirmLabel="Pausar"
        danger
      />

      {/* Archive creative confirm dialog */}
      <ConfirmDialog
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (archiveTarget) {
            setArchivedCreatives(prev => ({ ...prev, [archiveTarget]: true }));
          }
          toast('Criativo arquivado.');
          setArchiveTarget(null);
        }}
        title="Arquivar criativo?"
        description="O criativo será removido da lista ativa. Esta ação pode ser desfeita pelo suporte."
        confirmLabel="Arquivar"
        danger
      />
    </AppShell>
  );
}
