import React, { useEffect, useState } from 'react';
import { events } from '@/lib/fake';
import { Event } from '@/lib/types';
import { StatusChip } from '../domain/StatusChip';
import { format } from 'date-fns';

export function LiveFeed() {
  const [feed, setFeed] = useState<Event[]>(events.slice(0, 5));

  // Simulate incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: Event = {
        id: `evt_synthetic_${Date.now()}`,
        type: ['click_captured', 'postback_received', 'identity_linked'][Math.floor(Math.random() * 3)],
        person_id: `person_00${Math.floor(Math.random() * 8) + 1}`,
        status: 'Captured',
        latency_ms: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
      };
      
      setFeed(prev => [newEvent, ...prev].slice(0, 6));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-graphite border border-line rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between bg-iron">
        <h3 className="text-14 font-semibold text-eggshell flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-verified animate-pulse" />
          Live Proof Feed
        </h3>
        <span className="text-11 font-mono text-stone">Real-time</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col divide-y divide-line">
          {feed.map((evt) => (
            <div key={evt.id} className="p-3 hover:bg-zinc transition-colors animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-11 font-mono text-stone">
                  {format(new Date(evt.timestamp), 'HH:mm:ss')}
                </span>
                <StatusChip status={evt.status} />
              </div>
              <div className="text-13 text-eggshell mb-1">
                {evt.type.replace(/_/g, ' ')}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-12 font-mono text-stone">
                  {evt.person_id} {evt.click_id && `· ${evt.click_id}`}
                </span>
                {evt.value && (
                  <span className="text-13 font-mono font-medium text-verified">
                    R$ {evt.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}