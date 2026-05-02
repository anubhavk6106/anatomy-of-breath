// VaultPage.jsx
// 🟡 D. VAULT (Shop – Future)
// Coming Soon placeholder for future e-commerce functionality
// Future: Full e-commerce with Shopify OR Stripe + custom build

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ComingSoon from '../components/ui/ComingSoon'
import useIsMobile from '../hooks/useIsMobile'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Sacred geometry SVG - Flower of Life pattern
const GEOMETRY_SVG = `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#D4AF37" stroke-width="0.5" opacity="0.15">
      <circle cx="100" cy="100" r="30"/>
      <circle cx="100" cy="70"  r="30"/>
      <circle cx="126" cy="85"  r="30"/>
      <circle cx="126" cy="115" r="30"/>
      <circle cx="100" cy="130" r="30"/>
      <circle cx="74"  cy="115" r="30"/>
      <circle cx="74"  cy="85"  r="30"/>
      <circle cx="100" cy="100" r="60" opacity="0.3"/>
      <circle cx="100" cy="100" r="90" opacity="0.2"/>
    </g>
  </svg>
`

export default function VaultPage() {
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: isMobile ? '8rem 1.5rem 4rem' : '10rem 3rem 6rem',
        background: '#0b0b0b',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sacred geometry background - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: EASE }}
        style={{
          position: 'absolute',
          top: isMobile ? '-10%' : '5%',
          right: isMobile ? '-20%' : '5%',
          width: isMobile ? '300px' : '400px',
          height: isMobile ? '300px' : '400px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        dangerouslySetInnerHTML={{ __html: GEOMETRY_SVG }}
      />

      {/* Sacred geometry background - bottom left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2, delay: 0.3, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: isMobile ? '-10%' : '5%',
          left: isMobile ? '-20%' : '5%',
          width: isMobile ? '300px' : '400px',
          height: isMobile ? '300px' : '400px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'scaleX(-1)',
        }}
        dangerouslySetInnerHTML={{ __html: GEOMETRY_SVG }}
      />

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Coming Soon component */}
        <ComingSoon />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: 1.8,
            letterSpacing: '0.04em',
            color: 'rgba(245,240,232,0.6)',
            textAlign: 'center',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
          }}
        >
          {t('vault.description')}
        </motion.p>

        {/* Feature preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          {[
            { icon: '📿', label: 'Sacred Tools' },
            { icon: '🎵', label: 'Sound Healing' },
            { icon: '📚', label: 'Digital Guides' },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 + index * 0.1, ease: EASE }}
              style={{
                padding: '2rem 1.5rem',
                border: '1px solid rgba(212,175,55,0.12)',
                background: 'rgba(212,175,55,0.02)',
                textAlign: 'center',
                transition: 'border-color 0.4s, background 0.4s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'
                e.currentTarget.style.background = 'rgba(212,175,55,0.04)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'
                e.currentTarget.style.background = 'rgba(212,175,55,0.02)'
              }}
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  filter: 'grayscale(0.3)',
                }}
              >
                {item.icon}
              </div>
              <p
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '11px',
                  letterSpacing: '0.3em',
                  color: 'rgba(245,240,232,0.5)',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Future tech note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
          style={{
            fontFamily: 'Raleway, sans-serif',
            fontWeight: 200,
            fontSize: '9px',
            letterSpacing: '0.4em',
            color: 'rgba(245,240,232,0.25)',
            textAlign: 'center',
            marginTop: '3rem',
            textTransform: 'uppercase',
          }}
        >
          Future: Shopify or Stripe Integration
        </motion.p>

        {/* Future placeholders (commented for future implementation) */}
        {/* 
        TODO: Future sub-routes for Vault:
        - /vault/products - Product listing with filters
        - /vault/products/:slug - Product detail with images, description, variants
        - /vault/cart - Shopping cart with quantity management
        - /vault/checkout - Checkout flow with Stripe/Shopify
        
        Suggested Tech Stack:
        Option 1: Shopify Buy SDK
        - Pros: Full e-commerce features, inventory management, payment processing
        - Cons: Monthly fees, less customization
        
        Option 2: Stripe + Custom Build
        - Pros: Full control, lower fees, custom UX
        - Cons: More development, need to handle inventory
        
        Recommended: Start with Shopify Buy SDK for MVP, migrate to custom if needed
        */}
      </div>
    </div>
  )
}

