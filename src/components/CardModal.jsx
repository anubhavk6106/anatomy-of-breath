// CardModal.jsx — Mobile & Tablet Responsive
// Mobile  (<640px):  single column, visual panel on top (fixed height), content below, scrollable
// Tablet  (640–1024px): two columns, compressed proportions
// Desktop (>1024px): full two-column layout

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const EASE = [0.25, 0.46, 0.45, 0.94]

// ── Responsive hook ───────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'
  })
  useEffect(() => {
    const fn = () => {
      const w = window.innerWidth
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])
  return bp
}

// ── Mandala background ────────────────────────────────────────
function MandalaBg({ overlayGradient }) {
  const rings = [
    { r: 300, dur: 120, rev: false, sw: 0.3, op: 0.06 },
    { r: 220, dur: 80,  rev: true,  sw: 0.4, op: 0.09 },
    { r: 150, dur: 55,  rev: false, sw: 0.5, op: 0.12 },
    { r: 90,  dur: 35,  rev: true,  sw: 0.6, op: 0.16 },
    { r: 40,  dur: 20,  rev: false, sw: 0.8, op: 0.22 },
  ]
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: 'none',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: overlayGradient, opacity: 0.15 }} />
      <svg viewBox="-340 -340 680 680"
           style={{ width: 'min(800px, 120vw)', height: 'min(800px, 120vw)', overflow: 'visible' }}>
        {rings.map((ring, i) => (
          <motion.g key={i}
            animate={{ rotate: ring.rev ? -360 : 360 }}
            transition={{ duration: ring.dur, ease: 'linear', repeat: Infinity }}
            style={{ originX: '50%', originY: '50%' }}
          >
            <circle cx="0" cy="0" r={ring.r} fill="none"
              stroke="#D4AF37" strokeWidth={ring.sw} opacity={ring.op} />
            {Array.from({ length: 12 }, (_, t) => {
              const a = (t / 12) * Math.PI * 2
              return (
                <line key={t}
                  x1={Math.cos(a) * (ring.r - 5)} y1={Math.sin(a) * (ring.r - 5)}
                  x2={Math.cos(a) * (ring.r + 5)} y2={Math.sin(a) * (ring.r + 5)}
                  stroke="#D4AF37" strokeWidth={ring.sw * 1.5} opacity={ring.op * 1.5} />
              )
            })}
          </motion.g>
        ))}
        <line x1="-320" y1="0" x2="320" y2="0" stroke="#D4AF37" strokeWidth="0.2" opacity="0.05" />
        <line x1="0" y1="-320" x2="0" y2="320" stroke="#D4AF37" strokeWidth="0.2" opacity="0.05" />
        <motion.circle cx="0" cy="0" r="4" fill="#D4AF37" opacity="0.5"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
      </svg>
    </div>
  )
}

// ── Visual panel (anatomy + geometry) ────────────────────────
function VisualPanel({ card, height }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: card.baseColor,
      height, flexShrink: 0,
    }}>
      <motion.div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ width: '68%', height: '68%', opacity: 0.55 }}
          dangerouslySetInnerHTML={{ __html: card.anatomySVG }} />
      </motion.div>

      <motion.div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mixBlendMode: 'screen',
      }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, ease: 'linear', repeat: Infinity }}
      >
        <div style={{ width: '88%', height: '88%', opacity: 0.75 }}
          dangerouslySetInnerHTML={{ __html: card.geometrySVG }} />
      </motion.div>

      <div style={{
        position: 'absolute', inset: 0,
        background: card.overlayGradient, opacity: 0.28, pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', bottom: '1rem', left: '1.2rem',
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '10px', letterSpacing: '0.3em',
        color: 'rgba(212,175,55,0.3)',
      }}>
        {card.number}
      </div>
    </div>
  )
}

