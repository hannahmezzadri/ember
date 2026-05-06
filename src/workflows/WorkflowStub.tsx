import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function WorkflowStub({
  title,
  onCancel,
  onComplete,
}: {
  title: string;
  onCancel: () => void;
  onComplete: () => void;
}) {
  return (
    <Card
      title={
        <span className="ember-cluster">
          <span>{title}</span>
          <Badge tone="warning">stub · v1 placeholder</Badge>
        </span>
      }
      actions={
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Close
        </Button>
      }
    >
      <p style={{ marginTop: 0, color: 'var(--scout-text-display-secondary)' }}>
        This guided workflow will be implemented in a later milestone. The "Make a payment" workflow demonstrates the
        inline progressive-disclosure pattern that all flows in Ember will follow.
      </p>
      <p style={{ color: 'var(--scout-text-display-secondary)' }}>
        Use the action below to simulate completion and proceed to wrap-up.
      </p>
      <div className="ember-wf__actions">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onComplete}>
          Simulate completion
        </Button>
      </div>
    </Card>
  );
}
