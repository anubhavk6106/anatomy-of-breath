// Preloader.jsx
// Cinematic full-screen intro sequence:
//   Phase 1 (0–1.2s)  — black screen, single gold dot pulses in
//   Phase 2 (1.2–3s)  — Flower of Life rings draw outward one by one
//   Phase 3 (3–4.2s)  — "Anatomy of Breath" title fades up
//   Phase 4 (4.2–5s)  — tagline fades in + progress line fills
//   Phase 5 (5–5.8s)  — everything dissolves, screen fades to black → out

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '../config'

const EASE     = [0.25, 0.46, 0.45, 0.94]
const EASE_OUT = [0.0,  0.0,  0.2,  1.0]

// ── Concentric sacred geometry rings ─────────────────────────
const RINGS = [
  { r: 18,  delay: 0.0,  stroke: 0.8, opacity: 0.9  },
  { r: 36,  delay: 0.18, stroke: 0.7, opacity: 0.75 },
  { r: 54,  delay: 0.36, stroke: 0.6, opacity: 0.6  },
  { r: 72,  delay: 0.54, stroke: 0.5, opacity: 0.45 },
  { r: 90,  delay: 0.72, stroke: 0.4, opacity: 0.32 },
  { r: 108, delay: 0.90, stroke: 0.3, opacity: 0.2  },
  { r: 126, delay: 1.08, stroke: 0.3, opacity: 0.12 },
]

// Flower of Life petal circles
const PETALS = [
  { cx: 0,   cy: -54  },
  { cx: 46.8, cy: -27 },
  { cx: 46.8, cy: 27  },
  { cx: 0,   cy: 54   },
  { cx: -46.8, cy: 27 },
  { cx: -46.8, cy: -27},
]

function Ring({ r, delay, stroke, opacity, show }) {
  return (
    <motion.circle
      cx="0" cy="0" r={r}
      fill="none"
      stroke="#D4AF37"
      strokeWidth={stroke}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    />
  )
}

function Petal({ cx, cy, delay, show }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={54}
      fill="none"
      stroke="#D4AF37"
      strokeWidth="0.4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 0.25 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 1.4, delay, ease: EASE_OUT }}
    />
  )
}

// ── Main Preloader ────────────────────────────────────────────
export default function Preloader({ onComplete }) {
  const [phase, setPhase]       = useState(0) // 0=dot, 1=rings, 2=title, 3=tagline, 4=exit
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 3600),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => onComplete(), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Progress bar fills from phase 1 → 4
  useEffect(() => {
    if (phase < 1) return
    const targets = [0, 25, 60, 85, 100]
    const target  = targets[Math.min(phase, 4)]
    const step    = () => setProgress(p => {
      if (p >= target) return p
      return p + 1
    })
    const id = setInterval(step, 18)
    return () => clearInterval(id)
  }, [phase])

  return (
    <AnimatePresence>
      {phase < 4 ? (
        <motion.div
          key="preloader"
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: '#0b0b0b',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* ── Geometry canvas ─────────────────────── */}
          <div style={{ position: 'relative', width: 'min(320px, 72vw)', height: 'min(320px, 72vw)' }}>
            <svg
              viewBox="-160 -160 320 320"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* Flower of Life petals */}
              {PETALS.map((p, i) => (
                <Petal key={i} {...p} delay={0.3 + i * 0.12} show={phase >= 1} />
              ))}

              {/* Concentric rings */}
              {RINGS.map((ring, i) => (
                <Ring key={i} {...ring} show={phase >= 1} />
              ))}

              {/* Cross axes */}
              {phase >= 1 && (
                <>
                  <motion.line
                    x1="-130" y1="0" x2="130" y2="0"
                    stroke="#D4AF37" strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT }}
                  />
                  <motion.line
                    x1="0" y1="-130" x2="0" y2="130"
                    stroke="#D4AF37" strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT }}
                  />
                  {/* Diagonal axes */}
                  <motion.line
                    x1="-92" y1="-92" x2="92" y2="92"
                    stroke="#D4AF37" strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.12 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: EASE_OUT }}
                  />
                  <motion.line
                    x1="92" y1="-92" x2="-92" y2="92"
                    stroke="#D4AF37" strokeWidth="0.3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.12 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: EASE_OUT }}
                  />
                </>
              )}

              {/* Center dot — always visible, pulses */}
              <motion.circle
                cx="0" cy="0" r="3"
                fill="#D4AF37"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.9] }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              />
              {/* Breathing outer ring on dot */}
              <motion.circle
                cx="0" cy="0" r="8"
                fill="none" stroke="#D4AF37" strokeWidth="0.6"
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {/* ── Title ───────────────────────────────── */}
          <motion.div
            style={{ textAlign: 'center', marginTop: 'clamp(1.2rem, 4vw, 2.5rem)', position: 'relative', padding: '0 1rem' }}
            initial={{ opacity: 0, y: 24 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '9px', letterSpacing: '0.55em',
              color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase',
              marginBottom: '0.9rem',
            }}>
              {SITE.domain}
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
              lineHeight: 1.1,
              color: '#f5f0e8',
              letterSpacing: '-0.01em',
            }}>
              Anatomy of<br />
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Breath</em>
            </h1>
          </motion.div>

          {/* ── Tagline + progress ───────────────────── */}
          <motion.div
            style={{ textAlign: 'center', marginTop: '1.5rem', padding: '0 1.5rem' }}
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: 'clamp(8px, 2.2vw, 10px)', letterSpacing: '0.3em',
              color: 'rgba(245,240,232,0.35)', textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              Where science dissolves into sacred
            </p>

            {/* Progress bar */}
            <div style={{
              width: '160px', height: '1px',
              background: 'rgba(212,175,55,0.12)',
              margin: '0 auto', position: 'relative', overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  background: 'linear-gradient(to right, transparent, #D4AF37)',
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* ── Ambient corner geometry ──────────────── */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos, i) => (
            <motion.div
              key={pos}
              style={{
                position: 'absolute',
                ...(pos.includes('top')    ? { top: '2rem' }    : { bottom: '2rem' }),
                ...(pos.includes('left')   ? { left: '2rem' }   : { right: '2rem' }),
                width: '40px', height: '40px',
                borderTop:    pos.includes('top')    ? '1px solid rgba(212,175,55,0.2)' : 'none',
                borderBottom: pos.includes('bottom') ? '1px solid rgba(212,175,55,0.2)' : 'none',
                borderLeft:   pos.includes('left')   ? '1px solid rgba(212,175,55,0.2)' : 'none',
                borderRight:  pos.includes('right')  ? '1px solid rgba(212,175,55,0.2)' : 'none',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.08, ease: EASE }}
            />
          ))}

        </motion.div>
      ) : (
        // Exit: fade to black then unmount
        <motion.div
          key="exit"
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: '#0b0b0b',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      )}
    </AnimatePresence>
  )
}
