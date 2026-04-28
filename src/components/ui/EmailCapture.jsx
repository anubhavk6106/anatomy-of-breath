// EmailCapture.jsx
// Simple email capture — opens the user's email client pre-filled.
// No third-party service required.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '../../config'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | success
  const [focused, setFocused] = useState(false)

  const validate = () => {
    if (!email.trim()) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email'
    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }
    setError('')

    // Open email client pre-filled
    const subject = encodeURIComponent('Vault — Notify me when it opens')
    const body = encodeURIComponent(`Please add me to the Vault notification list.\n\nEmail: ${email}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`

    setStatus('success')
    setEmail('')
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              padding: '2rem',
              border: '1px solid rgba(255,215,0,0.2)',
              background: 'rgba(255,215,0,0.03)',
              textAlign: 'center',
            }}
          >
            <motion.svg viewBox="0 0 60 60" fill="none"
              style={{ width: '48px', height: '48px', margin: '0 auto 1rem', display: 'block' }}
            >
              <motion.circle cx="30" cy="30" r="28"
                stroke="rgba(255,215,0,0.5)" strokeWidth="1"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              <motion.path d="M18 30 L26 38 L42 22"
                stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
              />
            </motion.svg>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', marginBottom: '0.5rem' }}>
              Your email client is opening
            </p>
            <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,215,0,0.5)', textTransform: 'uppercase' }}>
              Complete sending from your email app
            </p>

            <button
              onClick={() => setStatus('idle')}
              style={{ marginTop: '1.5rem', background: 'none', border: '1px solid rgba(255,215,0,0.2)', color: 'rgba(255,215,0,0.5)', fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', padding: '0.6rem 1.2rem', cursor: 'pointer', transition: 'border-color 0.3s, color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; e.currentTarget.style.color = '#FFD700' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = 'rgba(255,215,0,0.5)' }}
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            noValidate
          >
            <div style={{ marginBottom: '1rem', position: 'relative' }}>
              <label htmlFor="email-capture-input" style={{ display: 'block', fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '9px', letterSpacing: '0.45em', color: error ? 'rgba(255,100,100,0.7)' : focused ? 'rgba(255,215,0,0.7)' : 'rgba(245,240,232,0.3)', textTransform: 'uppercase', marginBottom: '0.5rem', transition: 'color 0.3s' }}>
                Your Email
              </label>
              <input
                id="email-capture-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.75rem 1rem', background: focused ? 'rgba(255,215,0,0.03)' : 'transparent', border: `1px solid ${error ? 'rgba(255,100,100,0.4)' : focused ? 'rgba(255,215,0,0.45)' : 'rgba(255,215,0,0.15)'}`, color: '#f5f0e8', fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '13px', letterSpacing: '0.04em', outline: 'none', transition: 'border-color 0.3s, background 0.3s', borderRadius: 0, WebkitAppearance: 'none' }}
              />
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '8px', letterSpacing: '0.3em', color: 'rgba(255,100,100,0.7)', textTransform: 'uppercase', marginTop: '0.4rem' }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div style={{ textAlign: 'center' }}>
              <motion.button
                type="submit"
                style={{ padding: '0.9rem 2.5rem', background: 'transparent', border: '1px solid rgba(255,215,0,0.5)', color: '#FFD700', fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'pointer', transition: 'border-color 0.3s, color 0.3s, background 0.3s' }}
                whileHover={{ backgroundColor: 'rgba(255,215,0,0.06)' }}
                whileTap={{ scale: 0.97 }}
              >
                Notify Me
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
