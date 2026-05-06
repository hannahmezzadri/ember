import { useNotifications } from '../../providers/NotificationProvider';

export function Banners() {
  const { banners, dismissBanner } = useNotifications();
  if (banners.length === 0) return null;
  return (
    <div className="ember-banners">
      {banners.map((b) => (
        <div key={b.id} className={`ember-banner ember-banner--${b.variant}`}>
          <span className="ember-banner__title">{b.title}</span>
          {b.body && <span>{b.body}</span>}
          <button className="ember-banner__close" onClick={() => dismissBanner(b.id)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
