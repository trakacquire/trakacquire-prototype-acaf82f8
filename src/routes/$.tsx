import { createFileRoute } from '@tanstack/react-router';
import { ClientOnly } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const TrakacquireApp = lazy(() => import('@/TrakacquireApp'));

export const Route = createFileRoute('/$')({
  component: TrakacquireCatchAll,
});

function TrakacquireCatchAll() {
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
