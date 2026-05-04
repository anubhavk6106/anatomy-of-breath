// SoundToggle.jsx
// Minimal gold icon button for the nav — mute/unmute ambient drone.
// Shows animated sound-wave bars when playing, a flat line when muted.

import { motion, AnimatePresence } from 'framer-motion'

const BAR_HEIGHTS = [10, 16, 12, 18, 10]   // relative heights of the 5 bars

export default function SoundToggle({ playing, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      title={playing ? 'Mute' : 'Ambient sound'}
      style={{
        background: 'none',
        border: '1px solid rgba(212,175,55,0.22)',
        cursor: 'pointer',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        color: playing ? '#D4AF37' : 'rgba(212,175,55,0.4)',
        transition: 'border-color 0.3s, color 0.3s',
      }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.6)', color: '#D4AF37' }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Waveform icon */}
      <svg
        viewBox="0 0 28 20"
        style={{ width: '22px', height: '16px', overflow: 'visible' }}
      >
        {BAR_HEIGHTS.map((h, i) => {
          // Compute the initial height and y so the SVG attribute is always
          // a valid number — never undefined. The browser requires a concrete
          // value on the element; Framer Motion's animate-only values arrive
          // too late and cause: "Expected length, 'undefined'"
          const initH = playing ? h * 0.5 : 3
          const initY = (20 - initH) / 2

          return (
            <motion.rect
              key={i}
              x={i * 6}
              y={initY}
              width="3"
              height={initH}
              rx="1.5"
              fill="currentColor"
              animate={playing
                ? {
                    height: [h * 0.5, h, h * 0.7, h * 0.9, h * 0.5],
                    y: [(20 - h * 0.5) / 2, (20 - h) / 2, (20 - h * 0.7) / 2, (20 - h * 0.9) / 2, (20 - h * 0.5) / 2],
                  }
                : { height: 3, y: 8.5 }
              }
              transition={playing
                ? {
                    duration: 1.4 + i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.12,
                  }
                : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
              }
            />
          )
        })}
      </svg>

      {/* Label */}
      <span style={{
        fontFamily: 'Raleway, sans-serif',
        fontWeight: 200,
        fontSize: '9px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      }}>
        {playing ? 'Sound' : 'Sound'}
      </span>
    </motion.button>
  )
}
