// PortalPage.jsx — Cinematic narrative home page
//
// Structure:
//   1. Hero — fullscreen creation video (object-contain, loops) + centered quote
//   2. Philosophy — fade-in text section with gold lungs divider
//   3. Journey — "From Inhale to Cellular Fire" scroll timeline (BreathTimeline)
//   4. CTA — "Enter the Matrix" button

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import Philosophy from '../components/Philosophy'
import BreathTimeline from '../components/BreathTimeline'
import Preloader from '../components/Preloader'
import useIsMobile from '../hooks/useIsMobile'

const EASE = [0.25, 0.46, 0.45, 0.94]

// ── Gold lungs divider ────────────────────────────────────────
function LungsDivider() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '0.75rem',
      margin: '0 auto',
    }}>
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.5))',
      }} />
      <svg viewBox="0 0 60 50" fill="none" style={{ width: '36px', opacity: 0.55 }}>
        <path d="M30 8 L30 38" stroke="#D4AF37" strokeWidth="1.2"/>
        <path d="M30 14 C22 14 12 20 10 30 C8 40 14 46 20 48 C26 50 30 44 30 44 C30 44 24 40 22 34 C18 26 20 18 26 14"
              stroke="#D4AF37" strokeWidth="1" fill="rgba(212,175,55,0.06)"/>
        <path d="M30 14 C38 14 48 20 50 30 C52 40 46 46 40 48 C34 50 30 44 30 44 C30 44 36 40 38 34 C42 26 40 18 34 14"
              stroke="#D4AF37" strokeWidth="1" fill="rgba(212,175,55,0.06)"/>
        <circle cx="30" cy="28" r="3" stroke="rgba(212,175,55,0.6)" strokeWidth="0.6"/>
      </svg>
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, rgba(212,175,55,0.5), transparent)',
      }} />
    </div>
  )
}

// ── Hero video section ────────────────────────────────────────
function HeroVideo() {
  const videoRef = useRef(null)
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()

  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)

  const showVideo = !prefersReducedMotion && !isSlowConnection

  useEffect(() => {
    if (!showVideo || !videoRef.current) return
    const video = videoRef.current

    const attemptPlay = () => {
      video.play().catch(() => {})
    }

    attemptPlay()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') attemptPlay()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [showVideo])

  if (!showVideo) {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, #0b0b0b 70%)',
      }} />
    )
  }

  return (
    <motion.video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: EASE }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        // object-contain: show the full video frame, no cropping
        objectFit: 'contain',
        objectPosition: 'center center',
        // Subtle cinematic grade
        filter: 'brightness(0.65) contrast(1.05) saturate(0.8)',
      }}
    >
      {!isMobile && <source src="/videos/creation.webm" type="video/webm" />}
      <source src="/videos/creation.mp4" type="video/mp4" />
    </motion.video>
  )
}

