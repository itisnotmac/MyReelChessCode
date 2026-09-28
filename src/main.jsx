import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import NativeOAuthCallback from '@/components/auth/NativeOAuthCallback.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
    <NativeOAuthCallback />
  </>
)
