// BreathVisualizer.jsx
// Interactive 4-7-8 breathing guide.
//
// Phases:
//   INHALE  — 4s  — circle expands, rings bloom outward
//   HOLD    — 7s  — circle holds at max, geometry pulses gently
//   EXHALE  — 8s  — circle contracts, rings draw inward
//   REST    — 1s  — brief pause before next cycle
//
// User starts/stops by clicking the center.
// Sacred geometry rings orbit the breath circle while active.

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

const EASE_BREATH = [0.45, 0.05, 0.55, 0.95]

// ── Phase config ─────────────────────────────────────────────
const PHASES = [
  { name: 'Inhale',  duration: 4,  instruction: 'Breathe in',       color: 'rgba(255,215,0,0.9)'  },
  { name: 'Hold',    duration: 7,  instruction: 'Hold',              color: 'rgba(255,180,60,0.85)' },
  { name: 'Exhale',  duration: 8,  instruction: 'Breathe out',       color: 'rgba(255,215,0,0.6)'  },
  { name: 'Rest',    duration: 1,  instruction: 'Rest',              color: 'rgba(255,215,0,0.35)' },
]

const TOTAL_CYCLE = PHASES.reduce((s, p) => s + p.duration, 0) // 20s

// ── Orbit ring — rotates around the breath circle ────────────
function OrbitRing({ radius, duration, reverse, strokeWidth, opacity, active }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2, height: radius * 2,
        borderRadius: '50%',
        border: `${strokeWidth}px solid rgba(255,215,0,${opacity})`,
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
        pointerEvents: 'none',
      }}
      animate={active
        ? { rotate: reverse ? -360 : 360, opacity }
        : { rotate: 0, opacity: opacity * 0.3 }
      }
      transition={active
        ? { rotate: { duration, ease: 'linear', repeat: Infinity }, opacity: { duration: 1 } }
        : { duration: 1.5 }
      }
    />
  )
}

// ── Tick marks ring (sacred geometry feel) ───────────────────
function TickRing({ radius, count, active }) {
  const ticks = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360
    return angle
  })
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: radius * 2, height: radius * 2,
        top: '50%', left: '50%',
        marginTop: -radius, marginLeft: -radius,
        pointerEvents: 'none',
      }}
      animate={{ rotate: active ? 360 : 0 }}
      transition={{ duration: 30, ease: 'linear', repeat: active ? Infinity : 0 }}
    >
      <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}
           style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {ticks.map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const cx = radius, cy = radius
          const inner = radius - 6
          const outer = radius + 2
          return (
            <motion.line key={i}
              x1={cx + Math.cos(rad) * inner}
              y1={cy + Math.sin(rad) * inner}
              x2={cx + Math.cos(rad) * outer}
              y2={cy + Math.sin(rad) * outer}
              stroke="#FFD700"
              strokeWidth={i % 4 === 0 ? 1.2 : 0.5}
              animate={{ opacity: active ? (i % 4 === 0 ? 0.6 : 0.2) : 0.08 }}
              transition={{ duration: 0.8 }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

// ── Countdown arc — SVG circle that drains over phase duration ─
function CountdownArc({ duration, phase, active }) {
  const controls = useAnimation()
  const R = 88
  const circumference = 2 * Math.PI * R

  useEffect(() => {
    if (!active) return
    controls.set({ strokeDashoffset: 0 })
    controls.start({
      strokeDashoffset: circumference,
      transition: { duration, ease: 'linear' },
    })
  }, [phase, active, duration, circumference, controls])

  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        transform: 'rotate(-90deg)',
        pointerEvents: 'none',
      }}
    >
      {/* Track */}
      <circle cx="100" cy="100" r={R}
        fill="none" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
      {/* Progress */}
      <motion.circle cx="100" cy="100" r={R}
        fill="none"
        stroke="rgba(255,215,0,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animate={controls}
      />
    </svg>
  )
}

