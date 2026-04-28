# Design Document — Platform Expansion

## Overview

This document describes the technical architecture for transforming "Anatomy of Breath" from a single-page React application into a multi-route, internationalized, CMS-connected platform. The expansion adds React Router DOM v6, react-i18next, and Sanity CMS while preserving every existing component, animation, and visual characteristic without modification.

The guiding principle is **additive, non-destructive expansion**: the existing `App.jsx` becomes the Matrix route, the existing hooks and components are reused verbatim, and all new infrastructure layers beneath them.

### Key Design Decisions

- **`createBrowserRouter` over `BrowserRouter`**: Enables data loaders in the future and provides a cleaner root layout pattern via `<Outlet />`.
- **Locale files loaded lazily via `i18next-http-backend`**: Translation JSON is never bundled into the main chunk; it is fetched on demand per locale.
- **`Spiritus_Est_Origo` hardcoded, never keyed**: The Latin phrase `"Spiritus est origo"` is a brand constant, not translatable content. It is written as a string literal in the Portal component and excluded from all translation files.
- **In-memory Sanity cache with 60-second TTL**: A thin module-level `Map` wraps `@sanity/client` fetch calls. No external state manager is needed.
- **Existing `App.jsx` becomes `MatrixPage.jsx` verbatim**: The file is relocated; its internal `Nav` and `Footer` are replaced by the root layout equivalents, but all section components are untouched.

---

## Architecture

### High-Level Structure

```
Browser
  └── React Router (createBrowserRouter)
        └── RootLayout  ← mounts once: GlobalNav, CustomCursor, TransitionFlash, AmbientSound
              ├── /                → PortalPage       (lazy)
              ├── /matrix          → MatrixPage        (lazy)
              ├── /pillars/medicina-de-la-voz          → MedicinaPage     (lazy)
              ├── /pillars/medicina-de-la-voz/:slug    → MedicinaPostPage (lazy)
              ├── /pillars/soma    → SomaPage          (lazy)
              ├── /pillars/experiences                 → ExperiencesPage  (lazy)
              ├── /pillars/experiences/:slug           → ExperienceDetailPage (lazy)
              ├── /vault           → VaultPage         (lazy)
              └── *                → NotFoundPage      (lazy)
```

### Folder Structure

```
src/
├── App.jsx                    ← DELETED (content moved to pages/MatrixPage.jsx)
├── main.jsx                   ← Updated: mounts RouterProvider instead of <App />
├── config.js                  ← Updated: adds SANITY and I18N exports
├── index.css                  ← Unchanged
│
├── router/
│   └── index.jsx              ← createBrowserRouter definition + lazy imports
│
├── layouts/
│   └── RootLayout.jsx         ← GlobalNav, CustomCursor, TransitionFlash, <Outlet />
│
├── pages/
│   ├── PortalPage.jsx
│   ├── MatrixPage.jsx         ← Former App.jsx content (sections only, no Nav/Footer)
│   ├── NotFoundPage.jsx
│   ├── VaultPage.jsx
│   └── pillars/
│       ├── MedicinaPage.jsx
│       ├── MedicinaPostPage.jsx
│       ├── SomaPage.jsx
│       ├── ExperiencesPage.jsx
│       └── ExperienceDetailPage.jsx
│
├── components/                ← All existing components UNCHANGED
│   ├── BreathTimeline.jsx
│   ├── BreathVisualizer.jsx
│   ├── CardModal.jsx
│   ├── Contact.jsx
│   ├── Gallery.jsx
│   ├── HeroSection.jsx
│   ├── ImmersiveSection.jsx
│   ├── InteractiveCard.jsx
│   ├── Philosophy.jsx
│   ├── Preloader.jsx
│   ├── SoundToggle.jsx
│   ├── TransitionFlash.jsx
│   │
│   ├── nav/
│   │   ├── GlobalNav.jsx      ← New: replaces inline Nav in App.jsx
│   │   ├── PillarsDropdown.jsx
│   │   └── LanguageToggle.jsx
│   │
│   ├── cms/
│   │   ├── PostCard.jsx
│   │   ├── PostBody.jsx       ← Portable Text renderer
│   │   ├── EventCard.jsx
│   │   ├── SkeletonCard.jsx
│   │   └── SomaFeatureBlock.jsx
│   │
│   └── ui/
│       ├── VideoBackground.jsx
│       ├── ComingSoon.jsx
│       └── EmailCapture.jsx
│
├── hooks/
│   ├── useAmbientSound.js     ← Unchanged
│   ├── useNavTransition.js    ← Unchanged
│   ├── useIsMobile.js         ← Extracted from App.jsx (was inline hook)
│   └── useSanityQuery.js      ← New: wraps Sanity client with cache
│
├── i18n/
│   ├── index.js               ← i18next init (http-backend, languageDetector)
│   └── locales/
│       ├── es/
│       │   └── translation.json
│       └── en/
│           └── translation.json
│
└── lib/
    └── sanityClient.js        ← @sanity/client init + in-memory cache

sanity/                        ← Sanity Studio (separate workspace)
├── sanity.config.js
└── schemas/
    ├── index.js
    ├── post.js
    ├── event.js
    └── somaFeature.js
```

