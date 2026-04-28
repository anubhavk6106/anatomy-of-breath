// MatrixPage.jsx
// 🔵 B. MATRIX (Core Scientific + Interactive Understanding)
// Goal: Scientific + interactive understanding of breath anatomy
// This page contains all the original App.jsx content: respiratory system breakdown,
// lung mechanics visualization, sacred geometry, and interactive animations

import { useContext } from 'react'
import HeroSection from '../components/HeroSection'
import Gallery from '../components/Gallery'
import Philosophy from '../components/Philosophy'
import BreathTimeline from '../components/BreathTimeline'
import ImmersiveSection from '../components/ImmersiveSection'
import { NavTransitionContext } from '../layouts/RootLayout'

/**
 * MatrixPage — The core technical asset
 * 
 * This is the main scientific and interactive content from the original single-page app.
 * All existing components are preserved exactly as they were — no rebuilding, just integration.
 * 
 * Features:
 * - Respiratory system breakdown (Gallery)
 * - Lung mechanics visualization (BreathTimeline)
 * - Sacred geometry section (Philosophy)
 * - Interactive animations (ImmersiveSection)
 * - Contact form
 * 
 * Navigation and layout elements (Nav, Footer, CustomCursor, Preloader, TransitionFlash)
 * are now handled by RootLayout and are not included here.
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */
export default function MatrixPage() {
  // Get navigation function from RootLayout context
  const { navigateTo } = useContext(NavTransitionContext)

  return (
    <main>
      {/* Hero Section — Entry point with title and introduction */}
      <HeroSection />

      {/* Gallery — Respiratory system breakdown with anatomical illustrations */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* Philosophy — Sacred geometry and conceptual framework */}
      <section id="philosophy">
        <Philosophy />
      </section>

      {/* Timeline — Lung mechanics visualization and breath cycle */}
      <section id="timeline">
        <BreathTimeline />
      </section>

      {/* Immersive — Interactive animations and visualizations */}
      <section id="immersive">
        <ImmersiveSection />
      </section>
    </main>
  )
}
