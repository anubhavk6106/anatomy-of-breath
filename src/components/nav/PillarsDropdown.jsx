// src/components/nav/PillarsDropdown.jsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export default function PillarsDropdown() {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(null)

  const links = [
    { to: '/pillars/medicina-de-la-voz', label: t('nav.medicina') },
    { to: '/pillars/soma',               label: t('nav.soma') },
    { to: '/pillars/experiences',        label: t('nav.experiences') },
  ]

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(11,11,11,0.97)',
      border: '1px solid rgba(212,175,55,0.12)',
      backdropFilter: 'blur(14px)',
      minWidth: '200px',
      padding: '0.5rem 0',
    }}>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          style={{
            display: 'block',
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: hovered === to ? '#D4AF37' : 'rgba(245,240,232,0.55)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            padding: '0.6rem 1.4rem',
            background: hovered === to ? 'rgba(212,175,55,0.06)' : 'transparent',
            borderLeft: hovered === to ? '1px solid #D4AF37' : '1px solid transparent',
            transition: 'color 0.25s, background 0.25s, border-color 0.25s',
          }}
          onMouseEnter={() => setHovered(to)}
          onMouseLeave={() => setHovered(null)}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
