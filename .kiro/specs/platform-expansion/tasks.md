# Implementation Plan: Platform Expansion

## Overview

Transform "Anatomy of Breath" from a single-page React app into a multi-route, internationalized, CMS-connected platform. The approach is strictly additive: existing components are never modified, new infrastructure layers beneath them, and `App.jsx` content migrates verbatim into `MatrixPage.jsx`. Tasks are ordered so each step compiles and runs before the next begins.

## Tasks

- [x] 1. Install dependencies and update environment configuration
  - Run `npm install react-router-dom react-i18next i18next i18next-http-backend i18next-browser-languagedetector @sanity/client @portabletext/react`
  - Run `npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event fast-check` (add test tooling if not present)
  - Update `.env.example` to add `VITE_SANITY_PROJECT_ID=`, `VITE_SANITY_DATASET=production`, `VITE_SANITY_API_VERSION=2024-01-01`, and update `VITE_SITE_EMAIL=hola@anatomiadelaliento.com`
  - Update `src/config.js`: add `SANITY` export (projectId, dataset, apiVersion, useCdn) and `I18N` export (defaultLocale, supportedLocales, localePath) as specified in the design; update `SITE.email` and `SITE.mailtoHref` to `hola@anatomiadelaliento.com`
  - _Requirements: 10.4, 13.3, 13.5_

- [x] 2. Create Sanity client, query library, and CMS schemas
  - [x] 2.1 Create `src/lib/sanityClient.js`
    - Initialize `@sanity/client` using `SANITY` config values from `src/config.js`
    - Export `sanityClient` and module-level `queryCache` Map
    - _Requirements: 10.4, 10.5_

  - [x] 2.2 Create `src/lib/queries.js`
    - Export `POSTS_QUERY`, `POST_BY_SLUG_QUERY`, `EVENTS_QUERY`, `EVENT_BY_SLUG_QUERY`, `ACTIVE_SOMA_FEATURE_QUERY` as GROQ string constants matching the design exactly
    - _Requirements: 6.1, 6.5, 8.1, 8.6_

  - [x] 2.3 Create Sanity Studio schema files
    - Create `sanity/schemas/post.js` with all required fields: title (required), slug (required), publishedAt, category, coverImage (with alt), excerpt (max 200), body (block + image)
    - Create `sanity/schemas/event.js` with all required fields: title (required), slug (required), date (required), location, isOnline, description, coverImage (with alt), bookingUrl
    - Create `sanity/schemas/somaFeature.js` with fields: title, description, isActive
    - Create `sanity/schemas/index.js` that exports all three schemas
    - Create `sanity/sanity.config.js` wiring the schema index
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 3. Create i18n system
  - [x] 3.1 Create `src/i18n/index.js`
    - Initialize i18next with `HttpBackend`, `LanguageDetector`, and `initReactI18next` plugins
    - Configure `fallbackLng: 'es'`, `supportedLngs: ['es', 'en']`, backend `loadPath` pointing to `/locales/{{lng}}/{{ns}}.json`
    - Configure detection order `['localStorage', 'navigator']` with `lookupLocalStorage: 'i18n_lang'`
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [x] 3.2 Create translation JSON files
    - Create `public/locales/es/translation.json` with all keys: `nav.*`, `portal.*`, `vault.*`, `soma.hero.*`, `common.*` — do NOT include a key for "Spiritus est origo"
    - Create `public/locales/en/translation.json` with the same key structure translated to English — intentionally omit at least one key to exercise fallback behavior
    - _Requirements: 3.1, 3.4, 3.6_

- [x] 4. Create shared hooks
  - [x] 4.1 Extract `useIsMobile` hook to `src/hooks/useIsMobile.js`
    - Move the `useIsMobile` function verbatim from `App.jsx` into its own file and export it as default
    - _Requirements: 12.2_

  - [x] 4.2 Create `src/hooks/useSanityQuery.js`
    - Implement hook returning `{ data, loading, error }`
    - Check `queryCache` before fetching; cache results with `Date.now()` timestamp
    - Treat cache entries older than 60 000 ms as stale and re-fetch
    - _Requirements: 6.5, 12.6_

  - [x] 4.3 Write property test for `useSanityQuery` cache (Property 13)
    - **Property 13: Sanity query cache prevents redundant fetches within 60 seconds**
    - Generate random GROQ query strings; assert second call within 60 s returns cached data without calling `sanityClient.fetch` again; assert call after 60 s triggers one new fetch
    - **Validates: Requirements 6.5, 12.6**

