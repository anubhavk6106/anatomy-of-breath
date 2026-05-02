// src/layouts/RootLayout.jsx
import { createContext, useContext, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useNavTransition } from '../hooks/useNavTransition'
import TransitionFlash from '../components/TransitionFlash'
import GlobalNav from '../components/nav/GlobalNav'
import { LANGUAGES, SITE } from '../config'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Context for sharing navigateTo across all pages
export const NavTransitionContext = createContext({ flash: false, navigateTo: () => {} })

export function useNavTransitionContext() {
  return useContext(NavTransitionContext)
}

// ── Custom cursor — dot + lagging ring ───────────────────────
function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const raf     = useRef(null)
  const pos     = useRef({ x: -100, y: -100, rx: -100, ry: -100 })

  useEffect(() => {
    // Only activate on pointer-fine devices (mouse/trackpad)
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    // Hide native cursor on desktop only
    document.body.style.cursor = 'none'

    const dot  = dotRef.current
    const ring = ringRef.current

    // Show both elements
    if (dot)  dot.style.opacity  = '1'
    if (ring) ring.style.opacity = '1'

    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      if (dot) {
        dot.style.left = e.clientX + 'px'
        dot.style.top  = e.clientY + 'px'
      }
    }

    const tick = () => {
      pos.current.rx = lerp(pos.current.rx, pos.current.x, 0.1)
      pos.current.ry = lerp(pos.current.ry, pos.current.y, 0.1)
      if (ring) {
        ring.style.left = pos.current.rx + 'px'
        ring.style.top  = pos.current.ry + 'px'
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(tick)

    // Expand ring on interactive elements
    const expand = () => {
      if (ring) {
        ring.style.width  = '44px'
        ring.style.height = '44px'
        ring.style.borderColor = 'rgba(212,175,55,0.7)'
      }
    }
    const shrink = () => {
      if (ring) {
        ring.style.width  = '28px'
        ring.style.height = '28px'
        ring.style.borderColor = 'rgba(212,175,55,0.4)'
      }
    }

    const targets = document.querySelectorAll('a, button, [role="button"]')
    targets.forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
      document.body.style.cursor = ''
      targets.forEach(el => {
        el.removeEventListener('mouseenter', expand)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [])

  return (
    <>
      {/* Gold dot — always in DOM, shown via JS on pointer-fine devices */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          width: '7px',
          height: '7px',
          background: '#D4AF37',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          boxShadow: '0 0 8px rgba(212,175,55,0.9)',
          // No mix-blend-mode — keeps gold visible on dark backgrounds
        }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          width: '28px',
          height: '28px',
          border: '1px solid rgba(212,175,55,0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  )
}

// ── Footer ───────────────────────────────────────────────────
function GlobalFooter() {
  const { i18n } = useTranslation()

  const footerLinks = [
    { href: '/',                           label: 'Home' },
    { href: '/matrix',                     label: 'Matrix' },
    { href: '/pillars/medicina-de-la-voz', label: 'Medicina' },
    { href: '/pillars/soma',               label: 'Soma' },
    { href: '/pillars/experiences',        label: 'Experiences' },
    { href: '/vault',                      label: 'Vault' },
  ]

  return (
    <footer style={{
      background: 'rgba(4,4,4,0.99)',
      borderTop: '1px solid rgba(212,175,55,0.07)',
    }}>
      {/* Main footer grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'clamp(2rem, 4vw, 3.5rem)',
      }}>

        {/* Brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <motion.svg
              viewBox="0 0 24 24" fill="none"
              style={{ width: '16px', height: '16px', flexShrink: 0 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx="12" cy="12" r="10" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
              <circle cx="12" cy="12" r="6"  stroke="rgba(212,175,55,0.45)" strokeWidth="0.8"/>
              <circle cx="12" cy="12" r="2"  fill="rgba(212,175,55,0.6)"/>
            </motion.svg>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.05rem',
              color: '#D4AF37',
              fontStyle: 'italic',
              letterSpacing: '0.02em',
            }}>
              {SITE.name}
            </span>
          </Link>

          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '11px',
            lineHeight: 1.9,
            letterSpacing: '0.03em',
            color: 'rgba(245,240,232,0.28)',
            maxWidth: '230px',
            marginBottom: '1.5rem',
          }}>
            {SITE.description}
          </p>

          {/* Contact links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {/* Email */}
            <a
              href={`mailto:${SITE.email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(212,175,55,0.45)',
                textDecoration: 'none',
                transition: 'color 0.3s',
                paddingBottom: '0.85rem',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.45)'}
            >
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <rect x="0.5" y="0.5" width="11" height="8" rx="0.5" stroke="currentColor" strokeWidth="0.8"/>
                <path d="M1 1l5 4 5-4" stroke="currentColor" strokeWidth="0.8"/>
              </svg>
              {SITE.email}
            </a>

            {/* Thin divider */}
            <div style={{
              width: '100%',
              height: '1px',
              background: 'linear-gradient(to right, rgba(212,175,55,0.12), transparent)',
              marginBottom: '0.85rem',
            }} />

            {/* Instagram */}
            <a
              href={import.meta.env.VITE_SITE_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(212,175,55,0.45)',
                textDecoration: 'none',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.45)'}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>

              @anatomiadelaliento
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '8px',
            letterSpacing: '0.55em',
            color: 'rgba(212,175,55,0.35)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Navigate
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  to={href}
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 200,
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'rgba(245,240,232,0.3)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'color 0.3s, gap 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'rgba(212,175,55,0.8)'
                    e.currentTarget.style.gap = '14px'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(245,240,232,0.3)'
                    e.currentTarget.style.gap = '10px'
                  }}
                >
                  <span style={{
                    width: '14px', height: '1px',
                    background: 'rgba(212,175,55,0.25)',
                    display: 'inline-block',
                    flexShrink: 0,
                    transition: 'background 0.3s',
                  }} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Language */}
        <div>
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '8px',
            letterSpacing: '0.55em',
            color: 'rgba(212,175,55,0.35)',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Language
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {LANGUAGES.map(lang => {
              const isActive = i18n.language === lang.code
              return (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  aria-label={`Switch to ${lang.label}`}
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 200,
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: isActive ? '#D4AF37' : 'rgba(245,240,232,0.3)',
                    background: isActive ? 'rgba(212,175,55,0.07)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.08)'}`,
                    padding: '0.4rem 0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(245,240,232,0.65)'
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.22)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(245,240,232,0.3)'
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'
                    }
                  }}
                >
                  <span style={{ fontSize: '10px', opacity: 0.9 }}>{lang.nativeLabel}</span>
                  <span style={{ fontSize: '8px', opacity: 0.45 }}>{lang.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: 'rgba(212,175,55,0.2)',
            marginTop: '2rem',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
          }}>
            "{SITE.tagline}"
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.07), transparent)',
        }} />
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.1rem clamp(1.5rem, 4vw, 3rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '8px',
          letterSpacing: '0.3em',
          color: 'rgba(245,240,232,0.12)',
          textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} {SITE.domain}
        </span>
        <span style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '8px',
          letterSpacing: '0.25em',
          color: 'rgba(245,240,232,0.08)',
          textTransform: 'uppercase',
        }}>
          All rights reserved
        </span>
      </div>
    </footer>
  )
}

// ── RootLayout ───────────────────────────────────────────────
export default function RootLayout() {
  const { flash, navigateTo } = useNavTransition()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <NavTransitionContext.Provider value={{ flash, navigateTo }}>
      <CustomCursor />
      <TransitionFlash flash={flash} />
      <GlobalNav />
      <Outlet />
      <GlobalFooter />
    </NavTransitionContext.Provider>
  )
}
