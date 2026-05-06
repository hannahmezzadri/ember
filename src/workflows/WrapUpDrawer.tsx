import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Field, Select, Textarea } from '../components/ui/Field';
import { useNotifications } from '../providers/NotificationProvider';

const DISPOSITIONS = [
  'Resolved on first contact',
  'Resolved · with follow-up',
  'Escalated',
  'Customer disconnected',
  'Pending — awaiting documentation',
];

const REASONS = [
  'Payment',
  'Dispute',
  'Account access',
  'Information change',
  'Hardship',
  'Fraud',
  'Other',
];

export function WrapUpDrawer({
  open,
  actionLabel,
  customerName,
  onClose,
}: {
  open: boolean;
  actionLabel: string;
  customerName: string;
  onClose: () => void;
}) {
  const { pushToast } = useNotifications();
  const [disposition, setDisposition] = useState(DISPOSITIONS[0]);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setNotes(`Action taken: ${actionLabel}\nCustomer: ${customerName}\n\n`);
      setSubmitting(false);
    }
  }, [open, actionLabel, customerName]);

  const valid = notes.trim().length >= 10;

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    pushToast({ variant: 'success', title: 'Wrap-up saved', body: `${disposition} · ${reason}` });
    setSubmitting(false);
    onClose();
  };

  return (
    <>
      <div
        className={`ember-wrapup__overlay ${open ? 'ember-wrapup__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside className={`ember-wrapup ${open ? 'ember-wrapup--open' : ''}`} aria-hidden={!open}>
        <header className="ember-wrapup__header">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Wrap-up</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--scout-text-display-secondary)' }}>
            Required before ending contact · {customerName}
          </p>
        </header>
        <div className="ember-wrapup__body">
          <Field label="Disposition">
            <Select value={disposition} onChange={(e) => setDisposition(e.target.value)}>
              {DISPOSITIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reason category">
            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Notes" hint="Min 10 characters · summarize actions taken & next steps" error={!valid && notes.length > 0 ? 'Notes are too short' : undefined}>
            <Textarea
              rows={10}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summarize what happened, actions taken, follow-ups required…"
            />
          </Field>
          <Field label="Follow-up needed">
            <Select defaultValue="none">
              <option value="none">None</option>
              <option value="callback">Schedule callback</option>
              <option value="case">Open case</option>
              <option value="escalate">Escalate to specialist</option>
            </Select>
          </Field>
        </div>
        <footer className="ember-wrapup__footer">
          <Button variant="tertiary" size="sm" onClick={onClose}>
            Save draft
          </Button>
          <Button size="sm" onClick={submit} disabled={!valid || submitting} loading={submitting}>
            Submit & end contact
          </Button>
        </footer>
      </aside>
    </>
  );
}
