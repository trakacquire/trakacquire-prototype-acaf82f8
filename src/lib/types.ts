export type EventStatus = 
  | 'Captured' 
  | 'Linked' 
  | 'Confirmed' 
  | 'Reconciled' 
  | 'Divergent' 
  | 'Failed' 
  | 'Policy blocked' 
  | 'Orphan' 
  | 'Synthetic';

export type IntegrationState = 'disabled' | 'sandbox' | 'pilot' | 'production' | 'policy-blocked';

export type FunnelStage = 'Lead' | 'Registered' | 'Ativo pós-FTD' | 'VIP' | 'Esfriando' | 'Churn';

export type Workspace = {
  id: string;
  name: string;
  status: 'ativo' | 'trial' | 'suspenso';
  plan: 'Starter' | 'Growth' | 'Scale';
};

export type Person = {
  id: string;
  click_id?: string;
  customer_id?: string;
  telegram_id?: string;
  status: string;
  origin: string;
  campaign: string;
  registered_at?: string;
  ftd_at?: string;
  total_deposited: number;
  payout: number;
  net_deposit: number;
  stage: FunnelStage;
  score: number;
};

export type Event = {
  id: string;
  type: string;
  person_id?: string;
  click_id?: string;
  status: EventStatus;
  latency_ms: number;
  value?: number;
  timestamp: string;
};

export type MetricDelta = {
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
};

export type Metrics = {
  spend: number;
  deposits: number;
  withdrawals: number;
  net_deposit: number;
  payout: number;
  profit: number;
  roi: number;
  clicks: number;
  leads: number;
  registrations: number;
  ftd: number;
  cpftd: number;
};
