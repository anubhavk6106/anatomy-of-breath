// SomaFeatureBlock.jsx
// Dynamic CMS-driven feature block for Soma page
// Renders nothing (graceful omission) when feature is null/undefined

import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94]

/**
 * SomaFeatureBlock component
 * 
 * Displays a dynamic CMS-driven feature block with Framer Motion fade-in animation.
 * Returns null when feature is not available (graceful omission on fetch error).
 * 
 * @param {Object} props
 * @param {Object|null} props.feature - Feature object { title, description } or null
 * 
 * Validates: Requirements 7.3
 */
export default function SomaFeatureBlock({ feature }) {
  // Graceful omission when feature is null/undefined
  if (!feature || !feature.title) {
    return null
  }

  const { title, description } = feature

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{
        maxWidth: '900px',
        margin: '4rem auto',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, rgba(255,215,0,0.03) 0%, rgba(255,215,0,0.01) 100%)',
        border: '1px solid rgba(255,215,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle at top right, rgba(255,215,0,0.08), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Sacred geometry decoration */}
      <svg
        viewBox="0 0 100 100"
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-20px',
          width: '140px',
          height: '140px',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      >
        <circle cx="50" cy="50" r="45" stroke="#FFD700" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="#FFD700" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="15" stroke="#FFD700" strokeWidth="0.5" fill="none" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#FFD700" strokeWidth="0.3" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="#FFD700" strokeWidth="0.3" />
      </svg>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '9px',
            letterSpacing: '0.4em',
            color: 'rgba(255,215,0,0.6)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          Destacado
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#FFD700',
            lineHeight: 1.3,
            marginBottom: '1.5rem',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              fontWeight: 200,
              color: 'rgba(245,240,232,0.8)',
              lineHeight: 1.8,
              letterSpacing: '0.02em',
              maxWidth: '700px',
            }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.3), transparent)',
          transformOrigin: 'left',
        }}
      />
    </motion.section>
  )
}
