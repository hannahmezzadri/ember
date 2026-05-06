import { useParams } from 'react-router-dom';
import { cases } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate, timeAgo } from '../../lib/format';

export function AccountCasesPage() {
  const { accountId } = useParams();
  const list = cases.filter((c) => c.accountId === accountId);
  return (
    <Card title="Cases">
      {list.length === 0 ? (
        <div className="ember-empty">No cases for this account</div>
      ) : (
        <table className="ember-table">
          <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Opened</th><th>Updated</th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td><Badge tone={c.status === 'resolved' ? 'success' : c.status === 'escalated' ? 'critical' : 'info'}>{c.status}</Badge></td>
                <td><Badge tone={c.priority === 'high' ? 'critical' : c.priority === 'medium' ? 'warning' : 'neutral'}>{c.priority}</Badge></td>
                <td>{formatDate(c.openedAt)}</td>
                <td>{timeAgo(c.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
