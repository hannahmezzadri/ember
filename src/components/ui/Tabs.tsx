import './primitives.css';

export type TabItem = { id: string; label: string };

export function Tabs({
  items,
  activeId,
  onChange,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="ember-tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={it.id === activeId}
          className={`ember-tab ${it.id === activeId ? 'ember-tab--active' : ''}`}
          onClick={() => onChange(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
