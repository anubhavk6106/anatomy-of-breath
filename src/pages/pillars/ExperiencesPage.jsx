// ExperiencesPage.jsx
// Events listing page for Experiences pillar

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { EVENTS_QUERY } from '../../lib/queries'
import EventCard from '../../components/cms/EventCard'
import SkeletonCard from '../../components/cms/SkeletonCard'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Sample events to display when CMS is not configured
const SAMPLE_EVENTS = [
  {
    title: 'Taller de Respiración Consciente',
    slug: 'taller-respiracion-consciente',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    location: 'Ciudad de México',
    isOnline: false,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=1067&fit=crop',
      alt: 'Taller de respiración'
    },
    bookingUrl: 'mailto:hola@anatomiadelaliento.com'
  },
  {
    title: 'Ceremonia de Canto Sagrado',
    slug: 'ceremonia-canto-sagrado',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    location: 'Online',
    isOnline: true,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=1067&fit=crop',
      alt: 'Ceremonia de canto'
    },
    bookingUrl: 'mailto:hola@anatomiadelaliento.com'
  },
  {
    title: 'Retiro de Voz y Movimiento',
    slug: 'retiro-voz-movimiento',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: 'Tepoztlán, México',
    isOnline: false,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1067&fit=crop',
      alt: 'Retiro en naturaleza'
    },
    bookingUrl: 'mailto:hola@anatomiadelaliento.com'
  },
  {
    title: 'Círculo de Mantras y Meditación',
    slug: 'circulo-mantras-meditacion',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    location: 'Online',
    isOnline: true,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&h=1067&fit=crop',
      alt: 'Círculo de mantras'
    },
    bookingUrl: 'mailto:hola@anatomiadelaliento.com'
  }
]

export default function ExperiencesPage() {
  const { t } = useTranslation()
  const { data: cmsData, loading, error } = useSanityQuery(EVENTS_QUERY)

  // Use CMS data if available, otherwise use sample events
  const events = cmsData && cmsData.length > 0 ? cmsData : SAMPLE_EVENTS

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '8rem 1.5rem 4rem',
        background: '#0b0b0b',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            textAlign: 'center',
            marginBottom: '4rem',
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#FFD700',
              marginBottom: '1rem',
            }}
          >
            {t('nav.experiences')}
          </h1>
          <p
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '14px',
              letterSpacing: '0.04em',
              color: 'rgba(245,240,232,0.6)',
            }}
          >
            {t('nav.experiencesDesc') || 'Upcoming workshops, ceremonies, and gatherings'}
          </p>
          
          {/* CMS Status Indicator */}
          {!cmsData && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '11px',
                letterSpacing: '0.04em',
                color: 'rgba(255,215,0,0.4)',
                marginTop: '1rem',
                fontStyle: 'italic',
              }}
            >
              {t('common.sampleContent') || 'Showing sample content'}
            </motion.p>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Events Grid */}
        {!loading && events && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
