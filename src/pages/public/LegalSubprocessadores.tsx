import React from 'react';
import { LegalLayout } from '@/components/layout/LegalLayout';

export default function LegalSubprocessadoresPage() {
  const subprocessors = [
    { name: 'Amazon Web Services (AWS)', purpose: 'Infraestrutura de hospedagem e computação', country: 'Estados Unidos', privacy: 'https://aws.amazon.com/privacy/' },
    { name: 'Supabase Inc.', purpose: 'Banco de dados PostgreSQL gerenciado', country: 'Estados Unidos', privacy: 'https://supabase.com/privacy' },
    { name: 'Vercel Inc.', purpose: 'Hospedagem de aplicação frontend', country: 'Estados Unidos', privacy: 'https://vercel.com/legal/privacy-policy' },
    { name: 'Sentry', purpose: 'Monitoramento de erros e performance', country: 'Estados Unidos', privacy: 'https://sentry.io/privacy/' },
    { name: 'OpenAI', purpose: 'Processamento de linguagem natural (IA)', country: 'Estados Unidos', privacy: 'https://openai.com/privacy/' },
    { name: 'Twilio Inc.', purpose: 'Envio de SMS e chamadas de voz', country: 'Estados Unidos', privacy: 'https://www.twilio.com/legal/privacy' },
    { name: 'Telegram Messenger LLP', purpose: 'Integração de mensageria via Bot API', country: 'EUA / Emirados Árabes', privacy: 'https://telegram.org/privacy' },
    { name: 'Meta Platforms Inc.', purpose: 'Conversions API (CAPI) para Facebook/Instagram', country: 'Estados Unidos', privacy: 'https://www.facebook.com/privacy/explanation' },
  ];

  return (
    <LegalLayout title="Lista de Subprocessadores" version="1.4" effectiveDate="1 de junho de 2025">
      <section className="mb-8">
        <p className="text-14 text-stone mb-6">
          Em conformidade com nosso Data Processing Agreement (DPA), esta página lista todos os subprocessadores autorizados que a TrakAcquire utiliza para processar dados em nome dos clientes.
        </p>
        <p className="text-14 text-stone mb-6">
          A TrakAcquire notificará clientes com 30 dias de antecedência sobre qualquer adição ou substituição de subprocessadores. Clientes podem se opor por motivos legítimos relacionados à proteção de dados.
        </p>
        <p className="text-14 text-stone mb-8">
          Última atualização: <span className="font-mono text-eggshell">1 de junho de 2025</span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-6">Subprocessadores Autorizados</h2>
        
        <div className="bg-iron border border-line rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-graphite border-b border-line">
              <tr>
                <th className="px-4 py-3 text-12 font-bold text-stone uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-12 font-bold text-stone uppercase tracking-wider">Finalidade</th>
                <th className="px-4 py-3 text-12 font-bold text-stone uppercase tracking-wider">País</th>
                <th className="px-4 py-3 text-12 font-bold text-stone uppercase tracking-wider">Política de Privacidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {subprocessors.map((sub, idx) => (
                <tr key={idx} className="hover:bg-zinc transition-colors">
                  <td className="px-4 py-3 text-14 text-eggshell font-medium">{sub.name}</td>
                  <td className="px-4 py-3 text-13 text-stone">{sub.purpose}</td>
                  <td className="px-4 py-3 text-13 text-stone">{sub.country}</td>
                  <td className="px-4 py-3">
                    <a 
                      href={sub.privacy} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-13 text-proof-blue hover:underline"
                    >
                      Ver política →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">Transferências Internacionais</h2>
        <p className="text-14 text-stone mb-4">
          Alguns subprocessadores estão localizados fora do Brasil, principalmente nos Estados Unidos. Essas transferências internacionais são protegidas pelos seguintes mecanismos:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li>Cláusulas Contratuais Padrão (Standard Contractual Clauses - SCC) aprovadas pela Comissão Europeia</li>
          <li>Certificações de conformidade (SOC 2, ISO 27001) dos subprocessadores</li>
          <li>Garantias contratuais de proteção de dados equivalentes à LGPD</li>
          <li>Criptografia de dados em trânsito e em repouso</li>
        </ul>
        <p className="text-14 text-stone">
          A TrakAcquire avalia regularmente a conformidade de seus subprocessadores e mantém contratos que exigem nível adequado de proteção de dados pessoais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">Notificação de Alterações</h2>
        <p className="text-14 text-stone mb-4">
          Você será notificado por email com 30 dias de antecedência sobre:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li>Adição de novos subprocessadores</li>
          <li>Substituição de subprocessadores existentes</li>
          <li>Mudanças significativas na finalidade do processamento</li>
        </ul>
        <p className="text-14 text-stone mb-4">
          Caso você se oponha a um subprocessador por motivos legítimos relacionados à proteção de dados, entre em contato com dpo@trakacquire.io dentro do período de notificação.
        </p>
        <p className="text-14 text-stone">
          Se não conseguirmos chegar a uma resolução satisfatória, você terá o direito de rescindir o contrato sem penalidade.
        </p>
      </section>

      <section>
        <h2 className="text-24 font-bold text-eggshell mb-4">Histórico de Alterações</h2>
        <div className="space-y-4">
          <div className="border-l-2 border-verified pl-4 py-1">
            <div className="text-14 font-mono text-eggshell mb-1">v1.4 — 1 de junho de 2025</div>
            <div className="text-13 text-stone">Adicionado: Meta Platforms Inc. (CAPI)</div>
          </div>
          <div className="border-l-2 border-line pl-4 py-1">
            <div className="text-14 font-mono text-stone mb-1">v1.3 — 15 de março de 2025</div>
            <div className="text-13 text-stone">Adicionado: OpenAI (processamento de IA)</div>
          </div>
          <div className="border-l-2 border-line pl-4 py-1">
            <div className="text-14 font-mono text-stone mb-1">v1.2 — 10 de janeiro de 2025</div>
            <div className="text-13 text-stone">Atualizado: Telegram (novo endereço legal)</div>
          </div>
          <div className="border-l-2 border-line pl-4 py-1">
            <div className="text-14 font-mono text-stone mb-1">v1.1 — 15 de janeiro de 2024</div>
            <div className="text-13 text-stone">Versão inicial publicada</div>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}