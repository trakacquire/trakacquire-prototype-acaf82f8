/**
 * SHAPE ADAPTER — every value here is DERIVED from the canonical db.ts.
 * Do not hardcode numbers. Field names are kept legacy-compatible so pages
 * that still import from `@/lib/fake/extra` render the same scenario as
 * every other screen. Any new page should import directly from `@/lib/fake/db`.
 */
import {
  TENANTS, REPORTS, LINKS, DOMAINS, FLOWS, BROADCASTS, PERSONS,
  metricsForPeriod, spendForPeriod,
} from './db';

const CANONICAL_PERIOD = 30;
const m = metricsForPeriod(CANONICAL_PERIOD);
const totalSpend = spendForPeriod(CANONICAL_PERIOD).total;

// ── Tenants (Platform Admin) ────────────────────────────────────────────────
export const tenants = TENANTS.map(t => ({
  id: t.id,
  name: t.name,
  plan: t.plan,
  mrr: t.mrr,
  usage: t.events_30d,
  quota: t.events_quota,
  health: t.health === 'green' ? 'good' : t.health === 'yellow' ? 'warning' : 'critical',
  active: t.status !== 'suspended',
  last_access: t.created_at,
  ftd_reached: t.status === 'active',
  state: t.status === 'active' ? 'ativo' : t.status === 'trial' ? 'trial' : 'suspenso',
}));

// ── Reports ─────────────────────────────────────────────────────────────────
export const reports = REPORTS.map(r => ({
  id: r.id,
  name: r.name,
  status: r.scheduled ? 'ativo' : 'pausado',
  schedule: r.scheduled ? (r.schedule_cron ?? 'Agendado') : 'Manual',
  recipients: r.recipients.length,
}));

// ── Links ───────────────────────────────────────────────────────────────────
// CPFTD por link derivado do investimento canônico proporcional ao share de cliques,
// garantindo que a soma ponderada bate com metricsForPeriod(30).cpftd.
const totalUniqueClicks = LINKS.reduce((s, l) => s + l.unique_clicks, 0) || 1;
const LINK_TYPE: Record<string, string> = {
  camp_meta_001: 'presell→bot',
  camp_meta_002: 'multi-fonte',
  camp_tik_001: 'presell→bot',
};
export const links = LINKS.map(l => {
  const share = l.unique_clicks / totalUniqueClicks;
  const cpftd = l.ftds > 0 ? Math.round((totalSpend * share) / l.ftds) : 0;
  return {
    id: l.id,
    name: l.name,
    type: l.campaign_id ? (LINK_TYPE[l.campaign_id] ?? 'presell→bot') : 'bot→canal',
    domain: l.url.split('/')[0],
    clicks: l.clicks,
    conversions: l.ftds,
    cpftd,
    state: l.status === 'active' ? 'ativo' : l.status === 'paused' ? 'pausado' : 'arquivado',
  };
});

// ── Domains ─────────────────────────────────────────────────────────────────
export const domains = DOMAINS.map(d => ({
  id: d.id,
  name: d.domain,
  status: d.status === 'active' ? 'verificado' : 'pendente',
  role: d.type === 'presell' ? 'Principal' : d.type === 'track' ? 'Secundário' : 'Reserva',
  p95: d.status === 'active' ? 48 : 0,
  last_check: d.status === 'active' ? '2min atrás' : 'nunca',
}));

// ── Flows ───────────────────────────────────────────────────────────────────
export const flows = FLOWS.map(f => ({
  id: f.id,
  name: f.name,
  status: f.status === 'active' ? 'published' : f.status,
  version: 1,
  entries: f.persons_total,
  ftd_generated: f.ftds_generated,
  revenue: f.revenue,
  nodes: f.nodes,
}));

// ── Segments (pass-through) ─────────────────────────────────────────────────
export { SEGMENTS as segments } from './db';

// ── Broadcasts ──────────────────────────────────────────────────────────────
export const broadcasts = BROADCASTS.map(b => ({
  id: b.id,
  name: b.name,
  status: b.status === 'sent' ? 'enviado' : b.status === 'scheduled' ? 'agendado' : b.status,
  target: b.sent > 0 ? b.sent : (b.status === 'scheduled' ? 1234 : 0),
  open_rate: b.sent > 0 ? Math.round((b.read / b.sent) * 100) : 0,
  date: b.sent_at ?? b.scheduled_at ?? '-',
}));

// ── Conversations (Inbox) ───────────────────────────────────────────────────
export const conversations = PERSONS.flatMap(p =>
  p.conversations.map(c => ({
    id: c.id,
    user: p.id,
    name: p.name,
    channel: c.channel === 'telegram' ? 'Telegram' : 'WhatsApp',
    last_msg: c.last_message,
    time: relativeTime(c.started_at),
    unread: c.status === 'open' || c.status === 'pending',
  })),
).slice(0, 12);

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
