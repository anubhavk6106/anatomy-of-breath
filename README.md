# Anatomy of Breath

> *"Where science dissolves into sacred."*

A premium, full-featured React single-page experience blending human anatomy with sacred geometry. Built for **anatomiadelaliento.com** — a medical-mystical visual philosophy.

---

## Live Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Cinematic preloader / intro screen | ✅ |
| 2 | Ambient sound design toggle | ✅ |
| 3 | Interactive gallery with hover transformations | ✅ |
| 4 | Card detail modal with rotating mandala | ✅ |
| 5 | 4-7-8 Breath Rhythm Visualizer | ✅ |
| 6 | Scroll-driven parallax timeline | ✅ |
| 7 | Mobile & tablet responsive UI | ✅ |
| 8 | EmailJS contact form | ✅ |
| 9 | Page transitions (flash dissolve) | ✅ |
| 10 | Environment variable config (.env) | ✅ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS 3 + inline styles |
| Email | EmailJS (browser SDK) |
| Audio | Web Audio API (no files) |
| Fonts | Cormorant Garamond + Raleway (Google Fonts) |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your values
cp .env.example .env

# 3. Start dev server
npm run dev        # http://localhost:5173

# 4. Production build
npm run build

# 5. Preview production build
npm run preview
```

---

## Environment Variables

All configuration lives in `.env`. Copy `.env.example` to get started — never commit `.env` to git.

```env
# Site Identity
VITE_SITE_NAME=Anatomy of Breath
VITE_SITE_DOMAIN=anatomiadelaliento.com
VITE_SITE_EMAIL=anatomiadelaliento@gmail.com
VITE_SITE_TAGLINE=Where science dissolves into sacred
VITE_SITE_DESCRIPTION=Where science dissolves into sacred. A visual philosophy blending anatomy and sacred geometry.

# EmailJS — https://www.emailjs.com
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

All values are consumed through `src/config.js` — import `SITE` or `EMAILJS` from there, never read `import.meta.env` directly in components.

---

## Project Structure

```
anatomy-of-breath/
├── .env                        # Real credentials (git-ignored)
├── .env.example                # Safe template (committed)
├── .gitignore
├── index.html                  # Entry point — title/description from .env
├── vite.config.js              # loadEnv, %VITE_*% token injection
├── tailwind.config.js          # Custom colors: gold, obsidian, cream
├── postcss.config.js
├── package.json
└── src/
    ├── config.js               # ← Single source of truth for all env values
    ├── main.jsx
    ├── App.jsx                 # Nav, Footer, CustomCursor, TransitionFlash
    ├── index.css               # Global styles, gallery grid, grain texture
    ├── hooks/
    │   ├── useAmbientSound.js  # Web Audio API drone generator
    │   └── useNavTransition.js # Flash-dissolve scroll navigation
    └── components/
        ├── Preloader.jsx       # Cinematic intro sequence (6 phases)
        ├── TransitionFlash.jsx # Full-screen dissolve overlay
        ├── HeroSection.jsx     # Full-screen hero, breathing rings, parallax
        ├── Gallery.jsx         # Responsive grid + live search
        ├── InteractiveCard.jsx # Anatomy → geometry transformation on hover
        ├── CardModal.jsx       # Full-screen detail overlay + mandala
        ├── Philosophy.jsx      # Scroll-fade text section
        ├── BreathTimeline.jsx  # Scroll-driven 6-stage journey timeline
        ├── ImmersiveSection.jsx # Rotating mandala + breath visualizer
        ├── BreathVisualizer.jsx # Interactive 4-7-8 breathing guide
        ├── SoundToggle.jsx     # Animated waveform mute/unmute button
        └── Contact.jsx         # EmailJS contact form
```

---

## Feature Details

### 1. Cinematic Preloader (`Preloader.jsx`)
Full-screen intro that plays once on load:
- **Phase 1** — Single gold dot pulses in from black
- **Phase 2** — Flower of Life petals draw in via SVG `pathLength`, then 7 concentric rings expand
- **Phase 3** — "Anatomy of Breath" title fades up
- **Phase 4** — Tagline + gold progress bar fills
- **Phase 5** — Dissolves to black, main site fades in underneath

