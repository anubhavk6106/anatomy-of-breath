// App.jsx — FINAL VERSION (Blog + Experiences + Workshops)

import { useEffect, useRef, useState, useCallback } from 'react'
import HeroSection from './components/HeroSection'
import Gallery from './components/Gallery'
import Philosophy from './components/Philosophy'
import ImmersiveSection from './components/ImmersiveSection'
import BreathTimeline from './components/BreathTimeline'
import Contact from './components/Contact'
import BlogSection from './components/BlogSection'
import ExperiencesSection from './components/ExperiencesSection'   // ✅ NEW
import WorkshopsSection from './components/WorkshopsSection'       // ✅ NEW
import Preloader from './components/Preloader'
import SoundToggle from './components/SoundToggle'
import TransitionFlash from './components/TransitionFlash'
import { useAmbientSound } from './hooks/useAmbientSound'
import { useNavTransition } from './hooks/useNavTransition'

/* ── Hook: Detect Mobile ───────────────────────── */
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

/* ── Navigation ───────────────────────────────── */
function Nav({ navigateTo }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const isMobile = useIsMobile()
  const { playing, toggle: toggleSound } = useAmbientSound()

  // ✅ UPDATED LINKS
  const links = [
    'Gallery',
    'Philosophy',
    'Timeline',
    'Immersive',
    'Experiences',
    'Workshops',
    'Blog',
    'Contact'
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links.map(l => document.getElementById(l.toLowerCase())).filter(Boolean)

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.4 }
    )

    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      {!isMobile && (
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          {links.map(item => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={e => {
                  e.preventDefault()
                  navigateTo(item.toLowerCase())
                }}
                style={{
                  color: activeSection === item.toLowerCase() ? '#FFD700' : '#aaa'
                }}
              >
                {item}
              </a>
            </li>
          ))}
          <SoundToggle playing={playing} onToggle={toggleSound} />
        </ul>
      )}
    </nav>
  )
}

/* ── Footer ───────────────────────────────────── */
function Footer({ navigateTo }) {
  const links = [
    'Gallery',
    'Philosophy',
    'Timeline',
    'Immersive',
    'Experiences',
    'Workshops',
    'Blog',
    'Contact'
  ]

  return (
    <footer style={{ padding: '2rem', textAlign: 'center' }}>
      {links.map(item => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          onClick={e => {
            e.preventDefault()
            navigateTo(item.toLowerCase())
          }}
          style={{ margin: '0 10px', color: '#aaa' }}
        >
          {item}
        </a>
      ))}
    </footer>
  )
}

/* ── Custom Cursor ───────────────────────────── */
function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const move = e => {
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

/* ── App ─────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleComplete = useCallback(() => setLoaded(true), [])
  const { flash, navigateTo } = useNavTransition()

  return (
    <>
      {!loaded && <Preloader onComplete={handleComplete} />}
      <TransitionFlash flash={flash} />

      <div style={{ opacity: loaded ? 1 : 0 }}>
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

          {/* ✅ NEW SECTIONS */}
          <section id="experiences">
            <ExperiencesSection />
          </section>

          <section id="workshops">
            <WorkshopsSection />
          </section>

          <section id="blog">
            <BlogSection />
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