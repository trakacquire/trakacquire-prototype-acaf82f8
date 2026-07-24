import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useParams } from 'wouter';
import { db } from '@/lib/fake/db';
import { toast } from 'sonner';
import { StatusChip } from '@/components/domain/StatusChip';
import { PreviewBadge } from '@/components/data/PreviewBadge';
import { ScenarioStateGate, StateShowcase } from '@/components/state/ScenarioStateGate';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Play, FileDown, Calendar, Clock, Lock } from 'lucide-react';

const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

function humanCron(cron: string): string {
  if (cron === '0 8 * * 1') return 'Toda segunda, 08h00';
  if (cron === '0 9 1 * *') return 'Todo dia 1 do mês, 09h00';
  if (cron === '0 7 * * *') return 'Diariamente, 07h00';
  return cron;
}

function typeBadgeStyle(type: string) {
  if (type === 'pl') return 'bg-[var(--proof-blue)]/10 text-[var(--proof-blue)]';
  if (type === 'cohort') return 'bg-[var(--verified)]/10 text-[var(--verified)]';
  if (type === 'reconciliation') return 'bg-[var(--warning)]/10 text-[var(--warning)]';
  if (type === 'operational') return 'bg-[var(--stone)]/10 text-[var(--stone)]';
  return 'bg-[var(--zinc)] text-[var(--stone)]';
}

