import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

// =====================================================
// ✅ FIX: Handle dynamic import (chunk) loading errors
// This happens when old JS files are cached after deployment
// Example error: "Failed to fetch dynamically imported module"
// =====================================================

// Handles normal script errors
window.addEventListener("error", (e) => {
  if (e.message?.includes("Failed to fetch dynamically imported module")) {
    console.log("Chunk load error detected → reloading page...");
    window.location.reload(); // Reload to fetch latest JS files
  }
});

// Handles async errors (Promise rejections)
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason?.message?.includes("Failed to fetch dynamically imported module")
  ) {
    console.log("Dynamic import error detected → reloading page...");
    window.location.reload(); // Reload to fix missing chunk
  }
});

// =====================================================
// i18n setup (must be imported before components)
// Ensures translations are ready before rendering
// =====================================================
import './i18n/index'

// Global styles
import './index.css'

// =====================================================
// React App Render
// =====================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    {/* 
      Suspense is used for lazy-loaded components or translations.
      Currently fallback is null (no loading UI shown).
    */}
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>

  </React.StrictMode>
)