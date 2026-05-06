import { useState } from 'react';
import { Link } from 'react-router-dom';
import { customers, accounts } from '../data/mock';
import { LOB_LABEL } from '../data/types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Field';

export function CustomerSearchPage() {
  const [q, setQ] = useState('');
  const filtered = q
    ? customers.filter((c) =>
        [c.name, c.email, c.phone, c.id].some((v) => v.toLowerCase().includes(q.toLowerCase()))
      )
    : customers;

  return (
    <div>
      <header className="ember-page-header">
        <div>
          <h1 className="ember-page-title">Customers</h1>
          <p className="ember-page-subtitle">{filtered.length} of {customers.length} shown</p>
        </div>
        <div style={{ width: 320 }}>
          <Input placeholder="Search by name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </header>

      <Card>
        <div className="ember-stack" style={{ ['--gap' as string]: '0px' }}>
          {filtered.map((c) => {
            const accs = accounts.filter((a) => a.customerId === c.id);
            const lobs = Array.from(new Set(accs.map((a) => a.lob)));
            return (
              <Link key={c.id} to={`/customers/${c.id}`} className="ember-row">
                <Avatar name={c.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ember-cluster">
                    <strong style={{ fontSize: 14 }}>{c.name}</strong>
                    <Badge tone={c.type === 'business' ? 'info' : 'neutral'}>{c.type}</Badge>
                    {c.flags.includes('fraud-watch') && <Badge tone="critical">fraud watch</Badge>}
                    {c.flags.includes('delinquent-30') && <Badge tone="critical">delinquent</Badge>}
                    {c.flags.includes('hardship-program') && <Badge tone="warning">hardship</Badge>}
                    {c.flags.includes('high-value') && <Badge tone="success">high value</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--scout-text-display-secondary)', marginTop: 2 }}>
                    {c.email} · {c.phone}
                  </div>
                </div>
                <div className="ember-cluster">
                  {lobs.map((l) => (
                    <Badge key={l} tone="neutral">{LOB_LABEL[l]}</Badge>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
