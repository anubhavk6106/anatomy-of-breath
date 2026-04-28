// NotFoundPage.jsx
// 404 error page with sacred geometry and link back to Portal

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Sacred geometry SVG
const GEOMETRY_SVG = `
  <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#FFD700" stroke-width="0.6" opacity="0.9">
      <circle cx="100" cy="120" r="40"/>
      <circle cx="100" cy="80"  r="40"/>
      <circle cx="134.6" cy="100" r="40"/>
      <circle cx="134.6" cy="140" r="40"/>
      <circle cx="100" cy="160" r="40"/>
      <circle cx="65.4" cy="140" r="40"/>
      <circle cx="65.4" cy="100" r="40"/>
      <circle cx="100" cy="120" r="70" opacity="0.4"/>
    </g>
  </svg>
`

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: '#0b0b0b',
      }}
    >
      {/* Sacred geometry background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{
          position: 'absolute',
          width: 'min(500px, 90vw)',
          height: 'min(600px, 90vw)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        dangerouslySetInnerHTML={{ __html: GEOMETRY_SVG }}
      />

      {/* 404 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#f5f0e8',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        This path does not exist
      </motion.p>

      {/* Back to Portal link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: '#FFD700',
            textDecoration: 'none',
            textTransform: 'uppercase',
            padding: '0.9rem 2.5rem',
            border: '1px solid rgba(255,215,0,0.5)',
            display: 'inline-block',
            transition: 'background 0.3s, border-color 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,215,0,0.06)'
            e.currentTarget.style.borderColor = '#FFD700'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'
          }}
        >
          Return to Portal
        </Link>
      </motion.div>
    </div>
  )
}
