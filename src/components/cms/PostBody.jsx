// PostBody.jsx
// Renders Sanity Portable Text content with Design_Language typography
// Used for blog post bodies and event descriptions

import { PortableText } from '@portabletext/react'

/**
 * Custom components for Portable Text rendering
 * Applies Design_Language typography:
 * - Cormorant Garamond for headings
 * - Raleway for body text
 * - Cream (#f5f0e8) text on obsidian (#0b0b0b) background
 * - Gold (#D4AF37) accents for links
 */
const components = {
  block: {
    // Headings
    h1: ({ children }) => (
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#f5f0e8',
          lineHeight: 1.2,
          marginTop: '2.5rem',
          marginBottom: '1.5rem',
          letterSpacing: '0.02em',
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 300,
          color: '#D4AF37',
          lineHeight: 1.3,
          marginTop: '2rem',
          marginBottom: '1.25rem',
          letterSpacing: '0.02em',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          fontWeight: 400,
          color: '#f5f0e8',
          lineHeight: 1.4,
          marginTop: '1.75rem',
          marginBottom: '1rem',
          letterSpacing: '0.01em',
        }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 300,
          color: 'rgba(212,175,55,0.9)',
          lineHeight: 1.5,
          marginTop: '1.5rem',
          marginBottom: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </h4>
    ),

    // Paragraphs
    normal: ({ children }) => (
      <p
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          fontWeight: 200,
          color: 'rgba(245,240,232,0.85)',
          lineHeight: 1.8,
          marginBottom: '1.25rem',
          letterSpacing: '0.02em',
        }}
      >
        {children}
      </p>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
          fontStyle: 'italic',
          color: '#D4AF37',
          lineHeight: 1.6,
          margin: '2rem 0',
          padding: '1.5rem 2rem',
          borderLeft: '2px solid rgba(212,175,55,0.4)',
          background: 'rgba(212,175,55,0.03)',
          letterSpacing: '0.01em',
        }}
      >
        {children}
      </blockquote>
    ),
  },

  // Lists
  list: {
    bullet: ({ children }) => (
      <ul
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          fontWeight: 200,
          color: 'rgba(245,240,232,0.85)',
          lineHeight: 1.8,
          marginBottom: '1.5rem',
          paddingLeft: '2rem',
          listStyleType: 'none',
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        style={{
          fontFamily: 'Raleway, sans-serif',
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          fontWeight: 200,
          color: 'rgba(245,240,232,0.85)',
          lineHeight: 1.8,
          marginBottom: '1.5rem',
          paddingLeft: '2rem',
          listStyleType: 'decimal',
        }}
      >
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li
        style={{
          marginBottom: '0.75rem',
          position: 'relative',
          paddingLeft: '1.5rem',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            color: '#D4AF37',
            fontSize: '0.8rem',
          }}
        >
          •
        </span>
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li
        style={{
          marginBottom: '0.75rem',
          color: 'rgba(245,240,232,0.85)',
        }}
      >
        {children}
      </li>
    ),
  },

  // Marks (inline formatting)
  marks: {
    strong: ({ children }) => (
      <strong
        style={{
          fontWeight: 400,
          color: '#D4AF37',
        }}
      >
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em
        style={{
          fontStyle: 'italic',
          color: 'rgba(245,240,232,0.95)',
        }}
      >
        {children}
      </em>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        style={{
          color: '#D4AF37',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(212,175,55,0.3)',
          textUnderlineOffset: '3px',
          transition: 'text-decoration-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecorationColor = 'rgba(212,175,55,0.8)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecorationColor = 'rgba(212,175,55,0.3)'
        }}
      >
        {children}
      </a>
    ),
  },

  // Images
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null

      return (
        <figure
          style={{
            margin: '2.5rem 0',
            width: '100%',
          }}
        >
          <img
            src={value.asset.url}
            alt={value.alt || ''}
            loading="lazy"
            width={value.asset.metadata?.dimensions?.width || 800}
            height={value.asset.metadata?.dimensions?.height || 600}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          />
          {value.caption && (
            <figcaption
              style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 200,
                color: 'rgba(245,240,232,0.5)',
                textAlign: 'center',
                marginTop: '0.75rem',
                fontStyle: 'italic',
                letterSpacing: '0.02em',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

/**
 * PostBody component
 * 
 * @param {Object} props
 * @param {Array} props.body - Sanity Portable Text content array
 * 
 * Validates: Requirements 6.2
 */
export default function PostBody({ body }) {
  if (!body || !Array.isArray(body) || body.length === 0) {
    return null
  }

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}
    >
      <PortableText value={body} components={components} />
    </div>
  )
}
