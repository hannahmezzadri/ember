import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, forwardRef } from 'react';
import './primitives.css';

type FieldProps = {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

export function Field({ label, hint, error, children }: FieldProps) {
  return (
    <div className="ember-field">
      {label && <label className="ember-field__label">{label}</label>}
      {children}
      {error ? <span className="ember-field__error">{error}</span> : hint ? <span className="ember-field__hint">{hint}</span> : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...rest }, ref) {
    return <input ref={ref} className={`ember-input ${className}`} {...rest} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...rest }, ref) {
    return (
      <select ref={ref} className={`ember-select ${className}`} {...rest}>
        {children}
      </select>
    );
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = '', ...rest }, ref) {
    return <textarea ref={ref} className={`ember-textarea ${className}`} {...rest} />;
  }
);
