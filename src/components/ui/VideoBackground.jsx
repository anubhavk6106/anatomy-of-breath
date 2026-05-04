// VideoBackground.jsx
//
// Root cause of autoplay failure on first load / mobile Safari:
//   1. React renders the <video> element, but the browser may not fire autoplay
//      until the element is fully in the DOM and visible.
//   2. Mobile Safari requires a direct .play() call triggered by a user gesture
//      OR the video must be muted + playsInline + autoPlay all set together.
//   3. When the parent component fades in via opacity:0 → 1 (Framer Motion),
//      some browsers treat the video as "not visible" and suppress autoplay.
//   4. The `onEnded` prop was wired to the <video> element, but `loop` was also
//      set — loop prevents `onEnded` from ever firing. Fixed below.
//
// Fix strategy:
//   - Keep autoPlay + muted + loop + playsInline on the element (required)
//   - Add a useRef + useEffect to call .play() imperatively after mount
//   - Retry play() once on visibility change (handles Safari background tab)
//   - Remove `loop` when `onEnded` is provided (they are mutually exclusive)

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import useIsMobile from '../../hooks/useIsMobile'

export default function VideoBackground({
  src,
  srcMp4,
  srcMobile,
  poster,
  onEnded
}) {
  // Reference to the <video> element
  const videoRef = useRef(null)

  // Detect device conditions
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()

  // Track if video successfully started playing
  const [isPlaying, setIsPlaying] = useState(true)

  // Detect slow network connection (2G users)
  const isSlowConnection =
    typeof navigator !== 'undefined' &&
    navigator.connection?.effectiveType &&
    ['slow-2g', '2g'].includes(navigator.connection.effectiveType)

  // If user prefers reduced motion OR connection is slow → skip video
  const shouldSkipVideo = prefersReducedMotion || isSlowConnection

  // ─────────────────────────────────────────────
  // 🔥 AUTOPLAY FIX (Safari + Mobile)
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Do nothing if video should be skipped or ref not ready
    if (shouldSkipVideo || !videoRef.current) return

    const video = videoRef.current

    // Function to attempt video playback
    const attemptPlay = () => {
      // Safari requires video to be muted for autoplay
      video.muted = true

      // Try playing video
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true)
          })
          .catch(() => {
            // Autoplay failed (Safari / mobile restriction)
            // Retry after small delay (important fix)
            setTimeout(() => {
              video
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                  // Still failed → show fallback button
                  setIsPlaying(false)
                })
            }, 300)
          })
      }
    }

    // 🔥 Delay execution slightly
    // WHY:
    // - Ensures video is in DOM
    // - Ensures Framer Motion animations finished (opacity issue)
    const timeout = setTimeout(() => {
      attemptPlay()
    }, 200)

    // Retry when user returns to tab (Safari background fix)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptPlay()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [shouldSkipVideo])

  // Styles for full-screen background video/image
  const coverStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  }

  // ─────────────────────────────────────────────
  // 🎯 FALLBACK: Skip video (low performance devices)
  // ─────────────────────────────────────────────
  if (shouldSkipVideo) {
    return (
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        style={coverStyles}
      />
    )
  }

  // IMPORTANT:
  // - loop and onEnded cannot work together
  // - if onEnded exists → disable loop
  const shouldLoop = !onEnded

  return (
    <>
      {/* ─────────────────────────────────────────────
          🎥 VIDEO ELEMENT
         ───────────────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay                 // attempt autoplay
        muted                    // REQUIRED for autoplay
        loop={shouldLoop}        // disable if onEnded is used
        playsInline              // REQUIRED for iOS Safari
        preload="auto"           // ensures video loads early
        poster={poster}          // fallback image before video loads
        onEnded={onEnded}        // used for navigation (Portal → Matrix)
        style={coverStyles}
        onContextMenu={(e) => e.preventDefault()} // disable long-press save
      >
        {isMobile ? (
          // Mobile → use MP4 only (WebM not reliable on iOS)
          <source src={srcMobile || srcMp4} type="video/mp4" />
        ) : (
          // Desktop → WebM first (better performance), MP4 fallback
          <>
            <source src={src} type="video/webm" />
            <source src={srcMp4} type="video/mp4" />
          </>
        )}
      </video>

      {/* ─────────────────────────────────────────────
          ⚠️ FALLBACK BUTTON (if autoplay fails)
         ───────────────────────────────────────────── */}
      {!isPlaying && (
        <button
          onClick={() => videoRef.current?.play()}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: '1px solid #FFD700',
            cursor: 'pointer',
          }}
        >
          Tap to Play
        </button>
      )}
    </>
  )
}