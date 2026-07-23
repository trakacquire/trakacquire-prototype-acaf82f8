import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DataTable } from '@/components/data/DataTable';
import { reports } from '@/lib/fake/extra';
import { PlayCircle, Clock } from 'lucide-react';

export default function ReportsPage() {
  const columns = [
    { header: 'Relatório', accessorKey: 'name', cell: (r: any) => <span className="font-medium text-14 text-eggshell">{r.name}</span> },
    { header: 'Status', accessorKey: 'status', cell: (r: any) => (
      <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${r.status === 'ativo' ? 'bg-verified/10 text-verified' : 'bg-zinc text-stone border border-line'}`}>
        {r.status}
      </span>
    )},
    { header: 'Agendamento', accessorKey: 'schedule', cell: (r: any) => (
      <div className="flex items-center gap-1.5 text-13 text-stone">
        <Clock className="w-3.5 h-3.5" />
        {r.schedule}
      </div>
    )},
    { header: 'Ações', accessorKey: 'actions', cell: () => (
      <button className="text-proof-blue hover:text-eggshell transition-colors flex items-center gap-1 text-13">
        <PlayCircle className="w-4 h-4" /> Gerar agora
      </button>
    )}
  ];

  return (
    <AppShell breadcrumb={[{ label: 'Reports' }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-24 font-bold text-eggshell mb-2">Reports Library</h1>
            <p className="text-14 text-stone">Biblioteca de relatórios estáticos e snapshots agendados.</p>
          </div>
          <button className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
            Criar Relatório
          </button>
        </div>

        <DataTable data={reports} columns={columns} />
      </div>
    </AppShell>
  );
}