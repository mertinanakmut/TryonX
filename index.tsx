
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './mert';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical: Could not find root element");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">BOOT ERROR: ${err}</div>`;
  }
}
