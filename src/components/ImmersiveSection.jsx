// ImmersiveSection.jsx
// Full-screen cinematic section with three independently rotating sacred geometry
// layers + the interactive 4-7-8 Breath Rhythm Visualizer.

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import BreathVisualizer from './BreathVisualizer'

// ── Rotating geometry ring ────────────────────────────────────
function GeometryRing({ children, duration, reverse = false, style = {} }) {
  return (
    <div style={{
      position: 'absolute',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: `rotateSlow ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ── ImmersiveSection ──────────────────────────────────────────
export default function ImmersiveSection() {
  const textRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'opacity 1.2s ease, transform 1.2s ease'

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#060606',
      padding: 'clamp(4rem, 10vw, 6rem) 1.5rem',
    }}>

      {/* ── Animated sacred geometry background ─────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0.18, pointerEvents: 'none',
      }}>
        <GeometryRing duration={30} style={{ position: 'absolute' }}>
          <svg viewBox="0 0 800 800" style={{ width: 'min(900px, 140vw)', height: 'min(900px, 140vw)' }}
               xmlns="http://www.w3.org/2000/svg">
            <g stroke="#FFD700" strokeWidth="0.4" fill="none">
              <polygon points="400,50 699,225 699,575 400,750 101,575 101,225"/>
              <polygon points="400,100 664,250 664,550 400,700 136,550 136,250"/>
              <circle cx="400" cy="400" r="350"/>
              <circle cx="400" cy="400" r="300"/>
            </g>
          </svg>
        </GeometryRing>

        <GeometryRing duration={20} reverse style={{ position: 'absolute' }}>
          <svg viewBox="0 0 800 800" style={{ width: 'min(800px, 120vw)', height: 'min(800px, 120vw)' }}
               xmlns="http://www.w3.org/2000/svg">
            <g stroke="#FFD700" strokeWidth="0.6" fill="none">
              <polygon points="400,150 616,275 616,525 400,650 184,525 184,275"/>
              <polygon points="400,200 582,300 582,500 400,600 218,500 218,300"/>
              <circle cx="400" cy="400" r="250"/>
              <line x1="150" y1="400" x2="650" y2="400"/>
              <line x1="400" y1="150" x2="400" y2="650"/>
              <line x1="183" y1="225" x2="617" y2="575"/>
              <line x1="617" y1="225" x2="183" y2="575"/>
            </g>
          </svg>
        </GeometryRing>

        <GeometryRing duration={12} style={{ position: 'absolute' }}>
          <svg viewBox="0 0 800 800" style={{ width: 'min(600px, 95vw)', height: 'min(600px, 95vw)' }}
               xmlns="http://www.w3.org/2000/svg">
            <g stroke="#FFD700" strokeWidth="0.8" fill="none">
              <circle cx="400" cy="400" r="100"/>
              <circle cx="400" cy="400" r="70"/>
              <polygon points="400,300 487,350 487,450 400,500 313,450 313,350"/>
              <polygon points="400,320 474,363 474,437 400,480 326,437 326,363"/>
            </g>
          </svg>
        </GeometryRing>
      </div>

      {/* ── Foreground content ───────────────────────────── */}
      <div ref={textRef} style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0',
        width: '100%', maxWidth: '560px',
      }}>

        {/* Section label */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '10px', letterSpacing: '0.6em',
          color: '#FFD700', textTransform: 'uppercase',
          marginBottom: '1.5rem', opacity: 0.7,
        }}>
          {t('matrix.immersive.label', 'The Living Mandala')}
        </p>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 6vw, 4.5rem)',
          fontWeight: 300, color: '#f5f0e8',
          textShadow: '0 0 80px rgba(255,215,0,0.2)',
          lineHeight: 1.15, marginBottom: '0.6rem',
        }}>
          {t('matrix.immersive.title', 'Within Every')}<br />
          <em style={{ fontStyle: 'italic', color: '#FFD700' }}>{t('matrix.immersive.titleItalic', 'Breath')}</em>
        </h2>

        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', letterSpacing: '0.4em',
          color: 'rgba(255,215,0,0.5)', textTransform: 'uppercase',
          marginBottom: '3rem',
        }}>
          {t('matrix.immersive.subtitle', 'a universe unfolds')}
        </p>

        {/* Gold divider */}
        <div style={{
          width: '1px', height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.4), transparent)',
          marginBottom: '3rem',
        }} />

        {/* ── Breath Visualizer ─────────────────────── */}
        <BreathVisualizer />

        {/* Technique note */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: 'clamp(8px, 2vw, 10px)', letterSpacing: '0.25em',
          color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase',
          marginTop: '2.5rem', lineHeight: 1.8,
        }}>
          {t('matrix.immersive.technique', "4 · 7 · 8 · Dr. Andrew Weil's pranayama technique")}
        </p>
      </div>
    </div>
  )
}
