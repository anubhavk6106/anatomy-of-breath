// ComingSoon.test.jsx
// Unit tests for the ComingSoon component

import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import ComingSoon from '../ComingSoon'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'common.comingSoon': 'Coming Soon',
      }
      return translations[key] || key
    },
  }),
}))

describe('ComingSoon', () => {
  it('renders the coming soon message', () => {
    const { container } = render(<ComingSoon />)
    
    // Check for the heading text
    const heading = container.querySelector('h2')
    expect(heading).toBeTruthy()
    expect(heading.textContent).toBe('Coming Soon')
  })

  it('renders sacred geometry SVG background', () => {
    const { container } = render(<ComingSoon />)
    
    // Check for SVG element in the DOM
    const svgContainer = container.querySelector('div[style*="position: absolute"]')
    
    expect(svgContainer).toBeTruthy()
    expect(svgContainer.innerHTML).toContain('<svg')
    expect(svgContainer.innerHTML).toContain('circle')
  })

  it('applies Design Language styling - Cormorant Garamond italic', () => {
    const { container } = render(<ComingSoon />)
    
    const heading = container.querySelector('h2')
    
    // Check Cormorant Garamond italic font
    expect(heading.style.fontFamily).toContain('Cormorant Garamond')
    expect(heading.style.fontStyle).toBe('italic')
  })

  it('applies Design Language styling - gold color', () => {
    const { container } = render(<ComingSoon />)
    
    const heading = container.querySelector('h2')
    
    // Check gold color (#FFD700)
    expect(heading.style.color).toBe('rgb(255, 215, 0)')
  })

  it('renders decorative line element', () => {
    const { container } = render(<ComingSoon />)
    
    // Find the decorative line by its distinctive gradient style
    const decorativeLine = container.querySelector('div[style*="linear-gradient"]')
    
    expect(decorativeLine).toBeTruthy()
    expect(decorativeLine.style.height).toBe('1px')
  })

  it('centers content with flexbox', () => {
    const { container } = render(<ComingSoon />)
    
    const wrapper = container.firstChild
    
    expect(wrapper.style.display).toBe('flex')
    expect(wrapper.style.alignItems).toBe('center')
    expect(wrapper.style.justifyContent).toBe('center')
  })
})
