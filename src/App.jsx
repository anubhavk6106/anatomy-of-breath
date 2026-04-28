// App.jsx — Final Production Version

import { useEffect, useRef, useState, useCallback } from 'react'
import HeroSection from './components/HeroSection'
import Gallery from './components/Gallery'
import Philosophy from './components/Philosophy'
import ImmersiveSection from './components/ImmersiveSection'
import BreathTimeline from './components/BreathTimeline'
import Contact from './components/Contact'
import Preloader from './components/Preloader'
import SoundToggle from './components/SoundToggle'
import TransitionFlash from './components/TransitionFlash'
import { useAmbientSound } from './hooks/useAmbientSound'
import { useNavTransition } from './hooks/useNavTransition'
import { SITE } from './config'

// ── Hook: Detect Mobile ─────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return isMobile
}

// ── Navigation ─────────────────────────────────────
function Nav({ navigateTo }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const isMobile = useIsMobile()
  const { playing, toggle: toggleSound } = useAmbientSound()

  const links = ['Gallery', 'Philosophy', 'Timeline', 'Immersive', 'Contact']

  // Solid background after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight active section via IntersectionObserver
  useEffect(() => {
    const sections = links.map(l => document.getElementById(l.toLowerCase())).filter(Boolean)
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.4 }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: isMobile ? '0 1.5rem' : '0 3rem',
        height: isMobile ? '60px' : '68px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled
          ? 'rgba(11,11,11,0.97)'
          : 'linear-gradient(to bottom, rgba(11,11,11,0.85), transparent)',
        backdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(255,215,0,0.08)' : '1px solid transparent',
        transition: 'background 0.5s ease, border-color 0.5s ease',
      }}>

        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); navigateTo('top') }}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {/* Small breath mark */}
          <svg viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,215,0,0.35)" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="6"  stroke="rgba(255,215,0,0.55)" strokeWidth="0.8"/>
            <circle cx="12" cy="12" r="2"  fill="rgba(255,215,0,0.7)"/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem',
            color: '#FFD700',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}>
            {SITE.name}
          </span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <ul style={{ display: 'flex', gap: '0', listStyle: 'none', alignItems: 'center' }}>
            {links.map(item => {
              const isActive = activeSection === item.toLowerCase()
              return (
                <li key={item} style={{ position: 'relative' }}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={e => { e.preventDefault(); navigateTo(item.toLowerCase()) }}
                    style={{
                      fontFamily: 'Raleway, sans-serif',
                      fontWeight: 200,
                      fontSize: '10px',
                      letterSpacing: '0.32em',
                      color: isActive ? '#FFD700' : 'rgba(245,240,232,0.55)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      padding: '0.5rem 1.4rem',
                      display: 'block',
                      transition: 'color 0.35s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                    onMouseLeave={e => e.currentTarget.style.color = isActive ? '#FFD700' : 'rgba(245,240,232,0.55)'}
                  >
                    {item}
                    {/* Active underline */}
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px', left: '1.4rem', right: '1.4rem',
                      height: '1px',
                      background: '#FFD700',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.35s',
                    }} />
                  </a>
                </li>
              )
            })}

            {/* CTA pill */}
            <li style={{ marginLeft: '1rem' }}>
              <a
                href={SITE.mailtoHref}
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: '#FFD700',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1.2rem',
                  border: '1px solid rgba(255,215,0,0.35)',
                  transition: 'background 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.08)'
                  e.currentTarget.style.borderColor = '#FFD700'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(255,215,0,0.35)'
                }}
              >
                Inquire
              </a>
            </li>

            {/* Sound toggle */}
            <li style={{ marginLeft: '0.75rem' }}>
              <SoundToggle playing={playing} onToggle={toggleSound} />
            </li>
          </ul>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block',
                width: i === 1 ? (menuOpen ? '20px' : '14px') : '20px',
                height: '1px',
                background: '#FFD700',
                transition: 'width 0.3s, transform 0.3s, opacity 0.3s',
                transformOrigin: 'center',
                transform: menuOpen
                  ? i === 0 ? 'translateY(6px) rotate(45deg)'
                  : i === 2 ? 'translateY(-6px) rotate(-45deg)'
                  : 'scaleX(0)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </nav>

      {/* Mobile fullscreen overlay */}
      {isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(11,11,11,0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}>
          {/* Decorative geometry */}
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', width: '320px', opacity: 0.04, pointerEvents: 'none' }}>
            <circle cx="100" cy="100" r="90" stroke="#FFD700" strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="100" r="60" stroke="#FFD700" strokeWidth="0.5" fill="none"/>
            <circle cx="100" cy="100" r="30" stroke="#FFD700" strokeWidth="0.5" fill="none"/>
          </svg>

          {links.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={e => {
                e.preventDefault()
                setMenuOpen(false)
                navigateTo(item.toLowerCase())
              }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: activeSection === item.toLowerCase() ? '#FFD700' : 'rgba(245,240,232,0.75)',
                textDecoration: 'none',
                padding: '0.6rem 0',
                letterSpacing: '0.02em',
                transition: 'color 0.3s',
              }}
            >
              {item}
            </a>
          ))}

          <a
            href={SITE.mailtoHref}
            style={{
              marginTop: '2.5rem',
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: 'rgba(255,215,0,0.6)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,215,0,0.25)',
              padding: '0.75rem 2rem',
            }}
          >
            Inquire
          </a>

          {/* Sound toggle in mobile menu */}
          <div style={{ marginTop: '1.2rem' }}>
            <SoundToggle playing={playing} onToggle={toggleSound} />
          </div>
        </div>
      )}
    </>
  )
}

