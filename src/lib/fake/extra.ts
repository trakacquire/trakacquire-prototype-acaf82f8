export const tenants = [
  { id: 'tenant_1', name: 'Operação Brasil', plan: 'Growth', mrr: 797, usage: 127450, quota: 500000, health: 'good', active: true, last_access: '2025-07-24T10:00:00Z', ftd_reached: true, state: 'ativo' },
  { id: 'tenant_2', name: 'Agency Demo', plan: 'Scale', mrr: 1997, usage: 482000, quota: -1, health: 'good', active: true, last_access: '2025-07-24T09:30:00Z', ftd_reached: true, state: 'ativo' },
  { id: 'tenant_3', name: 'Teste MX', plan: 'Starter', mrr: 0, usage: 4500, quota: 50000, health: 'warning', active: true, last_access: '2025-07-23T14:20:00Z', ftd_reached: false, state: 'trial' },
  { id: 'tenant_4', name: 'Suspenso Inc', plan: 'Growth', mrr: 0, usage: 0, quota: 500000, health: 'critical', active: false, last_access: '2025-06-15T08:00:00Z', ftd_reached: true, state: 'suspenso' }
];

export const reports = [
  { id: 'rep_1', name: 'P&L Semanal', status: 'ativo', schedule: 'Toda segunda 08:00', recipients: 3 },
  { id: 'rep_2', name: 'Coorte D7 por Origem', status: 'pausado', schedule: 'Diário 09:00', recipients: 1 },
  { id: 'rep_3', name: 'Reconciliação Mensal', status: 'ativo', schedule: 'Dia 1 10:00', recipients: 5 },
  { id: 'rep_4', name: 'Performance por Criativo', status: 'ativo', schedule: 'Diário 18:00', recipients: 2 },
  { id: 'rep_5', name: 'Auditoria de Consentimentos', status: 'pausado', schedule: 'Manual', recipients: 1 }
];

export const links = [
  { id: 'link_1', name: 'Presell v3 Bot', type: 'presell→bot', domain: 'track.operacaobr.com', clicks: 8420, conversions: 245, cpftd: 185.4, state: 'ativo' },
  { id: 'link_2', name: 'Bot Direto Insta', type: 'bot→canal', domain: 'lnk.operacaobr.com', clicks: 4500, conversions: 120, cpftd: 145.2, state: 'ativo' },
  { id: 'link_3', name: 'Multi-fonte Teste', type: 'multi-fonte', domain: 'track.operacaobr.com', clicks: 1200, conversions: 15, cpftd: 320.0, state: 'pausado' },
  { id: 'link_4', name: 'Orgânico Canal', type: 'bot→canal', domain: 'lnk.operacaobr.com', clicks: 23000, conversions: 450, cpftd: 0, state: 'ativo' },
  { id: 'link_5', name: 'TikTok Oferta A', type: 'presell→bot', domain: 'track.operacaobr.com', clicks: 890, conversions: 12, cpftd: 450.5, state: 'esgotando' },
  { id: 'link_6', name: 'Legacy Redirect', type: 'multi-fonte', domain: 'test.trakacquire.io', clicks: 45, conversions: 0, cpftd: 0, state: 'arquivado' }
];

export const domains = [
  { id: 'dom_1', name: 'track.operacaobr.com', status: 'verificado', role: 'Principal', p95: 48, last_check: '2min atrás' },
  { id: 'dom_2', name: 'lnk.operacaobr.com', status: 'verificado', role: 'Secundário', p95: 52, last_check: '5min atrás' },
  { id: 'dom_3', name: 'test.trakacquire.io', status: 'pendente', role: 'Reserva', p95: 0, last_check: 'nunca' }
];

