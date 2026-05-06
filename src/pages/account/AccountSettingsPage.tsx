import { useParams } from 'react-router-dom';
import { getAccount } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Field, Input, Select } from '../../components/ui/Field';

export function AccountSettingsPage() {
  const { accountId } = useParams();
  const acc = accountId ? getAccount(accountId) : undefined;
  if (!acc) return null;

  return (
    <div className="ember-stack" style={{ ['--gap' as string]: '12px' }}>
      <Card title="Statement & alerts">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Statement cycle">
            <Select defaultValue="monthly-15">
              <option value="monthly-1">Monthly · 1st</option>
              <option value="monthly-15">Monthly · 15th</option>
              <option value="monthly-end">Monthly · last day</option>
            </Select>
          </Field>
          <Field label="Delivery">
            <Select defaultValue="paperless">
              <option value="paperless">Paperless</option>
              <option value="mail">Postal mail</option>
              <option value="both">Both</option>
            </Select>
          </Field>
          <Field label="Alert channels">
            <Select defaultValue="email-sms">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="email-sms">Email + SMS</option>
              <option value="push">Push only</option>
            </Select>
          </Field>
          <Field label="Autopay">
            <Select defaultValue="off">
              <option value="off">Off</option>
              <option value="min">Minimum due</option>
              <option value="stmt">Statement balance</option>
              <option value="full">Full balance</option>
            </Select>
          </Field>
        </div>
      </Card>

      {acc.lob === 'sb' && (
        <Card title="Users & permissions" subtitle="Authorized signers and admins">
          <div className="ember-empty">User management UI — to be built in next milestone.</div>
        </Card>
      )}

      <Card title="Account information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nickname"><Input defaultValue={acc.nickname} /></Field>
          <Field label="Mailing routing"><Input defaultValue="Default address on file" /></Field>
        </div>
      </Card>
    </div>
  );
}
