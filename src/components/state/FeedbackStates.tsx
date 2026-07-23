import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-stone">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <div className="text-14 font-medium animate-pulse">Carregando dados...</div>
    </div>
  );
}

export function EmptyState({ title, description, actionLabel, onAction }: { title: string, description: string, actionLabel: string, onAction?: () => void }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-graphite border border-line border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-18 font-medium text-eggshell mb-2">{title}</h3>
      <p className="text-14 text-stone max-w-md mb-6">{description}</p>
      {actionLabel && (
        <button onClick={onAction} className="bg-eggshell text-ink px-4 py-2 rounded-md font-medium text-14 hover:bg-white transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, correlationId, onRetry }: { message: string, correlationId?: string, onRetry?: () => void }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-graphite border border-critical/30 rounded-xl flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-critical/10 flex items-center justify-center mb-4">
        <span className="text-critical text-xl">!</span>
      </div>
      <h3 className="text-18 font-medium text-eggshell mb-2">Algo deu errado</h3>
      <p className="text-14 text-stone max-w-md mb-4">{message}</p>
      
      {correlationId && (
        <div className="bg-iron border border-line rounded px-3 py-1.5 mb-6 text-12 font-mono text-stone">
          Ref: {correlationId}
        </div>
      )}
      
      {onRetry && (
        <button onClick={onRetry} className="bg-zinc border border-line text-eggshell px-4 py-2 rounded-md font-medium text-14 hover:bg-line transition-colors">
          Tentar novamente
        </button>
      )}
    </div>
  );
}