import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { StatusChip } from '@/components/domain/StatusChip';
import ConfirmDialog from '@/components/domain/ConfirmDialog';
import { db } from '@/lib/fake/db';
import { toast } from 'sonner';
import { Image, Video, FileText } from 'lucide-react';

const fmtMoney = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const FORMAT_LABELS: Record<string, string> = {
  video: 'Vídeo',
  image: 'Imagem',
  carousel: 'Carrossel',
};

export default function MediaCreativesPage() {
  // Creatives from all campaigns, enriched with persons/ftds
  const allCreatives = db.campaigns.flatMap(c =>
    (c.creatives ?? []).map(cr => ({
      ...cr,
      campaign: c,
      persons: db.persons.filter(p => p.creative_id === cr.id),
      ftds: db.persons.filter(p => p.creative_id === cr.id && p.ftd_at),
    }))
  );

  const imageCount = allCreatives.filter(c => c.type === 'image').length;
  const videoCount = allCreatives.filter(c => c.type === 'video').length;
  const textCount = allCreatives.filter(c => c.type === 'carousel').length;

  // Archive state
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);

  const visibleCreatives = allCreatives.filter(c => !archivedIds.has(c.id));

  type CreativeRow = typeof allCreatives[0];

  const columns = [
    {
      header: 'Nome',
      accessorKey: 'id' as const,
      cell: (c: CreativeRow) => (
        <div>
          <div className="text-14 font-medium text-[var(--eggshell)]">
            {c.campaign.name} / {c.id}
          </div>
          <div className="text-11 font-mono text-[var(--stone)]">{c.name}</div>
        </div>
      ),
    },
    {
      header: 'Campanha',
      accessorKey: 'campaign' as const,
      cell: (c: CreativeRow) => (
        <span className="text-13 text-[var(--stone)]">{c.campaign.name}</span>
      ),
    },
    {
      header: 'Formato',
      accessorKey: 'type' as const,
      cell: (c: CreativeRow) => {
        const isVideo = c.type === 'video';
        const isImage = c.type === 'image';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-11 font-medium ${
              isVideo
                ? 'bg-[var(--verified)]/10 text-[var(--verified)] border-[var(--verified)]/20'
                : isImage
                ? 'bg-[var(--proof-blue)]/10 text-[var(--proof-blue)] border-[var(--proof-blue)]/20'
                : 'bg-[var(--zinc)] text-[var(--stone)] border-[var(--line)]'
            }`}
          >
            {isVideo ? <Video className="w-3 h-3" /> : isImage ? <Image className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            {FORMAT_LABELS[c.type] ?? c.type}
          </span>
        );
      },
    },
    {
      header: 'Pessoas',
      accessorKey: 'id' as const,
      cell: (c: CreativeRow) => (
        <span className="font-mono text-13">{c.persons.length.toLocaleString('pt-BR')}</span>
      ),
    },
    {
      header: 'FTDs',
      accessorKey: 'id' as const,
      cell: (c: CreativeRow) => (
        <span className="font-mono text-13 text-[var(--verified)]">{c.ftds.length}</span>
      ),
    },
    {
      header: 'CPFTD',
      accessorKey: 'id' as const,
      cell: (c: CreativeRow) => {
        // Estimate spend for the campaign (30d) and attribute proportionally
        const totalCampaignPersons = db.persons.filter(p => p.campaign_id === c.campaign.id).length || 1;
        const campSpend = c.campaign.budget_daily * 30;
        const creativeShare = c.persons.length / totalCampaignPersons;
        const estimatedSpend = campSpend * creativeShare;
        const cpftd = c.ftds.length > 0 ? estimatedSpend / c.ftds.length : 0;
        return (
          <span className="font-mono text-13">
            {cpftd > 0 ? fmtMoney(cpftd) : '—'}
          </span>
        );
      },
    },
    {
      header: 'Ações',
      accessorKey: 'id' as const,
      cell: (c: CreativeRow) => (
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

  return (
    <AppShell breadcrumb={[{ label: 'Mídia', href: '/media' }, { label: 'Criativos' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-24 font-bold text-[var(--eggshell)] mb-1">Criativos</h1>
          <p className="text-13 text-[var(--stone)]">Todos os criativos ativos nas campanhas de mídia paga</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--proof-blue)]/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-[var(--proof-blue)]" />
            </div>
            <div>
              <div className="text-11 font-mono text-[var(--stone)] uppercase tracking-wider">Imagens</div>
              <div className="text-22 font-mono font-semibold text-[var(--eggshell)]">{imageCount}</div>
            </div>
          </div>

          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--verified)]/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-[var(--verified)]" />
            </div>
            <div>
              <div className="text-11 font-mono text-[var(--stone)] uppercase tracking-wider">Vídeos</div>
              <div className="text-22 font-mono font-semibold text-[var(--eggshell)]">{videoCount}</div>
            </div>
          </div>

          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--zinc)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[var(--stone)]" />
            </div>
            <div>
              <div className="text-11 font-mono text-[var(--stone)] uppercase tracking-wider">Carrosséis</div>
              <div className="text-22 font-mono font-semibold text-[var(--eggshell)]">{textCount}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        {visibleCreatives.length > 0 ? (
          <DataTable
            data={visibleCreatives}
            columns={columns}
            searchPlaceholder="Buscar criativos..."
          />
        ) : (
          <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl py-16 text-center">
            <p className="text-14 text-[var(--stone)]">Nenhum criativo disponível.</p>
          </div>
        )}
      </div>

      {/* Archive confirm */}
      <ConfirmDialog
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          if (archiveTarget) {
            setArchivedIds(prev => new Set([...prev, archiveTarget]));
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
