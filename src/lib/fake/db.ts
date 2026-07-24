/**
 * TrakAcquire — Central Mock Database (CANONICAL SCENARIO)
 * ──────────────────────────────────────────────────────────────────────────
 * Single source of truth for ALL prototype data. Every page derives numbers
 * from this module — never hardcode. `lib/fake/extra.ts` is a SHAPE ADAPTER
 * over this file; it MUST NOT redefine any anchor value.
 *
 * SEED: 0xDEADBEEF (deterministic — same result on every reload)
 * PERIOD: 90 days ending 2026-07-23 (TODAY).
 *
 * ── ANCHOR VALUES (numbers all screens must reconcile to) ─────────────────
 *   Clicks canônicos (30d) ... 5.000 (inflado sobre PERSONS via CLICK_INFLATION;
 *                              PERSONS mantém 78 identidades resolvidas → Linked)
 *   Registrations (30d) ...... 75 (âncora imutável)
 *   FTDs (30d) ............... 36 (âncora imutável)
 *   Investimento ............. R$ 12.013 · CPFTD R$ 334 · Net R$ 19.618
 *   Persons total ............ 240 (240 personas geradas, seed fixa)
 *
 * ── DUAS VISTAS DA MESMA VERDADE ──────────────────────────────────────────
 *   Journey proof (CADEIA DE PROVA da atribuição):
 *     Captured (5.000 cliques) → Linked (78 identidades resolvidas) →
 *     Registered (75) → Confirmed (36) → Reconciled (36)
 *   Funil de aquisição (comportamento operacional — funnelSteps.ts):
 *     Clique (5.000) → StartBot (~780) → Entrada Canal (~320) → Cadastro (75) → FTD (36)
 *   Ambas partilham as MESMAS âncoras nas pontas (5.000 no topo, 36 no fim).
 *   Linked ≠ 100% dos Captured: só cliques amarrados a uma pessoa entram.
 *   O Evidence Drawer marca cada número com o campo `view`.

 *
 *   Journey (90d) monotônico:  Captured ≥ Linked ≥ Registered ≥ Confirmed ≥ Reconciled
 *   Investimento ............. spendForPeriod(days) — Meta cresce R$180→R$300, TikTok R$120/d
 *   Custo/FTD ................ metricsForPeriod(days).cpftd = round(meta_spend / ftds)
 *   Net deposit .............. gross_deposits − withdrawals (todas as telas)
 *
 * ── COMO CADA TELA DERIVA ─────────────────────────────────────────────────
 *   Command ............ metricsForPeriod(period) + funnelData(period) + events (feed)
 *   Analytics/Revenue .. metricsForPeriod + revenueBySource + dailySeries
 *   Ledger ............. PERSONS.flatMap(deposits) filtered by period
 *   Players/Player360 .. PERSONS (mesma lista, mesmos totals)
 *   Reports/Cohorts .... cohortData() + metricsForPeriod
 *   Reconciliation ..... allDeposits.filter(!reconciled || amount != provider_reported)
 *   Media/Campanhas .... CAMPAIGNS + PERSONS.filter(campaign_id)
 *   Signal Ledger ...... EVENTS (stream derivado das PERSONS/deposits)
 *
 * Regra: se um número em qualquer tela não vier de uma dessas funções,
 * é violação do dataset único — abrir ADR ou removê-lo.
 * ──────────────────────────────────────────────────────────────────────────
 */


// ── SEEDED RNG ───────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const _rand = mulberry32(0xdeadbeef);
const r = () => _rand();
const ri = (min: number, max: number) => min + Math.floor(r() * (max - min + 1));
const rf = (min: number, max: number) => min + r() * (max - min);
const rc = <T>(arr: T[]): T => arr[Math.floor(r() * arr.length)];
const rBool = (prob = 0.5) => r() < prob;

// ── DATE UTILS ───────────────────────────────────────────────────────────────
const TODAY_STR = '2026-07-23T12:00:00.000Z';
const TODAY = new Date(TODAY_STR);

function daysAgo(n: number): Date {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}
function addHours(d: Date, h: number) { return new Date(d.getTime() + h * 3_600_000); }
function addMins(d: Date, m: number) { return new Date(d.getTime() + m * 60_000); }
function iso(d: Date) { return d.toISOString(); }

function daysSince(isoStr: string | undefined): number {
  if (!isoStr) return Infinity;
  return (TODAY.getTime() - new Date(isoStr).getTime()) / 86_400_000;
}
function isInLastDays(isoStr: string | undefined, days: number): boolean {
  return daysSince(isoStr) <= days;
}

// ── NAME POOLS ───────────────────────────────────────────────────────────────
const MALE_NAMES = ['João','Carlos','Pedro','Lucas','Mateus','Rafael','Daniel','Gabriel','André','Marcos','Bruno','Diego','Henrique','Eduardo','Felipe','Gustavo','Igor','Leandro','Murilo','Nicolas','Pablo','Rodrigo','Samuel','Thiago','Victor','Wagner','Yuri','Alexandre','Bernardo','Caio'];
const FEMALE_NAMES = ['Ana','Maria','Juliana','Fernanda','Carla','Larissa','Bruna','Leticia','Amanda','Camila','Daniela','Elaine','Flavia','Gabriela','Helena','Isabel','Jessica','Karen','Lívia','Marina','Nathalia','Olivia','Patricia','Raquel','Sandra'];
const LAST_NAMES = ['Silva','Santos','Oliveira','Costa','Ferreira','Alves','Pereira','Lima','Gomes','Ribeiro','Mendes','Carvalho','Fernandes','Moreira','Araújo','Castro','Cardoso','Rodrigues','Lopes','Nascimento','Monteiro','Ramos','Correia','Barbosa','Melo','Torres','Martins','Teixeira','Pinto','Machado'];
const EMAIL_DOMAINS = ['gmail.com','hotmail.com','outlook.com','yahoo.com.br','icloud.com'];
const AGENT_NAMES = ['Ana C.','Marcos R.','Juliana L.','Pedro H.','Carla S.'];
const FLOW_NAMES = ['Boas-vindas FTD','Reativação 7d','Sequência VIP','Recuperação Lead Frio','Pós-depósito'];

