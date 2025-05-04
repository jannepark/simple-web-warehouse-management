import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onRegistered(r) {
    console.log('Service worker registered.', r)
  },
  onRegisterError(error) {
    console.error('Service worker registration error:', error)
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
