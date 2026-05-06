import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="ember-empty" style={{ padding: 80 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--scout-text-display-primary)' }}>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">← Back to dashboard</Link>
    </div>
  );
}
