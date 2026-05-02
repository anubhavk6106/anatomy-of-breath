// PageLoader.test.jsx
// Unit tests for the PageLoader component

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import PageLoader from '../PageLoader'

describe('PageLoader', () => {
  it('renders the loading indicator', () => {
    const { container } = render(<PageLoader />)
    
    // Check for the main container
    const loader = container.firstChild
    expect(loader).toBeTruthy()
  })

  it('renders sacred geometry SVG', () => {
    const { container } = render(<PageLoader />)
    
    // Check for SVG element in the DOM
    const svgContainer = container.querySelector('div[style*="width: 80px"]')
    
    expect(svgContainer).toBeTruthy()
    expect(svgContainer.innerHTML).toContain('<svg')
    expect(svgContainer.innerHTML).toContain('circle')
    expect(svgContainer.innerHTML).toContain('line')
  })

  it('applies Design Language styling - obsidian background', () => {
    const { container } = render(<PageLoader />)
    
    const loader = container.firstChild
    
    // Check obsidian background (#0b0b0b)
    expect(loader.style.background).toBe('rgb(11, 11, 11)')
  })

  it('applies Design Language styling - gold geometry', () => {
    const { container } = render(<PageLoader />)
    
    const svgContainer = container.querySelector('div[style*="width: 80px"]')
    
    // Check that SVG contains gold stroke color (#D4AF37)
    expect(svgContainer.innerHTML).toContain('#D4AF37')
  })

  it('renders as fullscreen overlay', () => {
    const { container } = render(<PageLoader />)
    
    const loader = container.firstChild
    
    expect(loader.style.position).toBe('fixed')
    expect(loader.style.top).toBe('0px')
    expect(loader.style.left).toBe('0px')
    expect(loader.style.width).toBe('100vw')
    expect(loader.style.height).toBe('100vh')
  })

  it('centers content with flexbox', () => {
    const { container } = render(<PageLoader />)
    
    const loader = container.firstChild
    
    expect(loader.style.display).toBe('flex')
    expect(loader.style.alignItems).toBe('center')
    expect(loader.style.justifyContent).toBe('center')
  })

  it('has high z-index for overlay behavior', () => {
    const { container } = render(<PageLoader />)
    
    const loader = container.firstChild
    
    expect(loader.style.zIndex).toBe('9999')
  })

  it('geometry container has correct dimensions', () => {
    const { container } = render(<PageLoader />)
    
    const svgContainer = container.querySelector('div[style*="width: 80px"]')
    
    expect(svgContainer.style.width).toBe('80px')
    expect(svgContainer.style.height).toBe('80px')
  })
})
