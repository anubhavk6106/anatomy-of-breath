// Feature: platform-expansion, Properties 11 & 12: Post list rendering and category filtering

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import fc from 'fast-check'
import MedicinaPage from '../MedicinaPage'

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

// Unique slug generator — avoids React key collisions
const uniqueSlug = fc.uuid()

const postRecord = fc.record({
  title:       fc.string({ minLength: 5, maxLength: 100 }),
  slug:        uniqueSlug,
  coverImage:  fc.record({
    asset: fc.record({ url: fc.webUrl({ validSchemes: ['https'] }) }),
    alt:   fc.string(),
  }),
  excerpt:     fc.string({ minLength: 10, maxLength: 200 }),
  category:    fc.constantFrom('Voice Medicine', 'Breathwork', 'Sound Healing'),
  publishedAt: fc.integer({ min: Date.now() - 365 * 24 * 60 * 60 * 1000, max: Date.now() })
               .map(ts => new Date(ts).toISOString()),
})

describe('MedicinaPage — Property 11: Post list renders a card for every fetched post', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders exactly one PostCard for each fetched post', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(postRecord, { minLength: 1, maxLength: 50 }),
        async (posts) => {
          mockUseSanityQuery.mockReturnValue({ data: posts, loading: false, error: null })
          const { container, unmount } = render(<MedicinaPage />, { wrapper: RouterWrapper })
          const articles = container.querySelectorAll('article')
          expect(articles.length).toBe(posts.length)
          unmount()
        }
      ),
      { numRuns: 50 }
    )
  }, 30000)

  it('renders empty state when no posts are available', () => {
    mockUseSanityQuery.mockReturnValue({ data: null, loading: false, error: null })
    const { container } = render(<MedicinaPage />, { wrapper: RouterWrapper })
    expect(container.textContent).toContain('common.noPosts')
  })
})

describe('MedicinaPage — Property 12: Category filter shows only matching posts', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('filters posts by selected category', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(postRecord, { minLength: 5, maxLength: 20 }),
        async (posts) => {
          mockUseSanityQuery.mockReturnValue({ data: posts, loading: false, error: null })
          const { container, unmount } = render(<MedicinaPage />, { wrapper: RouterWrapper })
          const categories = [...new Set(posts.map(p => p.category))]
          for (const category of categories) {
            const buttons = container.querySelectorAll('button')
            const categoryButton = Array.from(buttons).find(btn => btn.textContent.includes(category))
            if (categoryButton) {
              fireEvent.click(categoryButton)
              const articles = container.querySelectorAll('article')
              const expectedCount = posts.filter(p => p.category === category).length
              expect(articles.length).toBe(expectedCount)
            }
          }
          unmount()
        }
      ),
      { numRuns: 30 }
    )
  }, 30000)

  it('shows all posts when "all" filter is selected', async () => {
    const posts = [
      { title: 'Post 1', slug: 'post-1', coverImage: { asset: { url: 'https://example.com/1.jpg' }, alt: 'Post 1' }, excerpt: 'Excerpt 1', category: 'Voice Medicine', publishedAt: new Date().toISOString() },
      { title: 'Post 2', slug: 'post-2', coverImage: { asset: { url: 'https://example.com/2.jpg' }, alt: 'Post 2' }, excerpt: 'Excerpt 2', category: 'Breathwork', publishedAt: new Date().toISOString() },
    ]
    mockUseSanityQuery.mockReturnValue({ data: posts, loading: false, error: null })
    const { container } = render(<MedicinaPage />, { wrapper: RouterWrapper })
    const buttons = container.querySelectorAll('button')
    const allButton = Array.from(buttons).find(btn =>
      btn.textContent.toLowerCase().includes('all') || btn.textContent.toLowerCase().includes('todos')
    )
    if (allButton) {
      fireEvent.click(allButton)
      const articles = container.querySelectorAll('article')
      expect(articles.length).toBe(posts.length)
    }
  })
})
