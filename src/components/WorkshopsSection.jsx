import { useEffect, useState } from 'react'
import { client, urlFor } from '../lib/sanity'
import { Link } from 'react-router-dom'

export default function WorkshopsSection() {
  const [workshops, setWorkshops] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "event"] | order(date asc)`)
      .then((data) => {
        console.log("WORKSHOPS:", data)
        setWorkshops(data)
      })
  }, [])

  return (
    <section style={{ padding: '4rem', color: 'white' }}>
      <h1>Workshops</h1>

      {workshops.length === 0 && <p>No workshops available...</p>}

      {workshops.map((workshop) => (
        <div key={workshop._id} style={{ marginBottom: '2rem' }}>

          {/* ✅ FIXED ROUTE */}
          <h2>
            <Link
              to={`/pillars/experiences/${workshop.slug.current}`}
              style={{ color: '#FFD700', textDecoration: 'none' }}
            >
              {workshop.title}
            </Link>
          </h2>

          {workshop.coverImage && (
            <img
              src={urlFor(workshop.coverImage).width(500).url()}
              alt={workshop.coverImage?.alt || 'cover'}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          )}

          {workshop.description && <p>{workshop.description}</p>}
        </div>
      ))}
    </section>
  )
}