### Data Flow

```
User navigates to /pillars/medicina-de-la-voz
  → Router renders RootLayout + MedicinaPage (lazy chunk loaded)
  → MedicinaPage calls useSanityQuery(POSTS_QUERY)
  → useSanityQuery checks in-memory cache (Map keyed by query string)
      → Cache HIT (< 60s): returns cached data immediately
      → Cache MISS: calls sanityClient.fetch(query) → Sanity CDN → stores result
  → MedicinaPage renders PostCard grid
  → Visitor clicks a card → Router navigates to /pillars/medicina-de-la-voz/:slug
  → MedicinaPostPage calls useSanityQuery(POST_BY_SLUG_QUERY, { slug })
  → Renders PostBody (Portable Text)
```

---

## Components and Interfaces

### RootLayout

The single component that wraps every route. It mounts global singletons exactly once.

```jsx
// src/layouts/RootLayout.jsx
export default function RootLayout() {
  const { flash, navigateTo } = useNavTransition()
  // navigateTo is passed down via context so all pages can trigger flash
  return (
    <NavTransitionContext.Provider value={{ flash, navigateTo }}>
      <CustomCursor />
      <TransitionFlash flash={flash} />
      <GlobalNav />
      <Outlet />   {/* page content renders here */}
      <GlobalFooter />
    </NavTransitionContext.Provider>
  )
}
```

A `NavTransitionContext` is introduced so any page or component can call `navigateTo` without prop drilling.

### GlobalNav

Replaces the inline `Nav` function in `App.jsx`. Accepts no props — reads route state from `useLocation()` and translation from `useTranslation()`.

```
GlobalNav
├── Logo (links to /)
├── Desktop links
│   ├── Portal link  → /
│   ├── Matrix link  → /matrix
│   ├── Pillars item → hover triggers PillarsDropdown
│   │   └── PillarsDropdown
│   │       ├── Medicina de la Voz → /pillars/medicina-de-la-voz
│   │       ├── Soma               → /pillars/soma
│   │       └── Experiences        → /pillars/experiences
│   ├── Vault link   → /vault
│   ├── Inquire CTA  → mailto:hola@anatomiadelaliento.com
│   ├── LanguageToggle
│   └── SoundToggle
└── Mobile hamburger → fullscreen overlay (same aesthetic as existing)
    └── All links listed vertically + LanguageToggle + SoundToggle
```

Active state: `useMatch()` from React Router determines which link receives the gold underline.

### LanguageToggle

```jsx
// Renders: ES | EN  (active locale highlighted in gold)
function LanguageToggle() {
  const { i18n } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
  return (
    <button onClick={toggle} aria-label="Switch language">
      <span style={{ color: i18n.language === 'es' ? '#FFD700' : 'rgba(245,240,232,0.4)' }}>ES</span>
      <span style={{ color: 'rgba(245,240,232,0.2)', margin: '0 4px' }}>|</span>
      <span style={{ color: i18n.language === 'en' ? '#FFD700' : 'rgba(245,240,232,0.4)' }}>EN</span>
    </button>
  )
}
```

