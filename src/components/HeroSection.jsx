// HeroSection.jsx
// Full-screen hero with cinematic dual-layer video, breathing concentric rings,
// and sacred geometry parallax.
//
// Video layer system:
//   Layer 0a — BG video: object-cover, blurred + dimmed → fills every pixel
//   Layer 0b — FG video: object-contain, sharp + brighter → full figure visible
//
// Title animation sequence (one-shot, ~5.5s total):
//   0.0s  opacity 0   — hidden on mount
//   0.8s  opacity 1   — fades in (upward drift + blur)
//   2.5s  opacity 1   — holds at peak
//   4.5s  opacity 0   — fades out
//   5.5s+             — video is the sole focus

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../hooks/useIsMobile'

const EASE_IN = [0.25, 0.46, 0.45, 0.94]

// ── Shared video props ───────────────────────────────────────
// Both videos use identical playback attributes so they stay in sync.
const VIDEO_ATTRS = {
  autoPlay: true,
  muted:    true,
  loop:     true,
  playsInline: true,
}

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
  const geomRef    = useRef(null)
  const bgVideoRef = useRef(null)   // background — cover, blurred
  const fgVideoRef = useRef(null)   // foreground — contain, sharp
  const { t }      = useTranslation()
  const isMobile   = useIsMobile()
  const prefersReducedMotion = useReducedMotion()

  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)

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

  // Nudge both videos to play on mobile (some browsers block autoplay)
  useEffect(() => {
    if (!showVideo) return
    bgVideoRef.current?.play().catch(() => {})
    fgVideoRef.current?.play().catch(() => {})
  }, [showVideo])

  // ── Title animation keyframes ──────────────────────────────
  const titleVariants = prefersReducedMotion
    ? {
        initial: { opacity: 1, y: 0, filter: 'blur(0px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      }
    : {
        initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
        animate: {
          opacity: [0,   1,    1,    0  ],
          y:       [16,  0,    0,    -8 ],
          filter:  ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
        },
      }

  const titleTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 4.7,
        delay: 0.8,
        ease: 'easeInOut',
        times: [0, 0.3, 0.7, 1],
      }

  // ── Video sources helper ─────────────────────────────────
  // Extracted so both video elements share identical source markup.
  function VideoSources() {
    return (
      <>
        {!isMobile && <source src="/videos/dissection.webm" type="video/webm" />}
        <source src="/videos/dissection.mp4" type="video/mp4" />
      </>
    )
  }

  return (
    <>
      {/* ── Hero: full-screen video section ─────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{
          height: '100svh',
          minHeight: '600px',
          background: '#0b0b0b',
        }}
      >
        {showVideo && (
          <>
            {/* ── Layer 0a: BG video — cover, blurred ──────────
                Fills every pixel of the viewport. Heavily blurred and
                dimmed so it reads as an atmospheric backdrop, not the
                primary content. The blur hides any letterbox edges.    */}
            <video
              ref={bgVideoRef}
              {...VIDEO_ATTRS}
              aria-hidden="true"
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover',
                objectPosition: 'center center',
                zIndex: 0,
                // Blur hides letterbox seams; heavy dim keeps it subordinate
                filter: 'blur(18px) brightness(0.35) saturate(0.6)',
                // Scale up slightly so the blur doesn't reveal edges
                transform: 'scale(1.08)',
              }}
            >
              <VideoSources />
            </video>

            {/* ── Layer 0b: FG video — contain, sharp ──────────
                Sized to show the full figure (head to toe). Centered.
                The blurred BG behind it fills any letterbox space so
                there are no hard black bars.                           */}
            <motion.video
              ref={fgVideoRef}
              {...VIDEO_ATTRS}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.5, ease: EASE_IN }}
              className="absolute"
              style={{
                // Center the element
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // Mobile: cover fills the screen edge-to-edge, 100dvh handles
                //         the dynamic viewport (avoids the iOS address-bar gap).
                // Desktop: contain shows the full figure without cropping.
                width: '100%',
                height: isMobile ? '100dvh' : '100%',
                objectFit: isMobile ? 'cover' : 'contain',
                objectPosition: 'center center',
                zIndex: 1,
                // Sharper and brighter than the BG — this is the hero content
                filter: 'brightness(0.7) contrast(1.1) saturate(0.8) sepia(0.08)',
                animation: 'heroVideoDrift 30s ease-in-out infinite alternate',
              }}
            >
              <VideoSources />
            </motion.video>
          </>
        )}

        {/* Drift keyframe — translate only, no scale, so contain sizing is stable */}
        <style>{`
          @keyframes heroVideoDrift {
            0%   { transform: translate(-50%, -50%) translate(  0px,  0px); }
            33%  { transform: translate(-50%, -50%) translate( -5px, -3px); }
            66%  { transform: translate(-50%, -50%) translate(  4px, -4px); }
            100% { transform: translate(-50%, -50%) translate( -3px,  3px); }
          }
        `}</style>

        {/* ── Layer 1: Cinematic overlay gradients ─────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: showVideo ? `
              radial-gradient(ellipse 60% 50% at 50% 45%, rgba(212,175,55,0.04) 0%, transparent 65%),
              linear-gradient(to bottom,
                rgba(11,11,11,0.72) 0%,
                rgba(11,11,11,0.18) 28%,
                rgba(11,11,11,0.12) 55%,
                rgba(11,11,11,0.48) 80%,
                rgba(11,11,11,0.88) 100%
              ),
              linear-gradient(to right,
                rgba(11,11,11,0.30) 0%,
                transparent 18%,
                transparent 82%,
                rgba(11,11,11,0.30) 100%
              )
            ` : `
              radial-gradient(ellipse 80% 80% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 70%),
              #0b0b0b
            `,
          }}
        />

        {/* ── Layer 2: Sacred geometry parallax ─────────────── */}
        <div
          ref={geomRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: showVideo ? 0.07 : 0.12,
            transition: 'transform 0.1s linear',
            zIndex: 3,
            mixBlendMode: showVideo ? 'screen' : 'normal',
          }}
        >
          <FlowerOfLife />
        </div>

        {/* ── Layer 3: Breathing rings ───────────────────────── */}
        <BreathRing size="600px" mobileSize="92vw" opacity="0.06" delay={0}  zIndex={4} />
        <BreathRing size="400px" mobileSize="65vw" opacity="0.10" delay={-2} zIndex={4} />
        <BreathRing size="200px" mobileSize="38vw" opacity="0.18" delay={-4} zIndex={4} />

        {/* ── Layer 4: Cinematic title — fades in then out ───── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 5, padding: '0 1.5rem' }}
          variants={titleVariants}
          initial="initial"
          animate="animate"
          transition={titleTransition}
        >
          {/* Glow halo */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 'clamp(280px, 60vw, 600px)',
              height: 'clamp(120px, 20vw, 220px)',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
            }}
          />

          {/* Title */}
          <h1
            className="relative text-center"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 6vw, 3.8rem)',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              color: 'rgba(245,240,232,0.82)',
              textShadow: '0 2px 32px rgba(0,0,0,0.7), 0 0 60px rgba(212,175,55,0.12)',
              margin: 0,
              zIndex: 1,
            }}
          >
            {t('matrix.hero.title1')}{' '}
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 300,
              filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.35))',
            }}>
              {t('matrix.hero.title2')}
            </em>
          </h1>

          {/* Gold rule */}
          <div style={{
            width: 'clamp(40px, 8vw, 80px)',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)',
            marginTop: '1.4rem',
            position: 'relative',
            zIndex: 1,
          }} />
        </motion.div>

        {/* ── Layer 5: Scroll hint — appears after title fades ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.2,
            delay: prefersReducedMotion ? 1.0 : 5.8,
            ease: EASE_IN,
          }}
          className="absolute pointer-events-none"
          style={{
            bottom: 'clamp(2rem, 5vh, 3.5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '9px',
            letterSpacing: '0.38em',
            color: 'rgba(212,175,55,0.38)',
            textTransform: 'uppercase',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
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
function TaglineSection({ tagline }) {
  return (
    <section
      aria-label="tagline"
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: '#0b0b0b',
        padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 70%)',
        }}
      />

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

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, delay: 0.15, ease: EASE_IN }}
        className="relative text-center"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 3.5vw, 1.9rem)',
          lineHeight: 1.5,
          letterSpacing: '0.02em',
          color: 'rgba(245,240,232,0.65)',
          maxWidth: 'clamp(280px, 70vw, 680px)',
          margin: 0,
          zIndex: 1,
        }}
      >
        {tagline}
      </motion.p>

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
