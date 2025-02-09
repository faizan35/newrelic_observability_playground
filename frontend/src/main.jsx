import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';

const options = {
  init: { /* NREUM.init values */ },
  info: { /* NREUM.info values */ },
  loader_config: { /* NREUM.loader_config values */ }
};

new BrowserAgent(options);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
