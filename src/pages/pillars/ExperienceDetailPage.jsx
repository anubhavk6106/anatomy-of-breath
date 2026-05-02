// ExperienceDetailPage.jsx
// Individual event detail page — uses real Sanity CMS data only

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { EVENT_BY_SLUG_QUERY } from '../../lib/queries'
import PostBody from '../../components/cms/PostBody'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function ExperienceDetailPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const { data: event, loading } = useSanityQuery(EVENT_BY_SLUG_QUERY, { slug })

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b' }}>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '12px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase' }}>
          {t('common.loading') || 'Loading...'}
        </p>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', background: '#0b0b0b' }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', textAlign: 'center', marginBottom: '2rem' }}
        >
          {t('common.contentUnavailable') || 'Content unavailable'}
        </motion.p>
        <Link to="/pillars/experiences"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.4em', color: '#D4AF37', textDecoration: 'none', textTransform: 'uppercase', padding: '0.9rem 2.5rem', border: '1px solid rgba(212,175,55,0.5)', display: 'inline-block', transition: 'background 0.3s, border-color 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = '#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)' }}
        >
          {t('common.backToList') || 'Back to Experiences'}
        </Link>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()
  const formattedDate = eventDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const formattedTime = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

  return (
    <article style={{ minHeight: '100vh', padding: '8rem 1.5rem 4rem', background: '#0b0b0b' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: '2rem' }}>
          <Link to="/pillars/experiences"
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.6)', textDecoration: 'none', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.6)'}
          >
            ← {t('common.back') || 'Back'}
          </Link>
        </motion.div>

        {event.coverImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}
            style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', marginBottom: '3rem', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <img src={event.coverImage.asset?.url || event.coverImage.url} alt={event.coverImage.alt || event.title}
              loading="lazy" width="900" height="506" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}
        >
          {isPast && (
            <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', padding: '0.4rem 0.8rem', border: '1px solid rgba(245,240,232,0.2)' }}>
              Past Event
            </span>
          )}
          <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: '#D4AF37', textTransform: 'uppercase' }}>
            {formattedDate} • {formattedTime}
          </span>
          {(event.location || event.isOnline) && (
            <>
              <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '10px' }}>•</span>
              <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.5)' }}>
                {event.isOnline ? 'Online' : event.location}
              </span>
            </>
          )}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2, marginBottom: '2rem' }}
        >
          {event.title}
        </motion.h1>

        {event.description && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} style={{ marginBottom: '3rem' }}>
            <PostBody body={event.description} />
          </motion.div>
        )}

        {event.bookingUrl && !isPast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }} style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href={event.bookingUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.4em', color: '#D4AF37', textDecoration: 'none', textTransform: 'uppercase', padding: '0.9rem 2.5rem', border: '1px solid rgba(212,175,55,0.5)', display: 'inline-block', transition: 'background 0.3s, border-color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = '#D4AF37' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)' }}
            >
              {t('common.bookNow') || 'Reserve Your Spot'}
            </a>
          </motion.div>
        )}
      </div>
    </article>
  )
}
