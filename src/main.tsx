import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Universal Native Tooltip Suppressor:
// Intercept mouseover in capture phase, ensure aria-label exists, and purge `title`
// attribute before the OS/browser native tooltip timer can fire.
if (typeof document !== 'undefined') {
  document.addEventListener(
    'mouseover',
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest?.('[title]') as HTMLElement | null;
      if (el && el.hasAttribute('title')) {
        const val = el.getAttribute('title');
        if (val) {
          if (!el.getAttribute('aria-label')) {
            el.setAttribute('aria-label', val);
          }
          el.removeAttribute('title');
        }
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
