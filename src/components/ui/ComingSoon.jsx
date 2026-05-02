// ComingSoon.jsx
// Reusable "Coming Soon" / "Próximamente" component with sacred geometry background.
// Used in empty states for CMS-driven sections (Medicina, Experiences) and placeholder pages.

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Sacred geometry SVG — Flower of Life pattern (reused from Gallery.jsx GEOMETRY library)
const GEOMETRY_SVG = `
  <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.9">
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

export default function ComingSoon() {
  const { t } = useTranslation()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sacred geometry background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
        animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
        transition={{ duration: 1.8, ease: EASE }}
        style={{
          position: 'absolute',
          width: 'min(400px, 80vw)',
          height: 'min(480px, 80vw)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        dangerouslySetInnerHTML={{ __html: GEOMETRY_SVG }}
      />

      {/* Coming Soon text */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {t('common.comingSoon')}
      </motion.h2>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  )
}