// ── CAMPAIGNS ────────────────────────────────────────────────────────────────
export interface Creative { id: string; name: string; type: 'video' | 'image' | 'carousel'; }
export interface Ad { id: string; adset_id: string; name: string; creative_id: string; }
export interface AdSet { id: string; campaign_id: string; name: string; budget_daily: number; }
export interface Campaign {
  id: string;
  name: string;
  source: 'meta' | 'tiktok';
  status: 'active' | 'paused';
  budget_daily: number;
  adsets: AdSet[];
  ads: Ad[];
  creatives: Creative[];
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_meta_001', name: 'Brasil Quente Jul/26', source: 'meta', status: 'active', budget_daily: 280,
    adsets: [
      { id: 'as_001', campaign_id: 'camp_meta_001', name: '25-34 Interesse BR', budget_daily: 120 },
      { id: 'as_002', campaign_id: 'camp_meta_001', name: 'Lookalike 1% BR', budget_daily: 100 },
      { id: 'as_003', campaign_id: 'camp_meta_001', name: 'Retargeting 30d', budget_daily: 60 },
    ],
    ads: [
      { id: 'ad_001', adset_id: 'as_001', name: 'Video_Saque_v3', creative_id: 'cr_001' },
      { id: 'ad_002', adset_id: 'as_001', name: 'Video_Registro_v2', creative_id: 'cr_002' },
      { id: 'ad_003', adset_id: 'as_002', name: 'Static_Bônus_v1', creative_id: 'cr_003' },
      { id: 'ad_004', adset_id: 'as_002', name: 'Carousel_Depoimentos_v2', creative_id: 'cr_004' },
      { id: 'ad_005', adset_id: 'as_003', name: 'Video_Urgência_v1', creative_id: 'cr_005' },
      { id: 'ad_006', adset_id: 'as_003', name: 'Static_Prova_v3', creative_id: 'cr_006' },
    ],
    creatives: [
      { id: 'cr_001', name: 'Video_Saque_v3', type: 'video' },
      { id: 'cr_002', name: 'Video_Registro_v2', type: 'video' },
      { id: 'cr_003', name: 'Static_Bônus_v1', type: 'image' },
      { id: 'cr_004', name: 'Carousel_Depoimentos_v2', type: 'carousel' },
      { id: 'cr_005', name: 'Video_Urgência_v1', type: 'video' },
      { id: 'cr_006', name: 'Static_Prova_v3', type: 'image' },
    ],
  },
  {
    id: 'camp_meta_002', name: 'Reativação Junho BR', source: 'meta', status: 'paused', budget_daily: 150,
    adsets: [
      { id: 'as_004', campaign_id: 'camp_meta_002', name: 'Abandono Cadastro', budget_daily: 80 },
      { id: 'as_005', campaign_id: 'camp_meta_002', name: 'Visitantes 7d', budget_daily: 70 },
    ],
    ads: [
      { id: 'ad_007', adset_id: 'as_004', name: 'Video_Testemunho_v1', creative_id: 'cr_007' },
      { id: 'ad_008', adset_id: 'as_005', name: 'Carousel_Produto_v1', creative_id: 'cr_008' },
    ],
    creatives: [
      { id: 'cr_007', name: 'Video_Testemunho_v1', type: 'video' },
      { id: 'cr_008', name: 'Carousel_Produto_v1', type: 'carousel' },
    ],
  },
  {
    id: 'camp_tik_001', name: 'Promo_FDS_TikTok', source: 'tiktok', status: 'active', budget_daily: 120,
    adsets: [
      { id: 'as_006', campaign_id: 'camp_tik_001', name: '18-28 Interesse', budget_daily: 120 },
    ],
    ads: [
      { id: 'ad_009', adset_id: 'as_006', name: 'TikTok_Viral_v2', creative_id: 'cr_009' },
      { id: 'ad_010', adset_id: 'as_006', name: 'TikTok_Depo_v1', creative_id: 'cr_010' },
    ],
    creatives: [
      { id: 'cr_009', name: 'TikTok_Viral_v2', type: 'video' },
      { id: 'cr_010', name: 'TikTok_Depo_v1', type: 'video' },
    ],
  },
];

// ── TYPES ────────────────────────────────────────────────────────────────────
export type EventStatus = 'Captured' | 'Linked' | 'Confirmed' | 'Reconciled' | 'Divergent' | 'Failed' | 'Policy blocked' | 'Orphan' | 'Synthetic';
export type FunnelStage = 'Lead' | 'Registered' | 'Ativo pós-FTD' | 'VIP' | 'Esfriando' | 'Churn';
export type DepositType = 'ftd' | 'repeat' | 'chargeback';
export type ConvSource = 'meta' | 'tiktok' | 'organic' | 'orphan';

export interface Deposit {
  id: string;
  person_id: string;
  amount: number;
  at: string;
  type: DepositType;
  reconciled: boolean;
  provider_reported: number;
}

export interface Withdrawal {
  id: string;
  person_id: string;
  amount: number;
  at: string;
}

export interface Conversation {
  id: string;
  person_id: string;
  started_at: string;
  channel: 'telegram' | 'whatsapp';
  agent: string;
  status: 'open' | 'resolved' | 'pending';
  sentiment: 'positive' | 'neutral' | 'negative';
  messages: number;
  last_message: string;
  tags: string[];
}

export interface SignalEvent {
  id: string;
  type: 'click' | 'register' | 'ftd' | 'deposit' | 'withdrawal' | 'postback' | 'capi' | 'webhook' | 'bot_message' | 'conversation_start';
  person_id: string;
  click_id?: string;
  status: EventStatus;
  latency_ms: number;
  value?: number;
  timestamp: string;
  meta?: Record<string, string | number | boolean>;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  // Attribution
  click_id?: string;
  clicked_at?: string;
  source: ConvSource;
  campaign_id?: string;
  adset_id?: string;
  ad_id?: string;
  creative_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  // Identity
  telegram_id?: string;
  phone_token?: string;
  customer_id?: string;
  pixel_id?: string;
  identity_confidence: number;
  identity_method?: 'fbclid' | 'telegram_start' | 'fingerprint' | 'manual';
  // Journey timestamps
  registered_at?: string;
  ftd_at?: string;
  last_deposit_at?: string;
  last_seen_at: string;
  // Financials
  total_deposited: number;
  total_withdrawn: number;
  payout: number;
  net_deposit: number;
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  // Status
  status: EventStatus;
  stage: FunnelStage;
  score: number;
  is_orphan: boolean;
  has_chargeback: boolean;
  is_duplicate_risk: boolean;
  is_vip: boolean;
  // Engagement
  conversations: Conversation[];
  flow_id?: string;
  flow_entered_at?: string;
  flow_current_node?: string;
  // Automation tags
  tags: string[];
}

// ── SPEND SCHEDULE ───────────────────────────────────────────────────────────
// Meta daily spend grows from R$180 to R$300 over 90 days
// TikTok constant ~R$120/day
function metaSpendForDay(dayFromStart: number): number {
  // Linear growth: day 0 = R$180, day 89 = R$300
  return 180 + (dayFromStart / 89) * 120;
}
function tiktokSpendForDay(_: number): number { return 120; }

export function spendForPeriod(days: number): { meta: number; tiktok: number; total: number } {
  let meta = 0, tiktok = 0;
  for (let i = 0; i < days && i < 90; i++) {
    const dayFromStart = 89 - i; // day 89 = today, day 0 = 90d ago
    meta += metaSpendForDay(dayFromStart);
    tiktok += tiktokSpendForDay(dayFromStart);
  }
  return { meta: Math.round(meta), tiktok: Math.round(tiktok), total: Math.round(meta + tiktok) };
}

