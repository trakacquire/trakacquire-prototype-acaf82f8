import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { db } from '@/lib/fake/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtTs(isoStr?: string) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtMoney(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATUS_COLORS: Record<string, string> = {
  Captured: '#7C91FF',
  Linked: '#7C91FF',
  Confirmed: '#4CAF50',
  Reconciled: '#4CAF50',
  Divergent: '#F1C778',
  Failed: '#EF7D8B',
  'Policy blocked': '#EF7D8B',
  Orphan: '#FF9800',
  Synthetic: '#9C27B0',
};

function StatusChip({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? '#888';
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-11 font-medium border" style={{ color, borderColor: color + '44', background: color + '18' }}>
      {status}
    </span>
  );
}

const EVT_TYPE_COLOR: Record<string, string> = {
  click: '#7C91FF',
  register: '#4CAF50',
  ftd: '#72E6A6',
  deposit: '#72E6A6',
  withdrawal: '#EF7D8B',
  postback: '#FF9800',
  capi: '#F1C778',
  webhook: '#9C27B0',
  bot_message: '#7C91FF',
  conversation_start: '#E91E63',
};

function TypeChip({ type }: { type: string }) {
  const color = EVT_TYPE_COLOR[type] ?? '#888';
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-11 font-mono border" style={{ color, borderColor: color + '44', background: color + '18' }}>
      {type}
    </span>
  );
}

function SentimentChip({ sentiment }: { sentiment: string }) {
  const map: Record<string, { color: string; label: string }> = {
    positive: { color: '#4CAF50', label: '😊 positivo' },
    neutral: { color: '#7C91FF', label: '😐 neutro' },
    negative: { color: '#EF7D8B', label: '😠 negativo' },
  };
  const { color, label } = map[sentiment] ?? { color: '#888', label: sentiment };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-11 border" style={{ color, borderColor: color + '44', background: color + '18' }}>
      {label}
    </span>
  );
}

// ── Score gauge ───────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score < 30 ? '#EF7D8B' : score < 70 ? '#F1C778' : '#72E6A6';
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={65} cy={65} r={r} fill="none" stroke="#2a2a2a" strokeWidth={10} />
      <circle
        cx={65} cy={65} r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
      />
      <text x={65} y={60} textAnchor="middle" fill={color} fontSize={22} fontFamily="monospace" fontWeight="bold">{score}</text>
      <text x={65} y={76} textAnchor="middle" fill="#888" fontSize={11} fontFamily="monospace">score</text>
    </svg>
  );
}

