// MedicinaPostPage.jsx
// Individual blog post detail page — uses real Sanity CMS data only

import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { POST_BY_SLUG_QUERY } from '../../lib/queries'
import PostBody from '../../components/cms/PostBody'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function MedicinaPostPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const { data: post, loading } = useSanityQuery(POST_BY_SLUG_QUERY, { slug })

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0b' }}>
        <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '12px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.5)', textTransform: 'uppercase' }}>
          {t('common.loading') || 'Loading...'}
        </p>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', background: '#0b0b0b' }}>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300, fontStyle: 'italic', color: '#f5f0e8', textAlign: 'center', marginBottom: '2rem' }}
        >
          {t('common.contentUnavailable') || 'Content unavailable'}
        </motion.p>
        <Link to="/pillars/medicina-de-la-voz"
          style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.4em', color: '#D4AF37', textDecoration: 'none', textTransform: 'uppercase', padding: '0.9rem 2.5rem', border: '1px solid rgba(212,175,55,0.5)', display: 'inline-block', transition: 'background 0.3s, border-color 0.3s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = '#D4AF37' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)' }}
        >
          {t('common.backToList') || 'Back to Medicina de la Voz'}
        </Link>
      </div>
    )
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <article style={{ minHeight: '100vh', padding: '8rem 1.5rem 4rem', background: '#0b0b0b' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: '2rem' }}>
          <Link to="/pillars/medicina-de-la-voz"
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(212,175,55,0.6)', textDecoration: 'none', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,175,55,0.6)'}
          >
            ← {t('common.back') || 'Back'}
          </Link>
        </motion.div>

        {post.coverImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}
            style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', marginBottom: '3rem', border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <img src={post.coverImage.asset?.url || post.coverImage.url} alt={post.coverImage.alt || post.title}
              loading="lazy" width="900" height="506" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}
        >
          {post.category && <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.3em', color: '#D4AF37', textTransform: 'uppercase' }}>{post.category}</span>}
          {formattedDate && (
            <>
              {post.category && <span style={{ color: 'rgba(245,240,232,0.3)', fontSize: '10px' }}>•</span>}
              <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(245,240,232,0.5)' }}>{formattedDate}</span>
            </>
          )}
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2, marginBottom: '2rem' }}
        >
          {post.title}
        </motion.h1>

        {post.excerpt && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '16px', lineHeight: 1.8, color: 'rgba(245,240,232,0.8)', marginBottom: '3rem', fontStyle: 'italic' }}
          >
            {post.excerpt}
          </motion.p>
        )}

        {post.body && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }}>
            <PostBody body={post.body} />
          </motion.div>
        )}
      </div>
    </article>
  )
}
