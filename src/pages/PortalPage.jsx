// PortalPage.jsx
// Landing page with fullscreen video background and cinematic transition to Matrix
// 🟣 A. PORTAL (Home Page – Entry Experience)
// Goal: Emotional + cinematic first impression

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import VideoBackground from '../components/ui/VideoBackground'
import Preloader from '../components/Preloader'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function PortalPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showPreloader, setShowPreloader] = useState(false)
  const [preloaderComplete, setPreloaderComplete] = useState(false)
  
  // Scroll-trigger navigation
  const { scrollY } = useScroll()
  const overlayOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Check if this is first visit (session flag)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('portal_visited')
    if (!hasVisited) {
      setShowPreloader(true)
      sessionStorage.setItem('portal_visited', 'true')
    } else {
      setPreloaderComplete(true)
    }
  }, [])

  // Scroll-trigger navigation to Matrix
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        navigate('/matrix')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navigate])

  const handlePreloaderComplete = () => {
    setPreloaderComplete(true)
  }

  const handleVideoEnded = () => {
    // Cinematic transition to Matrix when video ends
    navigate('/matrix')
  }

  const handleEnterClick = () => {
    navigate('/matrix')
  }

  const handleScrollDown = () => {
    // Smooth scroll to trigger navigation
    window.scrollTo({ top: 500, behavior: 'smooth' })
  }

  return (
    <>
      {showPreloader && !preloaderComplete && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderComplete ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{
          position: 'relative',
          width: '100vw',
          minHeight: '200vh', // Allow scrolling
          overflow: 'hidden',
        }}
      >
        {/* Video Background - Fixed */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
          }}
        >
          <VideoBackground
            src="/videos/creation.webm"
            srcMp4="/videos/creation.mp4"
            srcMobile="/videos/creation.mp4"
            poster="/images/poster.jpg"
            onEnded={handleVideoEnded}
          />
        </div>

        {/* Overlay Content */}
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, rgba(11,11,11,0.3), rgba(11,11,11,0.6))',
            zIndex: 1,
            opacity: overlayOpacity,
          }}
        >
          {/* "Spiritus est origo" — hardcoded, NEVER translated */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              // Premium gold gradient
              background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: '1.5rem',
              letterSpacing: '0.02em',
              filter: 'drop-shadow(0 2px 16px rgba(212,175,55,0.2))',
            }}
          >
            Spiritus est origo
          </motion.h1>

          {/* Tagline (translated) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: 'clamp(12px, 2vw, 14px)',
              letterSpacing: '0.15em',
              color: 'rgba(245,240,232,0.8)',
              textAlign: 'center',
              textTransform: 'uppercase',
              marginBottom: '3rem',
              textShadow: '0 1px 10px rgba(0,0,0,0.5)',
            }}
          >
            {t('portal.tagline')}
          </motion.p>

          {/* Enter CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
            onClick={handleEnterClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: '#D4AF37',
              textTransform: 'uppercase',
              padding: '0.9rem 2.5rem',
              background: 'transparent',
              border: '1px solid rgba(212,175,55,0.5)',
              cursor: 'pointer',
              transition: 'background 0.3s, border-color 0.3s',
              marginBottom: '4rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,175,55,0.06)'
              e.currentTarget.style.borderColor = '#D4AF37'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
            }}
          >
            {t('portal.enter')}
          </motion.button>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2, ease: EASE }}
            onClick={handleScrollDown}
            style={{
              position: 'absolute',
              bottom: '3rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <motion.p
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '9px',
                letterSpacing: '0.3em',
                color: 'rgba(245,240,232,0.5)',
                textTransform: 'uppercase',
              }}
            >
              {t('portal.scroll') || 'Scroll'}
            </motion.p>
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: EASE }}
            >
              <path
                d="M12 5v14m0 0l-7-7m7 7l7-7"
                stroke="rgba(212,175,55,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
