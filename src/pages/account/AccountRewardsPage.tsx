import { useParams } from 'react-router-dom';
import { getAccount } from '../../data/mock';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function AccountRewardsPage() {
  const { accountId } = useParams();
  const acc = accountId ? getAccount(accountId) : undefined;
  return (
    <Card title="Rewards">
      {acc?.rewardsBalance !== undefined ? (
        <>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--scout-text-display-secondary)' }}>
            Available
          </div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{acc.rewardsBalance.toLocaleString()} pts</div>
          <div className="ember-cluster" style={{ marginTop: 12 }}>
            <Button size="sm">Redeem for statement credit</Button>
            <Button variant="secondary" size="sm">Travel</Button>
            <Button variant="secondary" size="sm">Gift cards</Button>
            <Button variant="secondary" size="sm">Transfer to partner</Button>
          </div>
        </>
      ) : (
        <div className="ember-empty">This account doesn't earn rewards.</div>
      )}
    </Card>
  );
}
