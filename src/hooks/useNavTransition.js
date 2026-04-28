// useNavTransition.js
// Intercepts anchor clicks, fires a flash overlay, then smooth-scrolls.
//
// Usage:
//   const { flash, navigateTo } = useNavTransition()
//   <TransitionFlash flash={flash} />
//   <a onClick={e => { e.preventDefault(); navigateTo('gallery') }}>Gallery</a>

import { useState, useCallback } from 'react'

export function useNavTransition() {
  const [flash, setFlash] = useState(false)

  const navigateTo = useCallback((sectionId, onAfter) => {
    // 1. Trigger the flash overlay
    setFlash(true)

    setTimeout(() => {
      // 2. Scroll to target while overlay is opaque
      const el = sectionId === 'top'
        ? document.body
        : document.getElementById(sectionId)

      if (el) {
        el.scrollIntoView({ behavior: 'instant' })
      } else if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }

      onAfter?.()

      // 3. Fade the overlay back out
      setTimeout(() => setFlash(false), 80)
    }, 280) // wait for fade-in to peak before scrolling
  }, [])

  return { flash, navigateTo }
}
