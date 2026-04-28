// Feature: platform-expansion, Property 9: VideoBackground skips video for all skip conditions

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import fc from 'fast-check'
import VideoBackground from '../VideoBackground'

/**
 * Validates: Requirements 4.2, 4.8, 11.6
 *
 * Property 9: VideoBackground skips video for specific skip conditions.
 * For conditions that should suppress video (prefers-reduced-motion: reduce,
 * or network effectiveType of 'slow-2g' or '2g'), the VideoBackground component
 * should render an <img> element rather than a <video> element.
 * Mobile devices now show video with MP4 format for better compatibility.
 */

// Mock framer-motion's useReducedMotion hook
const mockUseReducedMotion = vi.fn()
vi.mock('framer-motion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}))

// Mock useIsMobile hook
const mockUseIsMobile = vi.fn()
vi.mock('../../../hooks/useIsMobile', () => ({
  default: () => mockUseIsMobile(),
}))

describe('VideoBackground — Property 9: skips video for all skip conditions', () => {
  const defaultProps = {
    src: 'test-video.webm',
    srcMp4: 'test-video.mp4',
    poster: 'test-poster.jpg',
    onEnded: vi.fn(),
  }

  beforeEach(() => {
    // Reset mocks before each test
    mockUseReducedMotion.mockReturnValue(false)
    mockUseIsMobile.mockReturnValue(false)
    
    // Mock navigator.connection as undefined by default (adequate connection)
    Object.defineProperty(global.navigator, 'connection', {
      writable: true,
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders <img> instead of <video> when any skip condition is true', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate combinations of skip conditions
        fc.record({
          isMobile: fc.boolean(),
          prefersReducedMotion: fc.boolean(),
          effectiveType: fc.constantFrom('4g', 'slow-2g', '2g', '3g', undefined),
        }),
        async ({ isMobile, prefersReducedMotion, effectiveType }) => {
          // Set up mocks based on generated values
          mockUseIsMobile.mockReturnValue(isMobile)
          mockUseReducedMotion.mockReturnValue(prefersReducedMotion)
          
          // Set up navigator.connection mock
          if (effectiveType !== undefined) {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: { effectiveType },
            })
          } else {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: undefined,
            })
          }

          // Determine if video should be skipped (mobile no longer skips video)
          const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g'
          const shouldSkipVideo = prefersReducedMotion || isSlowConnection

          // Render component
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)

          if (shouldSkipVideo) {
            // Should render <img> instead of <video>
            const img = container.querySelector('img')
            const video = container.querySelector('video')
            
            expect(img).not.toBeNull()
            expect(img.src).toContain('test-poster.jpg')
            expect(video).toBeNull()
          } else {
            // Should render <video> with sources
            const video = container.querySelector('video')
            
            expect(video).not.toBeNull()
            
            // On mobile, should have MP4 source only
            if (isMobile) {
              const mp4Source = video.querySelector('source[type="video/mp4"]')
              expect(mp4Source).not.toBeNull()
            } else {
              // On desktop, should have both WebM and MP4
              expect(video.querySelector('source[type="video/webm"]')).not.toBeNull()
              expect(video.querySelector('source[type="video/mp4"]')).not.toBeNull()
            }
          }

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders <video> with MP4 source when mobile width < 768px', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(true), // isMobile = true
        async (isMobile) => {
          mockUseIsMobile.mockReturnValue(isMobile)
          mockUseReducedMotion.mockReturnValue(false)
          
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)
          
          const video = container.querySelector('video')
          const mp4Source = video?.querySelector('source[type="video/mp4"]')
          
          // Mobile should now show video with MP4 format
          expect(video).not.toBeNull()
          expect(mp4Source).not.toBeNull()
          expect(mp4Source.src).toContain('test-video.mp4')
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders <img> when prefers-reduced-motion is true', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(true), // prefersReducedMotion = true
        async (prefersReducedMotion) => {
          mockUseIsMobile.mockReturnValue(false)
          mockUseReducedMotion.mockReturnValue(prefersReducedMotion)
          
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)
          
          const img = container.querySelector('img')
          const video = container.querySelector('video')
          
          expect(img).not.toBeNull()
          expect(img.src).toContain('test-poster.jpg')
          expect(video).toBeNull()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders <img> when effectiveType is slow-2g or 2g', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('slow-2g', '2g'),
        async (effectiveType) => {
          mockUseIsMobile.mockReturnValue(false)
          mockUseReducedMotion.mockReturnValue(false)
          
          Object.defineProperty(global.navigator, 'connection', {
            writable: true,
            configurable: true,
            value: { effectiveType },
          })
          
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)
          
          const img = container.querySelector('img')
          const video = container.querySelector('video')
          
          expect(img).not.toBeNull()
          expect(img.src).toContain('test-poster.jpg')
          expect(video).toBeNull()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('renders <video> when no skip conditions are present', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('4g', '3g', undefined),
        async (effectiveType) => {
          mockUseIsMobile.mockReturnValue(false)
          mockUseReducedMotion.mockReturnValue(false)
          
          if (effectiveType !== undefined) {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: { effectiveType },
            })
          } else {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: undefined,
            })
          }
          
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)
          
          const video = container.querySelector('video')
          
          expect(video).not.toBeNull()
          expect(video.querySelector('source[type="video/webm"]')).not.toBeNull()
          expect(video.querySelector('source[type="video/mp4"]')).not.toBeNull()
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Validates: Requirements 11.5
 *
 * Property 10: VideoBackground includes appropriate sources for device type.
 * Desktop devices get WebM and MP4 sources. Mobile devices get MP4 source only.
 * For any VideoBackground render where video is not suppressed (no reduced motion,
 * adequate connection), the <video> element should contain appropriate sources.
 */