// ── Footer ─────────────────────────────────────────
function Footer({ navigateTo }) {
  const isMobile = useIsMobile()
  const links = ['Gallery', 'Philosophy', 'Timeline', 'Immersive', 'Contact']

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,215,0,0.08)',
      background: 'rgba(6,6,6,0.98)',
    }}>
      {/* Top band */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '3rem 1.5rem 2rem' : '4rem 3rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
        alignItems: 'start',
        gap: isMobile ? '2.5rem' : '3rem',
        textAlign: isMobile ? 'center' : 'left',
      }}>

        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom: '1rem' }}>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,215,0,0.3)" strokeWidth="0.8"/>
              <circle cx="12" cy="12" r="6"  stroke="rgba(255,215,0,0.5)" strokeWidth="0.8"/>
              <circle cx="12" cy="12" r="2"  fill="rgba(255,215,0,0.65)"/>
            </svg>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              color: '#FFD700',
              fontStyle: 'italic',
            }}>
              {SITE.name}
            </span>
          </div>
          <p style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '11px',
            lineHeight: 1.9,
            letterSpacing: '0.04em',
            color: 'rgba(245,240,232,0.3)',
            maxWidth: '240px',
            margin: isMobile ? '0 auto' : '0',
          }}>
            {SITE.description}
          </p>
        </div>

        {/* Center — sacred geometry divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.2 }}>
          <div style={{ width: '1px', height: isMobile ? '0' : '80px', background: 'linear-gradient(to bottom, transparent, #FFD700)' }} />
          <svg viewBox="0 0 40 40" fill="none" style={{ width: '28px', height: '28px' }}>
            <circle cx="20" cy="20" r="18" stroke="#FFD700" strokeWidth="0.6"/>
            <circle cx="20" cy="20" r="10" stroke="#FFD700" strokeWidth="0.6"/>
            <circle cx="20" cy="20" r="3"  stroke="#FFD700" strokeWidth="0.6"/>
            <line x1="2" y1="20" x2="38" y2="20" stroke="#FFD700" strokeWidth="0.4"/>
            <line x1="20" y1="2" x2="20" y2="38" stroke="#FFD700" strokeWidth="0.4"/>
          </svg>
          <div style={{ width: '1px', height: isMobile ? '0' : '80px', background: 'linear-gradient(to top, transparent, #FFD700)' }} />
        </div>

        {/* Nav column */}
        <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '9px', letterSpacing: '0.5em',
            color: 'rgba(255,215,0,0.4)', textTransform: 'uppercase',
            marginBottom: '1.2rem',
          }}>
            Navigate
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: isMobile ? 'center' : 'flex-end' }}>
            {links.map(item => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={e => { e.preventDefault(); navigateTo(item.toLowerCase()) }}
                  style={{
                    fontFamily: 'Raleway, sans-serif', fontWeight: 200,
                    fontSize: '10px', letterSpacing: '0.3em',
                    color: 'rgba(245,240,232,0.4)',
                    textDecoration: 'none', textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.4)'}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,215,0,0.06)',
        padding: isMobile ? '1.2rem 1.5rem' : '1.2rem 3rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <span style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '9px', letterSpacing: '0.3em',
          color: 'rgba(245,240,232,0.18)', textTransform: 'uppercase',
        }}>
          © {new Date().getFullYear()} {SITE.domain}
        </span>
        <span style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '9px', letterSpacing: '0.25em',
          color: 'rgba(245,240,232,0.12)', textTransform: 'uppercase',
        }}>
          All rights reserved
        </span>
      </div>
    </footer>
  )
}

// ── Custom Cursor ─────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        width: '10px',
        height: '10px',
        background: '#FFD700',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}

// ── App ────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleComplete = useCallback(() => setLoaded(true), [])
  const { flash, navigateTo } = useNavTransition()

  return (
    <>
      {!loaded && <Preloader onComplete={handleComplete} />}
      <TransitionFlash flash={flash} />

      <div style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: loaded ? 'auto' : 'none',
      }}>
        <CustomCursor />
        <Nav navigateTo={navigateTo} />

        <main>
          <HeroSection />

          <section id="gallery">
            <Gallery />
          </section>

          <section id="philosophy">
            <Philosophy />
          </section>

          <section id="timeline">
            <BreathTimeline />
          </section>

          <section id="immersive">
            <ImmersiveSection />
          </section>

          <section id="contact">
            <Contact />
          </section>
        </main>

        <Footer navigateTo={navigateTo} />
      </div>
    </>
  )
}