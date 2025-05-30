import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Get the base URL from the environment or use '/dlm-demo' as default
const baseUrl = import.meta.env.BASE_URL || '/dlm-demo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App baseUrl={baseUrl} />
  </React.StrictMode>
);
