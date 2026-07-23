import React from 'react';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { AppStateProvider } from '@/lib/context/AppStateContext';
import { PeriodProvider } from '@/lib/context/PeriodContext';
import ScenarioSelector from '@/components/domain/ScenarioSelector';
import NotFound from '@/pages/not-found';

// Public Pages
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import Pricing from '@/pages/public/Pricing';
import Docs from '@/pages/public/Docs';
import StatusPage from '@/pages/public/Status';
import InvitePage from '@/pages/public/Invite';
import AuthCallbackPage from '@/pages/public/AuthCallback';
import LegalTermosPage from '@/pages/public/LegalTermos';
import LegalPrivacidadePage from '@/pages/public/LegalPrivacidade';
import LegalDPAPage from '@/pages/public/LegalDPA';
import LegalSubprocessadoresPage from '@/pages/public/LegalSubprocessadores';

// Platform Pages
import PlatformCommand from '@/pages/platform/PlatformCommand';
import PlatformTenants from '@/pages/platform/PlatformTenants';
import PlatformTenantsNew from '@/pages/platform/PlatformTenantsNew';
import PlatformTenant360 from '@/pages/platform/PlatformTenant360';
import PlatformPlans from '@/pages/platform/PlatformPlans';
import PlatformEntitlements from '@/pages/platform/PlatformEntitlements';
import PlatformUsage from '@/pages/platform/PlatformUsage';
import PlatformInvoices from '@/pages/platform/PlatformInvoices';
import PlatformAIProviders from '@/pages/platform/PlatformAIProviders';
import PlatformAIRouting from '@/pages/platform/PlatformAIRouting';
import PlatformAIPrompts from '@/pages/platform/PlatformAIPrompts';
import PlatformAICost from '@/pages/platform/PlatformAICost';
import PlatformAIGuardrails from '@/pages/platform/PlatformAIGuardrails';
import PlatformAPIs from '@/pages/platform/PlatformAPIs';
import PlatformReliability from '@/pages/platform/PlatformReliability';
import PlatformIncidents from '@/pages/platform/PlatformIncidents';
import PlatformStatus from '@/pages/platform/PlatformStatus';
import PlatformReleases from '@/pages/platform/PlatformReleases';
import PlatformSupport from '@/pages/platform/PlatformSupport';
import PlatformAnnouncements from '@/pages/platform/PlatformAnnouncements';
import PlatformCompliance from '@/pages/platform/PlatformCompliance';
import PlatformStaff from '@/pages/platform/PlatformStaff';
import PlatformSettings from '@/pages/platform/PlatformSettings';

