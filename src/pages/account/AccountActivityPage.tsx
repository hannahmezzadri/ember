import { useParams } from 'react-router-dom';
import { getAccountTransactions } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/format';

export function AccountActivityPage() {
  const { accountId } = useParams();
  const txns = accountId ? getAccountTransactions(accountId) : [];
  return (
    <Card title="Activity" subtitle={`${txns.length} transactions`}>
      {txns.length === 0 ? (
        <div className="ember-empty">No activity</div>
      ) : (
        <table className="ember-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id}>
                <td>{formatDate(t.date)}</td>
                <td>{t.description}</td>
                <td style={{ color: 'var(--scout-text-display-secondary)' }}>{t.category}</td>
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
  );
}
