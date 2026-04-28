// MedicinaPage.jsx
// Blog post listing for Medicina de la Voz pillar

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useSanityQuery from '../../hooks/useSanityQuery'
import { POSTS_QUERY } from '../../lib/queries'
import PostCard from '../../components/cms/PostCard'
import SkeletonCard from '../../components/cms/SkeletonCard'
import ComingSoon from '../../components/ui/ComingSoon'

const EASE = [0.25, 0.46, 0.45, 0.94]

// Sample posts to display when CMS is not configured
const SAMPLE_POSTS = [
  {
    title: 'La Voz como Medicina Ancestral',
    slug: 'voz-medicina-ancestral',
    category: 'Fundamentos',
    publishedAt: '2024-01-15',
    excerpt: 'Exploramos cómo las culturas ancestrales utilizaban la voz como herramienta de sanación y transformación.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=1067&fit=crop',
      alt: 'Persona cantando'
    }
  },
  {
    title: 'Técnicas de Respiración para la Voz',
    slug: 'tecnicas-respiracion-voz',
    category: 'Práctica',
    publishedAt: '2024-01-20',
    excerpt: 'Descubre ejercicios de respiración que fortalecen y liberan tu voz natural.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=1067&fit=crop',
      alt: 'Respiración consciente'
    }
  },
  {
    title: 'El Poder del Canto Terapéutico',
    slug: 'poder-canto-terapeutico',
    category: 'Terapia',
    publishedAt: '2024-02-01',
    excerpt: 'Cómo el canto puede ser una herramienta poderosa para la sanación emocional y física.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=1067&fit=crop',
      alt: 'Canto terapéutico'
    }
  },
  {
    title: 'Resonancia y Vibración Corporal',
    slug: 'resonancia-vibracion-corporal',
    category: 'Fundamentos',
    publishedAt: '2024-02-10',
    excerpt: 'Entendiendo cómo la voz resuena en el cuerpo y su impacto en nuestro bienestar.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=1067&fit=crop',
      alt: 'Resonancia vocal'
    }
  },
  {
    title: 'Liberación Vocal y Emocional',
    slug: 'liberacion-vocal-emocional',
    category: 'Práctica',
    publishedAt: '2024-02-15',
    excerpt: 'Ejercicios para liberar bloqueos vocales y emocionales a través del sonido.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1067&fit=crop',
      alt: 'Liberación vocal'
    }
  },
  {
    title: 'Mantras y Su Poder Transformador',
    slug: 'mantras-poder-transformador',
    category: 'Terapia',
    publishedAt: '2024-02-20',
    excerpt: 'La ciencia y espiritualidad detrás de los mantras y su efecto en la consciencia.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=800&h=1067&fit=crop',
      alt: 'Meditación con mantras'
    }
  }
]

export default function MedicinaPage() {
  const { t } = useTranslation()
  const { data: cmsData, loading, error } = useSanityQuery(POSTS_QUERY)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Use CMS data if available, otherwise use sample posts
  const posts = cmsData && cmsData.length > 0 ? cmsData : SAMPLE_POSTS

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
              color: '#FFD700',
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
                color: 'rgba(255,215,0,0.4)',
                marginTop: '1rem',
                fontStyle: 'italic',
              }}
            >
              {t('common.sampleContent') || 'Mostrando contenido de ejemplo'}
            </motion.p>
          )}
        </motion.div>

        {/* Category Filter */}
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
                    color: isActive ? '#FFD700' : 'rgba(245,240,232,0.5)',
                    textTransform: 'uppercase',
                    padding: '0.6rem 1.5rem',
                    background: isActive ? 'rgba(255,215,0,0.06)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.2)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)'
                      e.currentTarget.style.color = 'rgba(245,240,232,0.8)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Post Grid */}
        {!loading && filteredPosts && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index, ease: EASE }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No results for filter */}
        {!loading && posts && posts.length > 0 && filteredPosts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontWeight: 200,
              fontSize: '14px',
              letterSpacing: '0.04em',
              color: 'rgba(245,240,232,0.5)',
              textAlign: 'center',
              padding: '4rem 0',
            }}
          >
            {t('common.noResults') || 'No posts found in this category'}
          </motion.p>
        )}
      </div>
    </div>
  )
}
