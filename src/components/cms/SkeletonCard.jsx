// SkeletonCard.jsx
// Loading placeholder for CMS content cards (PostCard / EventCard)
// Displays a card-shaped skeleton with gold shimmer animation
// matching the Design_Language aesthetic

import './SkeletonCard.css'

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      {/* Image placeholder */}
      <div className="skeleton-card__image" />
      
      {/* Content placeholder */}
      <div className="skeleton-card__content">
        {/* Title placeholder */}
        <div className="skeleton-card__title" />
        
        {/* Subtitle/excerpt placeholder */}
        <div className="skeleton-card__subtitle" />
        <div className="skeleton-card__subtitle skeleton-card__subtitle--short" />
        
        {/* Meta info placeholder */}
        <div className="skeleton-card__meta" />
      </div>
    </div>
  )
}
