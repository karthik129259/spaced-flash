// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind CSS styles
import './src/styles/flashcard-animations.css'; // Flashcard animations

// Prevent multiple root creation in development by checking if root already exists
const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement) {
  console.error('Failed to find the root element');
} else {
  // Use a safer approach that doesn't rely on internal React properties
  if ((window as any).__REACT_ROOT_INSTANCE__) {
    console.info('React root already exists, skipping initialization');
  } else {
    const root = ReactDOM.createRoot(rootElement);
    // Store reference to prevent duplicate initialization
    (window as any).__REACT_ROOT_INSTANCE__ = true;
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
