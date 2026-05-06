import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChats } from '../../providers/ChatProvider';
import { Badge, StatusDot } from '../ui/Badge';
import { Button } from '../ui/Button';
import './ChatDock.css';

export function ChatDock() {
  const { chats, activeChatId, setActiveChatId, globalAutopilot, setGlobalAutopilot, setChatMode, takeOver, closeChat, maxChats } = useChats();
  const [collapsed, setCollapsed] = useState(false);
  const active = chats.find((c) => c.id === activeChatId);

  if (collapsed) {
    return (
      <button className="ember-chatdock-fab" onClick={() => setCollapsed(false)}>
        💬 {chats.length}/{maxChats}
      </button>
    );
  }

  return (
    <aside className="ember-chatdock">
      <header className="ember-chatdock__header">
        <div>
          <div className="ember-chatdock__title">Chats & cases</div>
          <div className="ember-chatdock__subtitle">{chats.length} of {maxChats} active</div>
        </div>
        <button className="ember-iconbtn" onClick={() => setCollapsed(true)} title="Collapse" style={{ width: 24, height: 24 }}>›</button>
      </header>

      <div className="ember-chatdock__autopilot">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <input type="checkbox" checked={globalAutopilot} onChange={(e) => setGlobalAutopilot(e.target.checked)} />
          <strong>Auto-handle all</strong>
          <span style={{ color: 'var(--scout-text-display-secondary)' }}>· AI handles every chat</span>
        </label>
      </div>

      <div className="ember-chatdock__list">
        {chats.length === 0 && <div className="ember-empty">No active chats</div>}
        {chats.map((c) => {
          const tone = c.status === 'awaiting-handoff' ? 'critical' : c.status === 'agent-active' ? 'success' : 'info';
          return (
            <button
              key={c.id}
              className={`ember-row ${c.id === activeChatId ? 'ember-row--active' : ''}`}
              onClick={() => setActiveChatId(c.id)}
            >
              <StatusDot tone={tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ember-spread">
                  <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.customerName}
                  </span>
                  {c.unread > 0 && <Badge tone="critical">{c.unread}</Badge>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.channel} · {c.intent}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="ember-chatdock__active">
          <header className="ember-chatdock__activehead">
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{active.customerName}</div>
              <Link to={`/customers/${active.customerId}`} style={{ fontSize: 11 }}>Open 360 →</Link>
            </div>
            <button className="ember-iconbtn" onClick={() => closeChat(active.id)} title="End chat">✕</button>
          </header>

          <div className="ember-chatdock__modes">
            <span style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>Mode:</span>
            <button
              className={`ember-pill ${active.mode === 'copilot' ? 'ember-pill--active' : ''}`}
              onClick={() => setChatMode(active.id, 'copilot')}
            >
              Copilot
            </button>
            <button
              className={`ember-pill ${active.mode === 'autopilot' ? 'ember-pill--active' : ''}`}
              onClick={() => setChatMode(active.id, 'autopilot')}
            >
              Autopilot
            </button>
          </div>

          <div className="ember-chatdock__messages">
            {active.messages.length === 0 ? (
              <div className="ember-empty">No messages yet</div>
            ) : (
              active.messages.map((m) => (
                <div key={m.id} className={`ember-msg ember-msg--${m.author}`}>
                  <div className="ember-msg__author">{m.author}</div>
                  <div className="ember-msg__text">{m.text}</div>
                </div>
              ))
            )}
          </div>

          {active.status === 'ai-handling' || active.status === 'awaiting-handoff' ? (
            <div className="ember-chatdock__handoff">
              <Button variant="primary" size="sm" onClick={() => takeOver(active.id)}>
                Take over
              </Button>
              <span style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                {active.status === 'awaiting-handoff' ? 'AI requesting agent review' : 'AI is handling this chat'}
              </span>
            </div>
          ) : (
            <div className="ember-chatdock__compose">
              <input className="ember-input" placeholder="Reply to customer…" />
              <Button size="sm">Send</Button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
