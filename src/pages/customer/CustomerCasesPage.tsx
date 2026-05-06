import { useParams } from 'react-router-dom';
import { getCustomerCases } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatDate, timeAgo } from '../../lib/format';

export function CustomerCasesPage() {
  const { customerId } = useParams();
  const cases = customerId ? getCustomerCases(customerId) : [];
  return (
    <Card title="Cases">
      {cases.length === 0 ? (
        <div className="ember-empty">No cases on file</div>
      ) : (
        <table className="ember-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Owner</th>
              <th>Opened</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td>{c.category}</td>
                <td><Badge tone={c.status === 'resolved' ? 'success' : c.status === 'escalated' ? 'critical' : 'info'}>{c.status}</Badge></td>
                <td><Badge tone={c.priority === 'high' ? 'critical' : c.priority === 'medium' ? 'warning' : 'neutral'}>{c.priority}</Badge></td>
                <td>{c.owner ?? '—'}</td>
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
