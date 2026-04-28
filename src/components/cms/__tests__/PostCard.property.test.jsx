// Feature: platform-expansion, Property 16 (PostCard half): CMS images render with lazy loading and explicit dimensions

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import fc from 'fast-check'
import PostCard from '../PostCard'

/**
 * Validates: Requirements 12.5
 *
 * Property 16 (PostCard): CMS images render with lazy loading and explicit dimensions.
 * For any PostCard render with a cover image, the <img> element should have
 * loading="lazy", width, and height attributes for optimal performance.
 */

// Safe date generator — avoids invalid Date objects from fc.date()
const safeDate = fc.integer({ min: 0, max: Date.now() })
  .map(ts => new Date(ts).toISOString())

function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('PostCard — Property 16: CMS images render with lazy loading and explicit dimensions', () => {
  it('renders images with lazy loading and explicit dimensions for all posts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          title:      fc.string({ minLength: 5, maxLength: 100 }),
          slug:       fc.uuid(),
          coverImage: fc.record({
            asset: fc.record({
              url: fc.webUrl({ validSchemes: ['https'] }).map(url => url + '.jpg'),
            }),
            alt: fc.option(fc.string({ minLength: 5, maxLength: 100 }), { nil: undefined }),
          }),
          excerpt:     fc.option(fc.string({ minLength: 10, maxLength: 200 }), { nil: undefined }),
          category:    fc.option(fc.constantFrom('Voice Medicine', 'Breathwork', 'Sound Healing'), { nil: undefined }),
          publishedAt: safeDate,
        }),
        async (post) => {
          const { container, unmount } = render(
            <PostCard post={post} />,
            { wrapper: RouterWrapper }
          )

          const img = container.querySelector('img')

          expect(img).not.toBeNull()
          expect(img.getAttribute('loading')).toBe('lazy')

          const width = img.getAttribute('width')
          expect(width).not.toBeNull()
          expect(parseInt(width)).toBeGreaterThan(0)

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
          title:      fc.string({ minLength: 5, maxLength: 100 }),
          slug:       fc.uuid(),
          coverImage: fc.oneof(
            // Structure 1: asset.url
            fc.record({
              asset: fc.record({ url: fc.webUrl({ validSchemes: ['https'] }) }),
              alt:   fc.string(),
            }),
            // Structure 2: direct url
            fc.record({
              url: fc.webUrl({ validSchemes: ['https'] }),
              alt: fc.string(),
            })
          ),
          excerpt:     fc.string(),
          category:    fc.string(),
          publishedAt: safeDate,
        }),
        async (post) => {
          const { container, unmount } = render(
            <PostCard post={post} />,
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
})
