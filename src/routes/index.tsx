import { createFileRoute } from '@tanstack/react-router';
import { ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const TrakacquireApp = lazy(() => import('@/TrakacquireApp'));

export const Route = createFileRoute('/')({
  component: IndexPage,
  head: () => ({
    meta: [
      { title: 'TrakAcquire — Prova qual clique gerou receita' },
      { name: 'description', content: 'Infraestrutura de atribuição de receita: web, Telegram e WhatsApp sem perder a identidade.' },
      { property: 'og:title', content: 'TrakAcquire' },
      { property: 'og:description', content: 'Infraestrutura de atribuição de receita: web, Telegram e WhatsApp.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});

function IndexPage() {
  return (
    <ClientOnly fallback={<AppLoading />}>
      <Suspense fallback={<AppLoading />}>
        <TrakacquireApp />
      </Suspense>
    </ClientOnly>
  );
}

function AppLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-stone text-sm">Carregando…</div>
    </div>
  );
}
