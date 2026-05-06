import { type ReactNode } from 'react';
import './primitives.css';

type CardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Card({ title, subtitle, actions, footer, children, className = '', bodyClassName = '' }: CardProps) {
  return (
    <section className={`ember-card ${className}`}>
      {(title || actions) && (
        <header className="ember-card__header">
          <div>
            {title && <h3 className="ember-card__title">{title}</h3>}
            {subtitle && <p className="ember-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ember-cluster">{actions}</div>}
        </header>
      )}
      <div className={`ember-card__body ${bodyClassName}`}>{children}</div>
      {footer && <div className="ember-card__footer">{footer}</div>}
    </section>
  );
}