Main content renders behind the preloader the whole time — zero layout flash on reveal.

---

### 2. Ambient Sound (`useAmbientSound.js` + `SoundToggle.jsx`)
Zero audio files — generated entirely via Web Audio API:

| Layer | Frequency | Type | Role |
|-------|-----------|------|------|
| Sub-bass | 55 Hz (A1) | Sine | Grounding drone |
| Detune twin | 55 Hz +4¢ | Sine | Warmth / beating |
| Octave | 110 Hz | Sine | Presence |
| Shimmer | 220 Hz | Sine | Air |
| Texture | 82.5 Hz | Triangle | Subtle body |

A 0.07 Hz LFO (≈14s cycle) modulates master gain — the whole mix breathes in and out. Impulse-response reverb adds depth. 3.5s fade-in, 1.5s fade-out on toggle.

The `SoundToggle` button in the nav shows 5 animated EQ bars when playing, flat lines when muted.

---

### 3. Interactive Gallery (`Gallery.jsx` + `InteractiveCard.jsx`)
12 cards pairing anatomical SVG illustrations with sacred geometry overlays.

**Anatomy illustrations:** Lungs, Bronchial Tree, Diaphragm, Alveoli, Neural Network, Silence, Heart, Spine, Rib Cage, Skull, Blood Vessels, Eye

**Sacred geometry overlays:** Vesica Piscis, Star of David, Metatron's Cube, Sri Yantra, Pentagram, Torus Field, Flower of Life, Golden Spiral, Tree of Life

**Card hover effects (8 layers):**
1. Anatomy SVG blurs and fades out
2. Sacred geometry draws in with slow rotation
3. Pulsing gold aura glow
4. 12 floating gold dust particles
5. Diagonal shimmer sweep
6. Gold border + L-bracket corner accents
7. Info footer slides up (title, subtitle, "Click to explore")
8. 3D mouse-tracked tilt (perspective 800px)

**Live search** — filters by title, subtitle, and tags in real time. Shows result count, empty state, clear button.

**Touch devices** — info footer always visible, "Tap to explore" hint, tilt disabled.

---

### 4. Card Detail Modal (`CardModal.jsx`)
Opens on card click. Closes via ×, backdrop click, or `Escape`.

- Full-screen backdrop with blur
- 5 concentric rings rotating at different speeds/directions (mandala effect)
- Left panel: anatomy SVG floating (6s loop) + geometry SVG counter-rotating at screen blend
- Right panel: geometry name → title → subtitle → animated gold rule → extended description → tag pills — all staggered in
- Body scroll locked while open
- **Mobile:** full-screen single column, visual panel stacked on top, content scrolls below
- **Tablet:** two-column compact layout

---

### 5. Breath Rhythm Visualizer (`BreathVisualizer.jsx`)
Interactive 4-7-8 breathing guide embedded in the Immersive section.

| Phase | Duration | Visual |
|-------|----------|--------|
| Inhale | 4s | Circle expands to full size |
| Hold | 7s | Circle holds, geometry pulses |
| Exhale | 8s | Circle contracts |
| Rest | 1s | Brief pause |

- SVG countdown arc drains clockwise over each phase
- Two orbit rings rotate at different speeds while active
- 48-tick sacred geometry ring rotates slowly
- Phase label strip highlights active phase in gold
- Cycle counter appears after first complete cycle
- Tap/click to start or stop

---

### 6. Scroll-Driven Timeline (`BreathTimeline.jsx`)
Vertical timeline tracing the complete journey of a single breath across 6 stages.

| Stage | Phase | Anatomy | Key Metric |
|-------|-------|---------|-----------|
| 01 | Inhale | Diaphragm | 0.5L tidal volume |
| 02 | Descent | Bronchial Tree | 12cm trachea |
| 03 | Expansion | Alveoli | 300M alveoli, 70m² surface |
| 04 | Exchange | Membrane | 0.5μm thickness |
| 05 | Circulation | Vascular Tree | 60,000 miles |
| 06 | Cellular | Mitochondria | 37 trillion cells |

