
// BreathTimeline.jsx
// Scroll-driven vertical timeline — "The Journey of a Breath"
// Each stage reveals on scroll via IntersectionObserver.
// Alternates left/right on desktop, stacks on mobile.

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const EASE = [0.25, 0.46, 0.45, 0.94]

// ── Timeline stage data ───────────────────────────────────────
const ORIGINAL_STAGES = [
  {
    index: '01',
    phase: 'Inhale',
    title: 'The First Movement',
    subtitle: 'Diaphragm Descends',
    body: 'The diaphragm — a dome of muscle — contracts and flattens. Pressure inside the thorax drops below atmospheric. Air rushes in through the nose, warming and filtering as it travels the 11cm of the nasal passage.',
    metric: '0.5 L',
    metricLabel: 'tidal volume',
    side: 'right',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 140 Q100 80 170 140" stroke="rgba(245,240,232,0.6)" stroke-width="2" fill="rgba(245,240,232,0.04)"/>
      <path d="M30 155 Q100 95 170 155" stroke="rgba(245,240,232,0.3)" stroke-width="1"/>
      <path d="M30 170 Q100 110 170 170" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="100" y1="80" x2="100" y2="210" stroke="rgba(245,240,232,0.25)" stroke-width="1" stroke-dasharray="4 4"/>
      <circle cx="100" cy="80" r="6" fill="rgba(255,215,0,0.5)"/>
      <path d="M60 200 Q100 220 140 200" stroke="rgba(255,215,0,0.3)" stroke-width="1" fill="none"/>
      <line x1="40" y1="140" x2="40" y2="175" stroke="rgba(255,215,0,0.4)" stroke-width="1"/>
      <line x1="160" y1="140" x2="160" y2="175" stroke="rgba(255,215,0,0.4)" stroke-width="1"/>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="35" stroke="rgba(255,215,0,0.18)" stroke-width="0.5"/>
      <path d="M60 5 Q115 60 60 115 Q5 60 60 5Z" stroke="rgba(255,215,0,0.1)" stroke-width="0.5" fill="none"/>
    </svg>`,
  },
  {
    index: '02',
    phase: 'Descent',
    title: 'The Tracheal River',
    subtitle: 'Air Enters the Airways',
    body: 'Warmed to 37°C and humidified to 100%, air descends the trachea — a 12cm tube reinforced by C-shaped cartilage rings. At the carina, it divides: left bronchus and right bronchus, the first sacred bifurcation.',
    metric: '12 cm',
    metricLabel: 'tracheal length',
    side: 'left',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="100" y1="15" x2="100" y2="95" stroke="rgba(245,240,232,0.55)" stroke-width="3"/>
      <line x1="100" y1="95" x2="62" y2="145" stroke="rgba(245,240,232,0.48)" stroke-width="2.2"/>
      <line x1="100" y1="95" x2="138" y2="145" stroke="rgba(245,240,232,0.48)" stroke-width="2.2"/>
      <line x1="62" y1="145" x2="44" y2="190" stroke="rgba(245,240,232,0.35)" stroke-width="1.4"/>
      <line x1="62" y1="145" x2="80" y2="190" stroke="rgba(245,240,232,0.35)" stroke-width="1.4"/>
      <line x1="138" y1="145" x2="120" y2="190" stroke="rgba(245,240,232,0.35)" stroke-width="1.4"/>
      <line x1="138" y1="145" x2="156" y2="190" stroke="rgba(245,240,232,0.35)" stroke-width="1.4"/>
      <line x1="44" y1="190" x2="36" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="44" y1="190" x2="52" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="80" y1="190" x2="72" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="80" y1="190" x2="88" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="120" y1="190" x2="112" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="120" y1="190" x2="128" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="156" y1="190" x2="148" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="156" y1="190" x2="164" y2="218" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <circle cx="100" cy="95" r="5" stroke="rgba(255,215,0,0.5)" stroke-width="1" fill="rgba(255,215,0,0.1)"/>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="60,8 112,90 8,90" stroke="rgba(255,215,0,0.15)" stroke-width="0.5" fill="none"/>
      <polygon points="60,112 8,30 112,30" stroke="rgba(255,215,0,0.1)" stroke-width="0.5" fill="none"/>
      <circle cx="60" cy="60" r="40" stroke="rgba(255,215,0,0.1)" stroke-width="0.5"/>
    </svg>`,
  },
  {
    index: '03',
    phase: 'Expansion',
    title: 'The Lung Field Opens',
    subtitle: 'Alveolar Inflation',
    body: 'Air fans into 300 million alveoli — each a sphere 0.2mm across. The total surface area unfolds to 70m², the size of a tennis court. Surfactant coats each sac, reducing surface tension so they don\'t collapse.',
    metric: '300M',
    metricLabel: 'alveoli',
    side: 'right',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="115" r="32" stroke="rgba(245,240,232,0.45)" stroke-width="1.2"/>
      <circle cx="100" cy="115" r="20" stroke="rgba(245,240,232,0.3)" stroke-width=".8"/>
      <circle cx="56" cy="88" r="24" stroke="rgba(245,240,232,0.4)" stroke-width="1"/>
      <circle cx="144" cy="88" r="24" stroke="rgba(245,240,232,0.4)" stroke-width="1"/>
      <circle cx="68" cy="148" r="20" stroke="rgba(245,240,232,0.35)" stroke-width=".9"/>
      <circle cx="132" cy="148" r="20" stroke="rgba(245,240,232,0.35)" stroke-width=".9"/>
      <circle cx="100" cy="55" r="16" stroke="rgba(245,240,232,0.28)" stroke-width=".8"/>
      <circle cx="40" cy="130" r="14" stroke="rgba(245,240,232,0.22)" stroke-width=".7"/>
      <circle cx="160" cy="130" r="14" stroke="rgba(245,240,232,0.22)" stroke-width=".7"/>
      <circle cx="100" cy="175" r="12" stroke="rgba(245,240,232,0.18)" stroke-width=".6"/>
      <circle cx="100" cy="115" r="5" fill="rgba(255,215,0,0.35)"/>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" stroke="rgba(255,215,0,0.1)" stroke-width="0.5"/>
      <circle cx="60" cy="35" r="25" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
      <circle cx="82" cy="72" r="25" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
      <circle cx="38" cy="72" r="25" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
    </svg>`,
  },
  {
    index: '04',
    phase: 'Exchange',
    title: 'The Sacred Transfer',
    subtitle: 'Oxygen Crosses the Membrane',
    body: 'Across a membrane just 0.5 microns thick — thinner than a soap bubble — oxygen dissolves into the blood. Carbon dioxide flows the other way. This is the oldest transaction in animal life: 600 million years of evolution compressed into a single breath.',
    metric: '0.5 μm',
    metricLabel: 'membrane thickness',
    side: 'left',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="120" rx="60" ry="20" stroke="rgba(245,240,232,0.4)" stroke-width="1"/>
      <ellipse cx="100" cy="120" rx="60" ry="40" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <ellipse cx="100" cy="120" rx="60" ry="60" stroke="rgba(245,240,232,0.15)" stroke-width=".6"/>
      <circle cx="100" cy="120" r="60" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="40" y1="120" x2="160" y2="120" stroke="rgba(245,240,232,0.3)" stroke-width="1"/>
      <line x1="100" y1="60" x2="100" y2="180" stroke="rgba(245,240,232,0.3)" stroke-width="1"/>
      <circle cx="72" cy="100" r="8" fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.5)" stroke-width="0.8"/>
      <circle cx="128" cy="140" r="8" fill="rgba(255,100,100,0.15)" stroke="rgba(255,100,100,0.4)" stroke-width="0.8"/>
      <line x1="80" y1="100" x2="120" y2="100" stroke="rgba(255,215,0,0.3)" stroke-width=".6" stroke-dasharray="3 2"/>
      <line x1="80" y1="140" x2="120" y2="140" stroke="rgba(255,100,100,0.25)" stroke-width=".6" stroke-dasharray="3 2"/>
      <text x="62" y="98" font-size="7" fill="rgba(255,215,0,0.6)" font-family="serif">O₂</text>
      <text x="118" y="138" font-size="7" fill="rgba(255,120,120,0.6)" font-family="serif">CO₂</text>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="52" stroke="rgba(255,215,0,0.1)" stroke-width="0.5"/>
      <ellipse cx="60" cy="60" rx="52" ry="20" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
      <ellipse cx="60" cy="60" rx="52" ry="38" stroke="rgba(255,215,0,0.08)" stroke-width="0.5"/>
      <line x1="8" y1="60" x2="112" y2="60" stroke="rgba(255,215,0,0.1)" stroke-width="0.4"/>
      <line x1="60" y1="8" x2="60" y2="112" stroke="rgba(255,215,0,0.1)" stroke-width="0.4"/>
    </svg>`,
  },
  {
    index: '05',
    phase: 'Circulation',
    title: 'The Vascular Journey',
    subtitle: 'Oxygen Enters the Blood',
    body: 'Haemoglobin in red blood cells binds four oxygen molecules each. The pulmonary veins carry this oxygenated blood to the left heart, which pumps it into the aorta — beginning a 60,000-mile journey through the body\'s vascular network.',
    metric: '60,000 mi',
    metricLabel: 'vascular network',
    side: 'right',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 C100 20 94 55 106 95 C118 135 94 175 100 220" stroke="rgba(245,240,232,0.55)" stroke-width="3" fill="none"/>
      <path d="M96 65 C78 70 58 64 42 74" stroke="rgba(245,240,232,0.4)" stroke-width="1.6" fill="none"/>
      <path d="M104 65 C122 70 142 64 158 74" stroke="rgba(245,240,232,0.4)" stroke-width="1.6" fill="none"/>
      <path d="M104 108 C122 113 140 106 155 116" stroke="rgba(245,240,232,0.32)" stroke-width="1.2" fill="none"/>
      <path d="M96 108 C78 113 60 106 45 116" stroke="rgba(245,240,232,0.32)" stroke-width="1.2" fill="none"/>
      <path d="M96 155 C78 158 60 152 46 160" stroke="rgba(245,240,232,0.25)" stroke-width="1" fill="none"/>
      <path d="M104 155 C122 158 140 152 154 160" stroke="rgba(245,240,232,0.25)" stroke-width="1" fill="none"/>
      <circle cx="100" cy="48" r="4" fill="rgba(255,215,0,0.4)"/>
      <circle cx="100" cy="120" r="4" fill="rgba(255,215,0,0.3)"/>
      <circle cx="100" cy="192" r="4" fill="rgba(255,215,0,0.2)"/>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 10 Q110 60 60 110 Q10 60 60 10Z" stroke="rgba(255,215,0,0.12)" stroke-width="0.5" fill="none"/>
      <circle cx="60" cy="60" r="45" stroke="rgba(255,215,0,0.1)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="25" stroke="rgba(255,215,0,0.14)" stroke-width="0.5"/>
    </svg>`,
  },
  {
    index: '06',
    phase: 'Cellular',
    title: 'The Cellular Flame',
    subtitle: 'Mitochondrial Respiration',
    body: 'Inside each of the 37 trillion cells, mitochondria receive oxygen and combust glucose — producing ATP, the universal energy currency of life. This is the breath\'s final destination: the ancient fire that animates every thought, every movement, every heartbeat.',
    metric: '37 T',
    metricLabel: 'cells receiving O₂',
    side: 'left',
    svg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="120" rx="70" ry="50" stroke="rgba(245,240,232,0.4)" stroke-width="1.2"/>
      <ellipse cx="100" cy="120" rx="50" ry="34" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <ellipse cx="85" cy="112" rx="18" ry="12" stroke="rgba(255,215,0,0.45)" stroke-width="1" fill="rgba(255,215,0,0.04)"/>
      <ellipse cx="118" cy="130" rx="16" ry="10" stroke="rgba(255,215,0,0.38)" stroke-width=".9" fill="rgba(255,215,0,0.03)"/>
      <ellipse cx="95" cy="138" rx="12" ry="8" stroke="rgba(255,215,0,0.3)" stroke-width=".8" fill="rgba(255,215,0,0.03)"/>
      <circle cx="100" cy="120" r="6" fill="rgba(255,215,0,0.5)" stroke="rgba(255,215,0,0.8)" stroke-width="0.8"/>
      <line x1="100" y1="70" x2="100" y2="114" stroke="rgba(245,240,232,0.15)" stroke-width=".6" stroke-dasharray="3 3"/>
      <line x1="30" y1="120" x2="50" y2="120" stroke="rgba(245,240,232,0.15)" stroke-width=".6" stroke-dasharray="3 3"/>
      <line x1="150" y1="120" x2="170" y2="120" stroke="rgba(245,240,232,0.15)" stroke-width=".6" stroke-dasharray="3 3"/>
    </svg>`,
    geometryAccent: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" stroke="rgba(255,215,0,0.08)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="38" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="20" stroke="rgba(255,215,0,0.18)" stroke-width="0.5"/>
      <circle cx="60" cy="60" r="6" fill="rgba(255,215,0,0.25)"/>
    </svg>`,
  },
]

// ── useInView hook ────────────────────────────────────────────
function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ── Vertical spine line that fills as you scroll ──────────────
function SpineLine({ totalStages }) {
  const [height, setHeight] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const visible = Math.max(0, window.innerHeight - rect.top)
      const total = el.offsetHeight
      setHeight(Math.min(100, (visible / total) * 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      left: '50%', top: 0, bottom: 0,
      transform: 'translateX(-50%)',
      width: '1px',
      background: 'rgba(255,215,0,0.08)',
      pointerEvents: 'none',
    }}>
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.5), rgba(255,215,0,0.2))',
        height: `${height}%`,
        transition: 'height 0.1s linear',
      }} />
    </div>
  )
}

// ── Single timeline stage ─────────────────────────────────────
function Stage({ stage, isMobile }) {
  const [ref, inView] = useInView(0.2)
  const isRight = stage.side === 'right'

  // On mobile everything stacks; on desktop alternates sides
  const contentOrder = isMobile ? 0 : isRight ? 1 : 0
  const svgOrder     = isMobile ? 1 : isRight ? 0 : 1

  const slideX = isMobile ? 0 : isRight ? 40 : -40

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 80px 1fr',
      gap: isMobile ? '1.5rem' : '0',
      marginBottom: isMobile ? '4rem' : '0',
      paddingBottom: isMobile ? '0' : '6rem',
      alignItems: 'center',
    }}>

      {/* ── Content side ─────────────────────────── */}
      <motion.div
        style={{ order: contentOrder, padding: isMobile ? '0' : isRight ? '0 3rem 0 0' : '0 0 0 3rem' }}
        initial={{ opacity: 0, x: isMobile ? 0 : isRight ? -slideX : slideX, y: isMobile ? 20 : 0 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* Phase tag */}
        <div style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '9px', letterSpacing: '0.55em',
          color: 'rgba(255,215,0,0.5)', textTransform: 'uppercase',
          marginBottom: '0.7rem',
          textAlign: isMobile ? 'left' : isRight ? 'right' : 'left',
        }}>
          {stage.phase}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
          fontWeight: 300, color: '#f5f0e8',
          lineHeight: 1.15, marginBottom: '0.4rem',
          textAlign: isMobile ? 'left' : isRight ? 'right' : 'left',
        }}>
          {stage.title}
        </h3>

        {/* Subtitle */}
        <div style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '9px', letterSpacing: '0.4em',
          color: '#FFD700', textTransform: 'uppercase',
          marginBottom: '1.2rem',
          textAlign: isMobile ? 'left' : isRight ? 'right' : 'left',
        }}>
          {stage.subtitle}
        </div>

        {/* Gold rule */}
        <motion.div
          style={{
            height: '1px', marginBottom: '1.2rem',
            background: isRight
              ? 'linear-gradient(to left, #FFD700, transparent)'
              : 'linear-gradient(to right, #FFD700, transparent)',
            transformOrigin: isRight ? 'right' : 'left',
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        />

        {/* Body */}
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 300,
          fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
          lineHeight: 1.9, letterSpacing: '0.02em',
          color: 'rgba(245,240,232,0.5)',
          marginBottom: '1.4rem',
          textAlign: isMobile ? 'left' : isRight ? 'right' : 'left',
        }}>
          {stage.body}
        </p>

        {/* Metric pill */}
        <div style={{
          display: 'inline-flex', flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : isRight ? 'flex-end' : 'flex-start',
          gap: '0.15rem',
          float: isMobile ? 'none' : isRight ? 'right' : 'left',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            fontWeight: 300, color: '#FFD700',
            letterSpacing: '-0.01em',
          }}>
            {stage.metric}
          </span>
          <span style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '8px', letterSpacing: '0.35em',
            color: 'rgba(255,215,0,0.4)', textTransform: 'uppercase',
          }}>
            {stage.metricLabel}
          </span>
        </div>
        <div style={{ clear: 'both' }} />
      </motion.div>

      {/* ── Center spine node ─────────────────────── */}
      {!isMobile && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 2,
        }}>
          <motion.div
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              border: '1px solid rgba(255,215,0,0.4)',
              background: '#0b0b0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            {/* Pulse ring */}
            <motion.div style={{
              position: 'absolute', inset: -6,
              borderRadius: '50%',
              border: '1px solid rgba(255,215,0,0.2)',
            }}
              animate={inView ? { scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '8px', letterSpacing: '0.1em',
              color: 'rgba(255,215,0,0.7)',
            }}>
              {stage.index}
            </span>
          </motion.div>
        </div>
      )}

      {/* ── SVG visual side ───────────────────────── */}
      <motion.div
        style={{
          order: svgOrder,
          display: 'flex', alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : isRight ? 'flex-start' : 'flex-end',
          padding: isMobile ? '0' : isRight ? '0 0 0 3rem' : '0 3rem 0 0',
          position: 'relative',
        }}
        initial={{ opacity: 0, x: isMobile ? 0 : isRight ? slideX : -slideX, y: isMobile ? 20 : 0 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      >
        {/* Geometry accent — background */}
        <div style={{
          position: 'absolute',
          width: isMobile ? '100px' : '140px',
          height: isMobile ? '100px' : '140px',
          opacity: 0.6,
          pointerEvents: 'none',
          left: isMobile ? 'auto' : isRight ? '1rem' : 'auto',
          right: isMobile ? 'auto' : isRight ? 'auto' : '1rem',
        }}
          dangerouslySetInnerHTML={{ __html: stage.geometryAccent }}
        />

        {/* Anatomy SVG */}
        <motion.div
          style={{
            width: isMobile ? '110px' : 'clamp(130px, 18vw, 200px)',
            height: isMobile ? '130px' : 'clamp(155px, 21vw, 240px)',
            position: 'relative', zIndex: 1,
          }}
          animate={inView ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          dangerouslySetInnerHTML={{ __html: stage.svg }}
        />

        {/* Mobile index badge */}
        {isMobile && (
          <div style={{
            position: 'absolute', top: 0, right: 0,
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '9px', letterSpacing: '0.3em',
            color: 'rgba(255,215,0,0.4)',
          }}>
            {stage.index}
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ── BreathTimeline ────────────────────────────────────────────
export default function BreathTimeline() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [headerRef, headerInView] = useInView(0.3)
  const { t } = useTranslation()
  const STAGES = t('matrix.timeline.steps', {
  returnObjects: true
}).map((step, index) => ({
  index: step.step,
  phase: step.phase,
  title: step.title,
  subtitle: step.subtitle,
  body: step.description,
  metric: step.stat,
  metricLabel: step.statLabel,

  // keep your original design
  side: ORIGINAL_STAGES[index].side,
  svg: ORIGINAL_STAGES[index].svg,
  geometryAccent: ORIGINAL_STAGES[index].geometryAccent
}))

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn, { passive: true })
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div style={{
      background: '#080808',
      padding: 'clamp(4rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Section header ─────────────────────────── */}
      <motion.div
        ref={headerRef}
        style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vw, 6rem)' }}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '10px', letterSpacing: '0.6em',
          color: '#FFD700', textTransform: 'uppercase',
          marginBottom: '1.2rem', opacity: 0.7,
        }}>
          {t('matrix.timeline.label', 'The Journey')}
        </p>
        <div style={{
          width: '50px', height: '1px',
          background: 'linear-gradient(to right, transparent, #FFD700, transparent)',
          margin: '0 auto 1.8rem',
        }} />
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 300, color: '#f5f0e8', lineHeight: 1.1,
        }}>
          {t('matrix.timeline.title', 'From Inhale to')}<br />
          <em style={{ fontStyle: 'italic', color: '#FFD700' }}>{t('matrix.timeline.titleItalic', 'Cellular Fire')}</em>
        </h2>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', letterSpacing: '0.25em',
          color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase',
          marginTop: '1.2rem',
        }}>
          {t('matrix.timeline.subtitle', 'Scroll to follow the breath')}
        </p>
      </motion.div>

      {/* ── Timeline body ──────────────────────────── */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        position: 'relative',
      }}>
        {/* Vertical spine — desktop only */}
        {!isMobile && <SpineLine totalStages={STAGES.length} />}

        {/* Stages */}
        {STAGES.map(stage => (
          <Stage key={stage.index} stage={stage} isMobile={isMobile} />
        ))}
      </div>

      {/* ── End marker ─────────────────────────────── */}
      <motion.div
        style={{ textAlign: 'center', marginTop: isMobile ? '2rem' : '0', paddingTop: '2rem' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <div style={{
          width: '1px', height: '50px',
          background: 'linear-gradient(to bottom, rgba(255,215,0,0.3), transparent)',
          margin: '0 auto 1.5rem',
        }} />
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(255,215,0,0.4)',
          letterSpacing: '0.08em',
        }}>
          {t('matrix.timeline.ending', '— And then, the exhale begins.')}
        </p>
      </motion.div>
    </div>
  )
}