- [x] 5. Create router and update entry point
  - [x] 5.1 Create `src/router/index.jsx`
    - Define `createBrowserRouter` with `RootLayout` as root element and all nine child routes (index, matrix, pillars/medicina-de-la-voz, pillars/medicina-de-la-voz/:slug, pillars/soma, pillars/experiences, pillars/experiences/:slug, vault, *)
    - Wrap every page in `React.lazy` + `Suspense` with a `PageLoader` fallback
    - Export `router`
    - _Requirements: 1.1, 1.2, 1.3, 1.6, 12.1_

  - [x] 5.2 Write property test for router route coverage (Property 1)
    - **Property 1: Router renders a component for every defined route**
    - Generate route strings from the defined set; assert each resolves to a non-null component without full reload
    - **Validates: Requirements 1.2**

  - [x] 5.3 Write property test for 404 catch-all (Property 2)
    - **Property 2: Undefined routes render the 404 page**
    - Generate random path strings not in the defined route set; assert `NotFoundPage` renders
    - **Validates: Requirements 1.3**

  - [x] 5.4 Update `src/main.jsx`
    - Replace `<App />` with `<RouterProvider router={router} />`
    - Add `import './i18n/index'` before `import './index.css'` so i18next initializes before first render
    - _Requirements: 1.6, 3.1_