// ── Funnel step ───────────────────────────────────────────────────────────────
function FunnelStep({ label, date, reached, last }: { label: string; date?: string; reached: boolean; last: boolean }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[80px]">
      <div className="flex items-center w-full">
        {!last && <div className={`flex-1 h-0.5 mr-1 ${reached ? 'bg-proof-blue' : 'bg-zinc'}`} />}
        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${reached ? 'bg-proof-blue/20 border-proof-blue' : 'bg-zinc border-stone/30'}`}>
          {reached ? (
            <svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 6,11 12,3" stroke="#7C91FF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          ) : (
            <div className="w-2 h-2 rounded-full bg-stone/30" />
          )}
        </div>
        {!last && <div className={`flex-1 h-0.5 ml-1 ${reached ? 'bg-proof-blue' : 'bg-zinc'}`} />}
      </div>
      <div className="mt-2 text-center">
        <div className={`text-11 font-medium ${reached ? 'text-eggshell' : 'text-stone'}`}>{label}</div>
        <div className="text-10 font-mono text-stone mt-0.5">{date ? fmtTs(date) : '—'}</div>
      </div>
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ['Identidade', 'Aquisição', 'Provider', 'Funil', 'Atendimento', 'Sinais', 'Derivados'] as const;
type TabType = typeof TABS[number];

export default function Player360Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const person = db.getPerson(id) ?? db.persons[0];
  const [activeTab, setActiveTab] = useState<TabType>('Provider');
  const [convDialog, setConvDialog] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [personTags, setPersonTags] = useState<string[]>(person.tags);
  const [addingTag, setAddingTag] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  const personEvents = db.events.filter(e => e.person_id === person.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Funnel calc
  const clickToFTD = person.clicked_at && person.ftd_at
    ? (new Date(person.ftd_at).getTime() - new Date(person.clicked_at).getTime()) / 60000
    : null;
  const daysSinceClick = person.clicked_at
    ? Math.floor((new Date('2026-07-23').getTime() - new Date(person.clicked_at).getTime()) / 86400000)
    : null;

  // Projected LTV
  const avgDeposit = person.deposits.length > 0 ? person.total_deposited / person.deposits.length : 0;
  const ltvProj = Math.round(avgDeposit * 2.5);

  return (
    <AppShell breadcrumb={[{ label: 'Players', href: '/players' }, { label: person.name }]}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-graphite border border-line rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-24 font-mono font-bold text-eggshell">{person.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <StatusChip status={person.status} />
              {person.telegram_id && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-[6px] border border-proof-blue/20 bg-proof-blue/10 text-proof-blue text-11 font-medium">
                  Telegram Linked
                </span>
              )}
              <span className="text-13 text-stone">• {person.stage}</span>
              <span className="text-12 font-mono text-stone">{person.id}</span>
            </div>
          </div>
          <button className="bg-zinc text-eggshell border border-line px-4 py-2 rounded-md font-medium text-14 hover:bg-iron transition-colors">
            Enviar Mensagem
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-line flex gap-6 px-2 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-14 font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-eggshell border-proof-blue' : 'text-stone border-transparent hover:text-eggshell'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab: Identidade ── */}
        {activeTab === 'Identidade' && (
          <div className="bg-graphite border border-line rounded-xl p-5 space-y-3">
            <h2 className="text-16 font-medium text-eggshell">Identidade</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-13">
              {[
                { label: 'Click ID', value: person.click_id ?? '—' },
                { label: 'Telegram ID', value: person.telegram_id ?? '—' },
                { label: 'Customer ID', value: person.customer_id ?? '—' },
                { label: 'Método', value: person.identity_method ?? '—' },
                { label: 'Confiança', value: person.identity_confidence + '%' },
                { label: 'Source', value: person.source },
              ].map(r => (
                <div key={r.label} className="bg-zinc border border-line rounded-lg p-3">
                  <div className="text-11 text-stone uppercase mb-1">{r.label}</div>
                  <div className="font-mono text-eggshell text-12 break-all">{r.value}</div>
                </div>
              ))}
            </div>
            <a href={`/identity/${person.id}`} className="inline-block mt-2 text-13 text-proof-blue underline underline-offset-2 hover:text-eggshell transition-colors">
              Ver grafo completo →
            </a>
          </div>
        )}

        {/* ── Tab: Aquisição ── */}
        {activeTab === 'Aquisição' && (
          <div className="bg-graphite border border-line rounded-xl p-5 space-y-4">
            <h2 className="text-16 font-medium text-eggshell">Aquisição</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Source', value: person.source },
                { label: 'Campaign', value: person.campaign_id ?? '—' },
                { label: 'AdSet', value: person.adset_id ?? '—' },
                { label: 'Ad', value: person.ad_id ?? '—' },
                { label: 'UTM Source', value: person.utm_source ?? '—' },
                { label: 'UTM Medium', value: person.utm_medium ?? '—' },
                { label: 'Clicado em', value: fmtTs(person.clicked_at) },
                { label: 'Click ID', value: person.click_id ?? '—' },
              ].map(r => (
                <div key={r.label} className="bg-zinc border border-line rounded-lg p-3">
                  <div className="text-11 text-stone uppercase mb-1">{r.label}</div>
                  <div className="font-mono text-eggshell text-12 break-all">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Provider ── */}
        {activeTab === 'Provider' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="text-12 font-mono text-stone uppercase mb-1">Registro</div>
              <div className="text-18 font-mono text-eggshell">{person.registered_at ? fmtTs(person.registered_at) : '—'}</div>
            </div>
            <div className={`bg-graphite border rounded-xl p-4 ${person.ftd_at ? 'border-verified/30' : 'border-line'}`}>
              <div className="text-12 font-mono text-stone uppercase mb-1">FTD</div>
              <div className={`text-18 font-mono ${person.ftd_at ? 'text-verified' : 'text-stone'}`}>
                {person.deposits.find(d => d.type === 'ftd') ? fmtMoney(person.deposits.find(d => d.type === 'ftd')!.amount) : '—'}
              </div>
              <div className="text-11 text-stone mt-1">{fmtTs(person.ftd_at)}</div>
            </div>
            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="text-12 font-mono text-stone uppercase mb-1">Total Depositado</div>
              <div className="text-18 font-mono text-eggshell">{fmtMoney(person.total_deposited)}</div>
            </div>
            <div className="bg-graphite border border-line rounded-xl p-4">
              <div className="text-12 font-mono text-stone uppercase mb-1">Net Deposit</div>
              <div className="text-18 font-mono text-proof-blue">{fmtMoney(person.net_deposit)}</div>
            </div>
          </div>
        )}

        {/* ── Tab: Funil ── */}
        {activeTab === 'Funil' && (
          <div className="space-y-6">
            <div className="bg-graphite border border-line rounded-xl p-6">
              <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-6">Jornada do Player</h2>
              <div className="flex items-start gap-0 overflow-x-auto pb-2">
                {[
                  { label: 'Capturado', date: person.clicked_at, reached: !!person.clicked_at },
                  { label: 'Linkado', date: person.clicked_at, reached: !!person.telegram_id },
                  { label: 'Registrado', date: person.registered_at, reached: !!person.registered_at },
                  { label: 'Confirmado', date: person.ftd_at, reached: !!person.ftd_at },
                  { label: 'Reconciliado', date: person.last_deposit_at, reached: person.status === 'Reconciled' },
                ].map((step, i, arr) => (
                  <FunnelStep key={step.label} label={step.label} date={step.date} reached={step.reached} last={i === arr.length - 1} />
                ))}
              </div>
            </div>

            {/* Time-to-FTD stat */}
            <div className="bg-graphite border border-line rounded-xl p-6">
              {clickToFTD !== null ? (
                <div>
                  <div className="text-12 font-mono text-stone uppercase mb-2">Tempo clique → FTD</div>
                  <div className="text-24 font-mono text-verified">
                    {clickToFTD >= 60 ? `${Math.floor(clickToFTD / 60)}h ${Math.round(clickToFTD % 60)}min` : `${Math.round(clickToFTD)}min`}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-12 font-mono text-stone uppercase mb-2">Status da conversão</div>
                  <div className="text-16 text-stone">
                    Ainda não converteu
                    {daysSinceClick !== null && ` — ${daysSinceClick} dias desde o clique`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Atendimento ── */}
        {activeTab === 'Atendimento' && (
          <div className="space-y-4">
            {person.conversations.length === 0 ? (
              <div className="bg-graphite border border-line rounded-xl p-12 text-center">
                <div className="text-32 mb-3">💬</div>
                <div className="text-16 font-medium text-eggshell mb-1">Nenhuma conversa</div>
                <div className="text-13 text-stone">Este player não tem histórico de conversas.</div>
              </div>
            ) : (
              person.conversations.map(conv => (
                <div key={conv.id} className="bg-graphite border border-line rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-11 font-medium ${conv.channel === 'telegram' ? 'bg-proof-blue/10 text-proof-blue border border-proof-blue/30' : 'bg-verified/10 text-verified border border-verified/30'}`}>
                      {conv.channel === 'telegram' ? '🔵 Telegram' : '🟢 WhatsApp'}
                    </span>
                    <StatusChip status={conv.status} />
                    <SentimentChip sentiment={conv.sentiment} />
                    <span className="text-12 text-stone ml-auto">{conv.agent}</span>
                  </div>
                  <div className="text-13 text-stone">
                    <span className="font-mono">{conv.messages}</span> mensagens
                  </div>
                  <div className="text-13 italic text-stone border-l-2 border-line pl-3">"{conv.last_message}"</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {conv.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-11 bg-zinc border border-line text-stone">{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => setConvDialog(conv.id)}
                    className="px-3 py-1.5 rounded text-12 font-medium bg-zinc text-eggshell border border-line hover:bg-iron transition-colors"
                  >
                    Ver conversa
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Tab: Sinais ── */}
        {activeTab === 'Sinais' && (
          <div className="bg-graphite border border-line rounded-xl p-5">
            <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-4">Eventos de Sinal</h2>
            {personEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-32 mb-2">📡</div>
                <div className="text-16 font-medium text-eggshell">Nenhum evento</div>
                <div className="text-13 text-stone">Sem sinais registrados para este player.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-13">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left text-11 text-stone font-medium pb-2 pr-4">Tipo</th>
                      <th className="text-left text-11 text-stone font-medium pb-2 pr-4">Status</th>
                      <th className="text-right text-11 text-stone font-medium pb-2 pr-4">Valor</th>
                      <th className="text-right text-11 text-stone font-medium pb-2 pr-4">Latência</th>
                      <th className="text-left text-11 text-stone font-medium pb-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personEvents.map(evt => (
                      <React.Fragment key={evt.id}>
                        <tr
                          className="border-b border-line/50 hover:bg-zinc/30 cursor-pointer transition-colors"
                          onClick={() => setExpandedEvent(expandedEvent === evt.id ? null : evt.id)}
                        >
                          <td className="py-2 pr-4"><TypeChip type={evt.type} /></td>
                          <td className="py-2 pr-4"><StatusChip status={evt.status} /></td>
                          <td className="py-2 pr-4 text-right font-mono text-12 text-eggshell">
                            {evt.value !== undefined ? fmtMoney(evt.value) : '—'}
                          </td>
                          <td className="py-2 pr-4 text-right font-mono text-12 text-stone">{evt.latency_ms}ms</td>
                          <td className="py-2 font-mono text-11 text-stone whitespace-nowrap">{fmtTs(evt.timestamp)}</td>
                        </tr>
                        {expandedEvent === evt.id && evt.meta && (
                          <tr className="border-b border-line/30">
                            <td colSpan={5} className="py-2 px-3">
                              <pre className="text-10 font-mono text-stone bg-iron rounded p-2 overflow-x-auto">
                                {JSON.stringify(evt.meta, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Derivados ── */}
        {activeTab === 'Derivados' && (
          <div className="space-y-5">
            {/* Score + Badges */}
            <div className="bg-graphite border border-line rounded-xl p-5 flex flex-col sm:flex-row gap-6 items-center">
              <ScoreGauge score={person.score} />
              <div className="flex flex-wrap gap-2">
                {person.is_vip && (
                  <span className="px-3 py-1.5 rounded text-13 font-bold bg-verified/15 text-verified border border-verified/30">VIP</span>
                )}
                {person.is_orphan && (
                  <span className="px-3 py-1.5 rounded text-13 font-bold bg-warning/15 text-warning border border-warning/30">Órfão</span>
                )}
                {person.has_chargeback && (
                  <span className="px-3 py-1.5 rounded text-13 font-bold bg-critical/15 text-critical border border-critical/30">Chargeback</span>
                )}
                {person.is_duplicate_risk && (
                  <span className="px-3 py-1.5 rounded text-13 font-bold bg-warning/15 text-warning border border-warning/30">Risco Duplicata</span>
                )}
              </div>
            </div>

            {/* Stat grid */}
            <div className="bg-graphite border border-line rounded-xl p-5">
              <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-4">Métricas Derivadas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tempo→FTD', value: (() => { if (!person.clicked_at || !person.ftd_at) return '—'; const mins = (new Date(person.ftd_at).getTime() - new Date(person.clicked_at).getTime()) / 60000; return mins >= 60 ? `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m` : `${Math.round(mins)}min`; })() },
                  { label: 'Total depositado', value: fmtMoney(person.total_deposited) },
                  { label: 'Total sacado', value: fmtMoney(person.total_withdrawn) },
                  { label: 'Receita líquida', value: fmtMoney(person.net_deposit) },
                  { label: 'Payout', value: fmtMoney(person.payout) },
                  { label: 'Dias inativo', value: String(Math.floor((new Date('2026-07-23').getTime() - new Date(person.last_seen_at).getTime()) / 86400000)) + 'd' },
                  { label: 'LTV proj. 90d', value: fmtMoney(ltvProj) },
                  { label: 'Score', value: String(person.score) },
                ].map(stat => (
                  <div key={stat.label} className="bg-zinc border border-line rounded-lg p-3">
                    <div className="text-11 text-stone uppercase mb-1">{stat.label}</div>
                    <div className="font-mono text-14 text-eggshell">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-graphite border border-line rounded-xl p-5">
              <h2 className="text-14 font-medium text-stone uppercase tracking-wider mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2 items-center">
                {personTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded text-12 bg-zinc border border-line text-eggshell">
                    {tag}
                    <button
                      onClick={() => setPersonTags(t => t.filter(x => x !== tag))}
                      className="ml-1 text-stone hover:text-critical transition-colors text-12 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {addingTag ? (
                  <input
                    autoFocus
                    type="text"
                    value={newTagValue}
                    onChange={e => setNewTagValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newTagValue.trim()) {
                        setPersonTags(t => [...t, newTagValue.trim()]);
                        setNewTagValue('');
                        setAddingTag(false);
                      }
                      if (e.key === 'Escape') { setAddingTag(false); setNewTagValue(''); }
                    }}
                    onBlur={() => { setAddingTag(false); setNewTagValue(''); }}
                    placeholder="nova tag…"
                    className="px-2 py-1 rounded text-12 bg-zinc border border-proof-blue/50 text-eggshell placeholder:text-stone focus:outline-none w-24"
                  />
                ) : (
                  <button
                    onClick={() => setAddingTag(true)}
                    className="px-2 py-1 rounded text-12 bg-zinc border border-line text-stone hover:text-eggshell hover:border-proof-blue/30 transition-colors"
                  >
                    + adicionar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation dialog */}
      {convDialog && (() => {
        const conv = person.conversations.find(c => c.id === convDialog);
        if (!conv) return null;
        return (
          <Dialog open={true} onOpenChange={() => setConvDialog(null)}>
            <DialogContent className="bg-graphite border-line text-eggshell max-w-md">
              <DialogHeader>
                <DialogTitle className="text-eggshell">Conversa {conv.channel === 'telegram' ? '🔵 Telegram' : '🟢 WhatsApp'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                {/* 3 hardcoded chat bubbles */}
                <div className="flex justify-start">
                  <div className="bg-zinc border border-line rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                    <div className="text-11 text-stone mb-1">🤖 Bot</div>
                    <div className="text-13 text-eggshell">Olá! Bem-vindo. Como posso ajudar?</div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-proof-blue/20 border border-proof-blue/30 rounded-2xl rounded-tr-sm px-3 py-2 max-w-xs">
                    <div className="text-11 text-proof-blue mb-1">{person.name.split(' ')[0]}</div>
                    <div className="text-13 text-eggshell">Quero saber sobre meu depósito.</div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-zinc border border-line rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                    <div className="text-11 text-stone mb-1">👤 {conv.agent}</div>
                    <div className="text-13 text-eggshell italic">"{conv.last_message}"</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}
    </AppShell>
  );
}
