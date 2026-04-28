export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  title, slug, publishedAt, category, excerpt,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title, publishedAt, category, body,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const EVENTS_QUERY = `*[_type == "event" && defined(date)] | order(date asc) {
  title, slug, date, location, isOnline, description, bookingUrl,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  title, date, location, isOnline, description, bookingUrl,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const ACTIVE_SOMA_FEATURE_QUERY = `*[_type == "somaFeature" && isActive == true][0] {
  title, description
}`
