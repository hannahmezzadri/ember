import { type ReactNode } from 'react';
import './primitives.css';

type Tone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`ember-badge ember-badge--${tone}`}>{children}</span>;
}

export function StatusDot({ tone = 'neutral' }: { tone?: Tone }) {
  return <span className={`ember-dot ember-dot--${tone}`} aria-hidden />;
}
