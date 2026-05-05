// MatrixPage.jsx — The core scientific + interactive experience
//
// Section order:
//   1. Gallery — 12-card Living Architecture grid (cinematic entrance header)
//   2. Dissection video — anatomy in motion (slow parallax drift)
//   3. ImmersiveSection — "Within Every Breath" mandala + 4-7-8 visualizer
//
// UX enhancements:
//   - Cinematic section header before gallery (context + breathing space)
//   - Slow parallax drift on dissection video
//   - Gold breathing dividers between sections
//   - Progressive reveal via whileInView

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Gallery from '../components/Gallery'
import ImmersiveSection from '../components/ImmersiveSection'
import useIsMobile from '../hooks/useIsMobile'

const EASE = [0.25, 0.46, 0.45, 0.94]

// ── Gold breathing divider ────────────────────────────────────
function BreathDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        width: 'clamp(60px, 12vw, 120px)',
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)',
        margin: '0 auto',
        transformOrigin: 'center',
      }}
    />
  )
}

// ── Dissection video section ──────────────────────────────────
// Sits between the gallery and the immersive section.
// Uses the dual-layer technique: blurred cover BG + sharp contain FG.
function DissectionVideoSection() {
  const bgRef = useRef(null)
  const fgRef = useRef(null)
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  const { t } = useTranslation()

  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)

  const showVideo = !prefersReducedMotion && !isSlowConnection

  useEffect(() => {
    if (!showVideo) return
    const attemptPlay = () => {
      bgRef.current?.play().catch(() => {})
      fgRef.current?.play().catch(() => {})
    }
    attemptPlay()
    const onVis = () => { if (document.visibilityState === 'visible') attemptPlay() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [showVideo])

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: isMobile ? '70vw' : '80vh',
      minHeight: '400px',
      maxHeight: '900px',
      overflow: 'hidden',
      background: '#060606',
    }}>
      {showVideo ? (
        <>
          {/* BG layer — cover, blurred, fills every pixel */}
          <video
            ref={bgRef}
            autoPlay muted loop playsInline
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'blur(20px) brightness(0.3) saturate(0.5)',
              transform: 'scale(1.08)',
              zIndex: 0,
            }}
          >
            {!isMobile && <source src="/videos/dissection.webm" type="video/webm" />}
            <source src="/videos/dissection.mp4" type="video/mp4" />
          </video>

          {/* FG layer — contain, sharp, full figure visible + slow drift */}
          <motion.video
            ref={fgRef}
            autoPlay muted loop playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: EASE }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%', height: '100%',
              objectFit: isMobile ? 'cover' : 'contain',
              objectPosition: 'center center',
              filter: 'brightness(0.72) contrast(1.08) saturate(0.8) sepia(0.06)',
              zIndex: 1,
              animation: 'dissectionDrift 25s ease-in-out infinite alternate',
            }}
          >
            {!isMobile && <source src="/videos/dissection.webm" type="video/webm" />}
            <source src="/videos/dissection.mp4" type="video/mp4" />
          </motion.video>
          <style>{`
            @keyframes dissectionDrift {
              0%   { transform: translate(-50%, -50%) translate(0px, 0px); }
              33%  { transform: translate(-50%, -50%) translate(-5px, -3px); }
              66%  { transform: translate(-50%, -50%) translate(4px, -4px); }
              100% { transform: translate(-50%, -50%) translate(-3px, 3px); }
            }
          `}</style>
        </>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,175,55,0.05) 0%, #060606 70%)',
        }} />
      )}

      {/* Cinematic overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `
          linear-gradient(to bottom,
            rgba(6,6,6,0.7) 0%,
            rgba(6,6,6,0.1) 25%,
            rgba(6,6,6,0.1) 75%,
            rgba(6,6,6,0.8) 100%
          )
        `,
        pointerEvents: 'none',
      }} />
    </section>
  )
}

// ── MatrixPage ────────────────────────────────────────────────
export default function MatrixPage() {
  const { t } = useTranslation()

  return (
    <main>

      {/* ── 1. GALLERY — Living Architecture ─────────── */}
      <section
        id="gallery"
        style={{
          paddingTop: 'clamp(5rem, 10vw, 8rem)',
          background: '#0b0b0b',
        }}
      >
        <Gallery />
      </section>

      {/* Breathing divider */}
      <div style={{ background: '#0b0b0b', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
        <BreathDivider />
      </div>

      {/* ── 2. DISSECTION VIDEO — anatomy in motion ──── */}
      <DissectionVideoSection />

      {/* Breathing divider */}
      <div style={{ background: '#060606', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
        <BreathDivider />
      </div>

      {/* ── 3. IMMERSIVE — mandala + 4-7-8 visualizer ── */}
      <section id="immersive">
        <ImmersiveSection />
      </section>

    </main>
  )
}
