import { useParams } from 'react-router-dom';
import { getCustomer } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Field, Input } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';

export function CustomerProfilePage() {
  const { customerId } = useParams();
  const c = customerId ? getCustomer(customerId) : undefined;
  if (!c) return null;

  return (
    <div className="ember-stack" style={{ ['--gap' as string]: '12px' }}>
      <Card
        title="Personal information"
        subtitle="Verify identity before editing"
        actions={<Button variant="secondary" size="sm">Verify ID</Button>}
        footer={
          <>
            <Button variant="tertiary" size="sm">Cancel</Button>
            <Button size="sm">Save changes</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <Field label={c.type === 'business' ? 'Business name' : 'Full name'}>
            <Input defaultValue={c.name} />
          </Field>
          {c.dob && <Field label="Date of birth"><Input defaultValue={c.dob} /></Field>}
          {c.einLast4 && <Field label="EIN (last 4)"><Input defaultValue={`···· ${c.einLast4}`} disabled /></Field>}
          <Field label="Email"><Input defaultValue={c.email} /></Field>
          <Field label="Phone"><Input defaultValue={c.phone} /></Field>
          <Field label="Street"><Input defaultValue={c.address.street} /></Field>
          <Field label="City"><Input defaultValue={c.address.city} /></Field>
          <Field label="State"><Input defaultValue={c.address.state} /></Field>
          <Field label="ZIP"><Input defaultValue={c.address.zip} /></Field>
        </div>
      </Card>
    </div>
  );
}
