import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'critical';
export type NotificationKind = 'personal' | 'system' | 'release' | 'news';

export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  timestamp: string;
  read: boolean;
};

export type Toast = {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
};

export type SystemBanner = {
  id: string;
  variant: 'info' | 'warning' | 'critical';
  title: string;
  body?: string;
};

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  banners: SystemBanner[];
  dismissBanner: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

const seedNotifications: Notification[] = [
  {
    id: 'n1',
    kind: 'system',
    title: 'Planned outage Sat 11 PM ET',
    body: 'Auto-loan servicing will be unavailable for 30 minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    kind: 'release',
    title: 'New: AI handoff queue',
    body: 'Pending hand-offs now appear in your sidebar.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    kind: 'personal',
    title: 'Your AHT improved 12% this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: 'n4',
    kind: 'news',
    title: 'Reg E disclosure update — effective 6/1',
    body: 'Review the updated dispute response timelines.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: false,
  },
];

const seedBanners: SystemBanner[] = [
  {
    id: 'b1',
    variant: 'info',
    title: 'You are in demo mode',
    body: 'All actions are simulated. No customer data is real.',
  },
];

let counter = 0;
const uid = () => `id_${Date.now()}_${counter++}`;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banners, setBanners] = useState<SystemBanner[]>(seedBanners);

  const markRead = useCallback((id: string) => {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }, []);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const toast: Toast = { ...t, id: uid() };
    setToasts((ts) => [...ts, toast]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== toast.id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const dismissBanner = useCallback((id: string) => {
    setBanners((bs) => bs.filter((b) => b.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        markRead,
        markAllRead,
        toasts,
        pushToast,
        dismissToast,
        banners,
        dismissBanner,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
