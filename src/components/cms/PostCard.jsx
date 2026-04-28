// PostCard.jsx
// CMS blog post card component for Medicina de la Voz section
// Styled to match InteractiveCard aesthetic: dark base, gold border on hover,
// rgba(255,215,0,0.06) tint, sharp corners
//
// Props:
//   post { title, slug, coverImage, excerpt, category, publishedAt }
//
// Design Language:
//   - Obsidian (#0b0b0b) backgrounds
//   - Gold (#FFD700) accents and borders
//   - Cream (#f5f0e8) text
//   - Sharp corners (no border-radius)
//   - Cormorant Garamond for headings
//   - Raleway for labels/body text

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const EASE = [0.25, 0.46, 0.45, 0.94]

function PostCard({ post }) {
  const { title, slug, coverImage, excerpt, category, publishedAt } = post

  // Format date if present
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <Link to={`/pillars/medicina-de-la-voz/${slug}`} style={{ textDecoration: 'none' }}>
      <motion.article
        style={{
          aspectRatio: '3 / 4',
          background: '#0b0b0b',
          border: '1px solid rgba(255,215,0,0.2)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
        whileHover={{
          borderColor: 'rgba(255,215,0,0.6)',
          boxShadow: 'inset 0 0 40px rgba(255,215,0,0.06), 0 0 30px rgba(255,215,0,0.15)',
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* Cover Image */}
        {coverImage && (
          <div
            style={{
              width: '100%',
              height: '60%',
              overflow: 'hidden',
              position: 'relative',
              background: 'rgba(255,215,0,0.03)',
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
          {/* Category & Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {category && (
              <span
                style={{
                  fontFamily: 'Raleway, sans-serif',
                  fontWeight: 200,
                  fontSize: '0.625rem',
                  letterSpacing: '0.15em',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </span>
            )}
            {formattedDate && (
              <>
                {category && (
                  <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '0.625rem' }}>
                    •
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 200,
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(245,240,232,0.5)',
                  }}
                >
                  {formattedDate}
                </span>
              </>
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

          {/* Excerpt */}
          {excerpt && (
            <p
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontWeight: 200,
                fontSize: '0.8rem',
                lineHeight: 1.6,
                color: 'rgba(245,240,232,0.7)',
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {excerpt}
            </p>
          )}

          {/* Read More Indicator */}
          <motion.div
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '0.625rem',
              letterSpacing: '0.2em',
              color: 'rgba(255,215,0,0.5)',
              textTransform: 'uppercase',
              marginTop: 'auto',
            }}
            whileHover={{ color: 'rgba(255,215,0,0.9)' }}
            transition={{ duration: 0.3 }}
          >
            Leer más →
          </motion.div>
        </div>

        {/* Hover overlay tint */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,215,0,0.06)',
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
export default memo(PostCard)
