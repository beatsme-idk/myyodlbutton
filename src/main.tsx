
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as buffer from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || buffer.Buffer;
}

createRoot(document.getElementById("root")!).render(<App />);