- [x] 6. Create RootLayout and global navigation components
  - [x] 6.1 Create `src/layouts/RootLayout.jsx`
    - Create `NavTransitionContext` (exported) providing `{ flash, navigateTo }`
    - Call `useNavTransition()` at layout level; wrap children in context provider
    - Render `<CustomCursor />`, `<TransitionFlash flash={flash} />`, `<GlobalNav />`, `<Outlet />`, `<GlobalFooter />`
    - Add scroll-to-top effect on `useLocation()` change
    - _Requirements: 1.4, 1.5, 1.6, 2.1_

  - [x] 6.2 Write property test for GlobalNav presence on every route (Property 5)
    - **Property 5: GlobalNav is present on every route**
    - Generate random defined routes; assert rendered output contains exactly one `GlobalNav` instance
    - **Validates: Requirements 2.1**

  - [x] 6.3 Write property test for scroll reset on route change (Property 3)
    - **Property 3: Scroll resets to top on every route change**
    - Generate random route pairs A → B; assert `window.scrollY === 0` after navigation
    - **Validates: Requirements 1.4**

  - [x] 6.4 Write property test for TransitionFlash on route change (Property 4)
    - **Property 4: TransitionFlash fires on every route change**
    - Generate random navigation events; assert `flash` transitions to `true` then back to `false`
    - **Validates: Requirements 1.5**

  - [x] 6.5 Create `src/components/nav/LanguageToggle.jsx`
    - Render `ES | EN` with active locale in gold (`#FFD700`) and inactive in `rgba(245,240,232,0.4)`
    - Call `i18n.changeLanguage` on click; include `aria-label="Switch language"`
    - _Requirements: 2.5, 2.6_

  - [x] 6.6 Write property test for language toggle locale switching (Property 7)
    - **Property 7: Language toggle switches locale without page reload**
    - Generate random locale switches between `es` and `en`; assert `i18n.language` updates and `localStorage['i18n_lang']` is set to the new locale
    - **Validates: Requirements 2.6, 3.2**

  - [x] 6.7 Write property test for i18n fallback (Property 8)
    - **Property 8: i18n fallback returns Spanish value for missing keys**
    - Generate translation keys present in `es` but absent in `en`; assert `i18n.t(key)` with `en` active returns the `es` value
    - **Validates: Requirements 3.6**

  - [x] 6.8 Create `src/components/nav/PillarsDropdown.jsx`
    - Render dropdown with links to `/pillars/medicina-de-la-voz`, `/pillars/soma`, `/pillars/experiences`
    - Use translated labels via `useTranslation()`; apply Design_Language hover styles (gold border, `rgba(255,215,0,0.06)` tint)
    - _Requirements: 2.2_

  - [x] 6.9 Create `src/components/nav/GlobalNav.jsx`
    - Fixed nav bar with logo linking to `/`, desktop links (Portal, Matrix, Pillars with `PillarsDropdown`, Vault), Inquire CTA, `LanguageToggle`, `SoundToggle`
    - Mobile hamburger opens fullscreen overlay listing all links plus `LanguageToggle` and `SoundToggle`
    - Use `useMatch()` to determine active route; render active link in gold (`#FFD700`)
    - All labels via `useTranslation()`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

  - [x] 6.10 Write property test for active nav item color (Property 6)
    - **Property 6: Active nav item reflects current route**
    - Generate random defined routes; assert the matching nav item renders with `#FFD700` and all others render in inactive color
    - **Validates: Requirements 2.4**

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create UI utility components
  - [x] 8.1 Create `src/components/ui/VideoBackground.jsx`
    - Accept props: `src` (WebM), `srcMp4`, `poster`, `onEnded`
    - Use `useIsMobile()`, Framer Motion `useReducedMotion()`, and `navigator.connection?.effectiveType`
    - If any skip condition is true, render `<img src={poster} />` with cover styles; otherwise render `<video autoPlay muted loop playsInline>` with WebM and MP4 `<source>` elements and poster fallback `<img>`
    - _Requirements: 4.1, 4.2, 4.8, 11.1, 11.2, 11.5, 11.6_

  - [x] 8.2 Write property test for VideoBackground skip conditions (Property 9)
    - **Property 9: VideoBackground skips video for all skip conditions**
    - Generate combinations of mobile width < 768px / `prefers-reduced-motion` / `effectiveType` in `['slow-2g', '2g']`; assert `<img>` is rendered instead of `<video>`
    - **Validates: Requirements 4.2, 4.8, 11.6**

  - [x] 8.3 Write property test for VideoBackground source elements (Property 10)
    - **Property 10: VideoBackground always includes WebM and MP4 sources**
    - Generate valid non-skip VideoBackground props; assert rendered `<video>` contains `<source type="video/webm">` and `<source type="video/mp4">`
    - **Validates: Requirements 11.5**

  - [x] 8.4 Create `src/components/ui/EmailCapture.jsx`
    - Email input + submit button styled in Design_Language (obsidian bg, gold border, cream text, sharp corners)
    - Reuse EmailJS integration pattern from `Contact.jsx`; show inline success/error message
    - _Requirements: 9.3_

  - [x] 8.5 Create `src/components/ui/ComingSoon.jsx`
    - Centered "Coming Soon" / "Próximamente" message in Cormorant Garamond italic with sacred geometry SVG background element
    - _Requirements: 9.1, 9.2_

  - [x] 8.6 Create `src/components/ui/PageLoader.jsx`
    - Minimal loading indicator matching Design_Language (gold spinner or pulsing geometry) used as Suspense fallback
    - _Requirements: 12.1_

