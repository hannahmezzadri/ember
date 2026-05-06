import { NavLink, Outlet, useParams, useLocation } from 'react-router-dom';
import { getCustomer, getCustomerAccounts } from '../../data/mock';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/format';
import './customer.css';

export function CustomerLayout() {
  const { customerId } = useParams();
  const location = useLocation();
  const customer = customerId ? getCustomer(customerId) : undefined;
  const accs = customerId ? getCustomerAccounts(customerId) : [];

  if (!customer) {
    return <div className="ember-empty">Customer not found.</div>;
  }

  const totalDeposits = accs.filter((a) => a.lob !== 'auto' && a.lob !== 'card').reduce((s, a) => s + a.balance, 0);
  const totalCardBal = accs.filter((a) => a.lob === 'card').reduce((s, a) => s + a.balance, 0);
  const inAccountView = location.pathname.includes('/accounts/');

  return (
    <div className="ember-customer">
      <header className="ember-customer__header">
        <div className="ember-customer__title">
          <Avatar name={customer.name} size="lg" />
          <div>
            <div className="ember-cluster">
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{customer.name}</h1>
              <Badge tone={customer.type === 'business' ? 'info' : 'neutral'}>{customer.type}</Badge>
              {customer.segment && <Badge tone="neutral">{customer.segment}</Badge>}
              {customer.flags.includes('fraud-watch') && <Badge tone="critical">fraud watch</Badge>}
              {customer.flags.includes('delinquent-30') && <Badge tone="critical">delinquent</Badge>}
              {customer.flags.includes('hardship-program') && <Badge tone="warning">hardship</Badge>}
            </div>
            <div className="ember-customer__meta">
              {customer.id} · {customer.email} · {customer.phone} · joined {new Date(customer.joinedAt).getFullYear()}
            </div>
          </div>
        </div>
        <div className="ember-customer__summary">
          <div>
            <div className="ember-customer__sumlabel">Deposits</div>
            <div className="ember-customer__sumvalue">{formatCurrency(totalDeposits)}</div>
          </div>
          <div>
            <div className="ember-customer__sumlabel">Card balance</div>
            <div className="ember-customer__sumvalue">{formatCurrency(totalCardBal)}</div>
          </div>
          <div>
            <div className="ember-customer__sumlabel">Accounts</div>
            <div className="ember-customer__sumvalue">{accs.length}</div>
          </div>
        </div>
      </header>

      {!inAccountView && (
        <nav className="ember-tabs" style={{ marginBottom: 16 }}>
          <CustTab to={`/customers/${customer.id}`} end label="Customer overview" />
          <CustTab to={`/customers/${customer.id}/profile`} label="Profile" />
          <CustTab to={`/customers/${customer.id}/cases`} label="Cases" />
          <CustTab to={`/customers/${customer.id}/investigate`} label="Investigate" />
        </nav>
      )}

      <Outlet />
    </div>
  );
}

function CustTab({ to, end, label }: { to: string; end?: boolean; label: string }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `ember-tab ${isActive ? 'ember-tab--active' : ''}`}>
      {label}
    </NavLink>
  );
}