### VideoBackground

Handles the Portal background video with all required attributes and fallback logic.

```jsx
// src/components/ui/VideoBackground.jsx
// Props: src (WebM), srcMp4, poster, onEnded
function VideoBackground({ src, srcMp4, poster, onEnded }) {
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion() // Framer Motion hook
  const { effectiveType } = navigator.connection ?? {}
  const skipVideo = isMobile || prefersReducedMotion || effectiveType === 'slow-2g' || effectiveType === '2g'

  if (skipVideo) return <img src={poster} alt="" style={coverStyles} />

  return (
    <video
      autoPlay muted loop playsInline
      poster={poster}
      onEnded={onEnded}
      style={coverStyles}
    >
      <source src={src} type="video/webm" />
      <source src={srcMp4} type="video/mp4" />
      <img src={poster} alt="" />
    </video>
  )
}
```

### PostCard

```jsx
// src/components/cms/PostCard.jsx
// Props: post { title, slug, coverImage, excerpt, category, publishedAt }
// Styled to match InteractiveCard aesthetic: dark base, gold border on hover
function PostCard({ post }) { ... }
```

### SkeletonCard

Displays while CMS images load. Gold-tinted shimmer animation matching card dimensions.

```jsx
function SkeletonCard() {
  // Uses CSS animation: shimmer from rgba(255,215,0,0.03) to rgba(255,215,0,0.08)
}
```

### useSanityQuery

```js
// src/hooks/useSanityQuery.js
// Returns { data, loading, error }
// Checks module-level cache before fetching
export function useSanityQuery(query, params = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    const cacheKey = JSON.stringify({ query, params })
    const cached = queryCache.get(cacheKey)
    if (cached && Date.now() - cached.ts < 60_000) {
      setState({ data: cached.data, loading: false, error: null })
      return
    }
    sanityClient.fetch(query, params)
      .then(data => {
        queryCache.set(cacheKey, { data, ts: Date.now() })
        setState({ data, loading: false, error: null })
      })
      .catch(error => setState({ data: null, loading: false, error }))
  }, [query, JSON.stringify(params)])
  return state
}
```

---

## Data Models

### i18n Translation Structure

Translation files live at `src/i18n/locales/{locale}/translation.json`. Keys are namespaced by section.

```json
// src/i18n/locales/es/translation.json
{
  "nav": {
    "portal": "Portal",
    "matrix": "Matrix",
    "pillars": "Pilares",
    "medicina": "Medicina de la Voz",
    "soma": "Soma",
    "experiences": "Experiencias",
    "vault": "Vault",
    "inquire": "Consultar"
  },
  "portal": {
    "tagline": "Donde la ciencia se disuelve en lo sagrado",
    "enter": "Explorar"
  },
  "vault": {
    "comingSoon": "Próximamente",
    "description": "El Vault abrirá sus puertas pronto. Déjanos tu correo para ser el primero en saber.",
    "emailPlaceholder": "tu@correo.com",
    "notify": "Notifícame"
  },
  "soma": {
    "hero": {
      "title": "Soma",
      "subtitle": "Terapias corporales, respiración y movimiento",
      "body": "..."
    }
  },
  "common": {
    "comingSoon": "Próximamente",
    "noEvents": "No hay eventos próximos",
    "noPosts": "Contenido próximamente",
    "past": "Pasado",
    "bookNow": "Reservar",
    "readMore": "Leer más"
  }
}
```

**`Spiritus_Est_Origo` is NOT a key in any translation file.** It is written as the string literal `"Spiritus est origo"` directly in `PortalPage.jsx`.

### Sanity CMS Schemas

#### `post` Document Type

