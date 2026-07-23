import { Event } from '../types';

export const events: Event[] = [
  { id: 'evt_1001', type: 'first_deposit_confirmed', person_id: 'person_001', click_id: 'clk_8f72h', status: 'Reconciled', latency_ms: 240, value: 200, timestamp: '2025-07-23T14:32:01Z' },
  { id: 'evt_1002', type: 'postback_received', person_id: 'person_001', click_id: 'clk_8f72h', status: 'Confirmed', latency_ms: 45, value: 200, timestamp: '2025-07-23T14:31:55Z' },
  { id: 'evt_1003', type: 'click_captured', person_id: 'person_008', click_id: 'clk_77dd4', status: 'Captured', latency_ms: 12, timestamp: '2025-07-23T14:30:10Z' },
  { id: 'evt_1004', type: 'divergence_detected', person_id: 'person_004', click_id: 'clk_99aa1', status: 'Divergent', latency_ms: 0, timestamp: '2025-07-23T14:25:00Z' },
  { id: 'evt_1005', type: 'registration_confirmed', person_id: 'person_007', click_id: 'clk_55cc3', status: 'Reconciled', latency_ms: 180, timestamp: '2025-07-23T14:20:00Z' },
  { id: 'evt_1006', type: 'identity_linked', person_id: 'person_005', click_id: 'clk_11bb2', status: 'Linked', latency_ms: 35, timestamp: '2025-07-23T14:15:30Z' },
  { id: 'evt_1007', type: 'postback_received', person_id: 'person_006', status: 'Orphan', latency_ms: 50, value: 100, timestamp: '2025-07-23T14:10:00Z' },
  { id: 'evt_1008', type: 'attribution_resolved', person_id: 'person_002', click_id: 'clk_22jd9', status: 'Reconciled', latency_ms: 120, timestamp: '2025-07-23T14:05:00Z' },
];