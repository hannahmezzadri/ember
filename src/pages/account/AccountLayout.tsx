import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { getAccount, getCustomer } from '../../data/mock';
import { LOB_LABEL, type LOB } from '../../data/types';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/format';

const TABS_BY_LOB: Record<LOB, { id: string; label: string }[]> = {
  banking: [
    { id: '', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'cases', label: 'Cases' },
    { id: 'settings', label: 'Settings' },
  ],
  card: [
    { id: '', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'cases', label: 'Cases' },
    { id: 'settings', label: 'Settings' },
  ],
  auto: [
    { id: '', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'cases', label: 'Cases' },
    { id: 'settings', label: 'Settings' },
  ],
  sb: [
    { id: '', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'cases', label: 'Cases' },
    { id: 'settings', label: 'Settings · Users' },
  ],
};

export function AccountLayout() {
  const { customerId, accountId } = useParams();
  const acc = accountId ? getAccount(accountId) : undefined;
  const cust = customerId ? getCustomer(customerId) : undefined;
  if (!acc || !cust) return <div className="ember-empty">Account not found.</div>;

  const tabs = TABS_BY_LOB[acc.lob];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link to={`/customers/${customerId}`} style={{ fontSize: 12 }}>← Back to {cust.name}</Link>
      </div>

      <header className="ember-spread" style={{ marginBottom: 12 }}>
        <div>
          <div className="ember-cluster">
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{acc.nickname}</h2>
            <Badge tone="neutral">{LOB_LABEL[acc.lob]}</Badge>
            <Badge tone={acc.status === 'open' ? 'success' : acc.status === 'restricted' ? 'warning' : acc.status === 'delinquent' ? 'critical' : 'neutral'}>
              {acc.status}
            </Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--scout-text-display-secondary)', marginTop: 2 }}>
            {acc.productName} ····{acc.mask}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
            {acc.lob === 'card' ? 'Current balance' : acc.lob === 'auto' ? 'Principal' : 'Available'}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(acc.balance)}</div>
        </div>
      </header>

      <nav className="ember-tabs" style={{ marginBottom: 16 }}>
        {tabs.map((t) => (
          <NavLink
            key={t.id}
            to={t.id ? `/customers/${customerId}/accounts/${accountId}/${t.id}` : `/customers/${customerId}/accounts/${accountId}`}
            end={!t.id}
            className={({ isActive }) => `ember-tab ${isActive ? 'ember-tab--active' : ''}`}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
