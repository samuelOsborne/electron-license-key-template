import React from 'react'
import ReactDOM from 'react-dom/client'
import LicenseKeyEntry from './components/LicenseKeyEntry.tsx'
import {
  HashRouter,
  Route,
  Routes
} from "react-router-dom";
import './index.css'
import App from './App.tsx';
import { LicenseKeyProvider } from './components/LicenseKeyProvider.tsx';

/**
 * Video todo:
 *  - Create a lemonsqueezy store
 *  - Show IPC methods that save to sessionstore
 *  - Write LicenseKeyEntry component
 *  - Write out LicenseKeyProvider with handleActivateLicenseKey
 *  - Launch app and check if its working
 *  - Re-launch app and show that it asks for license key again
 *  - Create on launch method inside of provider that checks for license key
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <LicenseKeyProvider>
        <Routes>
          <Route path='/' Component={LicenseKeyEntry} />
          <Route path='/app' Component={App} />
        </Routes>
      </LicenseKeyProvider>
    </HashRouter>
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
