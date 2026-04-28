// Contact.jsx
// Contact form — submits via native mailto link (no third-party service required).
// On submit, opens the user's email client pre-filled with the message.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '../config'

const EASE = [0.25, 0.46, 0.45, 0.94]

// ── Shared input style ────────────────────────────────────────
function Field({ as: Tag = 'input', label, error, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: '1.2rem', position: 'relative' }}>
      <label style={{
        display: 'block',
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '9px', letterSpacing: '0.45em',
        color: error ? 'rgba(255,100,100,0.7)' : focused ? 'rgba(255,215,0,0.7)' : 'rgba(245,240,232,0.3)',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
        transition: 'color 0.3s',
      }}>
        {label}
      </label>
      <Tag
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%',
          padding: Tag === 'textarea' ? '0.9rem 1rem' : '0.75rem 1rem',
          background: focused ? 'rgba(255,215,0,0.03)' : 'transparent',
          border: `1px solid ${error ? 'rgba(255,100,100,0.4)' : focused ? 'rgba(255,215,0,0.45)' : 'rgba(255,215,0,0.15)'}`,
          color: '#f5f0e8',
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '13px',
          letterSpacing: '0.04em',
          outline: 'none',
          resize: Tag === 'textarea' ? 'vertical' : undefined,
          transition: 'border-color 0.3s, background 0.3s',
          borderRadius: 0,
          WebkitAppearance: 'none',
        }}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '8px', letterSpacing: '0.3em',
            color: 'rgba(255,100,100,0.7)', textTransform: 'uppercase',
            marginTop: '0.4rem',
          }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// ── Contact ───────────────────────────────────────────────────
export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | success

  const set = (key) => (e) => setFields(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!fields.name.trim())    e.name    = 'Name is required'
    if (!fields.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = 'Enter a valid email'
    if (!fields.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})

    // Build mailto link with pre-filled subject and body
    const subject = encodeURIComponent(`Message from ${fields.name}`)
    const body = encodeURIComponent(
      `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`
    )
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`

    // Show success state
    setStatus('success')
    setFields({ name: '', email: '', message: '' })
  }

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto',
      padding: 'clamp(4rem, 10vw, 7rem) clamp(1.25rem, 5vw, 2rem)',
      textAlign: 'center',
    }}>

      {/* Section label */}
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        letterSpacing: '0.6em', fontSize: '10px',
        color: '#FFD700', textTransform: 'uppercase',
        marginBottom: '1.5rem', opacity: 0.7,
      }}>
        Contact
      </p>

      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 300, color: '#f5f0e8',
        marginBottom: '1rem',
      }}>
        Begin the <em style={{ color: '#FFD700', fontStyle: 'italic' }}>Dialogue</em>
      </h2>

      <p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        color: 'rgba(245,240,232,0.4)', lineHeight: 1.8,
        fontSize: '0.88rem', letterSpacing: '0.02em',
        marginBottom: '3rem',
      }}>
        For collaborations, inquiries, or shared explorations of breath and form.
      </p>

      {/* Gold divider */}
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.4), transparent)',
        margin: '0 auto 3rem',
      }} />

      {/* ── Success state ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              padding: '3rem 2rem',
              border: '1px solid rgba(255,215,0,0.2)',
              background: 'rgba(255,215,0,0.03)',
            }}
          >
            {/* Animated check */}
            <motion.svg
              viewBox="0 0 60 60" fill="none"
              style={{ width: '52px', height: '52px', margin: '0 auto 1.5rem', display: 'block' }}
            >
              <motion.circle cx="30" cy="30" r="28"
                stroke="rgba(255,215,0,0.5)" strokeWidth="1"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              <motion.path d="M18 30 L26 38 L42 22"
                stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
              />
            </motion.svg>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem', fontWeight: 300, fontStyle: 'italic',
              color: '#f5f0e8', marginBottom: '0.6rem',
            }}>
              Your email client is opening
            </p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '11px', letterSpacing: '0.3em',
              color: 'rgba(255,215,0,0.5)', textTransform: 'uppercase',
            }}>
              Complete sending from your email app
            </p>

            <button
              onClick={() => setStatus('idle')}
              style={{
                marginTop: '2rem',
                background: 'none', border: '1px solid rgba(255,215,0,0.2)',
                color: 'rgba(255,215,0,0.5)',
                fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                fontSize: '9px', letterSpacing: '0.4em',
                textTransform: 'uppercase',
                padding: '0.6rem 1.4rem', cursor: 'pointer',
                transition: 'border-color 0.3s, color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; e.currentTarget.style.color = '#FFD700' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = 'rgba(255,215,0,0.5)' }}
            >
              Send another
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
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              border: '1px solid rgba(255,215,0,0.12)',
              background: 'rgba(255,215,0,0.02)',
              textAlign: 'left',
            }}
            noValidate
          >
            {/* Name + Email row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0 1.2rem',
            }}>
              <Field
                label="Your Name"
                name="from_name"
                type="text"
                value={fields.name}
                onChange={set('name')}
                error={errors.name}
                placeholder="e.g. Ana García"
              />
              <Field
                label="Your Email"
                name="from_email"
                type="email"
                value={fields.email}
                onChange={set('email')}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>

            <Field
              as="textarea"
              label="Your Message"
              name="message"
              rows={5}
              value={fields.message}
              onChange={set('message')}
              error={errors.message}
              placeholder="Share your inquiry, collaboration idea, or reflection…"
            />

            {/* Submit */}
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <motion.button
                type="submit"
                style={{
                  padding: '0.9rem 3rem',
                  background: 'transparent',
                  border: '1px solid rgba(255,215,0,0.5)',
                  color: '#FFD700',
                  fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                  fontSize: '10px', letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s, color 0.3s, background 0.3s',
                }}
                whileHover={{ backgroundColor: 'rgba(255,215,0,0.06)' }}
                whileTap={{ scale: 0.97 }}
              >
                Send Message
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Direct email link */}
      <p style={{
        fontFamily: 'Raleway, sans-serif', fontWeight: 200,
        fontSize: '9px', letterSpacing: '0.3em',
        color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase',
        marginTop: '2rem',
      }}>
        Or write directly —{' '}
        <a href={SITE.mailtoHref}
          style={{ color: 'rgba(255,215,0,0.35)', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,215,0,0.35)'}
        >
          {SITE.email}
        </a>
      </p>
    </div>
  )
}
