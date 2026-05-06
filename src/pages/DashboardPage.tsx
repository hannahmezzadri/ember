import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge, StatusDot } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useChats } from '../providers/ChatProvider';
import { useNotifications } from '../providers/NotificationProvider';
import { cases, customers } from '../data/mock';
import { timeAgo } from '../lib/format';
import './DashboardPage.css';

export function DashboardPage() {
  const navigate = useNavigate();
  const { chats } = useChats();
  const { notifications } = useNotifications();

  const queueByChannel = {
    voice: chats.filter((c) => c.channel === 'voice').length,
    chat: chats.filter((c) => c.channel === 'chat').length,
    case: chats.filter((c) => c.channel === 'case').length,
  };
  const handoffs = chats.filter((c) => c.status === 'awaiting-handoff');

  return (
    <div className="ember-dashboard">
      <header className="ember-page-header">
        <div>
          <h1 className="ember-page-title">Good afternoon, Hannah</h1>
          <p className="ember-page-subtitle">Here's what's queued up for you.</p>
        </div>
      </header>

      <div className="ember-dashboard__metrics">
        <MetricTile label="Avg handle time" value="4m 18s" delta="-12%" tone="success" />
        <MetricTile label="ASAT (CSAT)" value="4.6 / 5" delta="+0.2" tone="success" />
        <MetricTile label="Calls today" value="14" />
        <MetricTile label="Wrap pending" value="2" tone="warning" />
      </div>

      <div className="ember-dashboard__grid">
        <Card title="Queue" subtitle={`${chats.length} active across channels`}>
          <div className="ember-queue-row">
            <QueueChannel label="Voice" count={queueByChannel.voice} icon="📞" />
            <QueueChannel label="Chat" count={queueByChannel.chat} icon="💬" />
            <QueueChannel label="Cases" count={queueByChannel.case} icon="🗂️" />
          </div>
          <hr className="ember-divider" />
          <div className="ember-stack" style={{ ['--gap' as string]: '0px' }}>
            {chats.map((c) => (
              <button
                key={c.id}
                className="ember-row"
                onClick={() => navigate(`/customers/${c.customerId}`)}
              >
                <StatusDot tone={c.status === 'awaiting-handoff' ? 'critical' : c.status === 'agent-active' ? 'success' : 'info'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.customerName}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                    {c.channel} · {c.intent} · {timeAgo(c.startedAt)}
                  </div>
                </div>
                <Badge tone={c.status === 'awaiting-handoff' ? 'critical' : c.status === 'agent-active' ? 'success' : 'info'}>
                  {c.status.replace('-', ' ')}
                </Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Hand-offs requested" subtitle={`${handoffs.length} need your review`}>
          {handoffs.length === 0 ? (
            <div className="ember-empty">No pending hand-offs</div>
          ) : (
            handoffs.map((h) => (
              <div key={h.id} className="ember-spread" style={{ padding: '8px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{h.customerName}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>{h.intent}</div>
                </div>
                <Button size="sm" onClick={() => navigate(`/customers/${h.customerId}`)}>
                  Review
                </Button>
              </div>
            ))
          )}
        </Card>

        <Card title="System & news" subtitle="Stay informed">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="ember-stack" style={{ ['--gap' as string]: '2px', padding: '8px 0', borderTop: '1px solid var(--scout-border-secondary)' }}>
              <div className="ember-cluster">
                <Badge tone={n.kind === 'system' ? 'warning' : n.kind === 'release' ? 'info' : 'neutral'}>{n.kind}</Badge>
                <strong style={{ fontSize: 13 }}>{n.title}</strong>
              </div>
              {n.body && <span style={{ fontSize: 12, color: 'var(--scout-text-display-secondary)' }}>{n.body}</span>}
            </div>
          ))}
        </Card>

        <Card title="Open cases" subtitle="Recently updated">
          {cases.slice(0, 5).map((c) => {
            const cust = customers.find((x) => x.id === c.customerId);
            return (
              <button
                key={c.id}
                className="ember-row"
                onClick={() => navigate(`/customers/${c.customerId}/cases`)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                    {cust?.name} · {c.category} · {timeAgo(c.updatedAt)}
                  </div>
                </div>
                <Badge tone={c.priority === 'high' ? 'critical' : c.priority === 'medium' ? 'warning' : 'neutral'}>
                  {c.priority}
                </Badge>
              </button>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function MetricTile({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: 'success' | 'warning' | 'critical' }) {
  return (
    <div className="ember-metric">
      <div className="ember-metric__label">{label}</div>
      <div className="ember-metric__value">{value}</div>
      {delta && (
        <div className={`ember-metric__delta ember-metric__delta--${tone ?? 'neutral'}`}>{delta}</div>
      )}
    </div>
  );
}

function QueueChannel({ label, count, icon }: { label: string; count: number; icon: string }) {
  return (
    <div className="ember-queue-channel">
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>{label}</div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{count}</div>
      </div>
    </div>
  );
}