// ── Main BreathVisualizer ─────────────────────────────────────
export default function BreathVisualizer() {
  const [active, setActive]       = useState(false)
  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [elapsed, setElapsed]     = useState(0)   // seconds within current phase
  const timerRef                  = useRef(null)
  const phaseTimerRef             = useRef(null)

  const phase = PHASES[phaseIdx]

  // Advance through phases
  const advancePhase = useCallback((idx) => {
    const next = (idx + 1) % PHASES.length
    setPhaseIdx(next)
    setElapsed(0)
    if (next === 0) setCycleCount(c => c + 1)

    phaseTimerRef.current = setTimeout(() => advancePhase(next), PHASES[next].duration * 1000)
  }, [])

  const startCycle = useCallback(() => {
    setPhaseIdx(0)
    setElapsed(0)
    phaseTimerRef.current = setTimeout(() => advancePhase(0), PHASES[0].duration * 1000)
  }, [advancePhase])

  // Elapsed counter (updates every second for the countdown display)
  useEffect(() => {
    if (!active) return
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [active, phaseIdx])

  const toggle = useCallback(() => {
    if (active) {
      clearTimeout(phaseTimerRef.current)
      clearInterval(timerRef.current)
      setActive(false)
      setPhaseIdx(0)
      setElapsed(0)
    } else {
      setActive(true)
      startCycle()
    }
  }, [active, startCycle])

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimeout(phaseTimerRef.current)
    clearInterval(timerRef.current)
  }, [])

  // Circle scale per phase
  const circleScale = {
    Inhale: 1,
    Hold:   1,
    Exhale: 0.42,
    Rest:   0.42,
  }
  const targetScale = active ? circleScale[phase.name] : 0.55

  const remainingSecs = Math.max(0, phase.duration - elapsed)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '0',
      userSelect: 'none',
    }}>

      {/* ── Visualizer circle ──────────────────────── */}
      <div style={{
        position: 'relative',
        width: 'min(260px, 58vw)',
        height: 'min(260px, 58vw)',
      }}>

        {/* Orbit rings */}
        <OrbitRing radius={active ? 148 : 120} duration={18} reverse={false} strokeWidth={0.5} opacity={0.18} active={active} />
        <OrbitRing radius={active ? 128 : 105} duration={12} reverse={true}  strokeWidth={0.4} opacity={0.14} active={active} />

        {/* Tick ring */}
        <TickRing radius={active ? 138 : 112} count={48} active={active} />

        {/* Countdown arc */}
        {active && (
          <CountdownArc
            key={`${phaseIdx}-${cycleCount}`}
            duration={phase.duration}
            phase={phaseIdx}
            active={active}
          />
        )}

        {/* Outer glow ring */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(255,215,0,0.2)',
            pointerEvents: 'none',
          }}
          animate={active && phase.name === 'Inhale'
            ? { scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }
            : { scale: 1, opacity: active ? 0.3 : 0.15 }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main breath circle — the core visual */}
        <motion.div
          onClick={toggle}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            background: active
              ? `radial-gradient(circle at 40% 38%, rgba(255,215,0,0.22), rgba(255,180,0,0.08) 55%, transparent 75%)`
              : 'radial-gradient(circle at 40% 38%, rgba(255,215,0,0.08), transparent 70%)',
            border: `1px solid ${active ? phase.color : 'rgba(255,215,0,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: active
              ? `0 0 40px rgba(255,215,0,0.12), inset 0 0 30px rgba(255,215,0,0.06)`
              : 'none',
          }}
          animate={{
            scale: targetScale,
            borderColor: active ? phase.color : 'rgba(255,215,0,0.25)',
          }}
          transition={
            phase.name === 'Inhale'
              ? { duration: phase.duration, ease: [0.4, 0, 0.2, 1] }
              : phase.name === 'Exhale'
              ? { duration: phase.duration, ease: [0.8, 0, 0.6, 1] }
              : { duration: 0.8, ease: 'easeOut' }
          }
        >
          {/* Inner content */}
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div key={phaseIdx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Phase name */}
                  <div style={{
                    fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                    fontSize: 'clamp(8px, 2vw, 10px)', letterSpacing: '0.4em',
                    color: phase.color, textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}>
                    {phase.name}
                  </div>
                  {/* Countdown */}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                    fontWeight: 300, color: '#f5f0e8',
                    lineHeight: 1,
                  }}>
                    {remainingSecs}
                  </div>
                  {/* Instruction */}
                  <div style={{
                    fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                    fontSize: 'clamp(7px, 1.8vw, 9px)', letterSpacing: '0.3em',
                    color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase',
                    marginTop: '0.3rem',
                  }}>
                    {phase.instruction}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{
                    fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                    fontSize: 'clamp(7px, 1.8vw, 9px)', letterSpacing: '0.4em',
                    color: 'rgba(255,215,0,0.5)', textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}>
                    4 · 7 · 8
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(0.85rem, 3vw, 1.1rem)',
                    fontWeight: 300, fontStyle: 'italic',
                    color: 'rgba(245,240,232,0.6)',
                  }}>
                    Begin
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ── Phase label strip ──────────────────────── */}
      <div style={{
        display: 'flex', gap: 'clamp(0.8rem, 3vw, 1.8rem)',
        marginTop: '1.8rem', alignItems: 'center',
      }}>
        {PHASES.filter(p => p.name !== 'Rest').map((p, i) => (
          <div key={p.name} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              fontWeight: 300,
              color: active && PHASES[phaseIdx].name === p.name
                ? '#FFD700' : 'rgba(245,240,232,0.25)',
              transition: 'color 0.5s',
            }}>
              {p.duration}
            </div>
            <div style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: 'clamp(6px, 1.5vw, 8px)', letterSpacing: '0.35em',
              color: active && PHASES[phaseIdx].name === p.name
                ? 'rgba(255,215,0,0.6)' : 'rgba(245,240,232,0.18)',
              textTransform: 'uppercase',
              transition: 'color 0.5s',
            }}>
              {p.name}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cycle counter ──────────────────────────── */}
      <AnimatePresence>
        {cycleCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '1.2rem',
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '9px', letterSpacing: '0.4em',
              color: 'rgba(255,215,0,0.3)', textTransform: 'uppercase',
            }}
          >
            Cycle {cycleCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stop hint ──────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            style={{
              marginTop: '0.8rem',
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '8px', letterSpacing: '0.3em',
              color: 'rgba(255,215,0,0.2)', textTransform: 'uppercase',
            }}
          >
            Tap to stop
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
