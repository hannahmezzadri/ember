import { useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Input, Select } from '../components/ui/Field';
import { Badge } from '../components/ui/Badge';
import { useNotifications } from '../providers/NotificationProvider';
import { getCustomerAccounts } from '../data/mock';
import { formatCurrency, formatDate } from '../lib/format';
import type { Account, Customer } from '../data/types';
import './workflow.css';

type Step = 'amount' | 'source' | 'date' | 'review' | 'done';

const STEP_ORDER: Step[] = ['amount', 'source', 'date', 'review'];

export function MakePaymentWorkflow({
  account,
  customer,
  onCancel,
  onComplete,
}: {
  account: Account;
  customer: Customer;
  onCancel: () => void;
  onComplete: () => void;
}) {
  const { pushToast } = useNotifications();

  const sources = useMemo(
    () => getCustomerAccounts(customer.id).filter((a) => a.lob === 'banking' || a.lob === 'sb'),
    [customer.id]
  );

  type AmountChoice = 'minimum' | 'statement' | 'current' | 'custom';

  const [step, setStep] = useState<Step>('amount');
  const [amountChoice, setAmountChoice] = useState<AmountChoice>('statement');
  const [customAmount, setCustomAmount] = useState('');
  const [sourceId, setSourceId] = useState(sources[0]?.id ?? '');
  const [date, setDate] = useState<'today' | 'scheduled'>('today');
  const [scheduledDate, setScheduledDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const minAmount = account.paymentDue?.amount ?? 0;
  const statementAmount = account.paymentDue?.amount ? account.paymentDue.amount * 1.5 : account.balance;
  const currentBalance = account.balance;

  const amount =
    amountChoice === 'minimum'
      ? minAmount
      : amountChoice === 'statement'
      ? statementAmount
      : amountChoice === 'current'
      ? currentBalance
      : Number(customAmount || 0);

  const sourceAcc = sources.find((s) => s.id === sourceId);
  const stepIndex = STEP_ORDER.indexOf(step);

  const valid = {
    amount: amount > 0 && amount <= currentBalance + 1,
    source: !!sourceAcc && (sourceAcc.available ?? sourceAcc.balance) >= amount,
    date: date === 'today' || !!scheduledDate,
  };

  const goNext = () => {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) setStep(next);
  };

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStep('done');
    pushToast({
      variant: 'success',
      title: 'Payment scheduled',
      body: `${formatCurrency(amount)} from ${sourceAcc?.nickname} → ${account.nickname}`,
    });
    setTimeout(onComplete, 800);
  };

  return (
    <Card
      title={
        <span className="ember-cluster">
          <span>Make a payment</span>
          <Badge tone="info">Guided · {stepIndex + 1} of {STEP_ORDER.length}</Badge>
        </span>
      }
      subtitle={`${account.nickname} ····${account.mask}`}
      actions={
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      }
    >
      <div className="ember-wf">
        <WfStep title="1 · Choose amount" active={step === 'amount'} done={stepIndex > 0}>
          <div className="ember-wf__choices">
            {minAmount > 0 && (
              <ChoiceCard
                selected={amountChoice === 'minimum'}
                onClick={() => setAmountChoice('minimum')}
                label="Minimum due"
                value={formatCurrency(minAmount)}
                hint={`due ${account.paymentDue ? formatDate(account.paymentDue.date) : ''}`}
              />
            )}
            <ChoiceCard
              selected={amountChoice === 'statement'}
              onClick={() => setAmountChoice('statement')}
              label="Statement balance"
              value={formatCurrency(statementAmount)}
              hint="avoids interest"
            />
            <ChoiceCard
              selected={amountChoice === 'current'}
              onClick={() => setAmountChoice('current')}
              label="Current balance"
              value={formatCurrency(currentBalance)}
              hint="pay in full"
            />
            <ChoiceCard
              selected={amountChoice === 'custom'}
              onClick={() => setAmountChoice('custom')}
              label="Custom amount"
              value={amountChoice === 'custom' ? formatCurrency(Number(customAmount || 0)) : '—'}
            />
          </div>
          {amountChoice === 'custom' && (
            <div style={{ maxWidth: 240, marginTop: 12 }}>
              <Field label="Amount (USD)">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                />
              </Field>
            </div>
          )}
          {step === 'amount' && (
            <WfActions onNext={goNext} canNext={valid.amount} onCancel={onCancel} />
          )}
        </WfStep>

        <WfStep title="2 · Funding source" active={step === 'source'} done={stepIndex > 1}>
          {sources.length === 0 ? (
            <div className="ember-empty">No eligible deposit accounts on file</div>
          ) : (
            <Field label="Pay from" hint="Only deposit accounts are eligible">
              <Select value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nickname} ····{s.mask} — {formatCurrency(s.available ?? s.balance)} available
                  </option>
                ))}
              </Select>
            </Field>
          )}
          {sourceAcc && amount > (sourceAcc.available ?? sourceAcc.balance) && (
            <div className="ember-wf__warn">⚠ Source has insufficient available balance.</div>
          )}
          {step === 'source' && (
            <WfActions
              onBack={() => setStep('amount')}
              onNext={goNext}
              canNext={valid.source}
              onCancel={onCancel}
            />
          )}
        </WfStep>

        <WfStep title="3 · When" active={step === 'date'} done={stepIndex > 2}>
          <div className="ember-wf__choices">
            <ChoiceCard
              selected={date === 'today'}
              onClick={() => setDate('today')}
              label="Today"
              value={formatDate(new Date().toISOString())}
              hint="posts immediately"
            />
            <ChoiceCard
              selected={date === 'scheduled'}
              onClick={() => setDate('scheduled')}
              label="Schedule"
              value={date === 'scheduled' ? formatDate(scheduledDate) : 'pick a date'}
            />
          </div>
          {date === 'scheduled' && (
            <div style={{ maxWidth: 240, marginTop: 12 }}>
              <Field label="Date">
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </Field>
            </div>
          )}
          {step === 'date' && (
            <WfActions
              onBack={() => setStep('source')}
              onNext={goNext}
              canNext={valid.date}
              onCancel={onCancel}
            />
          )}
        </WfStep>

        <WfStep title="4 · Review & confirm" active={step === 'review'} done={step === 'done'}>
          <div className="ember-wf__review">
            <ReviewRow label="From" value={`${sourceAcc?.nickname} ····${sourceAcc?.mask}`} />
            <ReviewRow label="To" value={`${account.nickname} ····${account.mask}`} />
            <ReviewRow label="Amount" value={formatCurrency(amount)} strong />
            <ReviewRow label="Date" value={date === 'today' ? 'Today' : formatDate(scheduledDate)} />
            <ReviewRow label="Confirmation #" value="will generate on submit" muted />
          </div>
          <div className="ember-wf__attest">
            ☎ Read disclosure to customer: <em>"Your payment of {formatCurrency(amount)} will be processed from your account ending {sourceAcc?.mask}…"</em>
          </div>
          {step === 'review' && (
            <WfActions
              onBack={() => setStep('date')}
              onCancel={onCancel}
              onNext={submit}
              nextLabel={submitting ? 'Processing…' : 'Confirm payment'}
              loading={submitting}
              canNext={valid.amount && valid.source && valid.date}
            />
          )}
        </WfStep>

        {step === 'done' && (
          <div className="ember-wf__done">
            ✓ Payment scheduled. Opening wrap-up…
          </div>
        )}
      </div>
    </Card>
  );
}

