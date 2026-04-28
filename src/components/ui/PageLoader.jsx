// PageLoader.jsx
// Minimal loading indicator for React.lazy Suspense fallback.
// Displays a pulsing sacred geometry pattern matching the Design_Language.
// Used in router/index.jsx as the fallback for all lazy-loaded route chunks.

import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Simplified sacred geometry — single circle with rotating inner pattern
const GEOMETRY_SVG = `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#FFD700" stroke-width="0.5">
      <circle cx="50" cy="50" r="30" opacity="0.3"/>
      <circle cx="50" cy="50" r="20" opacity="0.5"/>
      <circle cx="50" cy="50" r="10" opacity="0.7"/>
      <line x1="50" y1="20" x2="50" y2="80" opacity="0.4"/>
      <line x1="20" y1="50" x2="80" y2="50" opacity="0.4"/>
      <line x1="28.8" y1="28.8" x2="71.2" y2="71.2" opacity="0.4"/>
      <line x1="71.2" y1="28.8" x2="28.8" y2="71.2" opacity="0.4"/>
    </g>
  </svg>
`

/**
 * PageLoader component
 * 
 * Minimal loading indicator matching Design_Language:
 * - Obsidian (#0b0b0b) background
 * - Gold (#FFD700) pulsing geometry
 * - Smooth fade-in animation
 * 
 * Used as Suspense fallback in router for lazy-loaded pages.
 * 
 * Validates: Requirements 12.1
 */
export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0b',
        zIndex: 9999,
      }}
    >
      {/* Pulsing sacred geometry */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: EASE,
        }}
        style={{
          width: '80px',
          height: '80px',
        }}
        dangerouslySetInnerHTML={{ __html: GEOMETRY_SVG }}
      />
    </motion.div>
  )
}
