import React from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { workspaces } from '@/lib/fake';

export function WorkspaceSwitcher() {
  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center justify-between bg-graphite border border-line rounded-md px-3 py-2 hover:border-stone transition-colors">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-5 h-5 rounded bg-proof-blue/20 text-proof-blue flex items-center justify-center text-xs font-bold shrink-0">
            OB
          </div>
          <span className="text-14 font-medium text-eggshell truncate">
            Operação Brasil
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-stone group-hover:text-eggshell transition-colors" />
      </div>

      <div className="absolute top-full left-0 w-full mt-1 bg-graphite border border-line rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="p-1">
          {workspaces.map(ws => (
            <div key={ws.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-zinc rounded cursor-pointer">
              <span className="text-13 text-eggshell">{ws.name}</span>
              <span className="text-[10px] uppercase font-bold text-stone bg-iron px-1.5 py-0.5 rounded border border-line">
                {ws.plan}
              </span>
            </div>
          ))}
          <div className="h-px bg-line my-1 mx-2" />
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc rounded cursor-pointer text-stone hover:text-eggshell">
            <Plus className="w-4 h-4" />
            <span className="text-13">Criar workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}