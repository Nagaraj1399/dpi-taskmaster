import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>
);
