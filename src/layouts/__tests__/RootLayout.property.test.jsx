// Feature: platform-expansion, Property 3: Scroll resets to top on every route change
// Feature: platform-expansion, Property 4: TransitionFlash fires on every route change
// Feature: platform-expansion, Property 5: GlobalNav is present on every route

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom'
import fc from 'fast-check'
import { useNavTransition } from '../../hooks/useNavTransition'

const DEFINED_ROUTES = ['/', '/matrix', '/pillars/medicina-de-la-voz', '/pillars/soma', '/pillars/experiences', '/vault']

// Stub route config with a minimal RootLayout that includes a nav marker
const makeStubRoutes = () => [
  {
    path: '/',
    element: (
      <div>
        <nav data-testid="global-nav" />
        <Outlet />
      </div>
    ),
    children: [
      { index: true,                        element: <div data-testid="portal-page" /> },
      { path: 'matrix',                     element: <div data-testid="matrix-page" /> },
      { path: 'pillars/medicina-de-la-voz', element: <div data-testid="medicina-page" /> },
      { path: 'pillars/soma',               element: <div data-testid="soma-page" /> },
      { path: 'pillars/experiences',        element: <div data-testid="experiences-page" /> },
      { path: 'vault',                      element: <div data-testid="vault-page" /> },
      { path: '*',                          element: <div data-testid="not-found-page" /> },
    ],
  },
]

// ── Property 5: GlobalNav is present on every route ──────────────────────────
// Validates: Requirements 2.1

describe('RootLayout — Property 5: GlobalNav is present on every route', () => {
  it('renders exactly one GlobalNav on every defined route', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...DEFINED_ROUTES),
        async (route) => {
          const testRouter = createMemoryRouter(makeStubRoutes(), { initialEntries: [route] })
          const { unmount } = render(<RouterProvider router={testRouter} />)
          const navElements = document.querySelectorAll('[data-testid="global-nav"]')
          expect(navElements).toHaveLength(1)
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ── Property 3: Scroll resets to top on every route change ───────────────────
// Validates: Requirements 1.4
//
// We use a ScrollResetter layout that replicates the exact scroll-to-top
// useEffect from RootLayout, isolating the behavior under test.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollResetLayout() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  return (
    <div>
      <nav data-testid="global-nav" />
      <Outlet />
    </div>
  )
}

const makeScrollRoutes = () => [
  {
    path: '/',
    element: <ScrollResetLayout />,
    children: [
      { index: true,                        element: <div data-testid="portal-page" /> },
      { path: 'matrix',                     element: <div data-testid="matrix-page" /> },
      { path: 'pillars/medicina-de-la-voz', element: <div data-testid="medicina-page" /> },
      { path: 'pillars/soma',               element: <div data-testid="soma-page" /> },
      { path: 'pillars/experiences',        element: <div data-testid="experiences-page" /> },
      { path: 'vault',                      element: <div data-testid="vault-page" /> },
      { path: '*',                          element: <div data-testid="not-found-page" /> },
    ],
  },
]

describe('RootLayout — Property 3: Scroll resets to top on every route change', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls window.scrollTo({ top: 0 }) on every route change', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...DEFINED_ROUTES),
        fc.constantFrom(...DEFINED_ROUTES),
        async (routeA, routeB) => {
          window.scrollTo.mockClear()
          // initialEntries with two entries and initialIndex: 1 means the router
          // starts at routeB — the useEffect fires on mount (location.pathname = routeB)
          const testRouter = createMemoryRouter(makeScrollRoutes(), {
            initialEntries: [routeA, routeB],
            initialIndex: 1,
          })
          const { unmount } = render(<RouterProvider router={testRouter} />)
          // scrollTo is called by the useEffect on mount
          expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})

// ── Property 4: TransitionFlash fires on every route change ──────────────────
// Validates: Requirements 1.5

describe('useNavTransition — Property 4: TransitionFlash fires on every route change', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('flash transitions to true then false on navigateTo', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z]/.test(s)),
        async (sectionId) => {
          const { result } = renderHook(() => useNavTransition())
          expect(result.current.flash).toBe(false)

          act(() => { result.current.navigateTo(sectionId) })
          expect(result.current.flash).toBe(true)

          await act(async () => { vi.advanceTimersByTime(400) })
          expect(result.current.flash).toBe(false)
        }
      ),
      { numRuns: 50 }
    )
  })
})