```js
// sanity/schemas/post.js
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',   title: 'Title',        validation: Rule => Rule.required() },
    { name: 'slug',        type: 'slug',     title: 'Slug',         options: { source: 'title' }, validation: Rule => Rule.required() },
    { name: 'publishedAt', type: 'datetime', title: 'Published At' },
    { name: 'category',    type: 'string',   title: 'Category' },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
    },
    { name: 'excerpt', type: 'text', title: 'Excerpt', validation: Rule => Rule.max(200) },
    { name: 'body',    type: 'array', title: 'Body', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] },
  ],
  orderings: [{ title: 'Published Date, New', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
}
```

#### `event` Document Type

```js
// sanity/schemas/event.js
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',   title: 'Title',    validation: Rule => Rule.required() },
    { name: 'slug',        type: 'slug',     title: 'Slug',     options: { source: 'title' }, validation: Rule => Rule.required() },
    { name: 'date',        type: 'datetime', title: 'Date',     validation: Rule => Rule.required() },
    { name: 'location',    type: 'string',   title: 'Location' },
    { name: 'isOnline',    type: 'boolean',  title: 'Online Event', initialValue: false },
    { name: 'description', type: 'array',    title: 'Description', of: [{ type: 'block' }] },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }]
    },
    { name: 'bookingUrl', type: 'url', title: 'Booking URL' },
  ],
  orderings: [{ title: 'Date Ascending', name: 'dateAsc', by: [{ field: 'date', direction: 'asc' }] }],
}
```

#### `somaFeature` Document Type

```js
// sanity/schemas/somaFeature.js
export default {
  name: 'somaFeature',
  title: 'Soma Feature',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',  title: 'Title' },
    { name: 'description', type: 'text',    title: 'Description' },
    { name: 'isActive',    type: 'boolean', title: 'Active', initialValue: true },
  ],
}
```

### GROQ Queries

```js
// src/lib/queries.js

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
```

### Environment Variables

`src/config.js` is extended with two new exports:

```js
// Additions to src/config.js

export const SANITY = {
  projectId:  env.VITE_SANITY_PROJECT_ID  || '',
  dataset:    env.VITE_SANITY_DATASET     || 'production',
  apiVersion: env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn:     true,
}

export const I18N = {
  defaultLocale: 'es',
  supportedLocales: ['es', 'en'],
  localePath: '/locales',   // served from public/locales/
}
```

`.env.example` updated to include:

```
VITE_SITE_NAME=Anatomy of Breath
VITE_SITE_DOMAIN=anatomiadelaliento.com
VITE_SITE_EMAIL=hola@anatomiadelaliento.com
VITE_SITE_TAGLINE=Where science dissolves into sacred
VITE_SITE_DESCRIPTION=...
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

### Sanity Client Initialization

```js
// src/lib/sanityClient.js
import { createClient } from '@sanity/client'
import { SANITY } from '../config'

export const sanityClient = createClient({
  projectId: SANITY.projectId,
  dataset:   SANITY.dataset,
  apiVersion: SANITY.apiVersion,
  useCdn:    SANITY.useCdn,
})

// Module-level in-memory cache — survives route changes, cleared on page reload
export const queryCache = new Map()
```

### Router Definition

```jsx
// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '../layouts/RootLayout'
import PageLoader from '../components/ui/PageLoader'

const wrap = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

