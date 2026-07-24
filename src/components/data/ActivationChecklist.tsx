import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { db } from '@/lib/fake/db';

/**
 * ActivationChecklist (PRODUCT-MAP F1) — "Prove seu primeiro FTD".
 * Fixo no topo do Command ATÉ que exista pelo menos um FTD reconciliado.
 * Após isso, some silenciosamente (a operação já provou o fluxo ponta-a-ponta).
 */
export function ActivationChecklist() {
  const reconciledFtds = db.persons.filter(
    (p) => p.ftd_at && p.deposits.some((d) => d.reconciled),
  ).length;

  // "Depois some" — regra explícita de PRODUCT-MAP F1.
  if (reconciledFtds > 0) return null;

  const steps = [
    { key: 'provider',   label: 'Conectar provider (TAP/BetLoco)', done: db.persons.length > 0, href: '/integrations' },
    { key: 'domain',     label: 'Domínio verificado (SPF/DKIM)',   done: false, href: '/domains' },
    { key: 'link',       label: 'Primeiro link de tracking criado', done: false, href: '/tracking' },
    { key: 'bot',        label: 'Bot Telegram conectado',           done: false, href: '/integrations/telegram' },
    { key: 'meta',       label: 'Meta CAPI conectada',              done: false, href: '/integrations/meta' },
    { key: 'firstFtd',   label: 'Primeiro FTD reconciliado (D+1)',  done: false, href: '/ledger' },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <section className="rounded-xl border border-proof-blue/30 bg-proof-blue/5 p-5">
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="text-11 font-mono uppercase tracking-[0.18em] text-proof-blue mb-1">Ativação · F1</div>
          <h3 className="text-eggshell text-18 font-medium">Prove seu primeiro FTD</h3>
          <p className="text-stone text-12 mt-0.5">
            {doneCount}/{steps.length} passos concluídos — {pct}%. Some quando reconciliar o primeiro FTD.
          </p>
        </div>
        <div className="text-24 font-mono tabular-nums text-proof-blue">{pct}%</div>
      </header>

      <ol className="space-y-1.5">
        {steps.map((s) => (
          <li key={s.key}>
            <Link
              href={s.href}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-graphite transition-colors group"
            >
              {s.done ? (
                <CheckCircle2 className="w-4 h-4 text-verified shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone shrink-0" />
              )}
              <span className={`text-13 flex-1 ${s.done ? 'text-stone line-through' : 'text-eggshell'}`}>
                {s.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-stone opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
