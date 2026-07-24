import React from 'react';
import { Link } from 'wouter';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-graphite border border-line rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="text-11 font-serif italic text-stone mb-2">Access · Nova conta</div>
          <div className="text-24 font-bold text-eggshell flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-proof-blue shrink-0"></span>
            TrakAcquire
          </div>
          <p className="text-14 text-stone mt-2">Crie sua conta. Proof over noise.</p>
        </div>


        <form className="space-y-4">
          <div>
            <label className="block text-12 font-medium text-stone mb-1.5">Email corporativo</label>
            <input 
              type="email" 
              placeholder="voce@operacao.com"
              className="w-full bg-zinc border border-line rounded-md px-3 py-2.5 text-14 text-eggshell focus:outline-none focus:border-proof-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-12 font-medium text-stone mb-1.5">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-zinc border border-line rounded-md px-3 py-2.5 text-14 text-eggshell focus:outline-none focus:border-proof-blue transition-colors"
            />
          </div>
          <div>
            <label className="block text-12 font-medium text-stone mb-1.5">Confirmar Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-zinc border border-line rounded-md px-3 py-2.5 text-14 text-eggshell focus:outline-none focus:border-proof-blue transition-colors"
            />
          </div>
          
          <div className="flex items-start gap-2 pt-2">
            <input type="checkbox" id="terms" className="mt-1 bg-zinc border-line text-proof-blue rounded" />
            <label htmlFor="terms" className="text-12 text-stone">
              Eu aceito os <Link href="/legal/termos" className="text-proof-blue hover:underline">Termos de Serviço</Link>, a <Link href="/legal/privacidade" className="text-proof-blue hover:underline">Política de Privacidade</Link> e o <Link href="/legal/dpa" className="text-proof-blue hover:underline">DPA</Link>.
            </label>
          </div>


          <button type="button" onClick={() => window.location.href='/command'} className="w-full bg-eggshell text-ink font-medium py-2.5 rounded-md text-14 hover:bg-white transition-colors mt-4">
            Criar conta
          </button>
        </form>

        <div className="mt-8 text-center text-13 text-stone">
          Já tem uma conta? <Link href="/login" className="text-eggshell hover:text-proof-blue transition-colors">Fazer login</Link>
        </div>
      </div>
    </div>
  );
}