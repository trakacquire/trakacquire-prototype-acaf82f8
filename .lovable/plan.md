
## Escopo

Reaproveitar 100% do frontend `artifacts/trakacquire` do zip enviado. O restante do monorepo (`api-server` Express, `mockup-sandbox`, `lib/db` Drizzle) fica de fora nesta migração — é backend Node que não roda no runtime deste projeto (Cloudflare Workers) e o usuário disse que os dados são fake e determinísticos, sem chamadas reais de backend.

Se depois você quiser trazer o `api-server`, viramos numa segunda etapa convertendo os endpoints Express para server functions do TanStack.

## O que fica

- Todas as ~60 páginas em `src/pages/` (public/tenant/platform)
- Todos os 76 componentes em `src/components/`
- Bibliotecas em `src/lib/` (contextos, fake data, tipos, utils)
- Hooks em `src/hooks/`
- Estilos `src/index.css` + design system Proofline (dark-only, tokens `--ink`, `--proof-blue`, etc.)
- Assets em `attached_assets/`

## Estratégia técnica

Este projeto usa **TanStack Router file-based**; o TrakAcquire usa **wouter**. Converter 60 arquivos de rota manualmente é caro e frágil. Solução pragmática:

1. **Manter wouter dentro do TanStack Start.** Criar uma única rota TanStack catch-all (`src/routes/$.tsx`) que renderiza o `App.tsx` do TrakAcquire por baixo. O wouter cuida do roteamento interno; o TanStack cuida do SSR shell.
2. **Rota raiz** (`src/routes/index.tsx`) redireciona para `/command` (ou a rota inicial que você preferir).
3. **`__root.tsx`** injeta o `<QueryClientProvider>`, `<TooltipProvider>`, `<Toaster>` e providers de estado do TrakAcquire, e importa o `index.css` do Proofline.

Isso preserva os imports `@/pages/...`, `@/components/...`, `@/lib/...` sem tocar em nenhum arquivo migrado.

## Passos

1. **Descartar plugins Replit-only** no Vite (`@replit/vite-plugin-runtime-error-modal`, `cartographer`, `dev-banner`) — não funcionam fora do Replit.
2. **Instalar dependências**: `wouter`, `sonner`, `framer-motion`, `recharts`, `cmdk`, todos os `@radix-ui/*` usados, `@hookform/resolvers`, `react-hook-form`, `zod`, `date-fns`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `vaul`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `next-themes`. Já temos `react-query` e Tailwind v4.
3. **Copiar árvore do TrakAcquire** para dentro do projeto:
   - `artifacts/trakacquire/src/pages` → `src/pages`
   - `artifacts/trakacquire/src/components` → `src/components` (mescla com o que já existe; conflitos de UI shadcn deixam a versão do TrakAcquire vencer)
   - `artifacts/trakacquire/src/lib` → `src/lib` (mescla)
   - `artifacts/trakacquire/src/hooks` → `src/hooks`
   - `artifacts/trakacquire/src/index.css` → renomeia para `src/trakacquire.css` e importa dentro de `src/styles.css`
   - `attached_assets/*` → `src/attached_assets/*` com alias `@assets`
4. **Alias `@assets`** no `vite.config.ts` apontando para `src/attached_assets`.
5. **Criar `src/routes/$.tsx`** (catch-all) que renderiza `<TrakAcquireApp />` — o `App.tsx` original sem os providers que já vão para o `__root.tsx`.
6. **Ajustar `src/routes/__root.tsx`**: manter o shell HTML/SSR, adicionar `<QueryClientProvider>` (já temos), `<TooltipProvider>`, `<Toaster>`, `<AppStateProvider>`, `<PeriodProvider>`, `<ScenarioSelector>`; trocar título e meta para "TrakAcquire".
7. **Sanear SSR**: envolver componentes que tocam `window`/`localStorage` na inicialização em `<ClientOnly>` ou mover para `useEffect`. Se algo do wouter quebrar no SSR, montar o `<TrakAcquireApp />` inteiro dentro de `<ClientOnly fallback={<AppShellSkeleton />}>`.
8. **Rodar `bun run build`** e corrigir imports faltando um a um até ficar verde. Restart do dev server e verificar `/command` no preview.

## O que fica de fora nesta migração

- `artifacts/api-server` (Express + Drizzle + pino) — backend Node
- `artifacts/mockup-sandbox` — segundo frontend Vite
- `lib/db`, `lib/api-spec`, `lib/api-client-react`, `lib/api-zod` — só usados pelo api-server
- `scripts/` — scripts de build do monorepo
- Configs Replit (`.replit`, plugins Vite Replit)

Nada é jogado fora do zip — só não é ativado agora. Podemos trazer numa segunda rodada se você quiser API real.

## Riscos

- **Volume**: 60 páginas + 76 componentes, algum vai referenciar coisa que não migramos. Corrijo conforme o build reclamar.
- **SSR vs wouter**: wouter foi pensado pra SPA. Se der ruim no SSR, cai pra render client-only (aceitável — o preview funciona igual).
- **Tailwind v4**: o projeto original pode estar em v3. Ajusto `index.css` para o formato v4 (`@import "tailwindcss"`, `@theme`) mantendo os tokens Proofline.
- **Conflitos de componentes shadcn** entre os que já existem aqui e os do TrakAcquire: vence a versão do TrakAcquire.

Confirma que posso seguir e começo pelo passo 1?
