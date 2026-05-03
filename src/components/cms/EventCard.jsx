// EventCard.jsx
// CMS event card component for Experiences section
// Shows "Past" label and reduced opacity for past events

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { localise } from '../../lib/localise'

const EASE = [0.25, 0.46, 0.45, 0.94]

function EventCard({ event }) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const title = localise(event.title, lang)

  const { slug, date, location, isOnline, coverImage } = event

  // Check if event is in the past
  const eventDate = new Date(date)
  const isPast = eventDate < new Date()

  // Format date
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = eventDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link
      to={`/pillars/experiences/${slug?.current || slug}`}
      style={{ textDecoration: 'none' }}
    >
      <motion.article
        style={{
          aspectRatio: '3 / 4',
          background: '#0b0b0b',
          border: '1px solid rgba(212,175,55,0.2)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          opacity: isPast ? 0.5 : 1,
          transition: 'opacity 0.3s',
        }}
        whileHover={{
          borderColor: 'rgba(212,175,55,0.6)',
          boxShadow: 'inset 0 0 40px rgba(212,175,55,0.06), 0 0 30px rgba(212,175,55,0.15)',
          opacity: isPast ? 0.7 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* Past Label */}
        {isPast && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 2,
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(245,240,232,0.6)',
              textTransform: 'uppercase',
              padding: '0.4rem 0.8rem',
              background: 'rgba(11,11,11,0.9)',
              border: '1px solid rgba(245,240,232,0.2)',
            }}
          >
            Past
          </div>
        )}

        {/* Cover Image */}
        {coverImage && (
          <div
            style={{
              width: '100%',
              height: '60%',
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(212,175,55,0.03)',
            }}
          >
            <motion.img
              src={coverImage.asset?.url || coverImage.url}
              alt={coverImage.alt || title}
              loading="lazy"
              width="400"
              height="533"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            flex: 1,
            background: 'linear-gradient(to top, rgba(11,11,11,1) 70%, rgba(11,11,11,0.95))',
          }}
        >
          {/* Date & Location */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '0.625rem',
                letterSpacing: '0.15em',
                color: '#D4AF37',
                textTransform: 'uppercase',
              }}
            >
              {formattedDate} • {formattedTime}
            </span>
            {(location || isOnline) && (
              <span
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(245,240,232,0.5)',
                }}
              >
                {isOnline ? 'Online' : location}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 300,
              color: '#f5f0e8',
              lineHeight: 1.3,
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h3>

          {/* View Details Indicator */}
          <motion.div
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '0.625rem',
              letterSpacing: '0.2em',
              color: 'rgba(212,175,55,0.5)',
              textTransform: 'uppercase',
              marginTop: 'auto',
            }}
            whileHover={{ color: 'rgba(212,175,55,0.9)' }}
            transition={{ duration: 0.3 }}
          >
            {isPast ? 'Ver detalles' : 'Más información'} →
          </motion.div>
        </div>

        {/* Hover overlay tint */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(212,175,55,0.06)',
            pointerEvents: 'none',
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </motion.article>
    </Link>
  )
}

// Wrap with React.memo for performance optimization
export default memo(EventCard)
