// PostCard.jsx
// CMS blog post card component for Medicina de la Voz section
// Styled to match InteractiveCard aesthetic: dark base, gold border on hover,
// rgba(212,175,55,0.06) tint, sharp corners
//
// Props:
//   post { title, slug, coverImage, excerpt, category, publishedAt }
//
// Design Language:
//   - Obsidian (#0b0b0b) backgrounds
//   - Gold (#D4AF37) accents and borders
//   - Cream (#f5f0e8) text
//   - Sharp corners (no border-radius)
//   - Cormorant Garamond for headings
//   - Raleway for labels/body text

import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { localise } from '../../lib/localise'

const EASE = [0.25, 0.46, 0.45, 0.94]

function PostCard({ post }) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  // Resolve multilingual fields — falls back to EN if current lang not available
  const title   = localise(post.title,   lang)
  const excerpt = localise(post.excerpt, lang)

  const { coverImage, category, publishedAt } = post

  // Extract slug string — handles all Sanity slug formats:
  // 1. Plain string: "my-slug"
  // 2. Sanity object: { current: "my-slug" }
  // 3. Null/undefined: ""
  // 4. Accidentally a full URL: strip to just the path
  let slugStr = ''
  if (post.slug) {
    const raw = typeof post.slug === 'object' ? (post.slug.current || '') : String(post.slug)
    // If someone put a full URL in the slug field, extract just the last path segment
    try {
      const url = new URL(raw)
      // It's a valid URL — use the last non-empty path segment as slug
      const parts = url.pathname.split('/').filter(Boolean)
      slugStr = parts[parts.length - 1] || ''
    } catch {
      // Not a URL — use as-is (normal case)
      slugStr = raw
    }
  }

  if (import.meta.env.DEV) {
    console.log('[PostCard]', title, '| slug:', JSON.stringify(post.slug), '→', slugStr)
  }

  // Format date if present
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Don't render a clickable link if there's no valid slug
  if (!slugStr) {
    return (
      <motion.article
        style={{
          aspectRatio: '3 / 4',
          background: '#0b0b0b',
          border: '1px solid rgba(212,175,55,0.2)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'default',
          opacity: 0.6,
        }}
      >
        <div style={{ padding: '1.25rem', marginTop: 'auto' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 300, color: '#f5f0e8' }}>
            {title}
          </h3>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.4)', textTransform: 'uppercase', marginTop: '0.5rem' }}>
            No slug — add slug in Sanity Studio
          </p>
        </div>
      </motion.article>
    )
  }

  return (
    <Link to={`/pillars/medicina-de-la-voz/${slugStr}`} style={{ textDecoration: 'none' }}>
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
        }}
        whileHover={{
          borderColor: 'rgba(212,175,55,0.6)',
          boxShadow: 'inset 0 0 40px rgba(212,175,55,0.06), 0 0 30px rgba(212,175,55,0.15)',
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
                  color: '#D4AF37',
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
              color: 'rgba(212,175,55,0.5)',
              textTransform: 'uppercase',
              marginTop: 'auto',
            }}
            whileHover={{ color: 'rgba(212,175,55,0.9)' }}
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
export default memo(PostCard)
