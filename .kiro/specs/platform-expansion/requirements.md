# Requirements Document

## Introduction

"Anatomy of Breath" (anatomiadelaliento.com) is a cinematic single-page React application that blends anatomical illustration with sacred geometry. This expansion transforms it into a full multi-section global platform with four primary destinations: **Portal** (cinematic entry), **Matrix** (the existing interactive experience), **Pillars** (three content sub-sections: Medicina de la Voz, Soma, and Experiences), and **Vault** (a future shop placeholder). The platform adds React Router for multi-page navigation, react-i18next for internationalization (Spanish default, English secondary), and Sanity headless CMS for content management of blog posts and events — all while preserving the existing visual language, animations, and performance characteristics of the current SPA.

---

## Glossary

- **Platform**: The expanded anatomiadelaliento.com web application in its entirety.
- **Portal**: The fullscreen cinematic home page — the entry point to the Platform.
- **Matrix**: The core interactive experience section containing all existing SPA components (HeroSection, Gallery, Philosophy, BreathTimeline, ImmersiveSection, Contact).
- **Pillars**: The three content sub-sections: Medicina de la Voz, Soma, and Experiences.
- **Medicina_de_la_Voz**: The CMS-powered blog sub-section within Pillars, focused on voice medicine.
- **Soma**: The body therapies, breathwork, and movement sub-section within Pillars (static + dynamic content).
- **Experiences**: The CMS-powered event and workshop calendar sub-section within Pillars.
- **Vault**: The future shop section — placeholder architecture only, no e-commerce implementation.
- **Router**: React Router DOM v6, managing all client-side routes.
- **i18n_System**: The react-i18next + i18next internationalization layer.
- **CMS**: Sanity headless CMS, used for Medicina_de_la_Voz blog posts and Experiences events.
- **Sanity_Client**: The `@sanity/client` library used to fetch content from the CMS.
- **Preloader**: The existing Flower of Life sacred geometry animation shown on first load.
- **TransitionFlash**: The existing gold flash overlay used during in-page navigation transitions.
- **AmbientSound**: The existing Web Audio drone managed by the `useAmbientSound` hook.
- **CustomCursor**: The existing gold dot cursor rendered on pointer devices.
- **Design_Language**: The visual system defined by obsidian (#0b0b0b), gold (#FFD700), cream (#f5f0e8), Cormorant Garamond (serif), and Raleway (sans-serif), with a "Futuristic Vesalius" cinematic aesthetic.
- **Spiritus_Est_Origo**: The Latin slogan displayed on the Portal. This string is hardcoded and NEVER passed through the i18n_System translation pipeline under any locale.
- **Mobile**: Viewport widths below 768px.
- **Desktop**: Viewport widths of 768px and above.

---

## Requirements

### Requirement 1: Multi-Page Routing Architecture

**User Story:** As a visitor, I want to navigate between distinct sections of the platform via clean URLs, so that I can bookmark, share, and return to specific areas directly.

#### Acceptance Criteria

1. THE Router SHALL manage client-side navigation for the routes `/` (Portal), `/matrix` (Matrix), `/pillars/medicina-de-la-voz` (Medicina_de_la_Voz), `/pillars/soma` (Soma), `/pillars/experiences` (Experiences), and `/vault` (Vault).
2. WHEN a visitor navigates to any defined route, THE Router SHALL render the corresponding page component without a full browser reload.
3. IF a visitor navigates to an undefined route, THEN THE Router SHALL render a 404 page that matches the Design_Language and provides a link back to the Portal.
4. THE Router SHALL preserve scroll position at the top of the page on every route change.
5. WHEN the Router performs a route change, THE TransitionFlash SHALL play its gold flash animation to provide a cinematic transition between pages.
6. THE Router SHALL use `createBrowserRouter` with a root layout that mounts the global Nav, CustomCursor, AmbientSound controls, and TransitionFlash exactly once across all routes.

---

### Requirement 2: Global Navigation

**User Story:** As a visitor, I want a persistent navigation bar that reflects the platform's four main sections, so that I can move between Portal, Matrix, Pillars, and Vault from any page.

#### Acceptance Criteria

1. THE Platform SHALL display a fixed navigation bar on all routes that includes links to Portal (`/`), Matrix (`/matrix`), Pillars (expandable to sub-sections), and Vault (`/vault`).
2. WHEN a visitor hovers over the Pillars nav item on Desktop, THE Nav SHALL display a dropdown revealing links to Medicina de la Voz, Soma, and Experiences.
3. WHEN a visitor is on Mobile, THE Nav SHALL display a fullscreen overlay menu matching the existing hamburger menu aesthetic, listing all top-level and Pillars sub-section links.
4. WHILE a visitor is on a given route, THE Nav SHALL visually highlight the corresponding nav item using the gold (#FFD700) active state consistent with the existing Design_Language.
5. THE Nav SHALL display a language toggle control that switches between Spanish (default) and English via the i18n_System.
6. WHEN the language toggle is activated, THE i18n_System SHALL switch the active locale and THE Nav SHALL re-render all translated labels without a page reload.
7. THE Nav SHALL preserve the existing SoundToggle, CustomCursor, and AmbientSound controls in their current positions.

---

### Requirement 3: Internationalization System

**User Story:** As a Spanish-speaking visitor, I want the platform to default to Spanish, and as an English-speaking visitor, I want to switch to English, so that the content is accessible in my preferred language.

#### Acceptance Criteria

1. THE i18n_System SHALL default to Spanish (`es`) as the active locale on first visit.
2. WHEN a visitor selects English, THE i18n_System SHALL switch to the `en` locale and persist the selection in `localStorage` so that subsequent visits restore the chosen language.
3. THE i18n_System SHALL load translation JSON files lazily per locale (not bundled into the main chunk) to avoid increasing initial load size.
4. THE Platform SHALL render all UI labels, navigation items, section headings, body copy, and CTA text through i18n_System translation keys — with the sole exception of **Spiritus_Est_Origo**, which is hardcoded as the Latin string `"Spiritus est origo"` and never replaced by a translation key.
5. THE i18n_System architecture SHALL support adding additional locales (e.g., Portuguese, French) by adding a new translation JSON file and registering the locale, without modifying any component source code.
6. IF a translation key is missing for the active locale, THEN THE i18n_System SHALL fall back to the Spanish (`es`) value rather than displaying a raw key string.

---

### Requirement 4: Portal — Cinematic Home Page

**User Story:** As a first-time visitor, I want to land on a fullscreen cinematic entry page, so that I am immediately immersed in the platform's aesthetic before exploring further.

#### Acceptance Criteria

1. THE Portal SHALL render a fullscreen background video ("The Creation") that autoplays muted and loops, covering the entire viewport.
2. WHEN the Portal loads on Mobile, THE Portal SHALL display a static poster image fallback instead of the background video to preserve performance and battery life.
3. THE Portal SHALL overlay the hardcoded Latin text **Spiritus_Est_Origo** (`"Spiritus est origo"`) centered on the viewport in Cormorant Garamond italic, gold (#FFD700), at a size no smaller than `clamp(2rem, 6vw, 5rem)`.
4. THE Portal SHALL display a secondary tagline below Spiritus_Est_Origo rendered through the i18n_System (translated per active locale).
5. WHEN the Portal video finishes its first play-through, THE Portal SHALL trigger a cinematic transition (using Framer Motion) that navigates the visitor to the Matrix route (`/matrix`).
6. THE Portal SHALL display a "Enter" / "Explorar" call-to-action button that, when activated, navigates to `/matrix` via the Router with the TransitionFlash animation.
7. THE Preloader SHALL play its Flower of Life animation on the Portal route only (first visit), consistent with the existing behavior.
8. WHERE the visitor's device supports reduced motion (`prefers-reduced-motion: reduce`), THE Portal SHALL skip the video autoplay and cinematic transition animation, showing only the static poster and the CTA button.

---

### Requirement 5: Matrix — Core Interactive Experience

**User Story:** As a visitor, I want to access the full existing interactive experience at `/matrix`, so that all current animations, components, and interactions are preserved exactly as built.

#### Acceptance Criteria

1. THE Matrix route SHALL render all existing components in their original order: HeroSection, Gallery, Philosophy, BreathTimeline, ImmersiveSection, and Contact.
2. THE Matrix SHALL preserve all existing Framer Motion animations, IntersectionObserver scroll triggers, parallax effects, 3D card tilts, and the BreathVisualizer without modification.
3. THE Matrix SHALL preserve the existing in-page anchor navigation (Gallery, Philosophy, Timeline, Immersive, Contact) using the existing `useNavTransition` hook and `navigateTo` function.
4. THE AmbientSound hook SHALL remain functional within the Matrix route, with the SoundToggle accessible from the global Nav.
5. WHEN the Matrix route is first loaded (not navigated to from Portal), THE Preloader SHALL NOT replay — it plays only once per session on the Portal.
6. THE Matrix SHALL lazy-load its route chunk so that visitors who land on the Portal do not download the Matrix bundle until navigation occurs.

---

### Requirement 6: Pillars — Medicina de la Voz (CMS Blog)

**User Story:** As a content editor, I want to publish blog posts about voice medicine through a CMS without touching code, so that the site stays current without developer involvement.

#### Acceptance Criteria

1. THE Medicina_de_la_Voz page SHALL fetch and display a list of blog posts from the CMS, each containing: title, cover image, excerpt, category tag, publication date, and slug.
2. WHEN a visitor clicks a blog post card, THE Router SHALL navigate to `/pillars/medicina-de-la-voz/:slug` and THE Medicina_de_la_Voz detail page SHALL render the full post body (rich text), cover image, title, date, and category.
3. THE Medicina_de_la_Voz list page SHALL support filtering posts by category tag without a page reload.
4. WHEN the CMS returns no posts, THE Medicina_de_la_Voz page SHALL display a "coming soon" state styled in the Design_Language rather than an empty or broken layout.
5. THE Sanity_Client SHALL fetch posts using GROQ queries and THE Platform SHALL cache responses for a minimum of 60 seconds to avoid redundant API calls on repeated navigation.
6. THE Medicina_de_la_Voz page SHALL render post cards in a responsive grid: 1 column on Mobile, 2 columns at 768px, 3 columns at 1200px.
7. WHEN a post cover image is loading, THE Medicina_de_la_Voz page SHALL display a gold-tinted skeleton placeholder matching the card dimensions, consistent with the Design_Language.

---

### Requirement 7: Pillars — Soma (Body Therapies & Movement)

**User Story:** As a visitor, I want to explore the Soma section covering body therapies, breathwork, and movement, so that I understand the full scope of the platform's somatic offerings.

#### Acceptance Criteria

1. THE Soma page SHALL render a hero section with a title, subtitle, and descriptive body copy — all rendered through the i18n_System.
2. THE Soma page SHALL display a grid of offering cards (static content), each containing: title, short description, and an anatomical SVG illustration consistent with the existing ANATOMY SVG library in Gallery.jsx.
3. THE Soma page SHALL include at least one dynamic content block that can be updated via the CMS (e.g., a featured offering or announcement), fetched through the Sanity_Client.
4. THE Soma page SHALL apply the same scroll-triggered Framer Motion fade-in animations used in the existing Philosophy and BreathTimeline components.
5. WHILE on Mobile, THE Soma page SHALL stack all grid columns to a single column and disable any parallax or heavy animation effects.

---

### Requirement 8: Pillars — Experiences (Event Calendar)

**User Story:** As a visitor, I want to browse upcoming workshops and events with booking information, so that I can register for experiences that interest me.

#### Acceptance Criteria

1. THE Experiences page SHALL fetch and display a list of events from the CMS, each containing: title, date, location (or "Online"), description, cover image, and booking URL or contact instruction.
2. THE Experiences page SHALL sort events by date ascending, displaying upcoming events first and visually distinguishing past events (e.g., reduced opacity, "Past" label).
3. WHEN a visitor clicks an event card, THE Router SHALL navigate to `/pillars/experiences/:slug` and THE Experiences detail page SHALL render the full event description, date, location, cover image, and a booking CTA button.
4. WHEN the CMS returns no upcoming events, THE Experiences page SHALL display a "no upcoming events" state styled in the Design_Language.
5. THE Experiences page SHALL render event cards in a responsive layout: 1 column on Mobile, 2 columns on Desktop.
6. THE Sanity_Client SHALL fetch events using GROQ queries filtered to include only events with a date field present, sorted by date ascending.

---

### Requirement 9: Vault — Future Shop Placeholder

**User Story:** As a platform owner, I want a Vault section with a scalable placeholder architecture, so that e-commerce can be added in the future without restructuring the routing or layout.

#### Acceptance Criteria

1. THE Vault route (`/vault`) SHALL render a fullscreen placeholder page styled in the Design_Language, displaying a "Coming Soon" message in Cormorant Garamond and a brief description rendered through the i18n_System.
2. THE Vault page SHALL include a sacred geometry SVG animation (reusing existing geometry components) as a background element, consistent with the Portal and Matrix aesthetic.
3. THE Vault page SHALL include an email capture input field that submits to the existing EmailJS service to notify interested visitors when the shop launches.
4. THE Vault route file structure SHALL be organized to accommodate future addition of product listing, product detail, cart, and checkout sub-routes without modifying the root Router configuration.

---

### Requirement 10: Sanity CMS Integration

**User Story:** As a content editor, I want a structured CMS schema for blog posts and events, so that I can create and update content through a visual interface without writing code.

#### Acceptance Criteria

1. THE CMS SHALL define a `post` document type with fields: `title` (string, required), `slug` (slug, required), `publishedAt` (datetime), `category` (string), `coverImage` (image with alt text), `excerpt` (text, max 200 chars), and `body` (block content / portable text).
2. THE CMS SHALL define an `event` document type with fields: `title` (string, required), `slug` (slug, required), `date` (datetime, required), `location` (string), `description` (block content), `coverImage` (image with alt text), `bookingUrl` (url), and `isOnline` (boolean).
3. THE CMS SHALL define a `somaFeature` document type with fields: `title` (string), `description` (text), and `isActive` (boolean) to support the Soma dynamic content block.
4. THE Sanity_Client SHALL be initialized with the project ID, dataset, and API version from environment variables (`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`) and SHALL NOT hardcode credentials in source files.
5. THE Platform SHALL use the Sanity CDN endpoint for read-only queries to maximize response speed and reduce origin load.

---

### Requirement 11: Video Integration

**User Story:** As a visitor, I want background videos to load efficiently without degrading page performance, so that the cinematic experience is smooth on all devices.

#### Acceptance Criteria

1. THE Portal background video ("The Creation") SHALL use the HTML `<video>` element with `autoplay`, `muted`, `loop`, and `playsinline` attributes to ensure cross-browser and iOS compatibility.
2. THE Portal video element SHALL include a `poster` attribute pointing to a static image that displays before the video loads and as the Mobile fallback.
3. WHEN the Portal video is not yet buffered, THE Portal SHALL display the poster image without layout shift.
4. THE Matrix intro video ("The Dissection"), if implemented, SHALL be lazy-loaded using the Intersection Observer API and SHALL NOT begin downloading until the Matrix route is active.
5. ALL video assets SHALL be served in WebM format with an MP4 fallback using `<source>` elements for maximum browser compatibility.
6. WHERE the visitor's connection is classified as `slow-2g` or `2g` via the Network Information API, THE Platform SHALL skip video autoplay and display the poster image instead.

---

### Requirement 12: Performance & Mobile Optimization

**User Story:** As a visitor on any device, I want the platform to load quickly and animate at 60fps, so that the experience feels premium and not sluggish.

#### Acceptance Criteria

1. THE Platform SHALL implement route-based code splitting using React lazy and Suspense so that each top-level route (Portal, Matrix, Pillars sub-sections, Vault) is a separate JS chunk loaded on demand.
2. WHILE on Mobile, THE Platform SHALL disable parallax mouse-tracking effects (as already implemented in HeroSection) across all new sections.
3. WHILE on Mobile, THE Platform SHALL disable or simplify heavy Framer Motion animations (e.g., reduce stagger counts, skip background geometry rotations) to maintain 60fps on mid-range devices.
4. THE Platform SHALL use `React.memo` or equivalent memoization on components that receive stable props and are rendered inside scroll-driven lists (e.g., blog post cards, event cards) to avoid unnecessary re-renders.
5. THE Platform SHALL lazy-load all CMS images using the `loading="lazy"` attribute and SHALL provide explicit `width` and `height` attributes to prevent cumulative layout shift (CLS).
6. THE Sanity_Client SHALL implement in-memory response caching with a 60-second TTL so that navigating back to a Pillars page does not re-fetch data already loaded in the same session.

---

### Requirement 13: Business Email & Domain Configuration

**User Story:** As the platform owner, I want to use hola@anatomiadelaliento.com as the business email and have the domain correctly configured on Namecheap, so that the platform is professionally presented and reachable.

#### Acceptance Criteria

1. THE Platform documentation SHALL provide step-by-step DNS configuration instructions for Namecheap to point `anatomiadelaliento.com` to the chosen hosting provider (Vercel or Netlify), including A record and CNAME record values.
2. THE Platform documentation SHALL provide instructions for setting up a custom domain email (`hola@anatomiadelaliento.com`) using a mail provider compatible with Namecheap DNS (e.g., Zoho Mail free tier or Google Workspace), including required MX record values.
3. THE Platform SHALL update the `SITE.email` value in `src/config.js` to `hola@anatomiadelaliento.com` and update the `VITE_SITE_EMAIL` environment variable accordingly.
4. THE Platform documentation SHALL specify that the EmailJS service must be reconfigured to send to `hola@anatomiadelaliento.com` once the custom domain email is active.
5. THE Platform SHALL include an `.env.example` file listing all required environment variables: `VITE_SITE_EMAIL`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`.

---

### Requirement 14: Design Language Consistency

**User Story:** As a visitor, I want all new sections to feel visually unified with the existing experience, so that the platform feels like a single cohesive work rather than a patchwork of additions.

#### Acceptance Criteria

1. THE Platform SHALL apply the Design_Language color palette — obsidian (#0b0b0b) backgrounds, gold (#FFD700) accents, cream (#f5f0e8) body text — consistently across all new pages and components.
2. THE Platform SHALL use Cormorant Garamond (serif, weight 300) for all headings and display text, and Raleway (sans-serif, weight 200) for all labels, captions, and body copy across all new sections.
3. THE Platform SHALL reuse existing anatomical SVG illustrations from the Gallery ANATOMY library and sacred geometry SVGs from the GEOMETRY library as decorative elements in new sections, rather than introducing new illustration styles.
4. ALL new interactive elements (buttons, links, form fields) SHALL follow the existing hover and focus state patterns: gold border brightening, subtle gold background tint (`rgba(255,215,0,0.06)`), and no border-radius (sharp corners).
5. THE Platform SHALL apply the existing `fade-in` CSS class and IntersectionObserver scroll-reveal pattern to all new section headers and content blocks, consistent with the existing Gallery and ImmersiveSection implementations.
6. WHEN new CMS-driven content cards are rendered, THE Platform SHALL style them using the same card aesthetic as the existing InteractiveCard component: dark base color, gold border on hover, and a subtle radial gradient overlay.
