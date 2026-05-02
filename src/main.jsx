import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

// i18n must be imported before any component that calls useTranslation().
// With bundled resources the init is synchronous — no async race.
import './i18n/index'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      Suspense is a safety net for any future lazy-loaded translation chunk.
      With bundled resources it resolves immediately and the fallback is
      never shown in practice.
    */}
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
)
