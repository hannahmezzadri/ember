import { type ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'critical' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, loading, className = '', children, disabled, ...rest },
  ref
) {
  const cls = [
    'ember-btn',
    `ember-btn--${variant}`,
    `ember-btn--${size}`,
    fullWidth && 'ember-btn--full',
    loading && 'ember-btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button ref={ref} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <span className="ember-btn__spinner" aria-hidden />}
      <span className="ember-btn__label">{children}</span>
    </button>
  );
});
