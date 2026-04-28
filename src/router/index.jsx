// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '../layouts/RootLayout'
import PageLoader from '../components/ui/PageLoader'

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

const PortalPage           = lazy(() => import('../pages/PortalPage'))
const MatrixPage           = lazy(() => import('../pages/MatrixPage'))
const MedicinaPage         = lazy(() => import('../pages/pillars/MedicinaPage'))
const MedicinaPostPage     = lazy(() => import('../pages/pillars/MedicinaPostPage'))
const SomaPage             = lazy(() => import('../pages/pillars/SomaPage'))
const ExperiencesPage      = lazy(() => import('../pages/pillars/ExperiencesPage'))
const ExperienceDetailPage = lazy(() => import('../pages/pillars/ExperienceDetailPage'))
const VaultPage            = lazy(() => import('../pages/VaultPage'))
const NotFoundPage         = lazy(() => import('../pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,                                    element: wrap(PortalPage) },
      { path: 'matrix',                                 element: wrap(MatrixPage) },
      { path: 'pillars/medicina-de-la-voz',             element: wrap(MedicinaPage) },
      { path: 'pillars/medicina-de-la-voz/:slug',       element: wrap(MedicinaPostPage) },
      { path: 'pillars/soma',                           element: wrap(SomaPage) },
      { path: 'pillars/experiences',                    element: wrap(ExperiencesPage) },
      { path: 'pillars/experiences/:slug',              element: wrap(ExperienceDetailPage) },
      { path: 'vault',                                  element: wrap(VaultPage) },
      { path: '*',                                      element: wrap(NotFoundPage) },
    ],
  },
])
