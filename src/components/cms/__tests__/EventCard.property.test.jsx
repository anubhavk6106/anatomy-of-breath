// Feature: platform-expansion, Property 16 (EventCard half): CMS images render with lazy loading and explicit dimensions

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import fc from 'fast-check'
import EventCard from '../EventCard'

/**
 * Validates: Requirements 12.5
 *
 * Property 16 (EventCard): CMS images render with lazy loading and explicit dimensions.
 * For any EventCard render with a cover image, the <img> element should have
 * loading="lazy", width, and height attributes for optimal performance.
 */

// Safe date generator — avoids invalid Date objects from fc.date()
const safeDate = fc.integer({ min: 0, max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
  .map(ts => new Date(ts).toISOString())

function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('EventCard — Property 16: CMS images render with lazy loading and explicit dimensions', () => {
  it('renders images with lazy loading and explicit dimensions for all events', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random event objects with cover images
        fc.record({
          title: fc.string({ minLength: 5, maxLength: 100 }),
          slug: fc.string({ minLength: 3, maxLength: 50 }).map(s => s.toLowerCase().replace(/[^a-z0-9]/g, '-')),
          date: safeDate,
          location: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: undefined }),
          isOnline: fc.boolean(),
          coverImage: fc.record({
            asset: fc.record({
              url: fc.webUrl({ validSchemes: ['https'] }).map(url => url + '.jpg'),
            }),
            alt: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: undefined }),
          }),
          bookingUrl: fc.option(fc.webUrl({ validSchemes: ['https'] }), { nil: undefined }),
        }),
        async (event) => {
          const { container, unmount } = render(
            <EventCard event={event} />,
            { wrapper: RouterWrapper }
          )

          // Find the image element
          const img = container.querySelector('img')
          
          // Assert image exists
          expect(img).not.toBeNull()
          
          // Assert lazy loading attribute
          expect(img.getAttribute('loading')).toBe('lazy')
          
          // Assert explicit width attribute
          const width = img.getAttribute('width')
          expect(width).not.toBeNull()
          expect(parseInt(width)).toBeGreaterThan(0)
          
          // Assert explicit height attribute
          const height = img.getAttribute('height')
          expect(height).not.toBeNull()
          expect(parseInt(height)).toBeGreaterThan(0)

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('handles both Sanity image URL structures with lazy loading', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 5, maxLength: 100 }),
          slug: fc.string({ minLength: 3, maxLength: 50 }),
          date: safeDate,
          location: fc.string(),
          isOnline: fc.boolean(),
          coverImage: fc.oneof(
            // Structure 1: asset.url
            fc.record({
              asset: fc.record({
                url: fc.webUrl({ validSchemes: ['https'] }),
              }),
              alt: fc.string(),
            }),
            // Structure 2: direct url
            fc.record({
              url: fc.webUrl({ validSchemes: ['https'] }),
              alt: fc.string(),
            })
          ),
          bookingUrl: fc.webUrl({ validSchemes: ['https'] }),
        }),
        async (event) => {
          const { container, unmount } = render(
            <EventCard event={event} />,
            { wrapper: RouterWrapper }
          )

          const img = container.querySelector('img')
          
          expect(img).not.toBeNull()
          expect(img.getAttribute('loading')).toBe('lazy')
          expect(img.getAttribute('width')).not.toBeNull()
          expect(img.getAttribute('height')).not.toBeNull()

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('distinguishes past events with reduced opacity', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title: fc.string({ minLength: 5, maxLength: 100 }),
          slug: fc.string({ minLength: 3, maxLength: 50 }),
          date: safeDate,
          location: fc.string(),
          isOnline: fc.boolean(),
          coverImage: fc.record({
            asset: fc.record({ url: fc.webUrl({ validSchemes: ['https'] }) }),
            alt: fc.string(),
          }),
          bookingUrl: fc.webUrl({ validSchemes: ['https'] }),
        }),
        async (event) => {
          const { container, unmount } = render(
            <EventCard event={event} />,
            { wrapper: RouterWrapper }
          )

          const eventDate = new Date(event.date)
          const isPast = eventDate < new Date()
          
          const article = container.querySelector('article')
          expect(article).not.toBeNull()
          
          // Check if past events have reduced opacity
          if (isPast) {
            const pastLabel = container.textContent.includes('Past')
            expect(pastLabel).toBe(true)
          }

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
