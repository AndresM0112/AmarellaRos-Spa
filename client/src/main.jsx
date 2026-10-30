import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import './index.css'
import ToastProvider from './toast/ToastProvider';
import App from './App.jsx'
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/allura/400.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ToastProvider> 
      <App />
    </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)

