import React, { createContext, useContext, useReducer } from 'react';
interface AuditEntry { timestamp: string; user: string; action: string; object: string; detail: string; }
interface AppState {
  actionPlans: Record<string, 'pending'|'approved'|'rejected'>;
  customSegments: Array<{id:string;name:string;rule:string;count:number}>;
  pendingInvites: Array<{email:string;role:string;sentAt:string}>;
  killSwitches: Record<string, boolean>;
  auditLog: AuditEntry[];
}
const init: AppState = {
  actionPlans: { ap_001: 'pending' },
  customSegments: [],
  pendingInvites: [],
  killSwitches: { meta_write: false, capi_send: true, broadcast_all: true },
  auditLog: [],
};
type Action = 
  | { type: 'APPROVE_PLAN'; id: string }
  | { type: 'REJECT_PLAN'; id: string }
  | { type: 'ADD_SEGMENT'; seg: AppState['customSegments'][0] }
  | { type: 'ADD_INVITE'; inv: AppState['pendingInvites'][0] }
  | { type: 'TOGGLE_KILL'; key: string }
  | { type: 'APPEND_AUDIT'; entry: AuditEntry };
function reducer(st: AppState, ac: Action): AppState {
  switch(ac.type) {
    case 'APPROVE_PLAN': return {...st, actionPlans:{...st.actionPlans,[ac.id]:'approved'}};
    case 'REJECT_PLAN': return {...st, actionPlans:{...st.actionPlans,[ac.id]:'rejected'}};
    case 'ADD_SEGMENT': return {...st, customSegments:[...st.customSegments, ac.seg]};
    case 'ADD_INVITE': return {...st, pendingInvites:[...st.pendingInvites, ac.inv]};
    case 'TOGGLE_KILL': return {...st, killSwitches:{...st.killSwitches,[ac.key]:!st.killSwitches[ac.key]}};
    case 'APPEND_AUDIT': return {...st, auditLog:[ac.entry, ...st.auditLog]};
    default: return st;
  }
}
const Ctx = createContext<{state:AppState;dispatch:React.Dispatch<Action>}>({state:init,dispatch:()=>{}});
export function AppStateProvider({children}:{children:React.ReactNode}) {
  const [state,dispatch] = useReducer(reducer, init);
  return <Ctx.Provider value={{state,dispatch}}>{children}</Ctx.Provider>;
}
export function useAppState() { return useContext(Ctx); }
