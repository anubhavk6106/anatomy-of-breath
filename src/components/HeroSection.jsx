// HeroSection.jsx
// Full-screen hero with cinematic video background, breathing concentric rings,
// and sacred geometry parallax.
//
// Title animation sequence (one-shot, ~5s total):
//   0.0s  opacity 0   — hidden on mount
//   0.8s  opacity 1   — fades in over ~1.4s (with slight upward drift + blur)
//   2.5s  opacity 1   — holds at peak
//   4.5s  opacity 0   — fades out over ~1s
//   5.5s+             — video is the sole focus, no text overlay

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../hooks/useIsMobile'

const EASE_IN  = [0.25, 0.46, 0.45, 0.94]
const EASE_OUT = [0.55, 0.0,  0.45, 1.0]

// ── Flower of Life SVG ───────────────────────────────────────
function FlowerOfLife() {
  return (
    <svg
      viewBox="0 0 500 500"
      style={{ width: 'min(700px, 95vw)', height: 'min(700px, 95vw)' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#D4AF37" strokeWidth="0.5" fill="none">
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
        border: `1px solid rgba(212,175,55,${opacity})`,
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
  const { t }    = useTranslation()
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

  // ── Title animation keyframes ──────────────────────────────
  // When prefersReducedMotion is true, skip the animation entirely and
  // show a static, permanently visible title instead.
  //
  // Timeline (normal motion):
  //   t=0.0s  opacity:0, y:16, filter:blur(8px)   — initial (hidden)
  //   t=0.8s  opacity:1, y:0,  filter:blur(0px)   — fade in starts (delay 0.8s, duration 1.4s)
  //   t=2.5s  opacity:1                            — hold (the keyframe array pauses here)
  //   t=4.5s  opacity:0, y:-8, filter:blur(4px)   — fade out
  //
  // Framer Motion keyframe arrays map evenly across the total duration unless
  // `times` is provided. We use `times` to control the exact hold window.
  //
  // Total duration: 5.5s  (delay 0.8s + animation 4.7s)
  const titleVariants = prefersReducedMotion
    ? {
        // Reduced motion: static, always visible, no blur
        initial: { opacity: 1, y: 0, filter: 'blur(0px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      }
    : {
        initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
        animate: {
          // Keyframe arrays: [start, peak, hold, end]
          opacity: [0,   1,    1,    0  ],
          y:       [16,  0,    0,    -8 ],
          filter:  [
            'blur(8px)',
            'blur(0px)',
            'blur(0px)',
            'blur(4px)',
          ],
        },
      }

  const titleTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        // Total animation duration after the delay
        duration: 4.7,
        delay: 0.8,
        ease: 'easeInOut',
        // times maps each keyframe to a position in [0, 1]
        // 0.0 → t=0.8s (start)
        // 0.3 → t=2.2s (peak reached)
        // 0.7 → t=4.1s (hold ends, fade-out begins)
        // 1.0 → t=5.5s (fully gone)
        times: [0, 0.3, 0.7, 1],
      }

  return (
    <>
      {/* ── Hero: full-screen video section ─────────────────── */}
      <section
        id="hero"
        style={{
          height: '100svh',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: '#0b0b0b',
        }}
      >
        {/* ── Layer 0: Background video ──────────────────────── */}
        {showVideo && (
          <motion.video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.05 }}
            transition={{ duration: 2.5, ease: EASE_IN }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              filter: 'brightness(0.55) contrast(1.15) saturate(0.75) sepia(0.12)',
              animation: 'heroVideoDrift 30s ease-in-out infinite alternate',
            }}
          >
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
          background: showVideo ? `
            radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,175,55,0.04) 0%, transparent 65%),
            linear-gradient(to bottom,
              rgba(11,11,11,0.72) 0%,
              rgba(11,11,11,0.20) 30%,
              rgba(11,11,11,0.15) 55%,
              rgba(11,11,11,0.50) 80%,
              rgba(11,11,11,0.88) 100%
            ),
            linear-gradient(to right,
              rgba(11,11,11,0.35) 0%,
              transparent 20%,
              transparent 80%,
              rgba(11,11,11,0.35) 100%
            )
          ` : `
            radial-gradient(ellipse 80% 80% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(212,175,55,0.03) 0%, transparent 60%),
            #0b0b0b
          `,
        }} />

        {/* ── Layer 2: Sacred geometry parallax ─────────────── */}
        <div ref={geomRef} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: showVideo ? 0.07 : 0.12,
          pointerEvents: 'none',
          transition: 'transform 0.1s linear',
          zIndex: 2,
          mixBlendMode: showVideo ? 'screen' : 'normal',
        }}>
          <FlowerOfLife />
        </div>

        {/* ── Layer 3: Breathing rings ───────────────────────── */}
        <BreathRing size="600px" mobileSize="92vw" opacity="0.06" delay={0}   zIndex={3} />
        <BreathRing size="400px" mobileSize="65vw" opacity="0.10" delay={-2}  zIndex={3} />
        <BreathRing size="200px" mobileSize="38vw" opacity="0.18" delay={-4}  zIndex={3} />

        {/* ── Layer 4: Cinematic title — fades in then out ───── */}
        <motion.div
          // pointerEvents none after fade-out so the video is fully interactive
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
            padding: '0 1.5rem',
            pointerEvents: 'none',
          }}
          // Wrapper fades with the same keyframe sequence so the
          // glow halo and the text disappear together
          variants={titleVariants}
          initial="initial"
          animate="animate"
          transition={titleTransition}
        >
          {/* Cinematic glow halo behind the text */}
          <div style={{
            position: 'absolute',
            width: 'clamp(280px, 60vw, 600px)',
            height: 'clamp(120px, 20vw, 220px)',
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            // Halo is always present in the DOM but invisible when wrapper opacity=0
          }} />

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 6vw, 3.8rem)',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              color: 'rgba(245,240,232,0.82)',
              // Cinematic text shadow — soft depth + subtle gold bloom
              textShadow: [
                '0 2px 32px rgba(0,0,0,0.7)',
                '0 0 60px rgba(212,175,55,0.12)',
              ].join(', '),
              margin: 0,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {t('matrix.hero.title1')}{' '}
            <em style={{
              fontStyle: 'italic',
              // Premium gold gradient on the accent word
              background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 300,
              // Gold bloom — visible during the hold phase
              filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.35))',
            }}>
              {t('matrix.hero.title2')}
            </em>
          </h1>

          {/* Thin gold rule below the title — part of the cinematic moment */}
          <div style={{
            width: 'clamp(40px, 8vw, 80px)',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)',
            marginTop: '1.4rem',
            position: 'relative',
            zIndex: 1,
          }} />
        </motion.div>

        {/* ── Layer 5: Scroll hint — fades in after title is gone ── */}
        {/* Delayed so it only appears once the video is the sole focus */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: prefersReducedMotion ? 0.45 : 1 }}
          transition={{
            duration: 1.2,
            // Start appearing as the title finishes fading out
            delay: prefersReducedMotion ? 1.0 : 5.8,
            ease: EASE_IN,
          }}
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vh, 3.5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '9px',
            letterSpacing: '0.38em',
            color: 'rgba(212,175,55,0.38)',
            textTransform: 'uppercase',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {t('matrix.hero.scroll')}
        </motion.p>
      </section>

      {/* ── Tagline section — below the fold ────────────────── */}
      <TaglineSection tagline={t('matrix.hero.tagline')} />
    </>
  )
}

// ── TaglineSection ───────────────────────────────────────────
// Sits immediately below the hero video. Centered, elegant, responsive.
function TaglineSection({ tagline }) {
  return (
    <section
      aria-label="tagline"
      style={{
        background: '#0b0b0b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow behind the text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease: EASE_IN }}
        style={{
          width: 'clamp(40px, 8vw, 80px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.45), transparent)',
          marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
          transformOrigin: 'center',
        }}
      />

      {/* Tagline text */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, delay: 0.15, ease: EASE_IN }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.9rem)',
          lineHeight: 1.5,
          letterSpacing: '0.02em',
          color: 'rgba(245,240,232,0.65)',
          textAlign: 'center',
          maxWidth: 'clamp(280px, 70vw, 680px)',
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {tagline}
      </motion.p>

      {/* Bottom rule */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE_IN }}
        style={{
          width: 'clamp(40px, 8vw, 80px)',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.45), transparent)',
          marginTop: 'clamp(1.5rem, 3vw, 2.5rem)',
          transformOrigin: 'center',
        }}
      />
    </section>
  )
}
