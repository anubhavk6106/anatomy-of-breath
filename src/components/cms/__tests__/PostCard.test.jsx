// PostCard.test.jsx
// Unit tests for PostCard component

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PostCard from '../PostCard'

// Wrapper for components that use React Router
function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('PostCard', () => {
  const mockPost = {
    title: 'The Voice as Medicine',
    slug: 'voice-as-medicine',
    coverImage: {
      asset: { url: 'https://example.com/image.jpg' },
      alt: 'Voice medicine illustration',
    },
    excerpt: 'Exploring the healing power of voice and sound in traditional medicine practices.',
    category: 'Voice Medicine',
    publishedAt: '2024-01-15T10:00:00Z',
  }

  it('renders all required post fields', () => {
    const { container } = render(<PostCard post={mockPost} />, { wrapper: RouterWrapper })

    // Title should be present
    expect(container.textContent).toContain('The Voice as Medicine')

    // Category should be present
    expect(container.textContent).toContain('Voice Medicine')

    // Excerpt should be present
    expect(container.textContent).toContain('Exploring the healing power of voice and sound')

    // Read more indicator should be present
    expect(container.textContent).toContain('Leer más')
  })

  it('renders cover image with lazy loading and explicit dimensions', () => {
    const { container } = render(<PostCard post={mockPost} />, { wrapper: RouterWrapper })

    const img = container.querySelector('img[alt="Voice medicine illustration"]')
    expect(img).toBeTruthy()
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('width')).toBe('400')
    expect(img.getAttribute('height')).toBe('533')
    expect(img.getAttribute('src')).toBe('https://example.com/image.jpg')
  })

  it('formats publishedAt date correctly', () => {
    const { container } = render(<PostCard post={mockPost} />, { wrapper: RouterWrapper })

    // Date should be formatted in Spanish locale
    // The exact format depends on the browser locale, but it should contain the year
    expect(container.textContent).toContain('2024')
  })

  it('links to the correct post detail page', () => {
    const { container } = render(<PostCard post={mockPost} />, { wrapper: RouterWrapper })

    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('/pillars/medicina-de-la-voz/voice-as-medicine')
  })

  it('handles missing optional fields gracefully', () => {
    const minimalPost = {
      title: 'Minimal Post',
      slug: 'minimal-post',
      coverImage: null,
      excerpt: null,
      category: null,
      publishedAt: null,
    }

    const { container } = render(<PostCard post={minimalPost} />, { wrapper: RouterWrapper })

    // Title should still render
    expect(container.textContent).toContain('Minimal Post')

    // Read more should still render
    expect(container.textContent).toContain('Leer más')
  })

  it('uses fallback image URL structure when asset.url is not present', () => {
    const postWithDirectUrl = {
      ...mockPost,
      coverImage: {
        url: 'https://example.com/direct-image.jpg',
        alt: 'Direct URL image',
      },
    }

    const { container } = render(<PostCard post={postWithDirectUrl} />, { wrapper: RouterWrapper })

    const img = container.querySelector('img[alt="Direct URL image"]')
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe('https://example.com/direct-image.jpg')
  })

  it('uses title as alt text when coverImage.alt is missing', () => {
    const postWithoutAlt = {
      ...mockPost,
      coverImage: {
        asset: { url: 'https://example.com/image.jpg' },
      },
    }

    const { container } = render(<PostCard post={postWithoutAlt} />, { wrapper: RouterWrapper })

    const img = container.querySelector('img[alt="The Voice as Medicine"]')
    expect(img).toBeTruthy()
  })

  it('is wrapped with React.memo', () => {
    // Verify that the default export is a memoized component
    expect(PostCard.$$typeof).toBeDefined()
  })
})
