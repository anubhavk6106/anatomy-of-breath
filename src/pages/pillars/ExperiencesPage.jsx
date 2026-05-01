// ExperiencesPage.jsx
// Events listing page — uses real Sanity CMS data only

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { EVENTS_QUERY } from '../../lib/queries'
import EventCard from '../../components/cms/EventCard'
import SkeletonCard from '../../components/cms/SkeletonCard'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function ExperiencesPage() {
  const { t } = useTranslation()
  const { data: cmsData, loading } = useSanityQuery(EVENTS_QUERY)

  // Normalize slug to plain string (Sanity returns slug as object { current: "..." })
  const events = (cmsData && cmsData.length > 0)
    ? cmsData.map(e => ({ ...e, slug: e.slug?.current || e.slug }))
    : null

  return (
    <div style={{ minHeight: '100vh', padding: '8rem 1.5rem 4rem', background: '#0b0b0b' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#FFD700', marginBottom: '1rem',
          }}>
            {t('nav.experiences')}
          </h1>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '14px', letterSpacing: '0.04em',
            color: 'rgba(245,240,232,0.6)',
          }}>
            {t('nav.experiencesDesc') || 'Upcoming workshops, ceremonies, and gatherings'}
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && (!events || events.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ textAlign: 'center', padding: '6rem 0' }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 300, fontStyle: 'italic',
              color: 'rgba(245,240,232,0.4)', marginBottom: '1rem',
            }}>
              {t('common.noUpcomingEvents') || 'No upcoming events'}
            </p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '11px', letterSpacing: '0.3em',
              color: 'rgba(255,215,0,0.3)', textTransform: 'uppercase',
            }}>
              Add events in Sanity Studio to see them here
            </p>
          </motion.div>
        )}

        {/* Events Grid */}
        {!loading && events && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.slug?.current || event.slug || index}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: EASE }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