const PortalPage           = lazy(() => import('../pages/PortalPage'))
const MatrixPage           = lazy(() => import('../pages/MatrixPage'))
const MedicinaPage         = lazy(() => import('../pages/pillars/MedicinaPage'))
const MedicinaPostPage     = lazy(() => import('../pages/pillars/MedicinaPostPage'))
const SomaPage             = lazy(() => import('../pages/pillars/SomaPage'))
const ExperiencesPage      = lazy(() => import('../pages/pillars/ExperiencesPage'))
const ExperienceDetailPage = lazy(() => import('../pages/pillars/ExperienceDetailPage'))
const VaultPage            = lazy(() => import('../pages/VaultPage'))
const NotFoundPage         = lazy(() => import('../pages/NotFoundPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,                                    element: wrap(PortalPage) },
      { path: 'matrix',                                 element: wrap(MatrixPage) },
      { path: 'pillars/medicina-de-la-voz',             element: wrap(MedicinaPage) },
      { path: 'pillars/medicina-de-la-voz/:slug',       element: wrap(MedicinaPostPage) },
      { path: 'pillars/soma',                           element: wrap(SomaPage) },
      { path: 'pillars/experiences',                    element: wrap(ExperiencesPage) },
      { path: 'pillars/experiences/:slug',              element: wrap(ExperienceDetailPage) },
      { path: 'vault',                                  element: wrap(VaultPage) },
      { path: '*',                                      element: wrap(NotFoundPage) },
    ],
  },
])
```

### main.jsx Update

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './i18n/index'   // initialize i18next before render
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

### i18next Initialization

```js
// src/i18n/index.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { I18N } from '../config'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: I18N.defaultLocale,
    supportedLngs: I18N.supportedLocales,
    defaultNS: 'translation',
    backend: {
      loadPath: `${I18N.localePath}/{{lng}}/{{ns}}.json`,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18n_lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
```

Translation JSON files are placed in `public/locales/` so Vite serves them as static assets — they are never bundled.

---

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property Reflection:** After prework analysis, the following properties were identified as testable via property-based testing. Redundancy check: 6.5 and 12.6 both describe the 60-second cache TTL — they are consolidated into a single property. 8.2 (sort order) and 8.6 (GROQ filter) are distinct enough to keep separate. 4.2 and 11.6 both describe VideoBackground conditional rendering — they are consolidated into one comprehensive property covering all skip-video conditions.

### Property 1: Router renders a component for every defined route

*For any* route string in the defined route set (`/`, `/matrix`, `/pillars/medicina-de-la-voz`, `/pillars/soma`, `/pillars/experiences`, `/vault`), navigating to that route via the router should render a non-null page component without triggering a full browser reload.

**Validates: Requirements 1.2**

---

### Property 2: Undefined routes render the 404 page

*For any* path string that is not in the defined route set, the router should render the `NotFoundPage` component.

**Validates: Requirements 1.3**

---

### Property 3: Scroll resets to top on every route change

*For any* pair of defined routes A and B, navigating from A to B should result in `window.scrollY === 0` after the navigation completes.

**Validates: Requirements 1.4**

---

### Property 4: TransitionFlash fires on every route change

*For any* route navigation event, the `flash` state managed by `useNavTransition` should transition to `true` during the navigation and back to `false` after it completes.

**Validates: Requirements 1.5**

---

### Property 5: GlobalNav is present on every route

*For any* defined route, the rendered output should contain exactly one `GlobalNav` component instance.

**Validates: Requirements 2.1**

---

### Property 6: Active nav item reflects current route

*For any* defined route, the nav item corresponding to that route should render with the gold active color (`#FFD700`), and all other nav items should render in the inactive color.

**Validates: Requirements 2.4**

---

### Property 7: Language toggle switches locale without page reload

*For any* supported locale (`es`, `en`), calling `i18n.changeLanguage` to the other locale should update `i18n.language` to the new value without triggering a page reload, and the new locale should be persisted in `localStorage` under the `i18n_lang` key.

**Validates: Requirements 2.6, 3.2**

---

### Property 8: i18n fallback returns Spanish value for missing keys

*For any* translation key that exists in the `es` locale but is absent from the `en` locale, calling `i18n.t(key)` with the `en` locale active should return the `es` value rather than the raw key string.

**Validates: Requirements 3.6**

---

### Property 9: VideoBackground skips video for all skip conditions

*For any* combination of conditions that should suppress video (mobile viewport width < 768px, `prefers-reduced-motion: reduce`, or network `effectiveType` of `'slow-2g'` or `'2g'`), the `VideoBackground` component should render an `<img>` element rather than a `<video>` element.

**Validates: Requirements 4.2, 4.8, 11.6**

---

### Property 10: VideoBackground always includes WebM and MP4 sources

*For any* `VideoBackground` render where video is not suppressed (desktop, no reduced motion, adequate connection), the `<video>` element should contain a `<source>` with `type="video/webm"` and a `<source>` with `type="video/mp4"`.

**Validates: Requirements 11.5**

---

### Property 11: Post list renders a card for every fetched post

*For any* non-empty array of post objects returned by the mocked Sanity client, the `MedicinaPage` should render exactly as many `PostCard` components as there are posts in the array.

**Validates: Requirements 6.1**

---

### Property 12: Category filter shows only matching posts

*For any* array of posts with mixed category values, selecting a category filter should result in only posts whose `category` field matches the selected value being rendered — no posts from other categories should appear.

**Validates: Requirements 6.3**

---

### Property 13: Sanity query cache prevents redundant fetches within 60 seconds

*For any* GROQ query string, calling `useSanityQuery` a second time within 60 seconds of the first call should return the cached result without invoking `sanityClient.fetch` again. After 60 seconds have elapsed, the next call should invoke `sanityClient.fetch` once.

**Validates: Requirements 6.5, 12.6**

---

### Property 14: Event list renders a card for every fetched event

*For any* non-empty array of event objects returned by the mocked Sanity client, the `ExperiencesPage` should render exactly as many `EventCard` components as there are events in the array.

**Validates: Requirements 8.1**

---

### Property 15: Events are rendered in ascending date order with past events distinguished

*For any* array of events with varying dates (some past, some future), the rendered `EventCard` components should appear in ascending date order, and any event whose `date` is before the current time should have a visual distinction (reduced opacity or "Past" label).

**Validates: Requirements 8.2**

---

### Property 16: CMS images render with lazy loading and explicit dimensions

*For any* `PostCard` or `EventCard` render that includes a cover image, the rendered `<img>` element should have `loading="lazy"`, an explicit `width` attribute, and an explicit `height` attribute.

**Validates: Requirements 12.5**

---

## Error Handling

### CMS Fetch Errors

`useSanityQuery` returns `{ data, loading, error }`. Each page component checks the `error` field and renders a graceful fallback:

- **List pages** (Medicina, Experiences): display the same "coming soon" / "no events" empty state as when the CMS returns zero results. The error is logged to the console but not surfaced to the user as a technical message.
- **Detail pages** (MedicinaPostPage, ExperienceDetailPage): display a "content unavailable" message in the Design_Language with a link back to the list page.
- **SomaPage dynamic block**: silently omits the dynamic block if `somaFeature` fetch fails; the static content renders normally.

### Router 404

Any unmatched path renders `NotFoundPage`, which displays a centered message in Cormorant Garamond italic, a sacred geometry SVG, and a `<Link to="/">` back to the Portal. It matches the Design_Language exactly.

### i18n Missing Keys

`i18next` is configured with `fallbackLng: 'es'`. If a key is missing in the active locale, the Spanish value is shown. If the key is missing in both locales, i18next returns the key string — this is treated as a development bug and caught during QA.

### Video Load Failures

`VideoBackground` uses the `<video>` element's native fallback chain: WebM → MP4 → `<img>` poster. If both video sources fail to load, the poster image is displayed. No JavaScript error handling is needed for this path.

### Network Information API Unavailability

`navigator.connection` is not available in all browsers (notably Firefox and Safari). The `VideoBackground` component uses optional chaining (`navigator.connection?.effectiveType`) and treats `undefined` as "adequate connection" — video plays normally. This is the safe default since the poster fallback is always available.

### EmailJS Errors (Vault)

The `EmailCapture` component in `VaultPage` reuses the existing EmailJS integration pattern from `Contact.jsx`. On send failure, it displays an inline error message in cream text. On success, it replaces the form with a confirmation message.

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

Unit tests cover specific examples, edge cases, and component rendering:

- **Router config**: assert all defined routes resolve to a component; assert `*` resolves to `NotFoundPage`.
- **GlobalNav**: assert active state for each route; assert LanguageToggle and SoundToggle are present.
- **LanguageToggle**: assert locale switches on click; assert localStorage is updated.
- **VideoBackground**: assert correct element type (img vs video) for each skip condition; assert source elements for WebM and MP4.
- **PostCard / EventCard**: assert all required fields are rendered; assert `React.memo` wrapping.
- **SkeletonCard**: assert it renders during loading state.
- **MedicinaPage empty state**: assert "coming soon" renders when posts array is empty.
- **ExperiencesPage empty state**: assert "no upcoming events" renders when events array is empty.
- **Sanity schemas**: assert each schema object contains all required field definitions.
- **sanityClient.js**: assert `useCdn: true` and no hardcoded credentials.
- **PortalPage**: assert "Spiritus est origo" is a string literal in the rendered output; assert CTA button navigates to `/matrix`.

### Property-Based Tests (Vitest + fast-check)

Each property test runs a minimum of 100 iterations. Tests are tagged with the feature and property number.

```
// Tag format: Feature: platform-expansion, Property N: <property_text>
```

- **Property 1**: Generate random route strings from the defined set; assert router resolves each to a component.
- **Property 2**: Generate random strings not in the defined route set; assert `NotFoundPage` renders.
- **Property 3**: Generate random route pairs; assert `window.scrollY === 0` after navigation.
- **Property 4**: Generate random navigation events; assert flash state transitions correctly.
- **Property 5**: Generate random defined routes; assert `GlobalNav` appears exactly once.
- **Property 6**: Generate random defined routes; assert correct active/inactive nav item colors.
- **Property 7**: Generate random locale switches; assert `i18n.language` and `localStorage` update correctly.
- **Property 8**: Generate random translation keys present in `es` but absent in `en`; assert fallback returns `es` value.
- **Property 9**: Generate random combinations of mobile width / reduced-motion / slow connection; assert `VideoBackground` renders `<img>`.
- **Property 10**: Generate random valid VideoBackground props (non-skip conditions); assert both source elements present.
- **Property 11**: Generate random arrays of post objects (1–50 items); assert `PostCard` count matches.
- **Property 12**: Generate random post arrays with mixed categories; assert filter correctness.
- **Property 13**: Generate random GROQ query strings; assert cache hit/miss behavior at time boundaries.
- **Property 14**: Generate random arrays of event objects (1–50 items); assert `EventCard` count matches.
- **Property 15**: Generate random event arrays with mixed past/future dates; assert sort order and visual distinction.
- **Property 16**: Generate random post/event objects with cover images; assert `loading="lazy"`, `width`, `height` on rendered `<img>`.

### Integration Tests

- **Sanity CDN**: one live fetch per schema type to verify the CDN endpoint responds and returns the expected shape.
- **EmailJS**: one send call to verify the service ID and template ID are wired correctly.
- **i18next HTTP backend**: verify that `public/locales/es/translation.json` and `public/locales/en/translation.json` are served correctly by the dev server.

### Smoke Tests

- **Bundle analysis**: verify no translation JSON appears in the main chunk (`vite-bundle-visualizer`).
- **Lazy loading**: verify all page imports in `router/index.jsx` use `React.lazy`.
- **React.memo**: verify `PostCard` and `EventCard` are wrapped with `React.memo`.
- **Reduced motion**: verify `VideoBackground` respects `prefers-reduced-motion` via media query mock.
- **Mobile parallax**: verify mouse-tracking handlers are not registered at viewport width < 768px.

### DNS & Email Configuration (Manual)

The following DNS records must be configured on Namecheap for `anatomiadelaliento.com`:

**Hosting (Vercel)**
- `A` record: `@` → `76.76.21.21`
- `CNAME` record: `www` → `cname.vercel-dns.com`

**Custom Email (Zoho Mail free tier)**
- `MX` record: `@` → `mx.zoho.com` (priority 10)
- `MX` record: `@` → `mx2.zoho.com` (priority 20)
- `MX` record: `@` → `mx3.zoho.com` (priority 50)
- `TXT` record: `@` → `v=spf1 include:zoho.com ~all`

Once `hola@anatomiadelaliento.com` is active, update `VITE_SITE_EMAIL` in `.env` and reconfigure the EmailJS service to send to that address.
