// config.js
// Single source of truth for all environment-driven values.
// Import from here — never read import.meta.env directly in components.

const env = import.meta.env

export const SITE = {
  name:        env.VITE_SITE_NAME        || 'Anatomy of Breath',
  domain:      env.VITE_SITE_DOMAIN      || 'anatomiadelaliento.com',
  email:       env.VITE_SITE_EMAIL       || 'hola@anatomiadelaliento.com',
  tagline:     env.VITE_SITE_TAGLINE     || 'Where science dissolves into sacred',
  description: env.VITE_SITE_DESCRIPTION || 'Where science dissolves into sacred. A visual philosophy blending anatomy and sacred geometry.',
  mailtoHref:  `mailto:${env.VITE_SITE_EMAIL || 'hola@anatomiadelaliento.com'}`,
}

export const SANITY = {
  projectId:  env.VITE_SANITY_PROJECT_ID  || '',
  dataset:    env.VITE_SANITY_DATASET     || 'production',
  apiVersion: env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn:     true,
}

export const I18N = {
  defaultLocale:    'es',
  supportedLocales: ['es', 'en', 'hi', 'fr', 'pt'],
  localePath:       '/locales',
}

// Language metadata for the footer selector
export const LANGUAGES = [
  { code: 'es', label: 'Español',    nativeLabel: 'ES' },
  { code: 'en', label: 'English',    nativeLabel: 'EN' },
  { code: 'hi', label: 'हिन्दी',      nativeLabel: 'HI' },
  { code: 'fr', label: 'Français',   nativeLabel: 'FR' },
  { code: 'pt', label: 'Português',  nativeLabel: 'PT' },
]
