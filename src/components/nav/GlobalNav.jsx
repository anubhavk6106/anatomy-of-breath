// src/components/nav/GlobalNav.jsx
import { useState, useEffect } from 'react'
import { Link, useMatch, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PillarsDropdown from './PillarsDropdown'
import LanguageToggle from './LanguageToggle'
import SoundToggle from '../SoundToggle'
import useIsMobile from '../../hooks/useIsMobile'
import { useAmbientSound } from '../../hooks/useAmbientSound'
import { LANGUAGES, SITE } from '../../config'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function GlobalNav() {
  const { t, i18n } = useTranslation()
  const isMobile = useIsMobile()
  const { playing, toggle: toggleSound } = useAmbientSound()
  const location = useLocation()

  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [pillarsOpen, setPillarsOpen] = useState(false)
  const [scrollPct,  setScrollPct]  = useState(0)

  const isPortal      = useMatch('/')
  const isMatrix      = useMatch('/matrix')
  const isMedicina    = useMatch('/pillars/medicina-de-la-voz/*')
  const isSoma        = useMatch('/pillars/soma')
  const isExperiences = useMatch('/pillars/experiences/*')
  const isVault       = useMatch('/vault')
  const isPillars     = isMedicina || isSoma || isExperiences

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Scroll state + page progress
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { to: '/',       label: t('nav.portal'),  match: isPortal },
    { to: '/matrix', label: t('nav.matrix'),  match: isMatrix },
    { to: '/vault',  label: t('nav.vault'),   match: isVault },
  ]

  const mobileLinks = [
    { to: '/',                           label: t('nav.portal'),      match: isPortal },
    { to: '/matrix',                     label: t('nav.matrix'),      match: isMatrix },
    { to: '/pillars/medicina-de-la-voz', label: t('nav.medicina'),    match: isMedicina },
    { to: '/pillars/soma',               label: t('nav.soma'),        match: isSoma },
    { to: '/pillars/experiences',        label: t('nav.experiences'), match: isExperiences },
    { to: '/vault',                      label: t('nav.vault'),       match: isVault },
  ]

  const gold    = '#D4AF37'
  const dimText = 'rgba(245,240,232,0.55)'

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: isMobile ? '0 1.25rem' : '0 2.5rem',
        height: isMobile ? '58px' : '66px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled
          ? 'rgba(8,8,8,0.97)'
          : 'linear-gradient(to bottom, rgba(8,8,8,0.9), transparent)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled
          ? '1px solid rgba(212,175,55,0.1)'
          : '1px solid transparent',
        transition: 'background 0.5s ease, border-color 0.5s ease',
      }}>

        {/* Logo */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
        >
          {/* Animated breath mark */}
          <motion.svg
            viewBox="0 0 24 24" fill="none"
            style={{ width: '18px', height: '18px', flexShrink: 0 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="12" cy="12" r="10" stroke="rgba(212,175,55,0.3)" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="6"  stroke="rgba(212,175,55,0.55)" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="2"  fill="rgba(212,175,55,0.75)"/>
          </motion.svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: gold,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}>
            {SITE.name}
          </span>
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={{
            display: 'flex', gap: 0, listStyle: 'none',
            alignItems: 'center', margin: 0, padding: 0,
          }}>
            {navLinks.map(({ to, label, match }) => (
              <li key={to} style={{ position: 'relative' }}>
                <Link
                  to={to}
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 200,
                    fontSize: '10px',
                    letterSpacing: '0.32em',
                    color: match ? gold : dimText,
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    padding: '0.5rem 1.3rem',
                    display: 'block',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => { if (!match) e.currentTarget.style.color = 'rgba(245,240,232,0.85)' }}
                  onMouseLeave={e => { if (!match) e.currentTarget.style.color = dimText }}
                >
                  {label}
                  {/* Active underline */}
                  <motion.span
                    style={{
                      position: 'absolute',
                      bottom: '-1px', left: '1.3rem', right: '1.3rem',
                      height: '1px',
                      background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
                    }}
                    animate={{ opacity: match ? 1 : 0, scaleX: match ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </Link>
              </li>
            ))}

            {/* Pillars dropdown */}
            <li
              style={{ position: 'relative' }}
              onMouseEnter={() => setPillarsOpen(true)}
              onMouseLeave={() => setPillarsOpen(false)}
            >
              <span style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '10px',
                letterSpacing: '0.32em',
                color: isPillars ? gold : dimText,
                textTransform: 'uppercase',
                padding: '0.5rem 1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'default',
                transition: 'color 0.3s',
              }}>
                {t('nav.pillars')}
                {/* Chevron */}
                <svg width="7" height="4" viewBox="0 0 7 4" fill="none"
                  style={{ transition: 'transform 0.25s', transform: pillarsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M1 1l2.5 2L6 1" stroke={isPillars ? gold : 'rgba(245,240,232,0.4)'} strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <motion.span
                  style={{
                    position: 'absolute',
                    bottom: '-1px', left: '1.3rem', right: '1.3rem',
                    height: '1px',
                    background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
                  }}
                  animate={{ opacity: isPillars ? 1 : 0, scaleX: isPillars ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                />
              </span>
              <AnimatePresence>
                {pillarsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE }}
                  >
                    <PillarsDropdown />
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Contact CTA */}
            <li style={{ marginLeft: '1rem' }}>
              <a
                href={SITE.mailtoHref}
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: gold,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  padding: '0.45rem 1.1rem',
                  border: '1px solid rgba(212,175,55,0.35)',
                  transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.08)'
                  e.currentTarget.style.borderColor = gold
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(212,175,55,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {t('nav.inquire')}
              </a>
            </li>

            <li style={{ marginLeft: '0.6rem' }}>
              <LanguageToggle />
            </li>
            <li style={{ marginLeft: '0.4rem' }}>
              <SoundToggle playing={playing} onToggle={toggleSound} />
            </li>
          </ul>
        )}

        {/* Mobile right side — sound + hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <SoundToggle playing={playing} onToggle={toggleSound} />
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px', display: 'flex', flexDirection: 'column',
                gap: '5px', alignItems: 'flex-end',
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: i === 1 ? (menuOpen ? '20px' : '13px') : '20px',
                  height: '1.5px',
                  background: gold,
                  borderRadius: '1px',
                  transition: 'width 0.3s, transform 0.35s, opacity 0.3s',
                  transformOrigin: 'center',
                  transform: menuOpen
                    ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                    : i === 2 ? 'translateY(-6.5px) rotate(-45deg)'
                    : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        )}
      </nav>

      {/* Page scroll progress bar */}
      <div style={{
        position: 'fixed',
        top: isMobile ? '58px' : '66px',
        left: 0, right: 0,
        height: '1px',
        zIndex: 101,
        background: 'rgba(212,175,55,0.06)',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(to right, rgba(212,175,55,0.6), rgba(212,175,55,0.3))',
            transformOrigin: 'left',
          }}
          animate={{ scaleX: scrollPct / 100 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ── Mobile fullscreen overlay ────────────────────────── */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              background: 'rgba(6,6,6,0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Sacred geometry background */}
            <svg viewBox="0 0 300 300" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px', opacity: 0.03, pointerEvents: 'none',
            }}>
              <circle cx="150" cy="150" r="130" stroke="#D4AF37" strokeWidth="0.5" fill="none"/>
              <circle cx="150" cy="150" r="90"  stroke="#D4AF37" strokeWidth="0.5" fill="none"/>
              <circle cx="150" cy="150" r="50"  stroke="#D4AF37" strokeWidth="0.5" fill="none"/>
              <line x1="20" y1="150" x2="280" y2="150" stroke="#D4AF37" strokeWidth="0.3"/>
              <line x1="150" y1="20" x2="150" y2="280" stroke="#D4AF37" strokeWidth="0.3"/>
            </svg>

            {/* Top bar — logo + close */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0 1.25rem',
              height: '58px',
              borderBottom: '1px solid rgba(212,175,55,0.06)',
              flexShrink: 0,
            }}>
              <Link to="/" onClick={() => setMenuOpen(false)}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: '16px', height: '16px' }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(212,175,55,0.3)" strokeWidth="0.8"/>
                  <circle cx="12" cy="12" r="6"  stroke="rgba(212,175,55,0.5)" strokeWidth="0.8"/>
                  <circle cx="12" cy="12" r="2"  fill="rgba(212,175,55,0.7)"/>
                </svg>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: gold, fontStyle: 'italic' }}>
                  {SITE.name}
                </span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'rgba(212,175,55,0.6)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              padding: '2rem 2.5rem',
              gap: '0.25rem',
            }}>
              {mobileLinks.map(({ to, label, match }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * i, ease: EASE }}
                >
                  <Link
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      color: match ? gold : 'rgba(245,240,232,0.65)',
                      textDecoration: 'none',
                      padding: '0.5rem 0',
                      letterSpacing: '0.01em',
                      transition: 'color 0.25s',
                      borderBottom: '1px solid rgba(212,175,55,0.05)',
                    }}
                  >
                    {/* Index number */}
                    <span style={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 200,
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      color: match ? 'rgba(212,175,55,0.6)' : 'rgba(245,240,232,0.2)',
                      minWidth: '20px',
                    }}>
                      0{i + 1}
                    </span>
                    {label}
                    {match && (
                      <span style={{
                        marginLeft: 'auto',
                        width: '4px', height: '4px',
                        borderRadius: '50%',
                        background: gold,
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom bar — contact + language + sound */}
            <div style={{
              borderTop: '1px solid rgba(212,175,55,0.06)',
              padding: '1.5rem 2.5rem',
              flexShrink: 0,
            }}>
              {/* Contact button */}
              <a
                href={SITE.mailtoHref}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(212,175,55,0.7)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(212,175,55,0.2)',
                  padding: '0.85rem 2rem',
                  marginBottom: '1.5rem',
                  transition: 'border-color 0.3s, color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; e.currentTarget.style.color = gold }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; e.currentTarget.style.color = 'rgba(212,175,55,0.7)' }}
              >
                {t('nav.inquire')}
              </a>

              {/* Language selector — horizontal pills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '8px',
                  letterSpacing: '0.5em',
                  color: 'rgba(212,175,55,0.3)',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  textAlign: 'center',
                }}>
                  Language
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}>
                  {LANGUAGES.map(lang => {
                    const isActive = i18n.language === lang.code
                    return (
                      <button
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        style={{
                          fontFamily: 'Raleway, sans-serif',
                          fontWeight: 200,
                          fontSize: '9px',
                          letterSpacing: '0.2em',
                          color: isActive ? gold : 'rgba(245,240,232,0.4)',
                          background: isActive ? 'rgba(212,175,55,0.08)' : 'transparent',
                          border: `1px solid ${isActive ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.1)'}`,
                          padding: '0.4rem 0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.25s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>{lang.nativeLabel}</span>
                        <span style={{ fontSize: '8px', opacity: 0.5 }}>{lang.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sound toggle */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SoundToggle playing={playing} onToggle={toggleSound} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
