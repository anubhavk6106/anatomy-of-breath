// Philosophy.jsx
// Minimal, contemplative text section.
// Content fades in as the user scrolls into view via IntersectionObserver.

import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// ── Reusable scroll-fade wrapper ──────────────────────────────
function ScrollFade({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`

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
  }, [delay])

  return <div ref={ref}>{children}</div>
}

// ── Gold divider line ─────────────────────────────────────────
function GoldDivider() {
  return (
    <div style={{
      width: '1px', height: '60px',
      background: 'linear-gradient(to bottom, transparent, #D4AF37, transparent)',
      margin: '3rem auto',
    }} />
  )
}

// ── Philosophy ────────────────────────────────────────────────
export default function Philosophy() {
  const { t } = useTranslation()

  return (
    <div style={{
      maxWidth: '760px', margin: '0 auto',
      padding: 'clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 2rem)',
      textAlign: 'center',
    }}>

      {/* Section label */}
      <ScrollFade delay={0}>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '10px', letterSpacing: '0.6em',
          color: '#D4AF37', textTransform: 'uppercase',
          marginBottom: '3rem', opacity: 0.7,
        }}>
          {t('matrix.philosophy.label', 'Philosophy')}
        </p>
      </ScrollFade>

      {/* Opening quote */}
      <ScrollFade delay={0.1}>
        <blockquote style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          fontWeight: 300, fontStyle: 'italic',
          lineHeight: 1.5, color: '#f5f0e8',
          marginBottom: '3rem',
          whiteSpace: 'pre-line',
        }}>
          {t('matrix.philosophy.quote',
            '"Every inhale is a universe\nexpanding. Every exhale,\na cosmos remembering itself."'
          )}
        </blockquote>
      </ScrollFade>

      <ScrollFade delay={0.2}>
        <GoldDivider />
      </ScrollFade>

      {/* Body copy — paragraph 1 */}
      <ScrollFade delay={0.3}>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 300,
          fontSize: '0.95rem', lineHeight: 1.9,
          color: 'rgba(245,240,232,0.55)', letterSpacing: '0.02em',
          marginBottom: '2.5rem',
        }}>
          {t('matrix.philosophy.body1',
            'The human body breathes approximately 20,000 times each day — a rhythm so ancient it predates consciousness itself. When we place the anatomical atlas beside the sacred geometric canon, something astonishing emerges: the branching of bronchi mirrors the fractal precision of the Sierpinski triangle. The alveolar clusters echo the geometry of the Flower of Life.'
          )}
        </p>
      </ScrollFade>

      {/* Body copy — paragraph 2 */}
      <ScrollFade delay={0.4}>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 300,
          fontSize: '0.95rem', lineHeight: 1.9,
          color: 'rgba(245,240,232,0.55)', letterSpacing: '0.02em',
        }}>
          {t('matrix.philosophy.body2',
            'Anatomy of Breath is a meditative inquiry into this convergence — a visual philosophy that honors both the scientific and the numinous, recognizing that the two have always been speaking the same language.'
          )}
        </p>
      </ScrollFade>

      <ScrollFade delay={0.5}>
        <GoldDivider />
      </ScrollFade>

      {/* Closing mantra */}
      <ScrollFade delay={0.6}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1rem', fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(212,175,55,0.5)', letterSpacing: '0.1em',
        }}>
          {t('matrix.philosophy.mantra', '— Breathe. Witness. Remember.')}
        </p>
      </ScrollFade>
    </div>
  )
}
