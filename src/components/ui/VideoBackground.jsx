import { useReducedMotion } from 'framer-motion'
import useIsMobile from '../../hooks/useIsMobile'

/**
 * VideoBackground component with adaptive rendering based on device capabilities
 * 
 * Skip conditions (renders static image instead of video):
 * - Reduced motion: prefers-reduced-motion (via Framer Motion's useReducedMotion)
 * - Slow connection: effectiveType in ['slow-2g', '2g']
 * 
 * Mobile devices get MP4 video for better compatibility
 * 
 * @param {Object} props
 * @param {string} props.src - WebM video source URL (desktop)
 * @param {string} props.srcMp4 - MP4 video source URL (desktop fallback & mobile)
 * @param {string} props.srcMobile - Optional mobile-optimized video URL
 * @param {string} props.poster - Poster image URL (fallback for skip conditions)
 * @param {Function} [props.onEnded] - Optional callback when video ends
 * 
 * Validates: Requirements 4.1, 4.2, 4.8, 11.1, 11.2, 11.5, 11.6
 */
export default function VideoBackground({ src, srcMp4, srcMobile, poster, onEnded }) {
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  
  // Check for slow connection
  const isSlowConnection = 
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)
  
  // Determine if we should skip video and show static image
  const shouldSkipVideo = prefersReducedMotion || isSlowConnection
  
  // Shared styles for cover behavior
  const coverStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  }
  
  if (shouldSkipVideo) {
    return (
      <img 
        src={poster} 
        alt="Background"
        style={coverStyles}
      />
    )
  }
  
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      onEnded={onEnded}
      style={coverStyles}
    >
      {isMobile ? (
        // Mobile: Use mobile-specific video if provided, otherwise use MP4
        <source src={srcMobile || srcMp4} type="video/mp4" />
      ) : (
        // Desktop: Use WebM with MP4 fallback
        <>
          <source src={src} type="video/webm" />
          <source src={srcMp4} type="video/mp4" />
        </>
      )}
      {/* Fallback image if video cannot be played */}
      <img 
        src={poster} 
        alt="Background"
        style={coverStyles}
      />
    </video>
  )
}