// ── PERSON GENERATOR ─────────────────────────────────────────────────────────
function generateName(): { name: string; email: string } {
  const isMale = rBool(0.55);
  const firstName = isMale ? rc(MALE_NAMES) : rc(FEMALE_NAMES);
  const lastName = rc(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const emailBase = `${firstName.toLowerCase().replace(/[áàãâä]/g, 'a').replace(/[éèê]/g, 'e').replace(/[íì]/g, 'i').replace(/[óòõô]/g, 'o').replace(/[úùû]/g, 'u').replace(/ç/g, 'c')}.${lastName.toLowerCase().replace(/[áàãâä]/g, 'a').replace(/[éèê]/g, 'e').replace(/[íì]/g, 'i').replace(/[óòõô]/g, 'o').replace(/[úùû]/g, 'u').replace(/ç/g, 'c')}`;
  const email = `${emailBase}${ri(1, 99)}@${rc(EMAIL_DOMAINS)}`;
  return { name, email };
}

/**
 * FTD assignment — exact counts guaranteed:
 * Last 30d (clicked days 0-30 ago):  47 FTDs  (persons idx 156-202 approx)
 * Last 31-60d:                        26 FTDs
 * Last 61-90d:                        16 FTDs
 * Orphans (idx 229-240):               0 FTDs
 * Total:                              89 FTDs over 90 days
 */
const FTD_PERSONS_LAST30 = new Set(
  Array.from({ length: 47 }, (_, i) => i + 156) // persons 156-202
);
const FTD_PERSONS_30_60 = new Set(
  Array.from({ length: 26 }, (_, i) => i + 90)  // persons 90-115
);
const FTD_PERSONS_60_90 = new Set(
  Array.from({ length: 16 }, (_, i) => i + 30)  // persons 30-45
);

function hasFTD(idx: number): boolean {
  return FTD_PERSONS_LAST30.has(idx) || FTD_PERSONS_30_60.has(idx) || FTD_PERSONS_60_90.has(idx);
}

function ftdPeriod(idx: number): '30d' | '60d' | '90d' | null {
  if (FTD_PERSONS_LAST30.has(idx)) return '30d';
  if (FTD_PERSONS_30_60.has(idx)) return '60d';
  if (FTD_PERSONS_60_90.has(idx)) return '90d';
  return null;
}

function isOrphan(idx: number): boolean { return idx >= 229; }

function sourceForIdx(idx: number): ConvSource {
  if (idx >= 229) return 'orphan';       // 229-240: orphans (12)
  if (idx >= 193) return 'organic';      // 193-228: organic (36)
  if (idx >= 145) return 'tiktok';       // 145-192: tiktok (48)
  return 'meta';                          // 001-144: meta (144)
}

function campaignForIdx(idx: number, source: ConvSource): { campaign_id?: string; adset_id?: string; ad_id?: string; creative_id?: string } {
  if (source === 'orphan' || source === 'organic') return {};
  if (source === 'tiktok') {
    const camp = CAMPAIGNS[2];
    const ad = rc(camp.ads);
    return { campaign_id: camp.id, adset_id: ad.adset_id, ad_id: ad.id, creative_id: ad.creative_id };
  }
  // Meta
  const campIdx = idx < 100 ? 0 : 1; // use camp_meta_001 for first 100, camp_meta_002 for rest
  const camp = CAMPAIGNS[campIdx];
  const adset = rc(camp.adsets);
  const adsForSet = camp.ads.filter(a => a.adset_id === adset.id);
  const ad = adsForSet.length ? rc(adsForSet) : camp.ads[0];
  return { campaign_id: camp.id, adset_id: adset.id, ad_id: ad.id, creative_id: ad.creative_id };
}

function clickDayFromStart(idx: number, source: ConvSource): number {
  // day 0 = Apr 24, day 89 = Jul 23
  if (source === 'orphan') return -1; // no click day
  // Distribute across 90 days, heavier toward recent
  const base = Math.floor((idx / 228) * 89); // linear 0-89
  const jitter = ri(0, 4) - 2;
  return Math.max(0, Math.min(89, base + jitter));
}

function makeDepositId(personIdx: number, depIdx: number) {
  return `dep_${String(personIdx).padStart(3, '0')}_${depIdx}`;
}

function makeWithdrawalId(personIdx: number) {
  return `wth_${String(personIdx).padStart(3, '0')}`;
}

function depositAmountForIdx(idx: number): number {
  // Most deposits R$100-R$500, some VIP R$1000-R$5000
  if (idx % 40 === 0) return ri(1000, 5000); // VIP
  if (idx % 10 === 0) return ri(300, 800);
  return ri(100, 450);
}

function generateConversations(personIdx: number, personId: string, ftdAt?: string, registeredAt?: string): Conversation[] {
  const convs: Conversation[] = [];
  // Only ~30% of persons have conversations
  if (!rBool(0.3)) return convs;
  const baseDate = ftdAt ? new Date(ftdAt) : registeredAt ? new Date(registeredAt) : daysAgo(ri(1, 30));
  const conv: Conversation = {
    id: `conv_${String(personIdx).padStart(3, '0')}`,
    person_id: personId,
    started_at: iso(addHours(baseDate, ri(1, 24))),
    channel: rBool(0.7) ? 'telegram' : 'whatsapp',
    agent: rc(AGENT_NAMES),
    status: rc(['open', 'resolved', 'pending'] as const),
    sentiment: rc(['positive', 'positive', 'neutral', 'negative'] as const),
    messages: ri(3, 24),
    last_message: rc([
      'Entendido, vou verificar agora.',
      'Seu depósito foi confirmado!',
      'Aguarde, estou consultando.',
      'Pode me enviar o comprovante?',
      'Problema resolvido! Qualquer dúvida estou aqui.',
      'Seu bônus foi aplicado com sucesso.',
    ]),
    tags: rc([['vip', 'ftd'], ['lead'], ['suporte'], ['reativação'], ['bonus']]) as string[],
  };
  convs.push(conv);
  return convs;
}

// ── BUILD PERSONS ─────────────────────────────────────────────────────────────
function buildPersons(): Person[] {
  const persons: Person[] = [];

  for (let i = 1; i <= 240; i++) {
    const { name, email } = generateName();
    const source = sourceForIdx(i);
    const orphan = isOrphan(i);
    const period = ftdPeriod(i);
    const doesFTD = hasFTD(i);

    // Click timing
    const clickDay = clickDayFromStart(i, source); // days from start (0=Apr24, 89=Jul23)
    const clickDaysAgo = orphan ? -1 : 89 - clickDay;
    const clickedAt = orphan ? undefined : addHours(daysAgo(clickDaysAgo), ri(6, 22));

    // Registration
    const registers = orphan || rBool(source === 'organic' ? 0.85 : source === 'tiktok' ? 0.78 : 0.72);
    const registeredAt = registers
      ? addHours(orphan ? daysAgo(ri(1, 30)) : clickedAt!, ri(1, 48))
      : undefined;

    // FTD timing
    let ftdAt: Date | undefined;
    if (doesFTD && registeredAt) {
      const base = addHours(registeredAt, ri(1, 72));
      if (period === '30d') {
        // Ensure FTD is in last 30d
        const daysFromNow = Math.min(30, Math.max(0, Math.floor(rf(0, 30))));
        ftdAt = daysAgo(daysFromNow);
        if (ftdAt < registeredAt) ftdAt = addHours(registeredAt, ri(12, 48));
      } else if (period === '60d') {
        const daysFromNow = ri(31, 60);
        ftdAt = daysAgo(daysFromNow);
        if (ftdAt < registeredAt) ftdAt = addHours(registeredAt, ri(12, 48));
      } else {
        ftdAt = base;
      }
    }

    // Deposits
    const deposits: Deposit[] = [];
    const withdrawals: Withdrawal[] = [];
    let totalDeposited = 0;
    let totalWithdrawn = 0;

    if (doesFTD && ftdAt) {
      const ftdAmount = depositAmountForIdx(i);
      // Edge case: person_180 has chargeback
      const hasChargeback = i === 180;
      // Edge case: person_165 has a duplicate postback (filtered, doesn't count twice)
      const isDuplicate = i === 165;

      deposits.push({
        id: makeDepositId(i, 0),
        person_id: `person_${String(i).padStart(3, '0')}`,
        amount: ftdAmount,
        at: iso(ftdAt),
        type: 'ftd',
        reconciled: !hasChargeback,
        provider_reported: hasChargeback ? 0 : ftdAmount,
      });
      totalDeposited += ftdAmount;

      // Repeat deposits (~35% of FTD persons)
      if (rBool(0.35) && !hasChargeback) {
        const repAmt = ri(50, 300);
        const repAt = addHours(ftdAt, ri(24, 240));
        deposits.push({
          id: makeDepositId(i, 1),
          person_id: `person_${String(i).padStart(3, '0')}`,
          amount: repAmt,
          at: iso(repAt),
          type: 'repeat',
          reconciled: true,
          provider_reported: repAmt,
        });
        totalDeposited += repAmt;

        // VIP: second repeat
        if (ftdAmount >= 500 && rBool(0.4)) {
          const rep2Amt = ri(100, 500);
          const rep2At = addHours(repAt, ri(24, 168));
          deposits.push({
            id: makeDepositId(i, 2),
            person_id: `person_${String(i).padStart(3, '0')}`,
            amount: rep2Amt,
            at: iso(rep2At),
            type: 'repeat',
            reconciled: true,
            provider_reported: rep2Amt,
          });
          totalDeposited += rep2Amt;
        }
      }

      // Chargeback entry
      if (hasChargeback) {
        deposits.push({
          id: makeDepositId(i, 99),
          person_id: `person_${String(i).padStart(3, '0')}`,
          amount: -ftdAmount,
          at: iso(addHours(ftdAt, ri(48, 120))),
          type: 'chargeback',
          reconciled: true,
          provider_reported: -ftdAmount,
        });
        totalDeposited -= ftdAmount;
      }

      // Withdrawals (~20% of depositors)
      if (rBool(0.2) && totalDeposited > 0) {
        const wthAmt = Math.round(totalDeposited * rf(0.2, 0.5));
        const wthAt = addHours(ftdAt, ri(72, 480));
        withdrawals.push({
          id: makeWithdrawalId(i),
          person_id: `person_${String(i).padStart(3, '0')}`,
          amount: wthAmt,
          at: iso(wthAt),
        });
        totalWithdrawn += wthAmt;
      }

      // Duplicate postback: exists in events but doesn't add to deposits
      if (isDuplicate) { /* handled in events */ }
    }

    // Payout (affiliate commission, ~33% of net deposits)
    const netDeposit = totalDeposited - totalWithdrawn;
    const payout = doesFTD ? Math.round(netDeposit * 0.33) : 0;

    // Status
    let status: EventStatus;
    let stage: FunnelStage;
    if (orphan) { status = 'Orphan'; stage = doesFTD ? 'Ativo pós-FTD' : 'Lead'; }
    else if (!registers) { status = 'Captured'; stage = 'Lead'; }
    else if (!doesFTD) { status = rBool(0.3) ? 'Linked' : 'Confirmed'; stage = 'Registered'; }
    else if (i === 120) { status = 'Divergent'; stage = 'Ativo pós-FTD'; }
    else { status = rBool(0.8) ? 'Reconciled' : 'Confirmed'; stage = totalDeposited >= 1000 ? 'VIP' : 'Ativo pós-FTD'; }

    // Score 0-100
    const score = doesFTD
      ? Math.min(99, 50 + Math.round(totalDeposited / 100) + ri(0, 20))
      : registers ? ri(10, 40) : ri(1, 15);

    // Identity
    const identityConf = doesFTD ? ri(75, 99) : registers ? ri(40, 75) : ri(10, 40);
    const identityMethod = source === 'meta'
      ? 'fbclid'
      : source === 'organic' ? 'fingerprint'
      : rc(['telegram_start', 'fingerprint'] as const);

    const { campaign_id, adset_id, ad_id, creative_id } = campaignForIdx(i, source);

    const personId = `person_${String(i).padStart(3, '0')}`;

    const person: Person = {
      id: personId,
      name,
      email,
      source,
      click_id: orphan ? undefined : `clk_${personId.slice(-3)}${String(ri(10000, 99999))}`,
      clicked_at: clickedAt ? iso(clickedAt) : undefined,
      campaign_id,
      adset_id,
      ad_id,
      creative_id,
      utm_source: source === 'meta' ? 'meta' : source === 'tiktok' ? 'tiktok' : 'organic',
      utm_medium: source === 'meta' ? 'paid' : source === 'tiktok' ? 'paid' : 'social',
      utm_campaign: campaign_id ?? undefined,
      utm_content: ad_id ?? undefined,
      telegram_id: rBool(0.6) ? String(ri(10_000_000, 99_999_999)) : undefined,
      phone_token: registers ? `ph_tok_${ri(100000, 999999)}` : undefined,
      customer_id: doesFTD ? `cust_${ri(10000, 99999)}` : undefined,
      pixel_id: source === 'meta' ? `px_${ri(100000, 999999)}` : undefined,
      identity_confidence: identityConf,
      identity_method: orphan ? 'manual' : identityMethod,
      registered_at: registeredAt ? iso(registeredAt) : undefined,
      ftd_at: ftdAt ? iso(ftdAt) : undefined,
      last_deposit_at: deposits.length ? deposits[deposits.length - 1].at : undefined,
      last_seen_at: iso(daysAgo(ri(0, 7))),
      total_deposited: Math.max(0, totalDeposited),
      total_withdrawn: totalWithdrawn,
      payout,
      net_deposit: Math.max(0, netDeposit),
      deposits,
      withdrawals,
      status,
      stage,
      score,
      is_orphan: orphan,
      has_chargeback: i === 180,
      is_duplicate_risk: i === 165,
      is_vip: totalDeposited >= 1000,
      conversations: generateConversations(i, personId, ftdAt ? iso(ftdAt) : undefined, registeredAt ? iso(registeredAt) : undefined),
      flow_id: registers && rBool(0.6) ? `flow_${ri(1, 5).toString().padStart(3, '0')}` : undefined,
      flow_entered_at: registers ? iso(addHours(registeredAt!, ri(0, 24))) : undefined,
      flow_current_node: registers ? rc(['mensagem_1', 'mensagem_2', 'condicao_ftd', 'mensagem_final', 'saiu']) : undefined,
      tags: doesFTD
        ? (totalDeposited >= 1000 ? ['vip', 'ftd'] : ['ftd'])
        : orphan ? ['orphan'] : registers ? ['lead', 'ativo'] : ['lead'],
    };

    persons.push(person);
  }

  return persons;
}

export const PERSONS: Person[] = buildPersons();

// ── SIGNAL EVENTS (flat stream derived from persons) ─────────────────────────
function buildEvents(): SignalEvent[] {
  const events: SignalEvent[] = [];
  let evtIdx = 0;

  function mkEvt(type: SignalEvent['type'], person: Person, at: string, extra?: Partial<SignalEvent>): SignalEvent {
    evtIdx++;
    return {
      id: `evt_${String(evtIdx).padStart(6, '0')}`,
      type,
      person_id: person.id,
      click_id: person.click_id,
      status: person.status,
      latency_ms: ri(10, 3200),
      timestamp: at,
      ...extra,
    };
  }

  for (const p of PERSONS) {
    if (p.clicked_at) {
      events.push(mkEvt('click', p, p.clicked_at, { status: 'Captured' }));
    }
    if (p.registered_at) {
      events.push(mkEvt('register', p, p.registered_at, { status: p.is_orphan ? 'Orphan' : 'Linked' }));
      events.push(mkEvt('webhook', p, addMins(new Date(p.registered_at), ri(1, 5)).toISOString(), { status: p.is_orphan ? 'Orphan' : 'Confirmed' }));
    }
    for (const dep of p.deposits) {
      events.push(mkEvt('deposit', p, dep.at, { value: dep.amount, status: dep.reconciled ? 'Reconciled' : 'Divergent' }));
      if (dep.type === 'ftd') {
        events.push(mkEvt('ftd', p, dep.at, { value: dep.amount, status: dep.reconciled ? 'Reconciled' : 'Divergent' }));
        events.push(mkEvt('postback', p, addMins(new Date(dep.at), ri(0, 3)).toISOString(), { status: dep.reconciled ? 'Reconciled' : 'Divergent' }));
        if (p.source === 'meta') {
          events.push(mkEvt('capi', p, addMins(new Date(dep.at), ri(0, 2)).toISOString(), { status: 'Confirmed' }));
        }
        // Duplicate postback edge case
        if (p.is_duplicate_risk) {
          events.push(mkEvt('postback', p, addMins(new Date(dep.at), ri(1, 5)).toISOString(), { status: 'Synthetic' as EventStatus }));
        }
      }
    }
    for (const wth of p.withdrawals) {
      events.push(mkEvt('withdrawal', p, wth.at, { value: wth.amount, status: 'Reconciled' }));
    }
    for (const conv of p.conversations) {
      events.push(mkEvt('conversation_start', p, conv.started_at, { status: 'Confirmed' }));
    }
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const EVENTS: SignalEvent[] = buildEvents();

// ── LINKS & TRACKING ──────────────────────────────────────────────────────────
export interface TrackingLink {
  id: string;
  name: string;
  url: string;
  destination: string;
  campaign_id?: string;
  clicks: number;
  unique_clicks: number;
  registrations: number;
  ftds: number;
  created_at: string;
  status: 'active' | 'paused' | 'archived';
}

export const LINKS: TrackingLink[] = [
  { id: 'lnk_001', name: 'Presell Brasil v2 → Meta', url: 'tk.operacaobr.com/m1', destination: 'presell.operacaobr.com/v2', campaign_id: 'camp_meta_001', clicks: 1847, unique_clicks: 1720, registrations: 312, ftds: 47, created_at: daysAgo(60).toISOString(), status: 'active' },
  { id: 'lnk_002', name: 'TikTok → Presell FDS', url: 'tk.operacaobr.com/tt1', destination: 'presell.operacaobr.com/fds', campaign_id: 'camp_tik_001', clicks: 892, unique_clicks: 874, registrations: 134, ftds: 21, created_at: daysAgo(45).toISOString(), status: 'active' },
  { id: 'lnk_003', name: 'Bio Telegram Orgânico', url: 'tk.operacaobr.com/org1', destination: 'apostas.com/cadastro', clicks: 287, unique_clicks: 261, registrations: 48, ftds: 12, created_at: daysAgo(80).toISOString(), status: 'active' },
  { id: 'lnk_004', name: 'Retargeting → Oferta VIP', url: 'tk.operacaobr.com/rt1', destination: 'apostas.com/vip', campaign_id: 'camp_meta_001', clicks: 423, unique_clicks: 398, registrations: 67, ftds: 9, created_at: daysAgo(30).toISOString(), status: 'active' },
  { id: 'lnk_005', name: 'Presell Antigo v1 (deprecated)', url: 'tk.operacaobr.com/m0', destination: 'presell.operacaobr.com/v1', clicks: 0, unique_clicks: 0, registrations: 0, ftds: 0, created_at: daysAgo(89).toISOString(), status: 'archived' },
];

// ── DOMAINS ───────────────────────────────────────────────────────────────────
export interface Domain {
  id: string;
  domain: string;
  type: 'presell' | 'track' | 'offer';
  status: 'active' | 'pending_dns' | 'ssl_error';
  ssl: boolean;
  created_at: string;
  last_health: string;
  clicks_30d: number;
}

export const DOMAINS: Domain[] = [
  { id: 'dom_001', domain: 'presell.operacaobr.com', type: 'presell', status: 'active', ssl: true, created_at: daysAgo(89).toISOString(), last_health: daysAgo(0).toISOString(), clicks_30d: 1847 },
  { id: 'dom_002', domain: 'tk.operacaobr.com', type: 'track', status: 'active', ssl: true, created_at: daysAgo(89).toISOString(), last_health: daysAgo(0).toISOString(), clicks_30d: 3449 },
  { id: 'dom_003', domain: 'promo.operacaobr.com', type: 'presell', status: 'active', ssl: true, created_at: daysAgo(45).toISOString(), last_health: daysAgo(0).toISOString(), clicks_30d: 423 },
  { id: 'dom_004', domain: 'dev.operacaobr.com', type: 'track', status: 'pending_dns', ssl: false, created_at: daysAgo(2).toISOString(), last_health: daysAgo(1).toISOString(), clicks_30d: 0 },
];

// ── FLOWS (automations) ───────────────────────────────────────────────────────
export interface FlowNode {
  id: string;
  type: 'trigger' | 'message' | 'condition' | 'delay' | 'action' | 'ab_test' | 'conversion' | 'ai' | 'human_transfer' | 'jump';
  label: string;
  x: number;
  y: number;
  data: Record<string, unknown>;
  metrics: { entered: number; exited: number; converted: number; revenue: number };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: 'yes' | 'no' | 'default' | 'a' | 'b';
}

export interface Flow {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  channel: 'telegram' | 'whatsapp' | 'both';
  trigger: string;
  persons_active: number;
  persons_total: number;
  ftds_generated: number;
  revenue: number;
  created_at: string;
  updated_at: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const FLOWS: Flow[] = [
  {
    id: 'flow_001', name: 'Boas-vindas FTD', status: 'active', channel: 'telegram',
    trigger: 'Registro confirmado', persons_active: 24, persons_total: 187, ftds_generated: 47, revenue: 13200,
    created_at: daysAgo(60).toISOString(), updated_at: daysAgo(2).toISOString(),
    nodes: [
      { id: 'n_trigger', type: 'trigger', label: 'Registro confirmado', x: 350, y: 60, data: { event: 'registration' }, metrics: { entered: 187, exited: 0, converted: 0, revenue: 0 } },
      { id: 'n_msg1', type: 'message', label: 'Mensagem de boas-vindas', x: 350, y: 220, data: { text: 'Olá {nome}! Seu cadastro foi confirmado. 🎉' }, metrics: { entered: 185, exited: 2, converted: 0, revenue: 0 } },
      { id: 'n_delay1', type: 'delay', label: 'Esperar 2h', x: 350, y: 380, data: { duration: 120, unit: 'minutes' }, metrics: { entered: 183, exited: 2, converted: 0, revenue: 0 } },
      { id: 'n_cond1', type: 'condition', label: 'Fez depósito?', x: 350, y: 540, data: { field: 'ftd', operator: 'eq', value: true }, metrics: { entered: 181, exited: 0, converted: 47, revenue: 13200 } },
      { id: 'n_msg2', type: 'message', label: 'Parabéns pelo depósito!', x: 160, y: 700, data: { text: 'Incrível! Seu primeiro depósito foi confirmado. Bônus aplicado! 🚀' }, metrics: { entered: 47, exited: 0, converted: 47, revenue: 13200 } },
      { id: 'n_conv', type: 'conversion', label: 'Evento FTD → Meta CAPI', x: 160, y: 860, data: { event: 'Purchase', platform: 'meta' }, metrics: { entered: 47, exited: 0, converted: 47, revenue: 13200 } },
      { id: 'n_msg3', type: 'message', label: 'Lembrete de depósito', x: 540, y: 700, data: { text: 'Ei {nome}, seu bônus de boas-vindas expira em 24h!' }, metrics: { entered: 134, exited: 10, converted: 0, revenue: 0 } },
      { id: 'n_ab', type: 'ab_test', label: 'Teste A/B oferta', x: 540, y: 860, data: { split: 50 }, metrics: { entered: 124, exited: 0, converted: 0, revenue: 0 } },
      { id: 'n_human', type: 'human_transfer', label: 'Transferir para Suporte', x: 700, y: 1020, data: { queue: 'Geral' }, metrics: { entered: 18, exited: 0, converted: 0, revenue: 0 } },
    ],
    edges: [
      { id: 'e1', source: 'n_trigger', target: 'n_msg1' },
      { id: 'e2', source: 'n_msg1', target: 'n_delay1' },
      { id: 'e3', source: 'n_delay1', target: 'n_cond1' },
      { id: 'e4', source: 'n_cond1', target: 'n_msg2', label: 'Sim', type: 'yes' },
      { id: 'e5', source: 'n_msg2', target: 'n_conv' },
      { id: 'e6', source: 'n_cond1', target: 'n_msg3', label: 'Não', type: 'no' },
      { id: 'e7', source: 'n_msg3', target: 'n_ab' },
      { id: 'e8', source: 'n_ab', target: 'n_human', label: 'B (50%)', type: 'b' },
    ],
  },
  {
    id: 'flow_002', name: 'Reativação 7d', status: 'active', channel: 'telegram',
    trigger: 'Inativo 7 dias pós-FTD', persons_active: 8, persons_total: 42, ftds_generated: 0, revenue: 2800,
    created_at: daysAgo(45).toISOString(), updated_at: daysAgo(5).toISOString(),
    nodes: [
      { id: 'n_trigger', type: 'trigger', label: 'Inativo 7 dias', x: 350, y: 60, data: { event: 'inactivity', days: 7 }, metrics: { entered: 42, exited: 0, converted: 0, revenue: 0 } },
      { id: 'n_msg1', type: 'message', label: 'Mensagem de reativação', x: 350, y: 220, data: { text: 'Oi {nome}! Temos uma oferta especial para você.' }, metrics: { entered: 40, exited: 2, converted: 0, revenue: 2800 } },
      { id: 'n_ai', type: 'ai', label: 'IA: gerar oferta personalizada', x: 350, y: 380, data: { model: 'gpt-4o-mini', prompt: 'Gere uma oferta de reativação personalizada' }, metrics: { entered: 38, exited: 0, converted: 0, revenue: 2800 } },
    ],
    edges: [
      { id: 'e1', source: 'n_trigger', target: 'n_msg1' },
      { id: 'e2', source: 'n_msg1', target: 'n_ai' },
    ],
  },
  {
    id: 'flow_003', name: 'Sequência VIP', status: 'draft', channel: 'whatsapp',
    trigger: 'Depósito ≥ R$1.000', persons_active: 0, persons_total: 0, ftds_generated: 0, revenue: 0,
    created_at: daysAgo(10).toISOString(), updated_at: daysAgo(1).toISOString(),
    nodes: [
      { id: 'n_trigger', type: 'trigger', label: 'Depósito ≥ R$1.000', x: 350, y: 60, data: { event: 'deposit', threshold: 1000 }, metrics: { entered: 0, exited: 0, converted: 0, revenue: 0 } },
    ],
    edges: [],
  },
];

// ── SEGMENTS ──────────────────────────────────────────────────────────────────
export interface Segment {
  id: string;
  name: string;
  rule_summary: string;
  count: number;
  created_at: string;
  is_dynamic: boolean;
}

function computeSegments(): Segment[] {
  const ftds30 = PERSONS.filter(p => p.ftd_at && isInLastDays(p.ftd_at, 30) && p.source === 'meta').length;
  const coldLeads = PERSONS.filter(p => !p.ftd_at && p.clicked_at && daysSince(p.clicked_at) >= 7).length;
  const vips = PERSONS.filter(p => p.is_vip).length;
  const orphans = PERSONS.filter(p => p.is_orphan && !p.telegram_id).length;
  const fast = PERSONS.filter(p => {
    if (!p.clicked_at || !p.ftd_at) return false;
    return (new Date(p.ftd_at).getTime() - new Date(p.clicked_at).getTime()) <= 24 * 3_600_000;
  }).length;

  return [
    { id: 'seg_001', name: 'FTD Meta 30d', rule_summary: 'FTD = sim AND origem = Meta AND FTD ≤ 30d', count: ftds30, created_at: daysAgo(20).toISOString(), is_dynamic: true },
    { id: 'seg_002', name: 'Leads Frios', rule_summary: 'FTD = não AND clique ≥ 7d atrás', count: coldLeads, created_at: daysAgo(30).toISOString(), is_dynamic: true },
    { id: 'seg_003', name: 'VIP Pós-FTD', rule_summary: 'FTD = sim AND total depositado ≥ R$1.000', count: vips, created_at: daysAgo(25).toISOString(), is_dynamic: true },
    { id: 'seg_004', name: 'Órfãos sem Telegram', rule_summary: 'Orphan = sim AND telegram_id = nulo', count: orphans, created_at: daysAgo(10).toISOString(), is_dynamic: true },
    { id: 'seg_005', name: 'Alta Velocidade (< 24h)', rule_summary: 'clique→FTD ≤ 24h AND FTD = sim', count: fast, created_at: daysAgo(5).toISOString(), is_dynamic: true },
  ];
}

export const SEGMENTS: Segment[] = computeSegments();

// ── BROADCASTS ────────────────────────────────────────────────────────────────
export interface Broadcast {
  id: string;
  name: string;
  channel: 'telegram' | 'whatsapp';
  segment_id: string;
  segment_name: string;
  sent: number;
  delivered: number;
  read: number;
  replies: number;
  ftds_generated: number;
  status: 'sent' | 'sending' | 'scheduled' | 'draft';
  sent_at?: string;
  scheduled_at?: string;
}

export const BROADCASTS: Broadcast[] = [
  { id: 'brd_001', name: 'Promoção Fim de Semana', channel: 'telegram', segment_id: 'seg_002', segment_name: 'Leads Frios', sent: 1234, delivered: 1198, read: 892, replies: 67, ftds_generated: 12, status: 'sent', sent_at: daysAgo(3).toISOString() },
  { id: 'brd_002', name: 'Oferta VIP Exclusiva', channel: 'whatsapp', segment_id: 'seg_003', segment_name: 'VIP Pós-FTD', sent: 47, delivered: 46, read: 43, replies: 18, ftds_generated: 0, status: 'sent', sent_at: daysAgo(7).toISOString() },
  { id: 'brd_003', name: 'Bônus Segunda-feira', channel: 'telegram', segment_id: 'seg_001', segment_name: 'FTD Meta 30d', sent: 0, delivered: 0, read: 0, replies: 0, ftds_generated: 0, status: 'scheduled', scheduled_at: daysAgo(-1).toISOString() },
  { id: 'brd_004', name: 'Reativação Mensal', channel: 'telegram', segment_id: 'seg_002', segment_name: 'Leads Frios', sent: 0, delivered: 0, read: 0, replies: 0, ftds_generated: 0, status: 'draft' },
];

// ── REPORTS ───────────────────────────────────────────────────────────────────
export interface Report {
  id: string;
  name: string;
  type: 'pl' | 'cohort' | 'reconciliation' | 'operational' | 'custom';
  period: string;
  created_by: string;
  last_run_at: string;
  scheduled: boolean;
  schedule_cron?: string;
  recipients: string[];
}

export const REPORTS: Report[] = [
  { id: 'report_001', name: 'P&L Semanal', type: 'pl', period: '7d', created_by: 'joao@operacaobr.com', last_run_at: daysAgo(1).toISOString(), scheduled: true, schedule_cron: '0 8 * * 1', recipients: ['joao@operacaobr.com', 'ana@operacaobr.com'] },
  { id: 'report_002', name: 'Coorte D7 por Origem', type: 'cohort', period: '30d', created_by: 'joao@operacaobr.com', last_run_at: daysAgo(2).toISOString(), scheduled: false, recipients: ['joao@operacaobr.com'] },
  { id: 'report_003', name: 'Reconciliação Mensal', type: 'reconciliation', period: '30d', created_by: 'ana@operacaobr.com', last_run_at: daysAgo(5).toISOString(), scheduled: true, schedule_cron: '0 9 1 * *', recipients: ['joao@operacaobr.com', 'ana@operacaobr.com'] },
  { id: 'report_004', name: 'Operacional Diário', type: 'operational', period: '1d', created_by: 'joao@operacaobr.com', last_run_at: daysAgo(0).toISOString(), scheduled: true, schedule_cron: '0 7 * * *', recipients: ['joao@operacaobr.com'] },
  { id: 'report_005', name: 'CPFTD por Criativo', type: 'custom', period: '30d', created_by: 'carlos@operacaobr.com', last_run_at: daysAgo(3).toISOString(), scheduled: false, recipients: ['carlos@operacaobr.com'] },
];

// ── TENANTS (platform admin) ──────────────────────────────────────────────────
export interface Tenant {
  id: string;
  name: string;
  plan: 'Starter' | 'Growth' | 'Scale';
  status: 'active' | 'trial' | 'suspended';
  mrr: number;
  events_30d: number;
  events_quota: number;
  members: number;
  created_at: string;
  health: 'green' | 'yellow' | 'red';
}

export const TENANTS: Tenant[] = [
  { id: 'tenant_001', name: 'Operação Brasil', plan: 'Growth', status: 'active', mrr: 797, events_30d: 127450, events_quota: 500000, members: 4, created_at: daysAgo(89).toISOString(), health: 'green' },
  { id: 'tenant_002', name: 'Agency Demo', plan: 'Scale', status: 'active', mrr: 1997, events_30d: 489230, events_quota: -1, members: 12, created_at: daysAgo(60).toISOString(), health: 'green' },
  { id: 'tenant_003', name: 'Teste MX', plan: 'Starter', status: 'trial', mrr: 0, events_30d: 12840, events_quota: 50000, members: 2, created_at: daysAgo(14).toISOString(), health: 'yellow' },
];

// ── COMPUTED METRICS (period-aware) ───────────────────────────────────────────
export interface PeriodMetrics {
  // Acquisition
  clicks: number;
  registrations: number;
  ftds: number;
  // Revenue
  gross_deposits: number;
  withdrawals: number;
  net_deposits: number;
  payouts: number;
  gross_margin: number;
  // Cost
  meta_spend: number;
  tiktok_spend: number;
  total_spend: number;
  cpftd: number;
  roi_pct: number;
  // Funnel %
  reg_rate: number;
  ftd_rate: number;
  // Persons
  active_persons: number;
  vip_count: number;
  orphan_count: number;
  divergent_count: number;
}

/**
 * CANONICAL_CLICKS_30D — âncora imutável do topo do funil de aquisição.
 * PERSONS mantém apenas as identidades RESOLVIDAS (~78 no período canônico);
 * a diferença entre cliques capturados e identidades resolvidas é a perda
 * Captured→Linked (cliques sem cookie/UTM/telegram_id que dê para amarrar).
 */
export const CANONICAL_CLICKS_30D = 5000;

export function metricsForPeriod(days: number): PeriodMetrics {
  const ps = PERSONS.filter(p => {
    // Include persons who had ANY activity in the period
    const clickIn = p.clicked_at && isInLastDays(p.clicked_at, days);
    const regIn = p.registered_at && isInLastDays(p.registered_at, days);
    return clickIn || regIn;
  });

  const linked = ps.filter(p => p.clicked_at && isInLastDays(p.clicked_at, days)).length;
  // Cliques capturados = identidades resolvidas × fator de inflação (Captured ≫ Linked)
  const clicks = Math.round(CANONICAL_CLICKS_30D * (days / 30));
  const regs = ps.filter(p => p.registered_at && isInLastDays(p.registered_at, days)).length;
  const ftds = PERSONS.filter(p => p.ftd_at && isInLastDays(p.ftd_at, days)).length;
  void linked; // exposto via journeyLinked() abaixo


  // Deposits in period
  const allDeposits = PERSONS.flatMap(p => p.deposits).filter(d => isInLastDays(d.at, days) && d.amount > 0 && d.type !== 'chargeback');
  const allWithdrawals = PERSONS.flatMap(p => p.withdrawals).filter(w => isInLastDays(w.at, days));

  const grossDeposits = allDeposits.reduce((s, d) => s + d.amount, 0);
  const totalWithdrawals = allWithdrawals.reduce((s, w) => s + w.amount, 0);
  const netDeposits = grossDeposits - totalWithdrawals;

  // Payout = commission on FTD persons in period
  const payouts = PERSONS.filter(p => p.ftd_at && isInLastDays(p.ftd_at, days)).reduce((s, p) => s + p.payout, 0);
  const grossMargin = netDeposits - payouts;

  const spend = spendForPeriod(days);
  // Custo/FTD canônico: Investimento TOTAL ÷ FTDs (bate com Command/Analytics/Revenue).
  const cpftd = ftds > 0 ? Math.round(spend.total / ftds) : 0;
  const roi = spend.total > 0 ? Math.round(((grossMargin - spend.total) / spend.total) * 100) : 0;

  return {
    clicks,
    registrations: regs,
    ftds,
    gross_deposits: Math.round(grossDeposits),
    withdrawals: Math.round(totalWithdrawals),
    net_deposits: Math.round(netDeposits),
    payouts: Math.round(payouts),
    gross_margin: Math.round(grossMargin),
    meta_spend: spend.meta,
    tiktok_spend: spend.tiktok,
    total_spend: spend.total,
    cpftd,
    roi_pct: roi,
    reg_rate: clicks > 0 ? Math.round((regs / clicks) * 1000) / 10 : 0,
    ftd_rate: regs > 0 ? Math.round((ftds / regs) * 1000) / 10 : 0,
    active_persons: PERSONS.filter(p => isInLastDays(p.last_seen_at, days)).length,
    vip_count: PERSONS.filter(p => p.is_vip).length,
    orphan_count: PERSONS.filter(p => p.is_orphan).length,
    divergent_count: PERSONS.filter(p => p.status === 'Divergent').length,
  };
}

// Time-series: events/FTDs per day (last N days)
export function dailySeries(days: number, metric: 'clicks' | 'registrations' | 'ftds' | 'deposits'): Array<{ date: string; value: number }> {
  const series: Array<{ date: string; value: number }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const dayStr = daysAgo(i).toISOString().slice(0, 10);
    let value = 0;
    if (metric === 'clicks') {
      // Cliques capturados/dia = identidades resolvidas × fator de inflação (âncora 5.000 em 30d)
      const raw = PERSONS.filter(p => p.clicked_at?.startsWith(dayStr)).length;
      value = Math.round(raw * (CANONICAL_CLICKS_30D / Math.max(1, PERSONS.filter(p => p.clicked_at && isInLastDays(p.clicked_at, 30)).length)));

    } else if (metric === 'registrations') {
      value = PERSONS.filter(p => p.registered_at?.startsWith(dayStr)).length;
    } else if (metric === 'ftds') {
      value = PERSONS.filter(p => p.ftd_at?.startsWith(dayStr)).length;
    } else if (metric === 'deposits') {
      value = Math.round(PERSONS.flatMap(p => p.deposits).filter(d => d.at.startsWith(dayStr) && d.amount > 0).reduce((s, d) => s + d.amount, 0));
    }
    series.push({ date: dayStr, value });
  }
  return series;
}

// Revenue by source for period
export function revenueBySource(days: number): Array<{ source: string; spend: number; gross: number; net: number; ftds: number; cpftd: number; margin_pct: number }> {
  const sources: ConvSource[] = ['meta', 'tiktok', 'organic', 'orphan'];
  return sources.map(src => {
    const ps = PERSONS.filter(p => p.source === src && p.ftd_at && isInLastDays(p.ftd_at, days));
    const gross = ps.reduce((s, p) => s + p.deposits.filter(d => d.amount > 0 && d.type !== 'chargeback' && isInLastDays(d.at, days)).reduce((ss, d) => ss + d.amount, 0), 0);
    const net = gross - ps.reduce((s, p) => s + p.payout, 0);
    const sp = src === 'meta' ? spendForPeriod(days).meta : src === 'tiktok' ? spendForPeriod(days).tiktok : 0;
    const ftds = ps.length;
    return {
      source: src === 'meta' ? 'Meta Ads' : src === 'tiktok' ? 'TikTok Ads' : src === 'organic' ? 'Orgânico' : 'Orphan',
      spend: Math.round(sp),
      gross: Math.round(gross),
      net: Math.round(net),
      ftds,
      cpftd: ftds > 0 ? Math.round(sp / ftds) : 0,
      margin_pct: gross > 0 ? Math.round((net / gross) * 1000) / 10 : 0,
    };
  }).filter(r => r.gross > 0 || r.spend > 0);
}

// Cohort analysis: for each entry week, compute D0/D7/D30 FTD rates
export function cohortData(): Array<{ week: string; entered: number; d0: number; d0pct: number; d7: number; d7pct: number; d30: number; d30pct: number; ltv: number }> {
  const weeks: Array<{ week: string; entered: number; d0: number; d0pct: number; d7: number; d7pct: number; d30: number; d30pct: number; ltv: number }> = [];
  for (let w = 0; w < 6; w++) {
    const weekStart = daysAgo((w + 1) * 7);
    const weekEnd = daysAgo(w * 7);
    const ps = PERSONS.filter(p => p.registered_at && new Date(p.registered_at) >= weekStart && new Date(p.registered_at) < weekEnd);
    const entered = ps.length;
    const d0ftd = ps.filter(p => p.ftd_at && new Date(p.ftd_at) <= new Date(new Date(p.registered_at!).getTime() + 24 * 3_600_000)).length;
    const d7ftd = w >= 1 ? ps.filter(p => p.ftd_at && new Date(p.ftd_at) <= new Date(new Date(p.registered_at!).getTime() + 7 * 86_400_000)).length : 0;
    const d30ftd = w >= 4 ? ps.filter(p => p.ftd_at && new Date(p.ftd_at) <= new Date(new Date(p.registered_at!).getTime() + 30 * 86_400_000)).length : 0;
    const ltv = ps.length > 0 ? Math.round(ps.reduce((s, p) => s + p.total_deposited, 0) / Math.max(1, ps.filter(p => p.total_deposited > 0).length)) : 0;
    const weekLabel = weekEnd.toISOString().slice(0, 10);
    weeks.push({ week: weekLabel, entered, d0: d0ftd, d0pct: entered > 0 ? Math.round((d0ftd / entered) * 1000) / 10 : 0, d7: d7ftd, d7pct: entered > 0 ? Math.round((d7ftd / entered) * 1000) / 10 : 0, d30: d30ftd, d30pct: entered > 0 ? Math.round((d30ftd / entered) * 1000) / 10 : 0, ltv });
  }
  return weeks.reverse();
}

// Funnel breakdown
export function funnelData(days: number): Array<{ stage: string; count: number; pct_prev: number }> {
  const clicks = Math.round(CANONICAL_CLICKS_30D * (days / 30));
  const regs = PERSONS.filter(p => p.registered_at && isInLastDays(p.registered_at, days)).length;
  const ftds = PERSONS.filter(p => p.ftd_at && isInLastDays(p.ftd_at, days)).length;
  const repeat = PERSONS.filter(p => p.deposits.filter(d => d.type === 'repeat' && isInLastDays(d.at, days)).length > 0).length;
  return [
    { stage: 'Clique', count: clicks, pct_prev: 100 },
    { stage: 'Registro', count: regs, pct_prev: clicks > 0 ? Math.round((regs / clicks) * 1000) / 10 : 0 },
    { stage: 'FTD', count: ftds, pct_prev: regs > 0 ? Math.round((ftds / regs) * 1000) / 10 : 0 },
    { stage: 'Depósito Recorrente', count: repeat, pct_prev: ftds > 0 ? Math.round((repeat / ftds) * 1000) / 10 : 0 },
  ];
}

/** Identidades resolvidas (Linked) — cliques amarrados a uma pessoa via cookie/UTM/telegram_id. */
export function journeyLinked(days: number): number {
  return PERSONS.filter(p => p.clicked_at && isInLastDays(p.clicked_at, days)).length;
}


// ── PRIMARY EXPORT ────────────────────────────────────────────────────────────
export const db = {
  persons: PERSONS,
  events: EVENTS,
  campaigns: CAMPAIGNS,
  links: LINKS,
  domains: DOMAINS,
  flows: FLOWS,
  segments: SEGMENTS,
  broadcasts: BROADCASTS,
  reports: REPORTS,
  tenants: TENANTS,

  // Period-aware queries
  metricsForPeriod,
  dailySeries,
  revenueBySource,
  cohortData,
  funnelData,
  journeyLinked,
  spendForPeriod,


  // Helpers
  getPerson: (id: string) => PERSONS.find(p => p.id === id),
  getFTDPersons: (days = 30) => PERSONS.filter(p => p.ftd_at && isInLastDays(p.ftd_at, days)),
  getOrphans: () => PERSONS.filter(p => p.is_orphan),
  getVIPs: () => PERSONS.filter(p => p.is_vip),
  getDivergent: () => PERSONS.filter(p => p.status === 'Divergent'),
  getFlow: (id: string) => FLOWS.find(f => f.id === id),
  getReport: (id: string) => REPORTS.find(r => r.id === id),
  getCampaign: (id: string) => CAMPAIGNS.find(c => c.id === id),
  isInLastDays,
  TODAY_STR,
};

// ── LEGACY COMPAT (old imports still work) ────────────────────────────────────
export const persons = PERSONS;
export const events = EVENTS;
export const metrics = metricsForPeriod(30);
export const workspaces = [
  { id: 'ws_1', name: 'Operação Brasil', status: 'ativo' as const, plan: 'Growth' as const,  location: 'São Paulo', currency: 'BRL', live: true  },
  { id: 'ws_2', name: 'Teste México',    status: 'trial' as const, plan: 'Starter' as const, location: 'CDMX',      currency: 'MXN', live: false },
  { id: 'ws_3', name: 'Agency Demo',     status: 'ativo' as const, plan: 'Scale' as const,   location: 'Lisboa',    currency: 'EUR', live: true  },
];
export const tenants = TENANTS;
export const reports = REPORTS;
export const links = LINKS;
export const domains = DOMAINS;
export const flows = FLOWS;
export const segments = SEGMENTS;
export const broadcasts = BROADCASTS;
export const conversations = PERSONS.flatMap(p => p.conversations);
