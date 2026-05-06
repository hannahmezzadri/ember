import { useNotifications } from '../../providers/NotificationProvider';

export function Toasts() {
  const { toasts, dismissToast } = useNotifications();
  return (
    <div className="ember-toasts" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`ember-toast ember-toast--${t.variant}`}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="ember-toast__title">{t.title}</div>
            {t.body && <div className="ember-toast__body">{t.body}</div>}
          </div>
          <button className="ember-toast__close" onClick={() => dismissToast(t.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
