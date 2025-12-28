
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './mert.tsx';

const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `
      <div style="padding: 40px; color: #ff4444; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; background: #000; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h1 style="font-weight: 900; letter-spacing: -2px; font-size: 40px;">BOOT_ERROR</h1>
        <p style="color: #666; font-size: 12px; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px;">Neural linking failed. Please refresh.</p>
        <code style="background: #111; padding: 10px; border-radius: 8px; margin-top: 20px; font-size: 10px; border: 1px solid #333;">${err}</code>
      </div>
    `;
  }
};

// Ensure init runs even if the browser has issues with module execution order
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
