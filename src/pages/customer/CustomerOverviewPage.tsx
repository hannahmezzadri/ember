import { Link, useParams } from 'react-router-dom';
import { getCustomerAccounts, getCustomerCases, getCustomerActivity } from '../../data/mock';
import { LOB_LABEL, type LOB, type Account } from '../../data/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/format';
import { timeAgo } from '../../lib/format';

const LOB_ORDER: LOB[] = ['banking', 'card', 'auto', 'sb'];

export function CustomerOverviewPage() {
  const { customerId } = useParams();
  if (!customerId) return null;
  const accs = getCustomerAccounts(customerId);
  const cases = getCustomerCases(customerId);
  const activity = getCustomerActivity(customerId);

  const grouped: Record<LOB, Account[]> = { banking: [], card: [], auto: [], sb: [] };
  accs.forEach((a) => grouped[a.lob].push(a));

  return (
    <div className="ember-stack" style={{ ['--gap' as string]: '12px' }}>
      <div>
        {LOB_ORDER.filter((l) => grouped[l].length > 0).map((lob) => (
          <section key={lob} className="ember-lob-section">
            <div className="ember-lob-section__title">{LOB_LABEL[lob]}</div>
            <div className="ember-account-list">
              {grouped[lob].map((acc) => (
                <Link
                  key={acc.id}
                  to={`/customers/${customerId}/accounts/${acc.id}`}
                  className="ember-account-card"
                >
                  <div className="ember-spread">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{acc.nickname}</div>
                      <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                        {acc.productName} ····{acc.mask}
                      </div>
                    </div>
                    <Badge tone={statusTone(acc.status)}>{acc.status}</Badge>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                      {acc.lob === 'card' ? 'Balance' : acc.lob === 'auto' ? 'Principal' : 'Available'}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(acc.balance)}</div>
                    {acc.available !== undefined && acc.lob === 'card' && (
                      <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                        {formatCurrency(acc.available)} available
                      </div>
                    )}
                    {acc.paymentDue && (
                      <div style={{ fontSize: 11, marginTop: 6 }}>
                        Payment {formatCurrency(acc.paymentDue.amount)} due {new Date(acc.paymentDue.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card title="Recent activity" subtitle="Across channels & devices">
          {activity.length === 0 ? (
            <div className="ember-empty">No recent activity</div>
          ) : (
            activity.slice(0, 5).map((a) => (
              <div key={a.id} className="ember-row" style={{ cursor: 'default' }}>
                <Badge tone="neutral">{a.channel}</Badge>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{a.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                    {a.actor} · {timeAgo(a.timestamp)} {a.device ? `· ${a.device}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>

        <Card title="Cases" subtitle={`${cases.length} total`}>
          {cases.length === 0 ? (
            <div className="ember-empty">No cases on file</div>
          ) : (
            cases.slice(0, 5).map((c) => (
              <div key={c.id} className="ember-row" style={{ cursor: 'default' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                    {c.category} · {c.status} · {timeAgo(c.updatedAt)}
                  </div>
                </div>
                <Badge tone={c.priority === 'high' ? 'critical' : c.priority === 'medium' ? 'warning' : 'neutral'}>
                  {c.priority}
                </Badge>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

function statusTone(s: string): 'success' | 'warning' | 'critical' | 'neutral' {
  if (s === 'open') return 'success';
  if (s === 'restricted') return 'warning';
  if (s === 'delinquent') return 'critical';
  return 'neutral';
}
