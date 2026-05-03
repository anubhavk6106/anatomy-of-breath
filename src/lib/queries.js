// queries.js
// GROQ queries for Sanity CMS.
//
// Multilingual fields (title, excerpt, description) are objects:
//   { en: "...", es: "...", hi: "...", fr: "...", pt: "..." }
//
// The frontend resolves the active language with localise():
//   localise(item.title, lang)  →  item.title[lang] ?? item.title.en ?? ''

export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  category,
  excerpt,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  publishedAt,
  category,
  excerpt,
  body,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const EVENTS_QUERY = `*[_type == "event" && defined(date)] | order(date asc) {
  title,
  "slug": slug.current,
  date,
  location,
  isOnline,
  description,
  bookingUrl,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  date,
  location,
  isOnline,
  description,
  bookingUrl,
  "coverImage": coverImage { asset->{url}, alt }
}`

export const ACTIVE_SOMA_FEATURE_QUERY = `*[_type == "somaFeature" && isActive == true][0] {
  title,
  description
}`
