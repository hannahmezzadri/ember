import { type ReactNode } from 'react';
import { PreferencesProvider } from './PreferencesProvider';
import { RoleProvider } from './RoleProvider';
import { NotificationProvider } from './NotificationProvider';
import { ChatProvider } from './ChatProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <RoleProvider>
        <NotificationProvider>
          <ChatProvider>{children}</ChatProvider>
        </NotificationProvider>
      </RoleProvider>
    </PreferencesProvider>
  );
}