- Desktop: alternating left/right layout with a vertical gold spine line that fills as you scroll
- Each spine node is a pulsing gold circle
- Every stage slides in from its side on scroll (fires once via `IntersectionObserver`)
- Anatomy SVGs float gently once in view
- Sacred geometry accent SVGs sit behind each illustration
- Mobile: single-column stack

---

### 7. Mobile & Tablet Responsive
- Custom breakpoints: mobile `<640px`, tablet `640–1024px`, desktop `>1024px`
- Gallery grid: 3 cols → 2 cols → 2 cols
- Nav: hamburger with animated X morph, fullscreen italic overlay menu
- Modal: full-screen single column on mobile, two-column on tablet
- Preloader: geometry canvas scales with `min(320px, 72vw)`
- Safe-area insets for iPhone notch / home bar
- `-webkit-tap-highlight-color: transparent` on all interactive elements
- `-webkit-text-size-adjust: 100%` prevents iOS font inflation
- Touch cards always show info footer (no hover required)

---

### 8. Contact Form (`Contact.jsx`)
Powered by [EmailJS](https://www.emailjs.com) — no backend required.

**Setup (2 minutes):**
1. Create a free account at emailjs.com (200 emails/month free)
2. Add an Email Service → copy **Service ID**
3. Create a Template with variables `{{from_name}}`, `{{from_email}}`, `{{message}}` → copy **Template ID**
4. Account → API Keys → copy **Public Key**
5. Add to `.env`:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
   ```

**Form features:**
- Name + Email in responsive two-column row
- Client-side validation with per-field inline errors
- Sending state: animated gold dot spinner
- Success state: animated SVG checkmark, "Message received", reset button
- Error state: banner with direct email fallback link
- Dev warning banner when EmailJS keys are not yet configured
- Direct `mailto:` fallback link always visible at the bottom

---

### 9. Page Transitions (`TransitionFlash.jsx` + `useNavTransition.js`)
Every nav link click triggers a cinematic dissolve instead of an instant jump.

**Sequence (560ms total):**
1. Click → screen fades to `#0b0b0b` over 280ms
2. Gold horizontal line sweeps across center simultaneously
3. At peak: `scrollIntoView({ behavior: 'instant' })` teleports to section
4. Screen fades back out over 280ms — new section revealed

Applied to: desktop nav links, mobile overlay links, footer nav links, logo (scrolls to top).

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0b0b0b` |
| Gold | `#FFD700` |
| Cream | `#f5f0e8` |
| Serif | Cormorant Garamond 300/400/600 |
| Sans | Raleway 200/300/400/500 |
| Custom cursor | 10px gold dot, desktop only |
| Film grain | SVG fractalNoise overlay, `opacity: 0.5` |
| Scrollbar | 4px gold tinted |

---

## Adding New Gallery Cards

In `src/components/Gallery.jsx`, add to the `CARDS` array:

```js
{
  number: '13',
  title: 'Your Title',
  subtitle: 'Your Subtitle',
  tags: ['keyword1', 'keyword2'],
  baseColor: '#0a0a14',
  overlayGradient: 'radial-gradient(ellipse at center, rgba(255,215,0,0.3), transparent 70%)',
  anatomySVG: ANATOMY.yourKey,
  geometrySVG: GEOMETRY.yourKey,
}
```

Add SVG strings to the `ANATOMY` and `GEOMETRY` objects above `CARDS`. Add a description to `DESCRIPTIONS` in `CardModal.jsx` keyed by the card number.

---

## Performance

- All animations use CSS `transform` and `opacity` — GPU-composited, 60fps
- SVG art is inline — zero network requests, zero layout shift
- Scroll detection uses `IntersectionObserver` — no scroll event listeners on components
- Ambient audio generated at runtime — no audio file downloads
- Web Audio nodes are fully cleaned up on toggle off and component unmount
- Preloader renders main content behind it — no flash on reveal
- `behavior: 'instant'` scroll during transition flash — no janky scroll animation visible

---

## Scripts

```bash
npm run dev      # Development server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

*"Breathe. Witness. Remember."*
