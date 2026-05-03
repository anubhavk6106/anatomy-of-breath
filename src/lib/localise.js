// src/lib/localise.js
//
// Resolves a multilingual field from Sanity CMS to a plain string.
//
// Sanity stores multilingual text as:
//   { en: "Anatomy of Breath", es: "Anatomía del Aliento", ... }
//
// Usage:
//   import { localise } from '../lib/localise'
//   const title = localise(post.title, i18n.language)
//
// Fallback chain:
//   1. Exact language match  (e.g. 'es')
//   2. Base language match   (e.g. 'es' from 'es-MX')
//   3. English fallback      ('en')
//   4. First available value
//   5. Empty string

/**
 * @param {string | Record<string, string> | null | undefined} field
 * @param {string} lang  — active i18next language code (e.g. 'es', 'en', 'hi')
 * @returns {string}
 */
export function localise(field, lang = 'en') {
  if (!field) return ''

  // Plain string (legacy / not yet migrated) — return as-is
  if (typeof field === 'string') return field

  // Multilingual object
  if (typeof field === 'object') {
    // 1. Exact match
    if (field[lang]) return field[lang]

    // 2. Base language (strip region: 'es-MX' → 'es')
    const base = lang.split('-')[0]
    if (base !== lang && field[base]) return field[base]

    // 3. English fallback
    if (field.en) return field.en

    // 4. First available value
    const first = Object.values(field).find(v => v)
    if (first) return first
  }

  return ''
}
