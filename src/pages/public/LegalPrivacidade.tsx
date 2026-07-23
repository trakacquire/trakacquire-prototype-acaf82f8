import React from 'react';
import { LegalLayout } from '@/components/layout/LegalLayout';

export default function LegalPrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" version="1.2" effectiveDate="1 de março de 2024">
      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">1. Dados que Coletamos</h2>
        <p className="text-14 text-stone mb-4">
          Coletamos informações necessárias para fornecer nossos serviços de atribuição de receita e operação da plataforma. Os dados coletados incluem:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li><strong className="text-eggshell">Dados de conta:</strong> nome, email corporativo, senha criptografada, preferências de MFA</li>
          <li><strong className="text-eggshell">Dados operacionais:</strong> click_ids, person_ids, customer_ids, valores de transação, timestamps de eventos</li>
          <li><strong className="text-eggshell">Dados de identidade (PII):</strong> telefone, email, IP (armazenados em cofre criptografado separado)</li>
          <li><strong className="text-eggshell">Dados de uso:</strong> logs de acesso, actions auditadas, sessões ativas, métricas de uso da plataforma</li>
          <li><strong className="text-eggshell">Dados técnicos:</strong> user-agent, device fingerprint, geolocalização aproximada por IP</li>
        </ul>
        <p className="text-14 text-stone">
          Não coletamos dados pessoais sensíveis além do estritamente necessário para atribuição de identidade cross-channel.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">2. Como Usamos os Dados</h2>
        <p className="text-14 text-stone mb-4">
          Utilizamos os dados coletados exclusivamente para:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Prover os serviços contratados de rastreamento, atribuição e reconciliação</li>
          <li>Vincular identidades através de canais (click → telegram → customer_id)</li>
          <li>Gerar relatórios operacionais e financeiros para você</li>
          <li>Detectar fraudes, anomalias e garantir a segurança da plataforma</li>
          <li>Cumprir obrigações legais e regulatórias (audit trail, retenção legal)</li>
          <li>Melhorar nossos produtos através de análise agregada e anonimizada</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">3. Compartilhamento de Dados</h2>
        <p className="text-14 text-stone mb-4">
          Seus dados operacionais permanecem isolados no seu workspace e não são compartilhados com outros clientes. Compartilhamos dados com terceiros apenas quando estritamente necessário:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li><strong className="text-eggshell">Subprocessadores:</strong> AWS (infraestrutura), Supabase (banco de dados), Vercel (hosting) conforme DPA</li>
          <li><strong className="text-eggshell">Integrações externas:</strong> Meta CAPI, Telegram, WhatsApp (apenas quando você configura essas integrações)</li>
          <li><strong className="text-eggshell">Obrigações legais:</strong> autoridades competentes mediante ordem judicial</li>
        </ul>
        <p className="text-14 text-stone">
          Nunca vendemos seus dados para terceiros. Não utilizamos seus dados para fins publicitários próprios.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">4. Retenção de Dados</h2>
        <p className="text-14 text-stone mb-4">
          Mantemos seus dados operacionais pelo período contratado conforme seu plano:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li>Plano Starter: 90 dias de retenção</li>
          <li>Plano Growth: 1 ano de retenção</li>
          <li>Plano Scale: 3 anos de retenção</li>
        </ul>
        <p className="text-14 text-stone mb-4">
          Após o cancelamento da conta, seus dados são mantidos por 30 dias para permitir reativação. Passado esse período, todos os dados operacionais são permanentemente excluídos.
        </p>
        <p className="text-14 text-stone">
          Logs de auditoria e dados financeiros são mantidos por 5 anos conforme obrigações fiscais e legais brasileiras.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">5. Seus Direitos (LGPD)</h2>
        <p className="text-14 text-stone mb-4">
          Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li><strong className="text-eggshell">Acesso:</strong> solicitar cópia de todos os dados que mantemos sobre você</li>
          <li><strong className="text-eggshell">Correção:</strong> corrigir dados incorretos ou desatualizados</li>
          <li><strong className="text-eggshell">Exclusão:</strong> solicitar a exclusão de seus dados (sujeito a obrigações legais de retenção)</li>
          <li><strong className="text-eggshell">Portabilidade:</strong> exportar seus dados em formato estruturado (CSV/JSON)</li>
          <li><strong className="text-eggshell">Revogação:</strong> revogar consentimentos concedidos a qualquer momento</li>
          <li><strong className="text-eggshell">Oposição:</strong> opor-se ao processamento de seus dados para determinadas finalidades</li>
        </ul>
        <p className="text-14 text-stone">
          Para exercer seus direitos, entre em contato através de privacy@trakacquire.io. Respondemos solicitações em até 15 dias úteis.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">6. Cookies e Rastreamento</h2>
        <p className="text-14 text-stone mb-4">
          Utilizamos cookies essenciais para autenticação e funcionamento da plataforma. Não utilizamos cookies de publicidade ou rastreamento de terceiros no dashboard.
        </p>
        <p className="text-14 text-stone">
          Para os serviços de tracking que você oferece aos seus usuários finais através da nossa plataforma, você é o controlador dos dados e responsável por obter consentimentos adequados.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">7. Segurança</h2>
        <p className="text-14 text-stone mb-4">
          Implementamos medidas técnicas e organizacionais de segurança da informação conforme as melhores práticas da indústria:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Criptografia em trânsito (TLS 1.3) e em repouso (AES-256)</li>
          <li>PII armazenada em cofre segregado com criptografia adicional</li>
          <li>Autenticação multi-fator obrigatória para acessos administrativos</li>
          <li>Isolamento de dados entre tenants (RLS no banco de dados)</li>
          <li>Monitoramento contínuo de segurança e detecção de anomalias</li>
          <li>Backups diários com retenção de 30 dias</li>
        </ul>
      </section>

      <section>
        <h2 className="text-24 font-bold text-eggshell mb-4">8. Contato do Encarregado de Dados</h2>
        <p className="text-14 text-stone mb-4">
          Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso Data Protection Officer (DPO):
        </p>
        <div className="bg-iron border border-line rounded-lg p-4 text-14 font-mono text-stone">
          Email: dpo@trakacquire.io<br />
          Endereço: Av. Paulista, 1000 - São Paulo, SP - 01310-100
        </div>
      </section>
    </LegalLayout>
  );
}