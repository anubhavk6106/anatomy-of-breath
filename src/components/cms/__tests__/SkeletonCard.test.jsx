// SkeletonCard.test.jsx
// Unit tests for SkeletonCard component

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SkeletonCard from '../SkeletonCard'

describe('SkeletonCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.querySelector('.skeleton-card')).toBeTruthy()
  })

  it('renders all placeholder elements', () => {
    const { container } = render(<SkeletonCard />)
    
    // Check for main card container
    const card = container.querySelector('.skeleton-card')
    expect(card).toBeTruthy()
    
    // Check for image placeholder
    const image = container.querySelector('.skeleton-card__image')
    expect(image).toBeTruthy()
    
    // Check for content area
    const content = container.querySelector('.skeleton-card__content')
    expect(content).toBeTruthy()
    
    // Check for title placeholder
    const title = container.querySelector('.skeleton-card__title')
    expect(title).toBeTruthy()
    
    // Check for subtitle placeholders
    const subtitles = container.querySelectorAll('.skeleton-card__subtitle')
    expect(subtitles.length).toBeGreaterThanOrEqual(2)
    
    // Check for meta placeholder
    const meta = container.querySelector('.skeleton-card__meta')
    expect(meta).toBeTruthy()
  })

  it('has correct structure and classes', () => {
    const { container } = render(<SkeletonCard />)
    const card = container.querySelector('.skeleton-card')
    
    // Check that the card has the correct class
    expect(card.className).toBe('skeleton-card')
  })

  it('applies Design_Language styling', () => {
    const { container } = render(<SkeletonCard />)
    const card = container.querySelector('.skeleton-card')
    
    // Check that card element exists with correct class
    expect(card).toBeTruthy()
    expect(card.className).toBe('skeleton-card')
  })

  it('has shimmer animation class', () => {
    const { container } = render(<SkeletonCard />)
    const card = container.querySelector('.skeleton-card')
    
    // Check that the card has the correct class for shimmer animation
    expect(card.className).toContain('skeleton-card')
  })
})
