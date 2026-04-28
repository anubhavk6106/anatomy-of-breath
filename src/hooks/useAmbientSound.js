// useAmbientSound.js
// Generates a layered ambient drone entirely via Web Audio API.
// No audio files needed.
//
// Architecture:
//   [1] Sub-bass oscillator  — 55 Hz sine, the body/foundation
//   [2] Mid harmonic         — 110 Hz sine, one octave up, softer
//   [3] High shimmer         — 220 Hz sine, two octaves up, very quiet
//   [4] LFO → gain           — 0.05 Hz sine modulates master gain (breathing rhythm)
//   [5] Reverb convolver     — impulse-response reverb for space/depth
//   [6] Master gain          — overall volume, fades in/out on toggle

import { useRef, useCallback, useState } from 'react'

// Build a simple impulse-response reverb
function createReverb(ctx) {
  const convolver = ctx.createConvolver()
  const length    = ctx.sampleRate * 4          // 4 second tail
  const impulse   = ctx.createBuffer(2, length, ctx.sampleRate)

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5)
    }
  }
  convolver.buffer = impulse
  return convolver
}

export function useAmbientSound() {
  const [playing, setPlaying]   = useState(false)
  const ctxRef                  = useRef(null)
  const masterRef               = useRef(null)
  const nodesRef                = useRef([])

  const start = useCallback(() => {
    if (ctxRef.current) return   // already running

    const ctx    = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    // ── Reverb ──────────────────────────────────────
    const reverb     = createReverb(ctx)
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.35
    reverb.connect(reverbGain)
    reverbGain.connect(ctx.destination)

    // ── Master gain (controls overall volume) ───────
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3.5)  // slow fade-in
    master.connect(ctx.destination)
    master.connect(reverb)
    masterRef.current = master

    // ── LFO — breathing modulation ──────────────────
    // Modulates master gain ±0.04 at ~0.07 Hz (≈14s cycle, like a slow breath)
    const lfo      = ctx.createOscillator()
    const lfoGain  = ctx.createGain()
    lfo.type       = 'sine'
    lfo.frequency.value = 0.07
    lfoGain.gain.value  = 0.04
    lfo.connect(lfoGain)
    lfoGain.connect(master.gain)
    lfo.start()

    // ── Helper: create one oscillator layer ─────────
    function addOsc(freq, type, gainVal, detune = 0) {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type             = type
      osc.frequency.value  = freq
      osc.detune.value     = detune
      gain.gain.value      = gainVal
      osc.connect(gain)
      gain.connect(master)
      osc.start()
      nodesRef.current.push(osc, gain)
      return osc
    }

    // [1] Sub-bass — 55 Hz (A1), the grounding drone
    addOsc(55,  'sine',     1.0)
    // [2] Slight detune twin for warmth
    addOsc(55,  'sine',     0.4,  4)
    // [3] Octave harmonic — 110 Hz
    addOsc(110, 'sine',     0.25)
    // [4] Two-octave shimmer — 220 Hz, very soft
    addOsc(220, 'sine',     0.08)
    // [5] Subtle triangle for texture — 82.5 Hz (E2)
    addOsc(82.5,'triangle', 0.06)

    nodesRef.current.push(lfo, lfoGain, reverb, reverbGain, master)
    setPlaying(true)
  }, [])

  const stop = useCallback(() => {
    const ctx    = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    // Fade out gracefully over 1.5s then kill everything
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)

    setTimeout(() => {
      nodesRef.current.forEach(n => {
        try { n.stop?.(); n.disconnect?.() } catch (_) {}
      })
      nodesRef.current = []
      ctx.close()
      ctxRef.current  = null
      masterRef.current = null
      setPlaying(false)
    }, 1600)
  }, [])

  const toggle = useCallback(() => {
    playing ? stop() : start()
  }, [playing, start, stop])

  return { playing, toggle }
}
