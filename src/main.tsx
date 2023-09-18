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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' Component={LicenseKeyEntry} />
        <Route path='/app' Component={App} />

        {/* <Route path='/login' Component={Login} />
        <Route path='/activateKey' Component={ActivateKey} />
        <Route path='/app' Component={App} /> */}
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