// Tenant Pages
import Command from '@/pages/tenant/Command';
import Analytics from '@/pages/tenant/Analytics';
import Reports from '@/pages/tenant/Reports';
import IntegrationTAP from '@/pages/tenant/IntegrationTAP';
import IntegrationMeta from '@/pages/tenant/IntegrationMeta';
import IntegrationTelegram from '@/pages/tenant/IntegrationTelegram';
import Integration360 from '@/pages/tenant/Integration360';
import Integrations from '@/pages/tenant/Integrations';
import Domain360 from '@/pages/tenant/Domain360';
import Domains from '@/pages/tenant/Domains';
import TrackingSources from '@/pages/tenant/TrackingSources';
import Link360 from '@/pages/tenant/Link360';
import Tracking from '@/pages/tenant/Tracking';
import EventDetail from '@/pages/tenant/EventDetail';
import Ledger from '@/pages/tenant/Ledger';
import IdentityDetail from '@/pages/tenant/IdentityDetail';
import Identity from '@/pages/tenant/Identity';
import Player360 from '@/pages/tenant/Player360';
import Players from '@/pages/tenant/Players';
import Signals from '@/pages/tenant/Signals';
import Monitoring from '@/pages/tenant/Monitoring';
import FlowBuilder from '@/pages/tenant/FlowBuilder';
import Automations from '@/pages/tenant/Automations';
import Segments from '@/pages/tenant/Segments';
import Broadcasts from '@/pages/tenant/Broadcasts';
import Inbox from '@/pages/tenant/Inbox';
import InboxSettings from '@/pages/tenant/InboxSettings';
import MediaCreatives from '@/pages/tenant/MediaCreatives';
import Campaign360 from '@/pages/tenant/Campaign360';
import Media from '@/pages/tenant/Media';
import Reconciliation from '@/pages/tenant/Reconciliation';
import Cohorts from '@/pages/tenant/Cohorts';
import Revenue from '@/pages/tenant/Revenue';
import Governance from '@/pages/tenant/Governance';
import ReportDetail from '@/pages/tenant/ReportDetail';
import SettingsTeam from '@/pages/tenant/SettingsTeam';
import SettingsAPI from '@/pages/tenant/SettingsAPI';
import SettingsBilling from '@/pages/tenant/SettingsBilling';
import SettingsNotifications from '@/pages/tenant/SettingsNotifications';
import SettingsAudit from '@/pages/tenant/SettingsAudit';
import SettingsGeneral from '@/pages/tenant/SettingsGeneral';
import Profile from '@/pages/tenant/Profile';
import LiveEvents from '@/pages/tenant/LiveEvents';
import Approvals from '@/pages/tenant/Approvals';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/"><Redirect to="/command" /></Route>
      
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/precos" component={Pricing} />
      <Route path="/docs" component={Docs} />
      <Route path="/status" component={StatusPage} />
      <Route path="/convite/:token" component={InvitePage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/legal/termos" component={LegalTermosPage} />
      <Route path="/legal/privacidade" component={LegalPrivacidadePage} />
      <Route path="/legal/dpa" component={LegalDPAPage} />
      <Route path="/legal/subprocessadores" component={LegalSubprocessadoresPage} />
      
      {/* Platform Routes */}
      <Route path="/platform" component={PlatformCommand} />
      <Route path="/platform/tenants/new" component={PlatformTenantsNew} />
      <Route path="/platform/tenants/:id" component={PlatformTenant360} />
      <Route path="/platform/tenants" component={PlatformTenants} />
      <Route path="/platform/plans" component={PlatformPlans} />
      <Route path="/platform/entitlements" component={PlatformEntitlements} />
      <Route path="/platform/usage" component={PlatformUsage} />
      <Route path="/platform/invoices" component={PlatformInvoices} />
      <Route path="/platform/ai/providers" component={PlatformAIProviders} />
      <Route path="/platform/ai/routing" component={PlatformAIRouting} />
      <Route path="/platform/ai/prompts" component={PlatformAIPrompts} />
      <Route path="/platform/ai/cost" component={PlatformAICost} />
      <Route path="/platform/ai/guardrails" component={PlatformAIGuardrails} />
      <Route path="/platform/apis" component={PlatformAPIs} />
      <Route path="/platform/reliability" component={PlatformReliability} />
      <Route path="/platform/incidents" component={PlatformIncidents} />
      <Route path="/platform/status" component={PlatformStatus} />
      <Route path="/platform/releases" component={PlatformReleases} />
      <Route path="/platform/support" component={PlatformSupport} />
      <Route path="/platform/announcements" component={PlatformAnnouncements} />
      <Route path="/platform/compliance" component={PlatformCompliance} />
      <Route path="/platform/staff" component={PlatformStaff} />
      <Route path="/platform/settings" component={PlatformSettings} />

      {/* Tenant Routes */}
      <Route path="/command" component={Command} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/reports/:id" component={ReportDetail} />
      <Route path="/reports" component={Reports} />
      <Route path="/integrations/tap" component={IntegrationTAP} />
      <Route path="/integrations/meta" component={IntegrationMeta} />
      <Route path="/integrations/telegram" component={IntegrationTelegram} />
      <Route path="/integrations/:slug" component={Integration360} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/domains/:id" component={Domain360} />
      <Route path="/domains" component={Domains} />
      <Route path="/tracking/sources" component={TrackingSources} />
      <Route path="/tracking/:id" component={Link360} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/ledger/:eventId" component={EventDetail} />
      <Route path="/ledger" component={Ledger} />
      <Route path="/identity/:personId" component={IdentityDetail} />
      <Route path="/identity" component={Identity} />
      <Route path="/players/:id" component={Player360} />
      <Route path="/players" component={Players} />
      <Route path="/signals" component={Signals} />
      <Route path="/monitoring" component={Monitoring} />
      <Route path="/automations/:id" component={FlowBuilder} />
      <Route path="/automations" component={Automations} />
      <Route path="/segments" component={Segments} />
      <Route path="/broadcasts" component={Broadcasts} />
      <Route path="/inbox/settings" component={InboxSettings} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/media/creatives" component={MediaCreatives} />
      <Route path="/media/:campaignId" component={Campaign360} />
      <Route path="/media" component={Media} />
      <Route path="/revenue/reconciliation" component={Reconciliation} />
      <Route path="/revenue/cohorts" component={Cohorts} />
      <Route path="/revenue" component={Revenue} />
      <Route path="/governance" component={Governance} />
      <Route path="/settings/team" component={SettingsTeam} />
      <Route path="/settings/api" component={SettingsAPI} />
      <Route path="/settings/billing" component={SettingsBilling} />
      <Route path="/settings/notifications" component={SettingsNotifications} />
      <Route path="/settings/audit" component={SettingsAudit} />
      <Route path="/settings/general" component={SettingsGeneral} />
      <Route path="/profile" component={Profile} />
      <Route path="/live" component={LiveEvents} />
      <Route path="/approvals" component={Approvals} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <PeriodProvider>
              <Router />
            </PeriodProvider>
            <Toaster
              position="top-right"
              theme="dark"
              toastOptions={{ style: { background: 'var(--graphite)', border: '1px solid var(--line)', color: 'var(--eggshell)' } }}
            />
          </WouterRouter>
          <ScenarioSelector />
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
