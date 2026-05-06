import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAccount, getCustomer, getAccountTransactions } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/format';
import { MakePaymentWorkflow } from '../../workflows/MakePaymentWorkflow';
import { WorkflowStub } from '../../workflows/WorkflowStub';
import { WrapUpDrawer } from '../../workflows/WrapUpDrawer';
import { useRole } from '../../providers/RoleProvider';
import type { LOB } from '../../data/types';

const ACTIONS_BY_LOB: Record<LOB, { id: string; label: string; tone?: 'critical' }[]> = {
  banking: [
    { id: 'payment', label: 'Make a payment' },
    { id: 'cancel-payment', label: 'Cancel a payment' },
    { id: 'edit-info', label: 'Change personal info' },
    { id: 'dispute', label: 'Log a dispute' },
    { id: 'order-card', label: 'Order a new card' },
    { id: 'close', label: 'Close account', tone: 'critical' },
  ],
  card: [
    { id: 'payment', label: 'Make a payment' },
    { id: 'cancel-payment', label: 'Cancel a payment' },
    { id: 'edit-info', label: 'Change personal info' },
    { id: 'cli', label: 'Request CLI' },
    { id: 'dispute', label: 'Log a dispute' },
    { id: 'auth-user', label: 'Add authorized user' },
    { id: 'replace-card', label: 'Request new plastic' },
    { id: 'redeem', label: 'Redeem rewards' },
    { id: 'statement', label: 'Review last statement' },
    { id: 'close', label: 'Close account', tone: 'critical' },
  ],
  auto: [
    { id: 'payment', label: 'Make a payment' },
    { id: 'cancel-payment', label: 'Cancel a payment' },
    { id: 'edit-info', label: 'Change personal info' },
    { id: 'close', label: 'Close account', tone: 'critical' },
  ],
  sb: [
    { id: 'payment', label: 'Make a payment' },
    { id: 'cancel-payment', label: 'Cancel a payment' },
    { id: 'edit-info', label: 'Change personal info' },
    { id: 'add-user', label: 'Add a new user' },
    { id: 'permissions', label: 'Change user permissions' },
    { id: 'company-info', label: 'Change company info' },
    { id: 'close', label: 'Close account', tone: 'critical' },
  ],
};

