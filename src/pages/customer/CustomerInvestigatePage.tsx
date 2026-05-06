import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomerActivity } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Field, Select } from '../../components/ui/Field';
import { formatDateTime } from '../../lib/format';

export function CustomerInvestigatePage() {
  const { customerId } = useParams();
  const all = customerId ? getCustomerActivity(customerId) : [];
  const [channel, setChannel] = useState<string>('all');
  const events = channel === 'all' ? all : all.filter((e) => e.channel === channel);

  return (
    <Card
      title="Investigate"
      subtitle="All traceable activity across channels & devices"
      actions={
        <div style={{ width: 180 }}>
          <Field label="Channel">
            <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="all">All channels</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="ivr">IVR</option>
              <option value="agent">Agent</option>
              <option value="system">System</option>
            </Select>
          </Field>
        </div>
      }
    >
      {events.length === 0 ? (
        <div className="ember-empty">No events for this filter</div>
      ) : (
        <table className="ember-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Channel</th>
              <th>Actor</th>
              <th>Description</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{formatDateTime(e.timestamp)}</td>
                <td><Badge tone="neutral">{e.channel}</Badge></td>
                <td>{e.actor}</td>
                <td>{e.description}</td>
                <td style={{ color: 'var(--scout-text-display-secondary)' }}>{e.device ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
