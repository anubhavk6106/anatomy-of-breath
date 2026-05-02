// TransitionFlash.jsx
// Full-screen dissolve overlay that flashes on nav transitions.
// A thin horizontal gold line sweeps across at peak opacity for a cinematic feel.

import { motion, AnimatePresence } from 'framer-motion'

export default function TransitionFlash({ flash }) {
  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key="flash"
          style={{
            position: 'fixed', inset: 0,
            zIndex: 9998,
            pointerEvents: 'none',
            background: '#0b0b0b',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Horizontal gold sweep line */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              top: '50%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)',
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Subtle radial vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
