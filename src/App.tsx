import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/shell/Shell';
import { DashboardPage } from './pages/DashboardPage';
import { CustomerSearchPage } from './pages/CustomerSearchPage';
import { CustomerLayout } from './pages/customer/CustomerLayout';
import { CustomerOverviewPage } from './pages/customer/CustomerOverviewPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerCasesPage } from './pages/customer/CustomerCasesPage';
import { CustomerInvestigatePage } from './pages/customer/CustomerInvestigatePage';
import { AccountLayout } from './pages/account/AccountLayout';
import { AccountOverviewPage } from './pages/account/AccountOverviewPage';
import { AccountActivityPage } from './pages/account/AccountActivityPage';
import { AccountRewardsPage } from './pages/account/AccountRewardsPage';
import { AccountCasesPage } from './pages/account/AccountCasesPage';
import { AccountSettingsPage } from './pages/account/AccountSettingsPage';
import { CasesPage } from './pages/CasesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerSearchPage />} />
        <Route path="/customers/:customerId" element={<CustomerLayout />}>
          <Route index element={<CustomerOverviewPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="cases" element={<CustomerCasesPage />} />
          <Route path="investigate" element={<CustomerInvestigatePage />} />
          <Route path="accounts/:accountId" element={<AccountLayout />}>
            <Route index element={<AccountOverviewPage />} />
            <Route path="activity" element={<AccountActivityPage />} />
            <Route path="rewards" element={<AccountRewardsPage />} />
            <Route path="cases" element={<AccountCasesPage />} />
            <Route path="settings" element={<AccountSettingsPage />} />
          </Route>
        </Route>
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Shell>
  );
}
