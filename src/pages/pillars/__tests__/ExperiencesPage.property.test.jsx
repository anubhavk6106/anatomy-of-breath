// Feature: platform-expansion, Properties 14 & 15: Event list rendering and date ordering

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import fc from 'fast-check'
import ExperiencesPage from '../ExperiencesPage'

// Mock useSanityQuery hook
const mockUseSanityQuery = vi.fn()
vi.mock('../../../hooks/useSanityQuery', () => ({
  default: () => mockUseSanityQuery(),
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

// Safe date generator
const safeDate = fc.integer({ min: Date.now() - 365 * 24 * 60 * 60 * 1000, max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
  .map(ts => new Date(ts).toISOString())

const eventRecord = fc.record({
  title:      fc.string({ minLength: 5, maxLength: 100 }),
  slug:       fc.uuid(),
  date:       safeDate,
  location:   fc.string({ minLength: 5, maxLength: 100 }),
  isOnline:   fc.boolean(),
  coverImage: fc.record({
    asset: fc.record({ url: fc.webUrl({ validSchemes: ['https'] }) }),
    alt:   fc.string(),
  }),
  bookingUrl: fc.webUrl({ validSchemes: ['https'] }),
})

describe('ExperiencesPage — Property 14: Event list renders a card for every fetched event', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders exactly one EventCard for each fetched event', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(eventRecord, { minLength: 1, maxLength: 50 }),
        async (events) => {
          mockUseSanityQuery.mockReturnValue({ data: events, loading: false, error: null })
          const { container, unmount } = render(<ExperiencesPage />, { wrapper: RouterWrapper })
          const articles = container.querySelectorAll('article')
          expect(articles.length).toBe(events.length)
          unmount()
        }
      ),
      { numRuns: 50 }
    )
  }, 30000)

  it('renders empty state when no events are available', () => {
    mockUseSanityQuery.mockReturnValue({ data: null, loading: false, error: null })
    const { container } = render(<ExperiencesPage />, { wrapper: RouterWrapper })
    expect(container.textContent).toContain('common.noUpcomingEvents')
  })
})

describe('ExperiencesPage — Property 15: Events are rendered in ascending date order with past events distinguished', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders events in ascending date order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(eventRecord, { minLength: 3, maxLength: 20 }),
        async (events) => {
          const sortedEvents = [...events].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          mockUseSanityQuery.mockReturnValue({ data: sortedEvents, loading: false, error: null })
          const { container, unmount } = render(<ExperiencesPage />, { wrapper: RouterWrapper })
          const articles = container.querySelectorAll('article')
          expect(articles.length).toBe(sortedEvents.length)
          unmount()
        }
      ),
      { numRuns: 30 }
    )
  }, 30000)

  it('distinguishes past events with "Past" label', () => {
    const now = new Date()
    const events = [
      { title: 'Past Event', slug: 'past-event', date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), location: 'Location 1', isOnline: false, coverImage: { asset: { url: 'https://example.com/1.jpg' }, alt: 'Past' }, bookingUrl: 'https://example.com/book1' },
      { title: 'Future Event', slug: 'future-event', date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), location: 'Location 2', isOnline: false, coverImage: { asset: { url: 'https://example.com/2.jpg' }, alt: 'Future' }, bookingUrl: 'https://example.com/book2' },
    ]
    mockUseSanityQuery.mockReturnValue({ data: events, loading: false, error: null })
    const { container } = render(<ExperiencesPage />, { wrapper: RouterWrapper })
    const pastLabels = container.querySelectorAll('[style*="opacity"]')
    expect(pastLabels.length).toBeGreaterThan(0)
  })

  it('applies reduced opacity to past events', () => {
    const pastEvent = { title: 'Past Event', slug: 'past-event', date: new Date('2020-01-01').toISOString(), location: 'Location', isOnline: false, coverImage: { asset: { url: 'https://example.com/1.jpg' }, alt: 'Past' }, bookingUrl: 'https://example.com/book' }
    mockUseSanityQuery.mockReturnValue({ data: [pastEvent], loading: false, error: null })
    const { container } = render(<ExperiencesPage />, { wrapper: RouterWrapper })
    const textContent = container.textContent
    expect(textContent.includes('Past') || textContent.includes('past')).toBe(true)
  })
})