describe('VideoBackground — Property 10: includes appropriate sources for device type', () => {
  const defaultProps = {
    src: 'test-video.webm',
    srcMp4: 'test-video.mp4',
    poster: 'test-poster.jpg',
    onEnded: vi.fn(),
  }

  beforeEach(() => {
    // Reset mocks before each test
    mockUseReducedMotion.mockReturnValue(false)
    mockUseIsMobile.mockReturnValue(false)
    
    // Mock navigator.connection as undefined by default (adequate connection)
    Object.defineProperty(global.navigator, 'connection', {
      writable: true,
      configurable: true,
      value: undefined,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('includes both WebM and MP4 source elements for desktop non-skip conditions', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid non-skip VideoBackground props for DESKTOP
        fc.record({
          isMobile: fc.constant(false), // Desktop only
          prefersReducedMotion: fc.constant(false), // Must be false to not skip video
          effectiveType: fc.constantFrom('4g', '3g', undefined), // Good connections only
          src: fc.webUrl({ validSchemes: ['https'] }).map(url => url + '.webm'),
          srcMp4: fc.webUrl({ validSchemes: ['https'] }).map(url => url + '.mp4'),
          poster: fc.webUrl({ validSchemes: ['https'] }).map(url => url + '.jpg'),
        }),
        async ({ isMobile, prefersReducedMotion, effectiveType, src, srcMp4, poster }) => {
          // Set up mocks for non-skip conditions
          mockUseIsMobile.mockReturnValue(isMobile)
          mockUseReducedMotion.mockReturnValue(prefersReducedMotion)
          
          // Set up navigator.connection mock
          if (effectiveType !== undefined) {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: { effectiveType },
            })
          } else {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: undefined,
            })
          }

          // Render component with generated props
          const { container, unmount } = render(
            <VideoBackground 
              src={src} 
              srcMp4={srcMp4} 
              poster={poster} 
              onEnded={vi.fn()} 
            />
          )

          // Assert video element is rendered (not skipped)
          const video = container.querySelector('video')
          expect(video).not.toBeNull()

          // Desktop: Assert both source elements are present with correct types
          const webmSource = video.querySelector('source[type="video/webm"]')
          const mp4Source = video.querySelector('source[type="video/mp4"]')
          
          expect(webmSource).not.toBeNull()
          expect(mp4Source).not.toBeNull()
          
          // Assert sources have correct src attributes
          expect(webmSource.src).toContain('.webm')
          expect(mp4Source.src).toContain('.mp4')

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('includes WebM source before MP4 source (format priority)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('4g', '3g', undefined),
        async (effectiveType) => {
          mockUseIsMobile.mockReturnValue(false)
          mockUseReducedMotion.mockReturnValue(false)
          
          if (effectiveType !== undefined) {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: { effectiveType },
            })
          } else {
            Object.defineProperty(global.navigator, 'connection', {
              writable: true,
              configurable: true,
              value: undefined,
            })
          }
          
          const { container, unmount } = render(<VideoBackground {...defaultProps} />)
          
          const video = container.querySelector('video')
          const sources = video.querySelectorAll('source')
          
          // Should have at least 2 sources
          expect(sources.length).toBeGreaterThanOrEqual(2)
          
          // WebM should come before MP4 (browser tries formats in order)
          const webmIndex = Array.from(sources).findIndex(s => s.type === 'video/webm')
          const mp4Index = Array.from(sources).findIndex(s => s.type === 'video/mp4')
          
          expect(webmIndex).toBeGreaterThanOrEqual(0)
          expect(mp4Index).toBeGreaterThanOrEqual(0)
          expect(webmIndex).toBeLessThan(mp4Index)
          
          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })
})