function WfStep({ title, active, done, children }: { title: string; active: boolean; done?: boolean; children: React.ReactNode }) {
  return (
    <div className={`ember-wf__step ${active ? 'ember-wf__step--active' : ''} ${done ? 'ember-wf__step--done' : ''}`}>
      <div className="ember-wf__steptitle">
        {done && <span style={{ color: 'var(--scout-text-display-success)' }}>✓ </span>}
        {title}
      </div>
      {(active || done) && <div className="ember-wf__stepbody">{children}</div>}
    </div>
  );
}

function WfActions({
  onBack,
  onNext,
  onCancel,
  nextLabel = 'Continue',
  canNext = true,
  loading,
}: {
  onBack?: () => void;
  onNext: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  canNext?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="ember-wf__actions">
      {onBack && (
        <Button variant="tertiary" size="sm" onClick={onBack}>
          Back
        </Button>
      )}
      {onCancel && (
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button size="sm" onClick={onNext} disabled={!canNext || loading} loading={loading}>
        {nextLabel}
      </Button>
    </div>
  );
}

function ChoiceCard({
  selected,
  onClick,
  label,
  value,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ember-wf__choice ${selected ? 'ember-wf__choice--selected' : ''}`}
    >
      <div className="ember-wf__choicelabel">{label}</div>
      <div className="ember-wf__choicevalue">{value}</div>
      {hint && <div className="ember-wf__choicehint">{hint}</div>}
    </button>
  );
}

function ReviewRow({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <div className="ember-spread" style={{ padding: '6px 0', borderBottom: '1px solid var(--scout-border-secondary)', fontSize: 13 }}>
      <span style={{ color: 'var(--scout-text-display-secondary)' }}>{label}</span>
      <span style={{ fontWeight: strong ? 700 : 500, color: muted ? 'var(--scout-text-display-secondary)' : undefined }}>{value}</span>
    </div>
  );
}