function typeName(type: string) {
  if (type === 'pl') return 'P&L';
  if (type === 'cohort') return 'Coorte';
  if (type === 'reconciliation') return 'Reconciliação';
  if (type === 'operational') return 'Operacional';
  return 'Personalizado';
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const report = db.getReport(params.id ?? '') ?? db.reports[0];

  const m = db.metricsForPeriod(30);
  const cohorts = db.cohortData();
  const bySource = db.revenueBySource(30);
  const divergent = db.getDivergent();

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [recipients, setRecipients] = useState(report.recipients.join(', '));

  // P&L — 4 weeks derived from dailySeries
  const plWeeks = (() => {
    const weeks = [];
    for (let w = 3; w >= 0; w--) {
      const series = db.dailySeries(7, 'deposits');
      const grossDeposits = series.reduce((s, d) => s + d.value, 0) * (0.85 + w * 0.05);
      const deducoes = Math.round(grossDeposits * 0.13);
      const receitaLiq = Math.round(grossDeposits - deducoes);
      const comissoes = Math.round(receitaLiq * 0.3);
      const margem = receitaLiq > 0 ? Math.round((receitaLiq - comissoes) / receitaLiq * 1000) / 10 : 0;
      const weekLabel = `Semana ${4 - w} (${7 * w + 1}-${7 * (w + 1)} Jul)`;
      weeks.push({ label: weekLabel, gross: Math.round(grossDeposits), deducoes, receitaLiq, comissoes, margem });
    }
    return weeks;
  })();

  const handleRun = () => {
    toast('Relatório em execução…');
    setTimeout(() => toast.success('Pronto! Dados atualizados.'), 1500);
  };

  const handleExportCSV = () => {
    let csvContent = '';
    let filename = (report.name ?? 'relatorio') + '.csv';

    if (report.type === 'pl') {
      csvContent = 'Semana,Receita Bruta,Deduções,Receita Líquida,Comissões,Margem %\n';
      const total = { gross: 0, deducoes: 0, receitaLiq: 0, comissoes: 0 };
      plWeeks.forEach(w => {
        csvContent += `"${w.label}",${w.gross},${w.deducoes},${w.receitaLiq},${w.comissoes},${w.margem}\n`;
        total.gross += w.gross; total.deducoes += w.deducoes; total.receitaLiq += w.receitaLiq; total.comissoes += w.comissoes;
      });
      const totalMargem = total.receitaLiq > 0 ? Math.round((total.receitaLiq - total.comissoes) / total.receitaLiq * 1000) / 10 : 0;
      csvContent += `"Total",${total.gross},${total.deducoes},${total.receitaLiq},${total.comissoes},${totalMargem}\n`;
    } else if (report.type === 'cohort') {
      csvContent = 'Semana,Entradas,D0 FTDs,D0%,D7 FTDs,D7%,D30 FTDs,D30%,LTV médio\n';
      cohorts.forEach(c => {
        csvContent += `${c.week},${c.entered},${c.d0},${c.d0pct},${c.d7},${c.d7pct},${c.d30},${c.d30pct},${c.ltv}\n`;
      });
    } else if (report.type === 'reconciliation') {
      csvContent = 'ID,Nome,Status,Valor,Data\n';
      divergent.forEach(p => {
        const dep = p.deposits[0];
        csvContent += `${p.id},"${p.name}",${p.status},${dep?.amount ?? 0},${dep ? fmtDate(dep.at) : ''}\n`;
      });
    } else if (report.type === 'operational') {
      csvContent = 'Métrica,Valor\n';
      const todayM = db.metricsForPeriod(1);
      csvContent += `Cliques,${todayM.clicks}\nRegistros,${todayM.registrations}\nFTDs,${todayM.ftds}\nDepósitos Brutos,${todayM.gross_deposits}\nMargem Bruta,${todayM.gross_margin}\n`;
    } else {
      csvContent = 'Origem,FTDs,Receita Bruta,Receita Líquida,Investimento,CP/FTD,Margem %\n';
      bySource.forEach(s => {
        csvContent += `"${s.source}",${s.ftds},${s.gross},${s.net},${s.spend},${s.cpftd},${s.margin_pct}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado com sucesso.');
  };

  return (
    <AppShell breadcrumb={[{ label: 'Prove' }, { label: 'Relatórios', href: '/reports' }, { label: report.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="kicker mb-1">Prove / Relatório</div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-24 font-bold text-[var(--eggshell)]">{report.name}</h1>
                <span className={`px-2 py-0.5 rounded text-11 uppercase font-bold ${typeBadgeStyle(report.type)}`}>
                  {typeName(report.type)}
                </span>
                <PreviewBadge />
                <StateShowcase />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-13 text-[var(--stone)]">
                <span>Período: {report.period}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-verified/10 text-verified text-11 font-mono uppercase tabular-nums">
                  <Lock className="w-3 h-3" /> v3 · congelado
                </span>
                <span className="font-mono text-11 tabular-nums">reabrir gera v4</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRun}
                className="flex items-center gap-2 bg-[var(--verified)] text-[var(--ink)] px-3 py-1.5 rounded-md font-medium text-13 hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4" /> Executar (nova versão)
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-[var(--zinc)] text-[var(--eggshell)] border border-[var(--line)] px-3 py-1.5 rounded-md font-medium text-13 hover:bg-[var(--iron)]"
              >
                <FileDown className="w-4 h-4" /> Exportar CSV
              </button>
              <button
                onClick={() => setScheduleOpen(true)}
                className="flex items-center gap-2 bg-[var(--zinc)] text-[var(--eggshell)] border border-[var(--line)] px-3 py-1.5 rounded-md font-medium text-13 hover:bg-[var(--iron)]"
              >
                <Calendar className="w-4 h-4" /> Agendar
              </button>
            </div>
          </div>
        </div>

        <ScenarioStateGate emptyTitle="Snapshot vazio" emptyDescription="Este relatório ainda não gerou dados neste período." emptyPrerequisite="Execute agora para produzir a primeira versão.">


        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* P&L */}
            {report.type === 'pl' && (
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-[var(--line)]">
                      {['Semana', 'FTDs', 'Receita Bruta', 'Deduções', 'Receita Líquida', 'Comissões', 'Margem'].map(h => (
                        <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plWeeks.map((w, i) => (
                      <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                        <td className="px-4 py-3 text-[var(--stone)] text-12">{w.label}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{Math.round(m.ftds / 4)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(w.gross)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--critical)]">{fmt(w.deducoes)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-[var(--proof-blue)]">{fmt(w.receitaLiq)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(w.comissoes)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--verified)]">{w.margem}%</td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-[var(--iron)]/40">
                      <td className="px-4 py-3 font-bold text-[var(--eggshell)]">Total</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--eggshell)]">{m.ftds}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--eggshell)]">{fmt(plWeeks.reduce((s, w) => s + w.gross, 0))}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--critical)]">{fmt(plWeeks.reduce((s, w) => s + w.deducoes, 0))}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--proof-blue)]">{fmt(plWeeks.reduce((s, w) => s + w.receitaLiq, 0))}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--eggshell)]">{fmt(plWeeks.reduce((s, w) => s + w.comissoes, 0))}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--verified)]">
                        {(() => { const tot = plWeeks.reduce((s, w) => s + w.receitaLiq, 0); const c = plWeeks.reduce((s, w) => s + w.comissoes, 0); return tot > 0 ? Math.round((tot - c) / tot * 1000) / 10 : 0; })()}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Cohort */}
            {report.type === 'cohort' && (
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-[var(--line)]">
                      {['Semana', 'Entradas', 'D0 FTDs', 'D0%', 'D7 FTDs', 'D7%', 'D30 FTDs', 'D30%', 'LTV médio'].map(h => (
                        <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohorts.map((c, i) => (
                      <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                        <td className="px-4 py-3 font-mono text-12 text-[var(--stone)]">{c.week}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{c.entered}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{c.d0}</td>
                        <td className="px-4 py-3 font-mono text-[var(--verified)]">{c.d0pct}%</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{c.d7}</td>
                        <td className="px-4 py-3 font-mono text-[var(--verified)]">{c.d7pct}%</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{c.d30}</td>
                        <td className="px-4 py-3 font-mono text-[var(--verified)]">{c.d30pct}%</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(c.ltv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reconciliation */}
            {report.type === 'reconciliation' && (
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-[var(--line)]">
                      {['ID', 'Nome', 'Tipo', 'Valor', 'Data'].map(h => (
                        <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {divergent.map((p, i) => {
                      const dep = p.deposits[0];
                      return (
                        <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                          <td className="px-4 py-3 font-mono text-12 text-[var(--proof-blue)]">{p.id}</td>
                          <td className="px-4 py-3 text-[var(--eggshell)]">{p.name}</td>
                          <td className="px-4 py-3"><StatusChip status="Divergent" /></td>
                          <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{dep ? fmt(dep.amount) : '—'}</td>
                          <td className="px-4 py-3 text-[var(--stone)]">{dep ? fmtDate(dep.at) : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Operational */}
            {report.type === 'operational' && (() => {
              const todayM = db.metricsForPeriod(1);
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Cliques', value: String(todayM.clicks) },
                    { label: 'Registros', value: String(todayM.registrations) },
                    { label: 'FTDs', value: String(todayM.ftds) },
                    { label: 'Depósitos Brutos', value: fmt(todayM.gross_deposits) },
                    { label: 'Saques', value: fmt(todayM.withdrawals) },
                    { label: 'Margem Bruta', value: fmt(todayM.gross_margin) },
                  ].map(card => (
                    <div key={card.label} className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4">
                      <div className="text-12 text-[var(--stone)] mb-1">{card.label} — hoje</div>
                      <div className="text-20 font-mono font-bold text-[var(--eggshell)]">{card.value}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Custom */}
            {report.type === 'custom' && (
              <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl overflow-hidden">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-[var(--line)]">
                      {['Origem', 'FTDs', 'Receita Bruta', 'Receita Líquida', 'Investimento', 'CP/FTD', 'Margem'].map(h => (
                        <th key={h} className="text-left text-11 font-semibold text-[var(--stone)] uppercase px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bySource.map((s, i) => (
                      <tr key={i} className="border-b border-[var(--line)] hover:bg-[var(--iron)] transition-colors">
                        <td className="px-4 py-3 text-[var(--eggshell)] font-medium">{s.source}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{s.ftds}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(s.gross)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--proof-blue)]">{fmt(s.net)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(s.spend)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--eggshell)]">{fmt(s.cpftd)}</td>
                        <td className="px-4 py-3 font-mono text-[var(--verified)]">{s.margin_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 text-12 text-[var(--stone)]">
              <Clock className="w-3.5 h-3.5" />
              Última execução: {fmtDate(report.last_run_at)}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-[var(--graphite)] border border-[var(--line)] rounded-xl p-4 space-y-4 sticky top-6">
              <h3 className="text-11 uppercase font-bold text-[var(--stone)]">Metadados</h3>
              <div className="space-y-3 text-13">
                <div>
                  <div className="text-11 text-[var(--stone)] mb-0.5">Criado por</div>
                  <div className="font-mono text-12 text-[var(--eggshell)]">{report.created_by}</div>
                </div>
                <div>
                  <div className="text-11 text-[var(--stone)] mb-0.5">Última execução</div>
                  <div className="text-[var(--eggshell)]">{fmtDate(report.last_run_at)}</div>
                </div>
                {report.scheduled && report.schedule_cron && (
                  <div>
                    <div className="text-11 text-[var(--stone)] mb-0.5">Agendamento</div>
                    <div className="text-[var(--eggshell)]">{humanCron(report.schedule_cron)}</div>
                  </div>
                )}
                <div>
                  <div className="text-11 text-[var(--stone)] mb-0.5">Destinatários</div>
                  <div className="space-y-1">
                    {report.recipients.map(r => (
                      <div key={r} className="font-mono text-11 text-[var(--eggshell)] break-all">{r}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
        </ScenarioStateGate>
      </div>


      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={v => { if (!v) setScheduleOpen(false); }}>
        <DialogContent className="bg-[var(--graphite)] border-[var(--line)] text-[var(--eggshell)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-16 font-bold text-[var(--eggshell)]">Agendar relatório</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-12 text-[var(--stone)] block mb-1">Frequência</label>
              <div className="bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] font-mono">
                {report.schedule_cron ? humanCron(report.schedule_cron) : 'Não agendado'}
              </div>
            </div>
            <div>
              <label className="text-12 text-[var(--stone)] block mb-1">Destinatários (separados por vírgula)</label>
              <input
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
                className="w-full bg-[var(--zinc)] border border-[var(--line)] rounded-md px-3 py-2 text-14 text-[var(--eggshell)] outline-none focus:border-[var(--proof-blue)]"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => setScheduleOpen(false)}
              className="px-4 py-2 rounded-md text-14 font-medium text-[var(--stone)] bg-[var(--zinc)] hover:text-[var(--eggshell)] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => { setScheduleOpen(false); toast.success('Agendamento salvo.'); }}
              className="px-4 py-2 rounded-md text-14 font-medium bg-[var(--eggshell)] text-[var(--ink)] hover:bg-white transition-colors"
            >
              Salvar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
