// src/i18n/index.js
//
// Translations are bundled directly as JS imports — no HTTP fetch, no async
// loading, no flash-of-wrong-language on first render.
//
// Why not HttpBackend?
//   HttpBackend fetches JSON over the network after React mounts. The first
//   render always happens before the fetch resolves, so components briefly
//   show English keys or the fallback language regardless of what's stored
//   in localStorage. Bundling the JSON eliminates that race entirely.
//
// Language persistence:
//   The LanguageDetector reads from localStorage key 'i18nextLng' (the
//   standard default). When the user picks a language via the footer/nav
//   toggle, i18next writes it there automatically. On the next page load the
//   detector reads it synchronously before the first render — no flash.

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { I18N } from '../config'

// ── Bundled translation resources ────────────────────────────
import es from '../../public/locales/es/translation.json'
import en from '../../public/locales/en/translation.json'
import hi from '../../public/locales/hi/translation.json'
import fr from '../../public/locales/fr/translation.json'
import pt from '../../public/locales/pt/translation.json'

// ── One-time localStorage key migration ───────────────────────
// The previous config stored the language under 'i18n_lang'.
// i18next-browser-languagedetector uses 'i18nextLng' by default.
// Migrate once so returning users don't lose their preference.
;(function migrateStorageKey() {
  try {
    const legacy = localStorage.getItem('i18n_lang')
    if (legacy && !localStorage.getItem('i18nextLng')) {
      localStorage.setItem('i18nextLng', legacy)
      localStorage.removeItem('i18n_lang')
    }
  } catch (_) {
    // localStorage unavailable (private browsing, etc.) — silently skip
  }
})()

i18n
  .use(LanguageDetector)   // reads localStorage before first render
  .use(initReactI18next)
  .init({
    // ── Resources bundled inline — synchronous, zero network ──
    resources: {
      es: { translation: es },
      en: { translation: en },
      hi: { translation: hi },
      fr: { translation: fr },
      pt: { translation: pt },
    },

    // ── Language resolution ───────────────────────────────────
    // 1. Check localStorage key 'i18nextLng' (written by i18next on change)
    // 2. Fall back to browser navigator language
    // 3. If neither matches a supported locale, use defaultLocale ('es')
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      // Use the standard key so i18next reads back what it wrote
      lookupLocalStorage: 'i18nextLng',
    },

    fallbackLng: I18N.defaultLocale,   // 'es'
    supportedLngs: I18N.supportedLocales,
    defaultNS: 'translation',

    // Resources are already loaded — no async init needed
    initImmediate: true,

    interpolation: { escapeValue: false },
  })

export default i18n
