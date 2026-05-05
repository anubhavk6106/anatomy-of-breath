// ======================================================
// Router Setup (React Router v6)
// Handles lazy loading + error fallback UI
// ======================================================

import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layout
import RootLayout from '../layouts/RootLayout'

// Loader shown while lazy components are loading
import PageLoader from '../components/ui/PageLoader'

// ======================================================
// Helper: Wrap lazy components with Suspense
// This ensures a loading UI is shown while pages load
// ======================================================
const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

// ======================================================
// Lazy-loaded pages (code splitting for performance)
// ======================================================
const PortalPage           = lazy(() => import('../pages/PortalPage'))
const MatrixPage           = lazy(() => import('../pages/MatrixPage'))
const MedicinaPage         = lazy(() => import('../pages/pillars/MedicinaPage'))
const MedicinaPostPage     = lazy(() => import('../pages/pillars/MedicinaPostPage'))
const SomaPage             = lazy(() => import('../pages/pillars/SomaPage'))
const ExperiencesPage      = lazy(() => import('../pages/pillars/ExperiencesPage'))
const ExperienceDetailPage = lazy(() => import('../pages/pillars/ExperienceDetailPage'))
const VaultPage            = lazy(() => import('../pages/VaultPage'))
const NotFoundPage         = lazy(() => import('../pages/NotFoundPage'))

// ======================================================
// ✅ Error Boundary Component
// This shows when something breaks (like chunk loading error)
// Instead of white screen, user sees clean UI + reload option
// ======================================================
function ErrorPage() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: '#0b0b0b',
      color: '#D4AF37',
      fontFamily: 'Raleway, sans-serif'
    }}>
      <p style={{
        marginBottom: '1rem',
        letterSpacing: '0.2em'
      }}>
        Updating experience…
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.6rem 1.5rem',
          border: '1px solid #D4AF37',
          background: 'transparent',
          color: '#D4AF37',
          cursor: 'pointer',
          letterSpacing: '0.2em'
        }}
      >
        Reload
      </button>
    </div>
  )
}

// ======================================================
// Router Configuration
// ======================================================
export const router = createBrowserRouter([
  {
    path: '/',
    
    // Main layout wrapper
    element: <RootLayout />,

    // ✅ Attach Error Boundary here (IMPORTANT)
    errorElement: <ErrorPage />,

    children: [

      // Home page
      { 
        index: true, 
        element: wrap(PortalPage) 
      },

      // Matrix page
      { 
        path: 'matrix', 
        element: wrap(MatrixPage) 
      },

      // Medicina pillar
      { 
        path: 'pillars/medicina-de-la-voz', 
        element: wrap(MedicinaPage) 
      },

      // Medicina post detail
      { 
        path: 'pillars/medicina-de-la-voz/:slug', 
        element: wrap(MedicinaPostPage) 
      },

      // Soma pillar
      { 
        path: 'pillars/soma', 
        element: wrap(SomaPage) 
      },

      // Experiences list
      { 
        path: 'pillars/experiences', 
        element: wrap(ExperiencesPage) 
      },

      // Experience detail
      { 
        path: 'pillars/experiences/:slug', 
        element: wrap(ExperienceDetailPage) 
      },

      // Vault page
      { 
        path: 'vault', 
        element: wrap(VaultPage) 
      },

      // 404 page (fallback route)
      { 
        path: '*', 
        element: wrap(NotFoundPage) 
      },
    ],
  },
])