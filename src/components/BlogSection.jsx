import { useEffect, useState } from 'react'
import { client, urlFor } from '../lib/sanity'

export default function BlogSection() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "post"] | order(publishedAt desc)`)
      .then((data) => {
        console.log("SANITY DATA:", data)
        setPosts(data)
      })
  }, [])

  return (
    <section style={{ padding: '4rem', color: 'white' }}>
      <h1>Medicina de la Voz (Blog)</h1>

      {posts.length === 0 && <p>No posts found...</p>}

      {posts.map((post) => (
        <div key={post._id} style={{ marginBottom: '2rem' }}>

          {/* ✅ EXTERNAL REDIRECT */}
          <h2>
            <a
              href={post.externalUrl || 'https://medicinadelavoz.wordpress.com'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FFD700', textDecoration: 'none' }}
            >
              {post.title}
            </a>
          </h2>

          {post.coverImage && (
            <img
              src={urlFor(post.coverImage).width(500).url()}
              alt={post.coverImage?.alt || 'cover'}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          )}

          {post.excerpt && <p>{post.excerpt}</p>}
        </div>
      ))}
    </section>
  )
}