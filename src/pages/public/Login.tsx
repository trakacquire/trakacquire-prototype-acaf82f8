import React from 'react';
import { Link } from 'wouter';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-graphite border border-line rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-11 font-serif italic text-stone mb-2">Access · Workspace</div>
          <div className="text-24 font-bold text-eggshell flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-proof-blue shrink-0"></span>
            TrakAcquire
          </div>
          <p className="text-14 text-stone mt-2">Proof over noise.</p>
        </div>


        <form className="space-y-4">
          <div>
            <label className="block text-12 font-medium text-stone mb-1.5">Email corporativo</label>
            <input 
              type="email" 
              placeholder="jota@operacao.com"
              className="w-full bg-zinc border border-line rounded-md px-3 py-2.5 text-14 text-eggshell focus:outline-none focus:border-proof-blue transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-12 font-medium text-stone">Senha</label>
              <a href="#" className="text-12 text-proof-blue hover:underline">Esqueci a senha</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-zinc border border-line rounded-md px-3 py-2.5 text-14 text-eggshell focus:outline-none focus:border-proof-blue transition-colors"
            />
          </div>

          <button type="button" onClick={() => window.location.href='/command'} className="w-full bg-eggshell text-ink font-medium py-2.5 rounded-md text-14 hover:bg-white transition-colors mt-2">
            Entrar no Workspace
          </button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-line"></div>
            <span className="flex-shrink-0 mx-4 text-stone text-12">ou</span>
            <div className="flex-grow border-t border-line"></div>
          </div>

          <button type="button" className="w-full bg-transparent border border-line text-eggshell font-medium py-2.5 rounded-md text-14 hover:bg-zinc transition-colors">
            Entrar com Magic Link
          </button>
        </form>

        <div className="mt-8 text-center text-13 text-stone">
          Não tem uma conta? <Link href="/signup" className="text-eggshell hover:text-proof-blue transition-colors">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}