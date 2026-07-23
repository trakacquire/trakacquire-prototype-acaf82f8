import React from 'react';
import { Link, useParams, useLocation } from 'wouter';

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const { token } = params;

  // Simulate token validation
  const isValidToken = token !== 'invalid';

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-graphite border border-critical/30 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-critical/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-critical text-3xl">!</span>
          </div>
          <h2 className="text-24 font-bold text-eggshell mb-2">Convite Inválido</h2>
          <p className="text-14 text-stone mb-6">Este convite expirou ou já foi usado.</p>
          <Link href="/login" className="inline-block bg-zinc text-eggshell border border-line px-6 py-2 rounded-md font-medium text-14 hover:bg-line transition-colors">
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-graphite border border-line rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-24 font-bold text-eggshell flex items-center gap-2 mb-6">
            <span className="w-6 h-6 rounded bg-proof-blue shrink-0"></span>
            TrakAcquire
          </div>
        </div>

        <h1 className="text-24 font-bold text-eggshell mb-3 text-center">
          Você foi convidado para<br />
          <span className="text-proof-blue">Operação Brasil</span>
        </h1>

        <div className="bg-iron border border-line rounded-xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-proof-blue text-ink flex items-center justify-center font-bold text-18 shrink-0">
            JS
          </div>
          <div>
            <div className="text-14 font-medium text-eggshell">João Souza</div>
            <div className="text-12 text-stone">joao@operacao.com</div>
            <div className="text-12 text-stone mt-1">convidou você como <span className="font-mono text-eggshell">Analista</span></div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            onClick={() => setLocation('/command')}
            className="w-full bg-eggshell text-ink font-medium py-3 rounded-md text-14 hover:bg-white transition-colors"
          >
            Aceitar Convite
          </button>
          <button className="w-full bg-transparent border border-critical text-critical font-medium py-3 rounded-md text-14 hover:bg-critical/10 transition-colors">
            Recusar
          </button>
        </div>

        <p className="text-12 text-stone text-center">
          Ao aceitar, você concorda com os{' '}
          <Link href="/legal/termos" className="text-proof-blue hover:underline">
            Termos de Serviço
          </Link>
        </p>
      </div>
    </div>
  );
}