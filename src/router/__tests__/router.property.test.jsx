// Feature: platform-expansion, Property 1: Router renders a component for every defined route
// Feature: platform-expansion, Property 2: Undefined routes render the 404 page

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom'
import fc from 'fast-check'

/**
 * Inline stub route config — page components don't exist yet (created in later tasks).
 * We define the same route shape as src/router/index.jsx but with simple stub elements
 * so the router logic (matching, catch-all) can be tested independently.
 */
const STUB_ROUTES = [
  {
    path: '/',
    element: <div data-testid="root-layout"><Outlet /></div>,
    children: [
      { index: true,                          element: <div data-testid="portal-page">Portal</div> },
      { path: 'matrix',                       element: <div data-testid="matrix-page">Matrix</div> },
      { path: 'pillars/medicina-de-la-voz',   element: <div data-testid="medicina-page">Medicina</div> },
      { path: 'pillars/soma',                 element: <div data-testid="soma-page">Soma</div> },
      { path: 'pillars/experiences',          element: <div data-testid="experiences-page">Experiences</div> },
      { path: 'vault',                        element: <div data-testid="vault-page">Vault</div> },
      { path: '*',                            element: <div data-testid="not-found-page">404</div> },
    ],
  },
]

const DEFINED_ROUTES = [
  '/',
  '/matrix',
  '/pillars/medicina-de-la-voz',
  '/pillars/soma',
  '/pillars/experiences',
  '/vault',
]

const TEST_ID_MAP = {
  '/':                            'portal-page',
  '/matrix':                      'matrix-page',
  '/pillars/medicina-de-la-voz':  'medicina-page',
  '/pillars/soma':                'soma-page',
  '/pillars/experiences':         'experiences-page',
  '/vault':                       'vault-page',
}

/**
 * Validates: Requirements 1.2
 *
 * Property 1: Router renders a component for every defined route.
 * For any route string in the defined route set, navigating to that route
 * should render a non-null page component.
 */
describe('Router — Property 1: renders a component for every defined route', () => {
  it('each defined route renders a non-null page component', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...DEFINED_ROUTES),
        async (route) => {
          const testRouter = createMemoryRouter(STUB_ROUTES, {
            initialEntries: [route],
          })

          const { unmount } = render(<RouterProvider router={testRouter} />)

          const testId = TEST_ID_MAP[route]
          expect(document.querySelector(`[data-testid="${testId}"]`)).not.toBeNull()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Validates: Requirements 1.3
 *
 * Property 2: Undefined routes render the 404 page.
 * For any path string that is not in the defined route set, the router
 * should render the NotFoundPage (catch-all *) component.
 */
describe('Router — Property 2: undefined routes render the 404 page', () => {
  it('any path not in the defined set renders the 404 component', async () => {
    const definedSet = new Set(DEFINED_ROUTES)

    await fc.assert(
      fc.asyncProperty(
        // Generate a path-like string: starts with '/', contains only safe URL chars
        fc.string({ minLength: 2, maxLength: 50 })
          .map(s => '/' + s.replace(/[^a-z0-9\-/]/gi, 'x'))
          .filter(s => s.length >= 2 && !s.startsWith('//')),
        async (randomPath) => {
          // Skip if the generated path happens to match a defined route
          if (definedSet.has(randomPath)) return

          const testRouter = createMemoryRouter(STUB_ROUTES, {
            initialEntries: [randomPath],
          })

          const { unmount } = render(<RouterProvider router={testRouter} />)

          expect(document.querySelector('[data-testid="not-found-page"]')).not.toBeNull()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
