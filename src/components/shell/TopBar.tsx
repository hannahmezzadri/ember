import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../providers/PreferencesProvider';
import { useRole, ROLE_LABEL, ROLE_DESCRIPTION, type Role } from '../../providers/RoleProvider';
import { useNotifications } from '../../providers/NotificationProvider';
import { customers } from '../../data/mock';
import { Avatar } from '../ui/Avatar';

export function TopBar() {
  const navigate = useNavigate();
  const { theme, density, toggleTheme, toggleDensity } = usePreferences();
  const { role, setRole } = useRole();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  const [showNotif, setShowNotif] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const results = search
    ? customers
        .filter((c) =>
          [c.name, c.email, c.phone, c.id].some((v) => v.toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  return (
    <header className="ember-topbar">
      <Link to="/" className="ember-topbar__brand">
        <span className="ember-topbar__logo" />
        Ember
      </Link>
      <nav className="ember-topbar__nav">
        <NavLink to="/" end className={({ isActive }) => `ember-topbar__navlink ${isActive ? 'ember-topbar__navlink--active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `ember-topbar__navlink ${isActive ? 'ember-topbar__navlink--active' : ''}`}>
          Customers
        </NavLink>
        <NavLink to="/cases" className={({ isActive }) => `ember-topbar__navlink ${isActive ? 'ember-topbar__navlink--active' : ''}`}>
          Cases
        </NavLink>
      </nav>

      <div className="ember-topbar__search ember-popover-wrap">
        <input
          className="ember-input"
          placeholder="Search customer by name, email, phone, or ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
        />
        {showResults && results.length > 0 && (
          <div className="ember-popover ember-popover--wide" style={{ right: 'auto', left: 0 }}>
            <div className="ember-popover__body">
              {results.map((c) => (
                <button
                  key={c.id}
                  className="ember-popover__item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    navigate(`/customers/${c.id}`);
                    setSearch('');
                    setShowResults(false);
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>
                    {c.type === 'business' ? 'Business' : 'Consumer'} · {c.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ember-topbar__actions">
        <button
          className="ember-iconbtn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
        >
          {theme === 'light' ? '☾' : '☀'}
        </button>
        <button
          className="ember-iconbtn"
          onClick={toggleDensity}
          title={`Density: ${density}`}
          style={{ fontSize: 14 }}
        >
          {density === 'default' ? '≡' : '☰'}
        </button>

        <div className="ember-popover-wrap">
          <button className="ember-iconbtn" onClick={() => setShowNotif((s) => !s)} title="Notifications">
            🔔
            {unreadCount > 0 && <span className="ember-iconbtn__count">{unreadCount}</span>}
          </button>
          {showNotif && (
            <div className="ember-popover ember-popover--wide">
              <div className="ember-popover__header">
                <span className="ember-popover__title">Notifications</span>
                <button className="ember-iconbtn" onClick={markAllRead} style={{ width: 'auto', padding: '0 8px', fontSize: 11 }}>
                  Mark all read
                </button>
              </div>
              <div className="ember-popover__body">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    className="ember-popover__item"
                    onClick={() => markRead(n.id)}
                    style={{ borderLeft: n.read ? 'none' : '3px solid var(--scout-fill-info)' }}
                  >
                    <div style={{ fontWeight: n.read ? 400 : 600, fontSize: 12 }}>{n.title}</div>
                    {n.body && <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)', marginTop: 2 }}>{n.body}</div>}
                    <div style={{ fontSize: 10, color: 'var(--scout-text-display-secondary)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{n.kind}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ember-popover-wrap">
          <button
            className="ember-iconbtn"
            onClick={() => setShowRole((s) => !s)}
            title="Switch role (demo)"
            style={{ width: 'auto', padding: '0 10px', fontSize: 12, fontWeight: 600 }}
          >
            {ROLE_LABEL[role]}
          </button>
          {showRole && (
            <div className="ember-popover">
              <div className="ember-popover__header"><span className="ember-popover__title">Demo · switch role</span></div>
              <div className="ember-popover__body">
                {(['admin', 'manager', 'agent', 'specialist'] as Role[]).map((r) => (
                  <button
                    key={r}
                    className={`ember-popover__item ${r === role ? 'ember-popover__item--active' : ''}`}
                    onClick={() => {
                      setRole(r);
                      setShowRole(false);
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{ROLE_LABEL[r]}</div>
                    <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)', marginTop: 2 }}>
                      {ROLE_DESCRIPTION[r]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ember-popover-wrap">
          <button className="ember-iconbtn" onClick={() => setShowProfile((s) => !s)} style={{ width: 'auto', padding: 2 }}>
            <Avatar name="Hannah Mezzadri" size="sm" />
          </button>
          {showProfile && (
            <div className="ember-popover">
              <div className="ember-popover__body">
                <div style={{ padding: '8px 12px' }}>
                  <div style={{ fontWeight: 600 }}>Hannah Mezzadri</div>
                  <div style={{ fontSize: 11, color: 'var(--scout-text-display-secondary)' }}>Agent ID: A-44218</div>
                </div>
                <hr className="ember-divider" />
                <button className="ember-popover__item">Profile settings</button>
                <button className="ember-popover__item">Personal information</button>
                <button className="ember-popover__item">Performance dashboard</button>
                <hr className="ember-divider" />
                <button className="ember-popover__item" style={{ color: 'var(--scout-text-display-critical)' }}>Log out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
