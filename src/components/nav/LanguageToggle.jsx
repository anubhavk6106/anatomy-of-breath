// src/components/nav/LanguageToggle.jsx
// Compact language switcher for the GlobalNav
// Shows current language code; click cycles through all supported languages

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../config'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (code) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch language"
        aria-expanded={open}
        style={{
          background: 'none',
          border: '1px solid rgba(212,175,55,0.25)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          transition: 'border-color 0.3s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'}
      >
        <span style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#D4AF37',
        }}>
          {current.nativeLabel}
        </span>
        {/* Chevron */}
        <svg
          width="8" height="5" viewBox="0 0 8 5" fill="none"
          style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M1 1l3 3 3-3" stroke="rgba(212,175,55,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: 'rgba(11,11,11,0.97)',
          border: '1px solid rgba(212,175,55,0.12)',
          backdropFilter: 'blur(14px)',
          minWidth: '140px',
          zIndex: 200,
        }}>
          {LANGUAGES.map(lang => {
            const isActive = lang.code === i18n.language
            return (
              <button
                key={lang.code}
                onClick={() => select(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '0.55rem 1rem',
                  background: isActive ? 'rgba(212,175,55,0.06)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '1px solid #D4AF37' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(212,175,55,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  color: isActive ? '#D4AF37' : 'rgba(245,240,232,0.4)',
                  textTransform: 'uppercase',
                  minWidth: '22px',
                }}>
                  {lang.nativeLabel}
                </span>
                <span style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                  color: isActive ? 'rgba(245,240,232,0.9)' : 'rgba(245,240,232,0.45)',
                }}>
                  {lang.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