export function AccountOverviewPage() {
  const { customerId, accountId } = useParams();
  const acc = accountId ? getAccount(accountId) : undefined;
  const cust = customerId ? getCustomer(customerId) : undefined;
  const txns = accountId ? getAccountTransactions(accountId).slice(0, 6) : [];
  const { can } = useRole();

  const [openWorkflow, setOpenWorkflow] = useState<string | null>(null);
  const [wrapUpOpen, setWrapUpOpen] = useState(false);
  const [wrapUpContext, setWrapUpContext] = useState<string>('');

  if (!acc || !cust) return null;

  const actions = ACTIONS_BY_LOB[acc.lob];

  const onComplete = (label: string) => {
    setOpenWorkflow(null);
    setWrapUpContext(label);
    setWrapUpOpen(true);
  };

  return (
    <div className="ember-account-page">
      <div className="ember-account-main">
        <div className="ember-stack" style={{ ['--gap' as string]: '12px' }}>
          <Card title="Account snapshot">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              <Snapshot label={acc.lob === 'card' ? 'Balance' : acc.lob === 'auto' ? 'Principal' : 'Available'} value={formatCurrency(acc.balance)} />
              {acc.available !== undefined && acc.lob === 'card' && (
                <Snapshot label="Available credit" value={formatCurrency(acc.available)} />
              )}
              {acc.apr !== undefined && <Snapshot label="APR" value={`${acc.apr}%`} />}
              {acc.paymentDue && (
                <Snapshot
                  label="Next payment"
                  value={formatCurrency(acc.paymentDue.amount)}
                  hint={`due ${formatDate(acc.paymentDue.date)}`}
                />
              )}
              {acc.rewardsBalance !== undefined && (
                <Snapshot label="Rewards" value={`${acc.rewardsBalance.toLocaleString()} pts`} />
              )}
              <Snapshot label="Opened" value={formatDate(acc.openedAt)} />
            </div>
          </Card>

          {openWorkflow === 'payment' ? (
            <MakePaymentWorkflow
              account={acc}
              customer={cust}
              onCancel={() => setOpenWorkflow(null)}
              onComplete={() => onComplete('Make a payment')}
            />
          ) : openWorkflow ? (
            <WorkflowStub
              title={actions.find((a) => a.id === openWorkflow)?.label ?? 'Workflow'}
              onCancel={() => setOpenWorkflow(null)}
              onComplete={() => onComplete(actions.find((a) => a.id === openWorkflow)?.label ?? 'Workflow')}
            />
          ) : (
            <Card title="Recent transactions" actions={<Button variant="tertiary" size="sm">View all</Button>}>
              {txns.length === 0 ? (
                <div className="ember-empty">No transactions to show</div>
              ) : (
                <table className="ember-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((t) => (
                      <tr key={t.id}>
                        <td>{formatDate(t.date)}</td>
                        <td>{t.description}</td>
                        <td><Badge tone={t.status === 'pending' ? 'warning' : 'neutral'}>{t.status}</Badge></td>
                        <td style={{ textAlign: 'right' }} className={t.amount < 0 ? 'ember-amount--neg' : 'ember-amount--pos'}>
                          {formatCurrency(t.amount, true)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          )}
        </div>
      </div>

      <aside className="ember-account-aside">
        <Card title="Quick actions" subtitle="Guided workflows for this account">
          <div className="ember-stack" style={{ ['--gap' as string]: '6px' }}>
            {actions.map((a) => {
              const disabled = a.id === 'close' && !can('closeAccount');
              const disabledCli = a.id === 'cli' && !can('creditLineIncrease');
              const isDisabled = disabled || disabledCli;
              return (
                <Button
                  key={a.id}
                  variant={a.tone === 'critical' ? 'ghost' : 'secondary'}
                  size="sm"
                  fullWidth
                  disabled={isDisabled}
                  onClick={() => setOpenWorkflow(a.id)}
                  style={a.tone === 'critical' ? { color: 'var(--scout-text-display-critical)', justifyContent: 'flex-start' } : { justifyContent: 'flex-start' }}
                >
                  {a.label}
                  {isDisabled && <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.7 }}>permission</span>}
                </Button>
              );
            })}
          </div>
        </Card>

        <div style={{ marginTop: 12 }}>
          <Card title="Card & user controls">
            <div className="ember-stack" style={{ ['--gap' as string]: '8px' }}>
              <ToggleRow label="Lock card" />
              <ToggleRow label="Travel mode" />
              <ToggleRow label="International transactions" defaultChecked />
              <ToggleRow label="Online purchases" defaultChecked />
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 12 }}>
          <Card title="Terms & settings">
            <div className="ember-stack" style={{ ['--gap' as string]: '4px', fontSize: 12 }}>
              <Row label="Statement cycle" value="Monthly · 15th" />
              <Row label="Autopay" value="Off" />
              <Row label="Paperless" value="On" />
              <Row label="Alerts" value="Email + SMS" />
            </div>
          </Card>
        </div>
      </aside>

      <WrapUpDrawer
        open={wrapUpOpen}
        actionLabel={wrapUpContext}
        customerName={cust.name}
        onClose={() => setWrapUpOpen(false)}
      />
    </div>
  );
}

function Snapshot({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>{hint}</div>}
    </div>
  );
}

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="ember-spread" style={{ cursor: 'pointer' }}>
      <span style={{ fontSize: 13 }}>{label}</span>
      <span
        onClick={() => setOn((v) => !v)}
        style={{
          width: 32,
          height: 18,
          borderRadius: 999,
          background: on ? 'var(--scout-fill-success, #47b52c)' : 'var(--scout-border-primary, #d1d5db)',
          position: 'relative',
          transition: 'background 120ms',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2,
          left: on ? 16 : 2,
          width: 14,
          height: 14,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 120ms',
        }}/>
      </span>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="ember-spread" style={{ padding: '4px 0' }}>
      <span style={{ color: 'var(--scout-text-display-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
