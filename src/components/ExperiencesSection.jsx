import { useEffect, useState } from 'react'
import { client, urlFor } from '../lib/sanity'
import { Link } from 'react-router-dom'

export default function ExperiencesSection() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "event"] | order(date asc)`)
      .then((data) => {
        console.log("EVENTS:", data)
        setEvents(data)
      })
  }, [])

  return (
    <section style={{ padding: '4rem', color: 'white' }}>
      <h1>Experiences</h1>

      {events.length === 0 && <p>No events available...</p>}

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: '2rem' }}>
          
          {/* ✅ FIXED ROUTE */}
          <h2>
            <Link
              to={`/pillars/experiences/${event.slug.current}`}
              style={{ color: '#D4AF37', textDecoration: 'none' }}
            >
              {event.title}
            </Link>
          </h2>

          {event.coverImage && (
            <img
              src={urlFor(event.coverImage).width(500).url()}
              alt={event.coverImage?.alt || 'cover'}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          )}

          {event.description && <p>{event.description}</p>}

          {event.date && (
            <p>
              <strong>Date:</strong>{' '}
              {new Date(event.date).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}