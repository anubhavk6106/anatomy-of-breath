// InteractiveCard.jsx
// Cinematic anatomy → sacred geometry transformation on hover.
//
// Layer architecture (bottom → top):
//   [1] Anatomy layer     — always visible, fades + blurs out on hover
//   [2] Geometry layer    — SVG path draw-on effect, fades in on hover
//   [3] Aura glow         — radial gold pulse, breathes while hovered
//   [4] Particle field    — 12 floating gold dust particles on hover
//   [5] Shimmer sweep     — single diagonal light pass on hover entry
//   [6] Border + corners  — gold frame traces in
//   [7] Info footer       — slides up with title + subtitle
//   [8] Mouse tilt        — entire card tilts toward cursor (3D perspective)

import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const EASE   = [0.25, 0.46, 0.45, 0.94]
const EASE_OUT = [0.0, 0.0, 0.2, 1]

// ── Floating dust particle ────────────────────────────────────
function Particle({ i }) {
  const angle  = (i / 12) * 360
  const radius = 30 + (i % 4) * 18
  const x = Math.cos((angle * Math.PI) / 180) * radius
  const y = Math.sin((angle * Math.PI) / 180) * radius
  const size = 1.5 + (i % 3) * 1.2
  const delay = i * 0.06

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: size, height: size,
        borderRadius: '50%',
        background: '#D4AF37',
        pointerEvents: 'none',
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, x * 0.6, x, x * 1.1, x],
        y: [0, y * 0.6, y, y * 0.9, y],
        opacity: [0, 0.9, 0.7, 0.5, 0.3],
        scale:   [0, 1.4, 1,   0.8,  0.6],
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: EASE_OUT,
        times: [0, 0.2, 0.5, 0.75, 1],
        repeat: Infinity,
        repeatType: 'mirror',
        repeatDelay: 0.3,
      }}
    />
  )
}

// ── SVG geometry with path draw-on ───────────────────────────
function GeometryLayer({ svg, hovered }) {
  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mixBlendMode: 'screen',
      }}
      initial={false}
      animate={{ opacity: hovered ? 1 : 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Slow dreamlike rotation while hovered */}
      <motion.div
        style={{ width: '100%', height: '100%' }}
        animate={hovered
          ? { rotate: 360, transition: { duration: 40, ease: 'linear', repeat: Infinity } }
          : { rotate: 0,   transition: { duration: 1.5, ease: EASE } }
        }
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </motion.div>
  )
}

