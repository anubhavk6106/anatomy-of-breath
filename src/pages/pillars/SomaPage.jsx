// SomaPage.jsx
// Soma pillar page with i18n-driven hero, static offerings, and dynamic CMS feature

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import useSanityQuery from '../../hooks/useSanityQuery'
import { ACTIVE_SOMA_FEATURE_QUERY } from '../../lib/queries'
import SomaFeatureBlock from '../../components/cms/SomaFeatureBlock'
import useIsMobile from '../../hooks/useIsMobile'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Anatomical SVG illustrations (reused from Gallery ANATOMY library concept)
const ANATOMY_ICONS = {
  lungs: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 20 Q30 30 30 50 Q30 70 40 80 L50 70 L60 80 Q70 70 70 50 Q70 30 50 20Z" stroke="#FFD700" stroke-width="0.8" opacity="0.7"/></svg>`,
  heart: `<svg viewBox="0 0 100 100" fill="none"><path d="M50 80 Q20 60 20 40 Q20 20 35 20 Q50 20 50 35 Q50 20 65 20 Q80 20 80 40 Q80 60 50 80Z" stroke="#FFD700" stroke-width="0.8" opacity="0.7"/></svg>`,
  spine: `<svg viewBox="0 0 100 100" fill="none"><line x1="50" y1="10" x2="50" y2="90" stroke="#FFD700" stroke-width="0.8" opacity="0.7"/><circle cx="50" cy="30" r="4" stroke="#FFD700" stroke-width="0.6" opacity="0.7"/><circle cx="50" cy="50" r="4" stroke="#FFD700" stroke-width="0.6" opacity="0.7"/><circle cx="50" cy="70" r="4" stroke="#FFD700" stroke-width="0.6" opacity="0.7"/></svg>`,
}

const offerings = [
  { key: 'breathwork', icon: ANATOMY_ICONS.lungs },
  { key: 'movement', icon: ANATOMY_ICONS.heart },
  { key: 'alignment', icon: ANATOMY_ICONS.spine },
]

export default function SomaPage() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { data: feature } = useSanityQuery(ACTIVE_SOMA_FEATURE_QUERY)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: isMobile ? '8rem 1.5rem 4rem' : '10rem 3rem 6rem',
          textAlign: 'center',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#FFD700',
            marginBottom: '1.5rem',
          }}
        >
          {t('soma.hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: 'clamp(14px, 2vw, 16px)',
            letterSpacing: '0.04em',
            color: 'rgba(245,240,232,0.7)',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            lineHeight: 1.8,
          }}
        >
          {t('soma.hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '14px',
            lineHeight: 1.9,
            letterSpacing: '0.02em',
            color: 'rgba(245,240,232,0.6)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {t('soma.hero.body')}
        </motion.div>
      </section>

      {/* Offerings Grid */}
      <section
        style={{
          padding: isMobile ? '3rem 1.5rem' : '4rem 3rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '2rem',
          }}
        >
          {offerings.map((offering, index) => (
            <motion.div
              key={offering.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 * index, ease: EASE }}
              style={{
                padding: '2.5rem 2rem',
                border: '1px solid rgba(255,215,0,0.2)',
                background: 'rgba(11,11,11,0.8)',
                textAlign: 'center',
                transition: 'border-color 0.4s, box-shadow 0.4s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'
                e.currentTarget.style.boxShadow = 'inset 0 0 40px rgba(255,215,0,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                }}
                dangerouslySetInnerHTML={{ __html: offering.icon }}
              />

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  fontWeight: 300,
                  color: '#f5f0e8',
                  marginBottom: '1rem',
                }}
              >
                {t(`soma.offerings.${offering.key}.title`)}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '13px',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                  color: 'rgba(245,240,232,0.6)',
                }}
              >
                {t(`soma.offerings.${offering.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic CMS Feature Block */}
      <SomaFeatureBlock feature={feature} />
    </div>
  )
}