// ── Enter Matrix CTA ──────────────────────────────────────────
function EnterCTA({ onClick }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: EASE }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(5rem, 12vw, 9rem) 1.5rem',
        background: '#0b0b0b',
        position: 'relative',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '9px', letterSpacing: '0.55em',
        color: 'rgba(212,175,55,0.4)', textTransform: 'uppercase',
        marginBottom: '2.5rem',
        position: 'relative', zIndex: 1,
      }}>
        {t('portal.tagline', 'Where science dissolves into sacred')}
      </p>

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '11px',
          letterSpacing: '0.45em',
          color: '#D4AF37',
          textTransform: 'uppercase',
          padding: '1.1rem 3.5rem',
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.45)',
          cursor: 'pointer',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          position: 'relative', zIndex: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(212,175,55,0.06)'
          e.currentTarget.style.borderColor = '#D4AF37'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(212,175,55,0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.45)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {t('portal.enter', 'Enter the Matrix')}
      </motion.button>

      {/* Decorative bottom line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
        style={{
          width: 'clamp(60px, 12vw, 120px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
          marginTop: '3rem',
          transformOrigin: 'center',
          position: 'relative', zIndex: 1,
        }}
      />
    </motion.div>
  )
}

// ── PortalPage ────────────────────────────────────────────────
export default function PortalPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPreloader, setShowPreloader] = useState(false)
  const [preloaderComplete, setPreloaderComplete] = useState(false)

  // First-visit preloader
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('portal_visited')
    if (!hasVisited) {
      setShowPreloader(true)
      sessionStorage.setItem('portal_visited', 'true')
    } else {
      setPreloaderComplete(true)
    }
  }, [])

  const handlePreloaderComplete = () => setPreloaderComplete(true)
  const handleEnterMatrix = () => navigate('/matrix')

  return (
    <>
      {showPreloader && !preloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >

        {/* ── 1. HERO — fullscreen video + centered quote ── */}
        <section style={{
          position: 'relative',
          width: '100vw',
          height: '100svh',
          minHeight: '600px',
          overflow: 'hidden',
          background: '#0b0b0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Video layer */}
          <HeroVideo />

          {/* Dark vignette overlay — keeps edges dark, center clear */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(11,11,11,0.55) 100%),
              linear-gradient(to bottom, rgba(11,11,11,0.6) 0%, transparent 20%, transparent 75%, rgba(11,11,11,0.85) 100%)
            `,
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          {/* Centered quote — appears at 1.5s so user sees video first */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 1.5, ease: EASE }}
            style={{
              position: 'relative', zIndex: 2,
              textAlign: 'center',
              padding: '0 clamp(1.5rem, 6vw, 5rem)',
              maxWidth: '820px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(2rem, 5vh, 3.5rem)',
            }}
          >
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem, 3.5vw, 2.4rem)',
              lineHeight: 1.55,
              letterSpacing: '0.01em',
              color: '#D4AF37',
              margin: 0,
              textShadow: '0 2px 40px rgba(0,0,0,0.7), 0 0 60px rgba(212,175,55,0.15)',
              whiteSpace: 'pre-line',
            }}>
              {t('matrix.philosophy.quote',
                '"Every inhale is a universe\nexpanding. Every exhale,\na cosmos remembering itself."'
              )}
            </blockquote>

            {/* Enter button — on the video, below the quote */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.8, ease: EASE }}
              onClick={handleEnterMatrix}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '10px',
                letterSpacing: '0.45em',
                color: '#D4AF37',
                textTransform: 'uppercase',
                padding: '0.9rem 2.8rem',
                background: 'rgba(11,11,11,0.45)',
                border: '1px solid rgba(212,175,55,0.4)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                pointerEvents: 'auto',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.1)'
                e.currentTarget.style.borderColor = '#D4AF37'
                e.currentTarget.style.boxShadow = '0 0 24px rgba(212,175,55,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(11,11,11,0.45)'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {t('portal.enter', 'Enter the Matrix')}
            </motion.button>
          </motion.div>

          {/* Scroll hint — appears after quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.5, ease: EASE }}
            style={{
              position: 'absolute',
              bottom: 'clamp(2rem, 5vh, 3.5rem)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none',
            }}
          >
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '9px', letterSpacing: '0.38em',
              color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase',
            }}>
              {t('portal.scroll', 'Scroll')}
            </p>
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M12 5v14m0 0l-7-7m7 7l7-7"
                stroke="rgba(212,175,55,0.35)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </motion.div>
        </section>

        {/* ── 2. PHILOSOPHY — fade-in text with lungs divider ── */}
        <section style={{ background: '#0b0b0b' }}>
          {/* Top lungs divider */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE }}
            style={{ paddingTop: 'clamp(3rem, 6vw, 5rem)' }}
          >
            <LungsDivider />
          </motion.div>

          <Philosophy />

          {/* Bottom lungs divider */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE }}
            style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}
          >
            <LungsDivider />
          </motion.div>
        </section>

        {/* ── 3. JOURNEY — breath timeline ─────────────────── */}
        <section id="journey">
          <BreathTimeline />
        </section>

        {/* ── 4. CTA — Enter the Matrix ────────────────────── */}
        <EnterCTA onClick={handleEnterMatrix} />

      </motion.div>
    </>
  )
}