- [x] 9. Create CMS display components
  - [x] 9.1 Create `src/components/cms/SkeletonCard.jsx`
    - Render a card-shaped placeholder with CSS shimmer animation from `rgba(255,215,0,0.03)` to `rgba(255,215,0,0.08)`
    - Match dimensions of `PostCard` / `EventCard`
    - _Requirements: 6.7_

  - [x] 9.2 Create `src/components/cms/PostCard.jsx`
    - Accept `post` prop `{ title, slug, coverImage, excerpt, category, publishedAt }`
    - Render cover image with `loading="lazy"`, explicit `width` and `height` attributes
    - Style matching `InteractiveCard`: dark base, gold border on hover, `rgba(255,215,0,0.06)` tint, sharp corners
    - Wrap with `React.memo`
    - _Requirements: 6.1, 12.4, 12.5, 14.4, 14.6_

  - [x] 9.3 Write property test for PostCard image attributes (Property 16 — PostCard half)
    - **Property 16: CMS images render with lazy loading and explicit dimensions**
    - Generate random `PostCard` renders with cover image; assert `<img>` has `loading="lazy"`, `width`, and `height` attributes
    - **Validates: Requirements 12.5**

  - [x] 9.4 Create `src/components/cms/EventCard.jsx`
    - Accept `event` prop `{ title, slug, date, location, isOnline, coverImage, bookingUrl }`
    - Render cover image with `loading="lazy"`, explicit `width` and `height`
    - Show "Past" label and reduced opacity when `event.date` is before `Date.now()`
    - Wrap with `React.memo`
    - _Requirements: 8.1, 8.2, 12.4, 12.5, 14.6_

  - [x] 9.5 Write property test for EventCard image attributes (Property 16 — EventCard half)
    - **Property 16: CMS images render with lazy loading and explicit dimensions**
    - Generate random `EventCard` renders with cover image; assert `<img>` has `loading="lazy"`, `width`, and `height` attributes
    - **Validates: Requirements 12.5**

  - [x] 9.6 Create `src/components/cms/PostBody.jsx`
    - Render Sanity Portable Text using `@portabletext/react`
    - Apply Design_Language typography: Cormorant Garamond for headings, Raleway for body, cream text on obsidian
    - _Requirements: 6.2_

  - [x] 9.7 Create `src/components/cms/SomaFeatureBlock.jsx`
    - Accept `feature` prop `{ title, description }`; render dynamic CMS block with Framer Motion fade-in
    - Render nothing (return null) when `feature` is null/undefined (graceful omission on fetch error)
    - _Requirements: 7.3_

- [x] 10. Create MatrixPage (migrate existing App.jsx content)
  - Create `src/pages/MatrixPage.jsx`
  - Copy all section content from `App.jsx` verbatim: `HeroSection`, `Gallery`, `Philosophy`, `BreathTimeline`, `ImmersiveSection`, `Contact` wrapped in their `<section id="...">` elements
  - Remove the inline `Nav`, `Footer`, `CustomCursor`, `Preloader`, and `TransitionFlash` — these are now in `RootLayout`
  - Keep `useNavTransition` consumed via `NavTransitionContext` (use `useContext(NavTransitionContext)`)
  - Do NOT replay Preloader on this route (Preloader is Portal-only)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 11. Create PortalPage
  - Create `src/pages/PortalPage.jsx`
  - Render `<VideoBackground>` as fullscreen background with "The Creation" video sources and poster
  - Overlay hardcoded string `"Spiritus est origo"` in Cormorant Garamond italic, gold, `clamp(2rem, 6vw, 5rem)` — do NOT use a translation key
  - Render translated tagline below via `useTranslation()` (`portal.tagline`)
  - Render CTA button ("Explorar" / "Enter" via `portal.enter` key) that navigates to `/matrix` via `navigateTo` from `NavTransitionContext`
  - Wire `onEnded` on `VideoBackground` to trigger Framer Motion cinematic transition to `/matrix`
  - Mount `Preloader` on first visit (session flag); skip on subsequent visits
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 12. Create Pillars pages
  - [x] 12.1 Create `src/pages/pillars/MedicinaPage.jsx`
    - Call `useSanityQuery(POSTS_QUERY)` and render `PostCard` grid (1 col mobile / 2 col 768px / 3 col 1200px)
    - Show `SkeletonCard` while loading; show `ComingSoon` when posts array is empty or on error
    - Implement category filter buttons that filter rendered cards client-side without page reload
    - _Requirements: 6.1, 6.3, 6.4, 6.6, 6.7_

  - [x] 12.2 Write property test for post list card count (Property 11)
    - **Property 11: Post list renders a card for every fetched post**
    - Generate random arrays of 1–50 post objects; assert `MedicinaPage` renders exactly that many `PostCard` components
    - **Validates: Requirements 6.1**

  - [x] 12.3 Write property test for category filter (Property 12)
    - **Property 12: Category filter shows only matching posts**
    - Generate post arrays with mixed categories; assert selecting a category renders only posts with matching `category` field
    - **Validates: Requirements 6.3**

  - [x] 12.4 Create `src/pages/pillars/MedicinaPostPage.jsx`
    - Read `:slug` from `useParams()`; call `useSanityQuery(POST_BY_SLUG_QUERY, { slug })`
    - Render cover image, title, date, category, and `<PostBody body={post.body} />`
    - Show "content unavailable" message with link back to `/pillars/medicina-de-la-voz` on error or null result
    - _Requirements: 6.2_

  - [x] 12.5 Create `src/pages/pillars/SomaPage.jsx`
    - Render i18n-driven hero (title, subtitle, body via `soma.hero.*` keys)
    - Render static offering cards grid reusing anatomical SVG illustrations from Gallery's ANATOMY library
    - Call `useSanityQuery(ACTIVE_SOMA_FEATURE_QUERY)` and render `<SomaFeatureBlock>` (silently omit on error)
    - Apply Framer Motion scroll-triggered fade-in animations; disable parallax on mobile
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 12.6 Create `src/pages/pillars/ExperiencesPage.jsx`
    - Call `useSanityQuery(EVENTS_QUERY)` and render `EventCard` list (1 col mobile / 2 col desktop)
    - Events arrive pre-sorted ascending by date from GROQ; apply "Past" visual distinction client-side
    - Show `SkeletonCard` while loading; show "no upcoming events" state when array is empty or on error
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 8.6_

  - [x] 12.7 Write property test for event list card count (Property 14)
    - **Property 14: Event list renders a card for every fetched event**
    - Generate random arrays of 1–50 event objects; assert `ExperiencesPage` renders exactly that many `EventCard` components
    - **Validates: Requirements 8.1**

  - [x] 12.8 Write property test for event date ordering and past distinction (Property 15)
    - **Property 15: Events are rendered in ascending date order with past events distinguished**
    - Generate event arrays with mixed past/future dates; assert rendered cards appear in ascending date order and past events have reduced opacity or "Past" label
    - **Validates: Requirements 8.2**

  - [x] 12.9 Create `src/pages/pillars/ExperienceDetailPage.jsx`
    - Read `:slug` from `useParams()`; call `useSanityQuery(EVENT_BY_SLUG_QUERY, { slug })`
    - Render cover image, title, date, location/online indicator, `<PostBody>` for description, and booking CTA button
    - Show "content unavailable" with link back to `/pillars/experiences` on error or null result
    - _Requirements: 8.3_

