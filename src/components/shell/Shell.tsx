import { type ReactNode } from 'react';
import { TopBar } from './TopBar';
import { Banners } from './Banners';
import { Toasts } from './Toasts';
import { ChatDock } from '../chat/ChatDock';
import './Shell.css';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="ember-shell">
      <TopBar />
      <Banners />
      <main className="ember-shell__main">
        <div className="ember-shell__content">{children}</div>
        <ChatDock />
      </main>
      <Toasts />
    </div>
  );
}
