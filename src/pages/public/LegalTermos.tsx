import React from 'react';
import { LegalLayout } from '@/components/layout/LegalLayout';

export default function LegalTermosPage() {
  return (
    <LegalLayout title="Termos de Serviço" version="1.3" effectiveDate="15 de janeiro de 2024">
      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">1. Aceitação dos Termos</h2>
        <p className="text-14 text-stone mb-4">
          Ao criar uma conta ou utilizar os serviços do TrakAcquire, você aceita integralmente estes Termos de Serviço. Se você não concorda com qualquer cláusula, não utilize a plataforma.
        </p>
        <p className="text-14 text-stone">
          Estes termos constituem um contrato juridicamente vinculante entre você (pessoa física ou jurídica) e a TrakAcquire Tecnologia Ltda., doravante denominada "TrakAcquire", "nós" ou "plataforma".
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">2. Descrição do Serviço</h2>
        <p className="text-14 text-stone mb-4">
          O TrakAcquire é uma plataforma SaaS de infraestrutura de atribuição de receita para operações de iGaming e afiliados. A plataforma permite rastrear, atribuir e reconciliar eventos de aquisição, registro e depósito através de múltiplos canais (web, Telegram, WhatsApp) e provedores de receita.
        </p>
        <p className="text-14 text-stone">
          Os serviços incluem, mas não se limitam a: rastreamento de cliques, gestão de identidade cross-channel, automações de mensagens, integração com Meta CAPI, reconciliação financeira e relatórios operacionais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">3. Conta e Responsabilidades</h2>
        <p className="text-14 text-stone mb-4">
          Você é responsável por manter a confidencialidade de suas credenciais de acesso. Todas as ações realizadas em sua conta são de sua responsabilidade exclusiva.
        </p>
        <p className="text-14 text-stone mb-4">
          Você deve fornecer informações precisas e atualizadas ao criar sua conta. É obrigatório habilitar autenticação de dois fatores (MFA) para contas com papel de Owner ou Admin.
        </p>
        <p className="text-14 text-stone">
          Você é responsável por todas as atividades que ocorrem sob sua conta, incluindo ações realizadas por membros da sua equipe que você convidou para a plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">4. Uso Aceitável</h2>
        <p className="text-14 text-stone mb-4">
          Você concorda em não utilizar a plataforma para atividades ilegais, fraudulentas ou que violem direitos de terceiros. É expressamente proibido:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte da plataforma</li>
          <li>Utilizar a plataforma para enviar spam, malware ou conteúdo malicioso</li>
          <li>Tentar burlar limites de uso, quotas ou medidas de segurança</li>
          <li>Revender ou sublicenciar o acesso à plataforma sem autorização expressa</li>
          <li>Coletar dados de outros usuários sem consentimento</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">5. Pagamento e Faturamento</h2>
        <p className="text-14 text-stone mb-4">
          O acesso à plataforma está condicionado ao pagamento das taxas de assinatura conforme o plano contratado (Starter, Growth ou Scale). As faturas são geradas mensalmente no primeiro dia do mês.
        </p>
        <p className="text-14 text-stone mb-4">
          Caso o uso exceda as quotas do seu plano, será cobrado overage conforme a tabela de preços vigente. Você será notificado quando atingir 80% e 95% da sua quota mensal.
        </p>
        <p className="text-14 text-stone">
          O não pagamento de faturas dentro do prazo resultará na suspensão temporária da conta após 7 dias de inadimplência e no cancelamento definitivo após 30 dias.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">6. Propriedade Intelectual</h2>
        <p className="text-14 text-stone mb-4">
          Todos os direitos de propriedade intelectual sobre a plataforma, incluindo código-fonte, design, marca e documentação, pertencem exclusivamente à TrakAcquire.
        </p>
        <p className="text-14 text-stone">
          Você mantém todos os direitos sobre os dados que processa através da plataforma. A TrakAcquire não reivindica propriedade sobre seus dados operacionais, métricas ou conteúdo gerado por você.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">7. Limitação de Responsabilidade</h2>
        <p className="text-14 text-stone mb-4">
          A TrakAcquire não se responsabiliza por perdas financeiras, interrupções operacionais ou danos indiretos decorrentes do uso da plataforma. A plataforma é fornecida "como está", sem garantias de qualquer tipo.
        </p>
        <p className="text-14 text-stone">
          Nossa responsabilidade máxima está limitada ao valor pago por você nos últimos 12 meses. Não garantimos disponibilidade ininterrupta do serviço, embora nos esforcemos para manter SLAs de 99,9% conforme os planos contratados.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">8. Rescisão</h2>
        <p className="text-14 text-stone mb-4">
          Você pode cancelar sua assinatura a qualquer momento através das configurações de billing. O acesso permanecerá ativo até o final do período já pago.
        </p>
        <p className="text-14 text-stone">
          Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, sem aviso prévio e sem reembolso, em casos de uso fraudulento, ilegal ou que comprometa a segurança da plataforma.
        </p>
      </section>

      <section>
        <h2 className="text-24 font-bold text-eggshell mb-4">9. Foro e Legislação Aplicável</h2>
        <p className="text-14 text-stone mb-4">
          Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo, SP, para dirimir quaisquer controvérsias decorrentes destes termos.
        </p>
        <p className="text-14 text-stone">
          Caso alguma cláusula seja considerada inválida, as demais permanecerão em pleno vigor.
        </p>
      </section>
    </LegalLayout>
  );
}