// ── Anatomy layer — blurs and fades on hover ──────────────────
function AnatomyLayer({ svg, baseColor, hovered }) {
  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: baseColor,
      }}
      animate={{
        scale:  hovered ? 1.07 : 1,
      }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <motion.div
        style={{ width: '80%', height: '80%' }}
        animate={{
          opacity: hovered ? 0.18 : 0.5,
          filter:  hovered ? 'blur(3px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.8, ease: EASE }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </motion.div>
  )
}

// ── Pulsing aura glow ─────────────────────────────────────────
function AuraGlow({ hovered, overlayGradient }) {
  return (
    <motion.div
      style={{
        position: 'absolute', inset: 0,
        background: overlayGradient,
        pointerEvents: 'none',
        zIndex: 3,
      }}
      animate={hovered
        ? { opacity: [0.6, 1, 0.7], scale: [1, 1.04, 1],
            transition: { duration: 3, ease: 'easeInOut', repeat: Infinity } }
        : { opacity: 0, scale: 1,
            transition: { duration: 0.6, ease: EASE } }
      }
    />
  )
}

// ── InteractiveCard ───────────────────────────────────────────
export default function InteractiveCard({
  number, title, subtitle,
  baseColor, overlayGradient,
  anatomySVG, geometrySVG,
  onClick,
}) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)
  const { t } = useTranslation()

  // On touch devices always show the info footer (no hover available)
  const isTouch = typeof window !== 'undefined'
    && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  const showInfo = hovered || isTouch

  // Mouse-tracked 3D tilt
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 })

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)   // -1 → 1
    const dy = (e.clientY - cy) / (rect.height / 2)   // -1 → 1
    rotateY.set(dx * 10)
    rotateX.set(-dy * 10)
  }, [rotateX, rotateY])

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    setHovered(false)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={cardRef}
      style={{
        aspectRatio: '3 / 4',
        cursor: 'crosshair',
        position: 'relative',
        overflow: 'hidden',
        perspective: 800,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setHovered(v => !v)}
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.4, ease: EASE }}
    >

      {/* ── [1] Anatomy base ─────────────────────────── */}
      <AnatomyLayer svg={anatomySVG} baseColor={baseColor} hovered={hovered} />

      {/* ── [2] Sacred geometry draw-on ──────────────── */}
      <GeometryLayer svg={geometrySVG} hovered={hovered} />

      {/* ── [3] Aura glow ────────────────────────────── */}
      <AuraGlow hovered={hovered} overlayGradient={overlayGradient} />

      {/* ── [4] Particle field ───────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {Array.from({ length: 12 }, (_, i) => <Particle key={i} i={i} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── [5] Shimmer sweep ────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="shimmer"
            style={{
              position: 'absolute', inset: 0, zIndex: 5,
              background: 'linear-gradient(110deg, transparent 25%, rgba(212,175,55,0.1) 50%, transparent 75%)',
              pointerEvents: 'none',
            }}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '160%',  opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* ── [6] Gold border + corner dots ────────────── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, zIndex: 6,
          border: '1px solid rgba(212,175,55,0.6)',
          boxShadow: 'inset 0 0 40px rgba(212,175,55,0.06), 0 0 30px rgba(212,175,55,0.15)',
          pointerEvents: 'none',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />

      {/* Corner L-brackets */}
      {[
        { top: 0,    left: 0,    borderTop: '1px solid #D4AF37', borderLeft:  '1px solid #D4AF37' },
        { top: 0,    right: 0,   borderTop: '1px solid #D4AF37', borderRight: '1px solid #D4AF37' },
        { bottom: 0, left: 0,    borderBottom: '1px solid #D4AF37', borderLeft:  '1px solid #D4AF37' },
        { bottom: 0, right: 0,   borderBottom: '1px solid #D4AF37', borderRight: '1px solid #D4AF37' },
      ].map((style, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', width: '18px', height: '18px',
            zIndex: 7, pointerEvents: 'none', ...style,
          }}
          animate={{
            opacity: hovered ? 1 : 0,
            scale:   hovered ? 1 : 0.4,
          }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
        />
      ))}

      {/* ── Card number ───────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute', top: '1rem', left: '1.1rem', zIndex: 8,
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '10px', letterSpacing: '0.25em', color: '#D4AF37',
        }}
        animate={{ opacity: showInfo ? 0.9 : 0.25 }}
        transition={{ duration: 0.35 }}
      >
        {number}
      </motion.div>

      {/* ── "Transform" label — appears mid-hover ─────── */}
      <motion.div
        style={{
          position: 'absolute', top: '1rem', right: '1.1rem', zIndex: 8,
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '8px', letterSpacing: '0.4em',
          color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
        animate={{ opacity: showInfo ? 1 : 0, y: showInfo ? 0 : -6 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      >
        Sacred
      </motion.div>

      {/* ── [7] Info footer ───────────────────────────── */}
      <motion.div
        className="card-footer"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          zIndex: 8, padding: '3rem 1.25rem 1.4rem',
          background: 'linear-gradient(to top, rgba(8,8,8,0.98) 55%, rgba(8,8,8,0.5) 80%, transparent)',
        }}
        animate={{ y: showInfo ? 0 : 8, opacity: showInfo ? 1 : 0.75 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Animated gold rule */}
        <motion.div
          style={{
            height: '1px', marginBottom: '0.75rem',
            background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.2), transparent)',
            transformOrigin: 'left',
          }}
          animate={{ scaleX: showInfo ? 1 : 0, opacity: showInfo ? 1 : 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
        />

        <motion.div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 2.8vw, 1.3rem)',
            fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2,
            marginBottom: '0.4rem',
          }}
        >
          {title}
        </motion.div>

        <motion.div
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '8px', letterSpacing: '0.4em',
            color: '#D4AF37', textTransform: 'uppercase',
          }}
          animate={{ opacity: showInfo ? 1 : 0, y: showInfo ? 0 : 4 }}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
        >
          {subtitle}
        </motion.div>

        {/* Click/tap hint */}
        <motion.div
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '7px', letterSpacing: '0.35em',
            color: 'rgba(212,175,55,0.35)', textTransform: 'uppercase',
            marginTop: '0.6rem',
          }}
          animate={{ opacity: showInfo ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
        >
          {isTouch
            ? t('matrix.gallery.tapToExplore', 'Tap to explore')
            : t('matrix.gallery.clickToExplore', 'Click to explore')}
        </motion.div>
      </motion.div>

    </motion.div>
  )
}
