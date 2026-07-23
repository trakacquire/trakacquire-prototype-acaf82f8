import React from 'react';
import { LegalLayout } from '@/components/layout/LegalLayout';

export default function LegalDPAPage() {
  return (
    <LegalLayout title="Data Processing Agreement (DPA)" version="1.1" effectiveDate="15 de janeiro de 2024">
      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">1. Definições</h2>
        <p className="text-14 text-stone mb-4">
          Para fins deste Acordo de Processamento de Dados (DPA), aplicam-se as seguintes definições:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li><strong className="text-eggshell">Controlador:</strong> você, o cliente da TrakAcquire, que determina as finalidades e meios do processamento de dados pessoais</li>
          <li><strong className="text-eggshell">Operador:</strong> a TrakAcquire, que processa dados pessoais em nome do Controlador</li>
          <li><strong className="text-eggshell">Dados Pessoais:</strong> qualquer informação relacionada a uma pessoa natural identificada ou identificável processada através da plataforma</li>
          <li><strong className="text-eggshell">Subprocessador:</strong> terceiro contratado pela TrakAcquire para auxiliar no processamento de dados</li>
          <li><strong className="text-eggshell">Violação de Dados:</strong> incidente de segurança que resulte em acesso, divulgação ou perda não autorizada de dados pessoais</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">2. Obrigações do Controlador</h2>
        <p className="text-14 text-stone mb-4">
          Como Controlador dos dados, você é responsável por:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Garantir que tem base legal para coletar e processar os dados pessoais</li>
          <li>Obter consentimentos adequados dos titulares de dados quando necessário</li>
          <li>Definir claramente as finalidades do processamento</li>
          <li>Instruir a TrakAcquire sobre como processar os dados conforme suas necessidades</li>
          <li>Responder diretamente a solicitações de titulares de dados (acesso, correção, exclusão)</li>
          <li>Notificar a TrakAcquire imediatamente sobre qualquer solicitação de autoridade competente</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">3. Obrigações do Operador (TrakAcquire)</h2>
        <p className="text-14 text-stone mb-4">
          Como Operador, a TrakAcquire compromete-se a:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Processar dados pessoais apenas conforme instruções documentadas do Controlador</li>
          <li>Garantir que pessoas autorizadas a processar dados estejam sujeitas a dever de confidencialidade</li>
          <li>Implementar medidas técnicas e organizacionais apropriadas para segurança dos dados</li>
          <li>Não subcontratar processamento sem autorização prévia por escrito do Controlador</li>
          <li>Auxiliar o Controlador no cumprimento de obrigações de resposta a titulares de dados</li>
          <li>Excluir ou devolver todos os dados pessoais após término do contrato</li>
          <li>Disponibilizar informações necessárias para demonstrar conformidade</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">4. Subprocessamento</h2>
        <p className="text-14 text-stone mb-4">
          A TrakAcquire pode contratar subprocessadores para auxiliar na prestação dos serviços. Ao aceitar este DPA, você autoriza o uso dos subprocessadores listados em nossa página de Subprocessadores.
        </p>
        <p className="text-14 text-stone mb-4">
          Notificaremos você com 30 dias de antecedência sobre adição ou substituição de subprocessadores. Você terá direito de se opor por motivos legítimos relacionados à proteção de dados.
        </p>
        <p className="text-14 text-stone">
          A TrakAcquire permanece integralmente responsável perante você pelo desempenho de obrigações de subprocessadores contratados.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">5. Medidas Técnicas e Organizacionais</h2>
        <p className="text-14 text-stone mb-4">
          A TrakAcquire implementa as seguintes medidas de segurança:
        </p>
        <div className="bg-iron border border-line rounded-lg p-4 mb-4">
          <h3 className="text-16 font-bold text-eggshell mb-3">Medidas Técnicas:</h3>
          <ul className="list-disc list-inside text-13 text-stone space-y-1 ml-4">
            <li>Criptografia em trânsito (TLS 1.3) e em repouso (AES-256)</li>
            <li>Segregação de dados entre tenants via Row Level Security (RLS)</li>
            <li>PII armazenada em cofre criptografado separado com chaves rotacionadas</li>
            <li>Autenticação multi-fator (MFA) obrigatória para acessos privilegiados</li>
            <li>Backups diários criptografados com retenção de 30 dias</li>
            <li>Monitoramento contínuo de segurança e detecção de intrusão</li>
          </ul>
        </div>
        <div className="bg-iron border border-line rounded-lg p-4">
          <h3 className="text-16 font-bold text-eggshell mb-3">Medidas Organizacionais:</h3>
          <ul className="list-disc list-inside text-13 text-stone space-y-1 ml-4">
            <li>Política de acesso baseada no princípio do menor privilégio</li>
            <li>Treinamento obrigatório de segurança da informação para toda equipe</li>
            <li>Processo de revisão periódica de acessos (trimestral)</li>
            <li>Termos de confidencialidade assinados por todos os colaboradores</li>
            <li>Plano de resposta a incidentes documentado e testado</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">6. Violações de Dados</h2>
        <p className="text-14 text-stone mb-4">
          Em caso de violação de dados pessoais, a TrakAcquire notificará você sem demora injustificada e no máximo em 72 horas após tomar conhecimento do incidente.
        </p>
        <p className="text-14 text-stone mb-4">
          A notificação incluirá:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4">
          <li>Descrição da natureza da violação e dados afetados</li>
          <li>Número aproximado de titulares e registros impactados</li>
          <li>Consequências prováveis da violação</li>
          <li>Medidas tomadas ou propostas para remediar a violação</li>
          <li>Ponto de contato para obter mais informações</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-24 font-bold text-eggshell mb-4">7. Auditorias e Inspeções</h2>
        <p className="text-14 text-stone mb-4">
          Você tem direito de auditar a conformidade da TrakAcquire com este DPA, mediante aviso prévio de 30 dias e no máximo uma vez por ano, salvo em caso de violação de dados.
        </p>
        <p className="text-14 text-stone">
          A TrakAcquire disponibilizará relatórios SOC 2 Type II mediante solicitação como evidência de conformidade com controles de segurança e privacidade.
        </p>
      </section>

      <section>
        <h2 className="text-24 font-bold text-eggshell mb-4">8. Devolução e Exclusão de Dados</h2>
        <p className="text-14 text-stone mb-4">
          Após término do contrato ou mediante sua solicitação, a TrakAcquire:
        </p>
        <ul className="list-disc list-inside text-14 text-stone space-y-2 ml-4 mb-4">
          <li>Devolverá todos os dados pessoais em formato estruturado (CSV/JSON) mediante solicitação</li>
          <li>Excluirá permanentemente todos os dados pessoais após 30 dias do cancelamento</li>
          <li>Fornecerá certificado de exclusão mediante solicitação</li>
        </ul>
        <p className="text-14 text-stone">
          Exceção: dados de audit log e financeiros serão mantidos por 5 anos conforme obrigações legais brasileiras, mesmo após término do contrato.
        </p>
      </section>
    </LegalLayout>
  );
}