export const flows = [
  { id: 'flow_1', name: 'Boas-vindas Telegram v3', status: 'published', version: 3, entries: 847, ftd_generated: 47, revenue: 9400,
    nodes: [
      { id: 'n1', type: 'trigger', x: 100, y: 100, label: '/start com payload' },
      { id: 'n2', type: 'message', x: 100, y: 200, label: 'Olá! Você chegou pelo link...' },
      { id: 'n3', type: 'condition', x: 100, y: 300, label: 'Tem click_id?' },
      { id: 'n4', type: 'message', x: -50, y: 400, label: 'Link rastreado' },
      { id: 'n5', type: 'message', x: 250, y: 400, label: 'Link padrão' },
      { id: 'n6', type: 'wait', x: 100, y: 500, label: 'Espera 48h' },
      { id: 'n7', type: 'condition', x: 100, y: 600, label: 'Fez registro?' },
      { id: 'n8', type: 'capi', x: -50, y: 700, label: 'CAPI: CompleteRegistration' },
      { id: 'n9', type: 'handoff', x: 250, y: 700, label: 'Handoff Atendente' }
    ]
  },
  { id: 'flow_2', name: 'Recuperação 7d', status: 'published', version: 1, entries: 234, ftd_generated: 12, revenue: 2400, nodes: [] },
  { id: 'flow_3', name: 'Reativação 30d', status: 'paused', version: 2, entries: 89, ftd_generated: 4, revenue: 800, nodes: [] },
  { id: 'flow_4', name: 'Teste A/B Oferta', status: 'draft', version: 1, entries: 0, ftd_generated: 0, revenue: 0, nodes: [] }
];

export const segments = [
  { id: 'seg_1', name: 'FTD Meta 30d', count: 892, rule: 'FTD = sim AND Origem = Meta AND Depósito > 30d atrás' },
  { id: 'seg_2', name: 'Leads Frios', count: 1234, rule: 'Registro = não AND Clique > 15d atrás' },
  { id: 'seg_3', name: 'VIP Pós-FTD', count: 47, rule: 'FTD = sim AND Total Depósitos > R$ 1000' },
  { id: 'seg_4', name: 'Órfãos sem Telegram', count: 18, rule: 'Telegram = null AND Registro = sim' },
  { id: 'seg_5', name: 'Alta Velocidade', count: 23, rule: 'Velocidade Clique->FTD < 1h' }
];

export const broadcasts = [
  { id: 'bc_1', name: 'Promoção Segunda', status: 'enviado', target: 847, open_rate: 34, date: '2025-07-21 10:00' },
  { id: 'bc_2', name: 'Reativação Julho', status: 'agendado', target: 1234, open_rate: 0, date: '2025-07-24 09:00' },
  { id: 'bc_3', name: 'Teste Oferta', status: 'draft', target: 0, open_rate: 0, date: '-' }
];

export const conversations = [
  { id: 'conv_1', user: 'person_001', name: 'João Silva', channel: 'Telegram', last_msg: 'Já fiz o depósito, e agora?', time: '2m', unread: true },
  { id: 'conv_2', user: 'person_004', name: 'Maria F.', channel: 'WhatsApp', last_msg: 'O link não tá abrindo...', time: '15m', unread: true },
  { id: 'conv_3', user: 'person_007', name: 'Carlos (VIP)', channel: 'Telegram', last_msg: 'Valeu pelo bônus!', time: '1h', unread: false },
  { id: 'conv_4', user: 'person_002', name: 'Ana Souza', channel: 'Telegram', last_msg: 'Como funciona o saque?', time: '2h', unread: false },
  { id: 'conv_5', user: 'person_005', name: 'Lead 4482', channel: 'Telegram', last_msg: '/start clk_11bb2', time: '5h', unread: false },
  { id: 'conv_6', user: 'person_008', name: 'Lead 9912', channel: 'Telegram', last_msg: 'Tem grupo grátis?', time: '1d', unread: false },
  { id: 'conv_7', user: 'person_003', name: 'Roberto M.', channel: 'WhatsApp', last_msg: 'Tudo certo, obrigado.', time: '2d', unread: false },
  { id: 'conv_8', user: 'person_006', name: 'Usuário 9926', channel: 'Telegram', last_msg: '?', time: '3d', unread: false }
];