import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AppProviders } from './providers/AppProviders';

import '@scout/tokens/css';
import '@scout/tokens/css/dark';
import '@scout/tokens/css/density-condensed';
import '@scout/tokens/css/brand/ember';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
