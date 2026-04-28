// HeroSection.jsx
// Full-screen hero with cinematic video background, breathing concentric rings,
// sacred geometry parallax, and cinematic title typography. Fully responsive.

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SITE } from '../config'
import useIsMobile from '../hooks/useIsMobile'

// ── Flower of Life SVG ───────────────────────────────────────
function FlowerOfLife() {
  return (
    <svg
      viewBox="0 0 500 500"
      style={{ width: 'min(700px, 95vw)', height: 'min(700px, 95vw)' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#FFD700" strokeWidth="0.5" fill="none">
        <circle cx="250" cy="250" r="80" />
        <circle cx="250" cy="170" r="80" />
        <circle cx="319.3" cy="210" r="80" />
        <circle cx="319.3" cy="290" r="80" />
        <circle cx="250" cy="330" r="80" />
        <circle cx="180.7" cy="290" r="80" />
        <circle cx="180.7" cy="210" r="80" />
        <circle cx="250" cy="250" r="160" />
        <circle cx="250" cy="90"  r="160" />
        <circle cx="388.6" cy="170" r="160" />
        <circle cx="388.6" cy="330" r="160" />
        <circle cx="250" cy="410" r="160" />
        <circle cx="111.4" cy="330" r="160" />
        <circle cx="111.4" cy="170" r="160" />
        <line x1="250" y1="90"  x2="250" y2="410" />
        <line x1="111.4" y1="170" x2="388.6" y2="330" />
        <line x1="388.6" y1="170" x2="111.4" y2="330" />
      </g>
    </svg>
  )
}

// ── Breathing concentric ring ────────────────────────────────
function BreathRing({ size, mobileSize, opacity, delay, zIndex = 1 }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `min(${size}, ${mobileSize})`,
        height: `min(${size}, ${mobileSize})`,
        borderRadius: '50%',
        border: `1px solid rgba(255,215,0,${opacity})`,
        pointerEvents: 'none',
        zIndex,
      }}
      animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

// ── HeroSection ──────────────────────────────────────────────
export default function HeroSection() {
  const geomRef  = useRef(null)
  const videoRef = useRef(null)
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()

  // Check for slow connection
  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)

  // Show video only when motion is allowed and connection is adequate
  const showVideo = !prefersReducedMotion && !isSlowConnection

  // Parallax on mouse move (desktop only)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = e => {
      if (!geomRef.current) return
      const dx = (e.clientX / window.innerWidth  - 0.5) * 20
      const dy = (e.clientY / window.innerHeight - 0.5) * 20
      geomRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Ensure video plays on mobile (some browsers need a nudge)
  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked — video stays hidden, fallback gradient shows
      })
    }
  }, [showVideo])

  return (
    <section style={{
      height: '100svh',
      minHeight: '600px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '0 1.5rem',
      background: '#0b0b0b',
    }}>

      {/* ── Layer 0: Background video ─────────────────────── */}
      {showVideo && (
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          // Cinematic slow-zoom: starts slightly zoomed in, breathes outward
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            // Color grading: desaturate slightly, boost contrast, warm tint
            filter: 'brightness(0.55) contrast(1.15) saturate(0.75) sepia(0.12)',
            // Continuous slow drift — gives the video a living, breathing feel
            animation: 'heroVideoDrift 30s ease-in-out infinite alternate',
          }}
        >
          {/* Desktop: WebM first (better compression), MP4 fallback */}
          {!isMobile && <source src="/videos/dissection.webm" type="video/webm" />}
          <source src="/videos/dissection.mp4" type="video/mp4" />
        </motion.video>
      )}

      {/* CSS keyframes for the slow drift animation */}
      <style>{`
        @keyframes heroVideoDrift {
          0%   { transform: scale(1.05) translate(0px, 0px); }
          33%  { transform: scale(1.08) translate(-8px, -4px); }
          66%  { transform: scale(1.06) translate(6px, -6px); }
          100% { transform: scale(1.05) translate(-4px, 4px); }
        }
      `}</style>

      {/* ── Layer 1: Multi-layer cinematic overlay ─────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 1,
        // Stacked gradients:
        // 1. Radial gold glow at center (brand accent)
        // 2. Top-to-bottom dark vignette (nav readability + cinematic feel)
        // 3. Bottom-to-top dark vignette (scroll indicator readability)
        // 4. Left/right edge darkening (focus on center)
        background: showVideo ? `
          radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,215,0,0.05) 0%, transparent 65%),
          linear-gradient(to bottom,
            rgba(11,11,11,0.72) 0%,
            rgba(11,11,11,0.25) 30%,
            rgba(11,11,11,0.20) 55%,
            rgba(11,11,11,0.55) 80%,
            rgba(11,11,11,0.85) 100%
          ),
          linear-gradient(to right,
            rgba(11,11,11,0.35) 0%,
            transparent 20%,
            transparent 80%,
            rgba(11,11,11,0.35) 100%
          )
        ` : `
          radial-gradient(ellipse 80% 80% at 50% 40%, rgba(255,215,0,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 50% 50% at 20% 80%, rgba(255,215,0,0.03) 0%, transparent 60%),
          #0b0b0b
        `,
      }} />

      {/* ── Layer 2: Sacred geometry parallax ─────────────── */}
      <div ref={geomRef} style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // More visible over video — the geometry feels like it's inside the scene
        opacity: showVideo ? 0.09 : 0.12,
        pointerEvents: 'none',
        transition: 'transform 0.1s linear',
        zIndex: 2,
        // Blend with video using screen mode for a luminous effect
        mixBlendMode: showVideo ? 'screen' : 'normal',
      }}>
        <FlowerOfLife />
      </div>

      {/* ── Layer 3: Breathing rings ───────────────────────── */}
      <BreathRing size="600px" mobileSize="92vw" opacity="0.06" delay={0}   zIndex={3} />
      <BreathRing size="400px" mobileSize="65vw" opacity="0.10" delay={-2}  zIndex={3} />
      <BreathRing size="200px" mobileSize="38vw" opacity="0.18" delay={-4}  zIndex={3} />

      {/* ── Layer 4: Hero text ─────────────────────────────── */}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 4, width: '100%' }}>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            letterSpacing: '0.35em', fontSize: '10px',
            color: '#FFD700', textTransform: 'uppercase',
            marginBottom: '1.5rem',
            // Subtle text shadow so it reads over any video frame
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}
        >
          {t('matrix.hero.eyebrow', SITE.domain)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(3rem, 14vw, 8rem)',
            lineHeight: 1, letterSpacing: '-0.01em',
            color: '#f5f0e8',
            textShadow: '0 2px 30px rgba(0,0,0,0.5)',
          }}
        >
          {t('matrix.hero.title1')}<br />
          <em style={{
            fontStyle: 'italic',
            color: '#FFD700',
            fontWeight: 300,
            // Gold glow on the italic word
            textShadow: '0 0 40px rgba(255,215,0,0.35), 0 2px 20px rgba(0,0,0,0.5)',
          }}>
            {t('matrix.hero.title2')}
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.3 }}
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: 'clamp(0.65rem, 2.5vw, 1rem)',
            letterSpacing: 'clamp(0.1em, 1.5vw, 0.25em)',
            marginTop: '1.2rem',
            color: 'rgba(245,240,232,0.5)',
            textTransform: 'uppercase',
            textShadow: '0 1px 12px rgba(0,0,0,0.5)',
          }}
        >
          {t('matrix.hero.tagline', SITE.tagline)}
        </motion.p>

        {/* Animated gold line */}
        <motion.div
          animate={{ scaleY: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '60px',
            background: 'linear-gradient(to bottom, transparent, #FFD700, transparent)',
            margin: '2.5rem auto 0',
            filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.4))',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '10px', letterSpacing: '0.35em',
            color: 'rgba(255,215,0,0.45)',
            textTransform: 'uppercase', marginTop: '0.8rem',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          }}
        >
          {t('matrix.hero.scroll', 'Scroll to explore')}
        </motion.p>
      </div>
    </section>
  )
}
