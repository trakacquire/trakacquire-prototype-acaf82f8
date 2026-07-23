import React from 'react';
import { AppShell } from '@/components/layout/AppShell';

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  return (
    <AppShell breadcrumb={[{ label: 'Signal Ledger', href: '/ledger' }, { label: params.eventId }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-24 font-bold text-eggshell mb-6">Event Detail: <span className="font-mono text-stone">{params.eventId}</span></h1>
        
        <div className="bg-graphite border border-line rounded-xl p-6 font-mono text-13 overflow-x-auto">
          <pre className="text-proof-blue">
{`{
  "id": "${params.eventId}",
  "type": "first_deposit_confirmed",
  "occurred_at": "2025-07-24T14:30:00Z",
  "received_at": "2025-07-24T14:30:02Z",
  "source": {
    "adapter": "tap-v2.1.0",
    "idempotency_key": "trx_abc123"
  },
  "correlation": {
    "person_id": "person_001",
    "click_id": "clk_8f72h"
  },
  "payload": {
    "value": 200.0,
    "currency": "BRL"
  }
}`}
          </pre>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md font-medium text-14 hover:bg-line">
            Ver Attribution
          </button>
        </div>
      </div>
    </AppShell>
  );
}