// ── Content panel ─────────────────────────────────────────────
function ContentPanel({ card, isMobile }) {
  const { t } = useTranslation()
  const title       = t(`matrix.cards.${card.cardKey}.title`,       card.cardKey)
  const subtitle    = t(`matrix.cards.${card.cardKey}.subtitle`,    '')
  const description = t(`matrix.cards.${card.cardKey}.description`, '')
  const geometry    = t(`matrix.cards.${card.cardKey}.geometry`,    'Sacred Geometry')

  return (
    <div style={{
      padding: isMobile ? '1.6rem 1.4rem 2rem' : 'clamp(1.8rem, 4vw, 3rem)',
      display: 'flex', flexDirection: 'column',
      justifyContent: isMobile ? 'flex-start' : 'center',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <motion.p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '9px', letterSpacing: '0.5em',
        color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase',
        marginBottom: '0.9rem',
      }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
      >
        {geometry}
      </motion.p>

      <motion.h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: isMobile ? '1.7rem' : 'clamp(1.6rem, 3.5vw, 2.8rem)',
        fontWeight: 300, color: '#f5f0e8',
        lineHeight: 1.1, marginBottom: '0.4rem',
      }}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
      >
        {title}
      </motion.h2>

      <motion.p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '9px', letterSpacing: '0.4em',
        color: '#D4AF37', textTransform: 'uppercase',
        marginBottom: '1.4rem',
      }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.36, ease: EASE }}
      >
        {subtitle}
      </motion.p>

      <motion.div style={{
        height: '1px', marginBottom: '1.4rem',
        background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.1), transparent)',
        transformOrigin: 'left',
      }}
        initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.42, ease: EASE }}
      />

      <motion.p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 300,
        fontSize: isMobile ? '0.82rem' : 'clamp(0.8rem, 1.4vw, 0.92rem)',
        lineHeight: 1.85, letterSpacing: '0.02em',
        color: 'rgba(245,240,232,0.52)',
        marginBottom: '1.6rem',
      }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
      >
        {description}
      </motion.p>

      <motion.div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
      >
        {card.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '8px', letterSpacing: '0.3em',
            color: 'rgba(212,175,55,0.4)', textTransform: 'uppercase',
            border: '1px solid rgba(212,175,55,0.14)',
            padding: '0.28rem 0.6rem',
          }}>
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────
export default function CardModal({ card, onClose }) {
  const bp       = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!card) return null

  // Layout config per breakpoint
  const panelStyle = isMobile
    ? {
        // Mobile: full-screen, single column, scrollable
        width: '100%', height: '100%',
        maxWidth: '100%', maxHeight: '100%',
        display: 'flex', flexDirection: 'column',
        borderRadius: 0,
      }
    : isTablet
    ? {
        // Tablet: two columns, compact
        width: '96%', maxWidth: '780px',
        maxHeight: '88vh',
        display: 'grid',
        gridTemplateColumns: '42% 1fr',
      }
    : {
        // Desktop: full two-column
        width: '100%', maxWidth: '1100px',
        maxHeight: '90vh',
        display: 'grid',
        gridTemplateColumns: 'clamp(200px, 36%, 420px) 1fr',
      }

  const visualHeight = isMobile ? '42vw' : '100%'

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        style={{
          position: 'fixed', inset: 0, zIndex: 5000,
          background: 'rgba(6,6,6,0.96)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? 0 : 'clamp(0.75rem, 3vw, 2.5rem)',
          overflowY: isMobile ? 'auto' : 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={onClose}
      >
        <MandalaBg overlayGradient={card.overlayGradient} />

        <motion.div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative', zIndex: 2,
            border: isMobile ? 'none' : '1px solid rgba(212,175,55,0.14)',
            background: 'rgba(11,11,11,0.92)',
            overflow: isMobile ? 'auto' : 'hidden',
            WebkitOverflowScrolling: 'touch',
            ...panelStyle,
          }}
          initial={{ opacity: 0, scale: isMobile ? 1 : 0.94, y: isMobile ? 40 : 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{    opacity: 0, scale: isMobile ? 1 : 0.96, y: isMobile ? 30 : 16 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Visual panel */}
          <VisualPanel card={card} height={isMobile ? '52vw' : '100%'} />

          {/* Content panel */}
          <ContentPanel card={card} isMobile={isMobile} />

          {/* Close button — always top-right, larger tap target on mobile */}
          <motion.button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'fixed',
              top: isMobile ? '0.8rem' : '1rem',
              right: isMobile ? '0.8rem' : '1rem',
              zIndex: 20,
              background: 'rgba(11,11,11,0.85)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: 'rgba(212,175,55,0.7)',
              width: isMobile ? '40px' : '36px',
              height: isMobile ? '40px' : '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isMobile ? '20px' : '18px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
            whileTap={{ scale: 0.88 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            ×
          </motion.button>

          {/* Corner accents — desktop/tablet only */}
          {!isMobile && [
            { top: 0, left: 0,    borderTop: '1px solid rgba(212,175,55,0.28)', borderLeft:  '1px solid rgba(212,175,55,0.28)' },
            { bottom: 0, left: 0, borderBottom: '1px solid rgba(212,175,55,0.28)', borderLeft: '1px solid rgba(212,175,55,0.28)' },
            { top: 0, right: 0,   borderTop: '1px solid rgba(212,175,55,0.28)', borderRight: '1px solid rgba(212,175,55,0.28)' },
            { bottom: 0, right: 0, borderBottom: '1px solid rgba(212,175,55,0.28)', borderRight: '1px solid rgba(212,175,55,0.28)' },
          ].map((s, i) => (
            <motion.div key={i} style={{
              position: 'absolute', width: '18px', height: '18px',
              pointerEvents: 'none', ...s,
            }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.35, ease: EASE }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
