import { Link } from 'react-router-dom';
import { cases, customers } from '../data/mock';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate, timeAgo } from '../lib/format';

export function CasesPage() {
  return (
    <div>
      <header className="ember-page-header">
        <div>
          <h1 className="ember-page-title">All cases</h1>
          <p className="ember-page-subtitle">{cases.length} cases across your customers</p>
        </div>
      </header>

      <Card>
        <table className="ember-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Opened</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const cust = customers.find((x) => x.id === c.customerId);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td>{cust && <Link to={`/customers/${cust.id}`}>{cust.name}</Link>}</td>
                  <td>{c.category}</td>
                  <td><Badge tone={c.status === 'resolved' ? 'success' : c.status === 'escalated' ? 'critical' : 'info'}>{c.status}</Badge></td>
                  <td><Badge tone={c.priority === 'high' ? 'critical' : c.priority === 'medium' ? 'warning' : 'neutral'}>{c.priority}</Badge></td>
                  <td>{formatDate(c.openedAt)}</td>
                  <td>{timeAgo(c.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