- [x] 13. Create VaultPage and NotFoundPage
  - [x] 13.1 Create `src/pages/VaultPage.jsx`
    - Render fullscreen placeholder with "Coming Soon" heading (Cormorant Garamond) and description via `vault.*` i18n keys
    - Include sacred geometry SVG animation as background element (reuse existing geometry)
    - Render `<EmailCapture>` component wired to EmailJS
    - Structure file with commented placeholders for future product listing, product detail, cart, and checkout sub-routes
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 13.2 Create `src/pages/NotFoundPage.jsx`
    - Centered Cormorant Garamond italic message, sacred geometry SVG, and `<Link to="/">` back to Portal
    - All styled in Design_Language (obsidian bg, gold/cream text)
    - _Requirements: 1.3_

- [ ] 14. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Delete App.jsx and verify integration
  - Delete `src/App.jsx` (its content now lives in `src/pages/MatrixPage.jsx`)
  - Verify `src/main.jsx` no longer imports `App`
  - Run `npm run build` and confirm zero import errors and no orphaned references to `App.jsx`
  - _Requirements: 5.1_

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- `"Spiritus est origo"` must never appear as a translation key — it is always a hardcoded string literal in `PortalPage.jsx`
- Property tests use Vitest + fast-check with a minimum of 100 iterations per property
- All new components follow the Design_Language: obsidian (#0b0b0b) backgrounds, gold (#FFD700) accents, cream (#f5f0e8) text, Cormorant Garamond headings, Raleway labels, sharp corners (no border-radius)
- Existing components (`BreathTimeline`, `BreathVisualizer`, `CardModal`, `Contact`, `Gallery`, `HeroSection`, `ImmersiveSection`, `InteractiveCard`, `Philosophy`, `Preloader`, `SoundToggle`, `TransitionFlash`) are never modified
