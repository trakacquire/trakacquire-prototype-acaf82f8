import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AuthCallbackPage() {
  const [, setLocation] = useLocation();
  
  // Check for error in query params
  const urlParams = new URLSearchParams(window.location.search);
  const hasError = urlParams.get('error') === 'true';

  useEffect(() => {
    if (hasError) {
      return;
    }

    const timer = setTimeout(() => {
      setLocation('/command');
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasError, setLocation]);

  if (hasError) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-graphite border border-critical/30 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-critical/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-critical text-3xl">!</span>
          </div>
          <h2 className="text-24 font-bold text-eggshell mb-2">Falha na Autenticação</h2>
          <p className="text-14 text-stone mb-6">Não foi possível verificar suas credenciais. Tente novamente.</p>
          <button 
            onClick={() => setLocation('/login')}
            className="bg-eggshell text-ink px-6 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-line border-t-proof-blue rounded-full animate-spin mb-6"></div>
      <p className="text-14 text-stone font-medium">Verificando credenciais...</p>
    </div>
  );
}