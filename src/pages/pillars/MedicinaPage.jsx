// MedicinaPage.jsx
// Blog post listing for Medicina de la Voz pillar

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { POSTS_QUERY } from '../../lib/queries'
import { SAMPLE_POSTS } from '../../lib/sampleData'
import PostCard from '../../components/cms/PostCard'
import SkeletonCard from '../../components/cms/SkeletonCard'
import ComingSoon from '../../components/ui/ComingSoon'

const EASE = [0.25, 0.46, 0.45, 0.94]

export default function MedicinaPage() {
  const { t } = useTranslation()
  const { data: cmsData, loading } = useSanityQuery(POSTS_QUERY)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Use CMS data only — normalize slug to plain string
  const posts = (cmsData && cmsData.length > 0)
    ? cmsData.map(p => ({ ...p, slug: p.slug?.current || p.slug }))
    : []
  // Extract unique categories from posts
  const categories = posts
    ? ['all', ...new Set(posts.map(p => p.category).filter(Boolean))]
    : ['all']

  // Filter posts by selected category
  const filteredPosts = posts
    ? selectedCategory === 'all'
      ? posts
      : posts.filter(p => p.category === selectedCategory)
    : []

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
              background: 'linear-gradient(90deg, #EBD197, #D4AF37, #A67C00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
            }}
          >
            {t('nav.medicinaVoz')}
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
            {t('nav.medicinaVozDesc') || 'Explorations in voice as medicine'}
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
                color: 'rgba(212,175,55,0.4)',
                marginTop: '1rem',
                fontStyle: 'italic',
              }}
            >
              {t('common.sampleContent') || 'Mostrando contenido de ejemplo'}
            </motion.p>
          )}
        </motion.div>

        {/* Category Filter — show only when posts are loaded */}
        {!loading && posts && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 200,
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: isActive ? '#D4AF37' : 'rgba(245,240,232,0.5)',
                    textTransform: 'uppercase',
                    padding: '0.6rem 1.5rem',
                    background: isActive ? 'rgba(212,175,55,0.06)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.2)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'
                      e.currentTarget.style.color = 'rgba(245,240,232,0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
                      e.currentTarget.style.color = 'rgba(245,240,232,0.5)'
                    }
                  }}
                >
                  {category === 'all' ? t('common.all') || 'All' : category}
                </button>
              )
            })}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state when CMS has no content */}
        {!loading && posts.length === 0 && (
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
              {t('common.noPosts') || 'No articles yet'}
            </p>
            <p style={{
              fontFamily: 'Raleway, sans-serif', fontWeight: 200,
              fontSize: '11px', letterSpacing: '0.3em',
              color: 'rgba(212,175,55,0.3)', textTransform: 'uppercase',
            }}>
              Add posts in Sanity Studio to see them here
            </p>
          </motion.div>
        )}

        {/* Post Grid */}
        {!loading && filteredPosts && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: EASE }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No results for filter */}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: '14px', letterSpacing: '0.04em', color: 'rgba(245,240,232,0.5)', textAlign: 'center', padding: '4rem 0' }}
          >
            {t('common.noResults') || 'No posts found in this category'}
          </motion.p>
        )}
      </div>
    </div>
  )
}
