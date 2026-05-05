// Gallery.jsx
// Responsive grid of InteractiveCard components with live search.
// Each card pairs a hand-crafted anatomical SVG with a sacred geometry overlay.

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import InteractiveCard from './InteractiveCard'
import CardModal from './CardModal'

// ── Anatomical SVG illustrations ─────────────────────────────
const ANATOMY = {
  lungs: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 L100 180" stroke="rgba(245,240,232,0.3)" stroke-width="1.5"/>
      <path d="M100 40 C80 40 50 60 45 100 C40 140 55 180 75 200 C85 210 100 200 100 200 C100 200 85 185 80 160 C72 130 75 90 90 70"
            stroke="rgba(245,240,232,0.45)" stroke-width="1.2" fill="rgba(245,240,232,0.04)"/>
      <path d="M100 40 C120 40 150 60 155 100 C160 140 145 180 125 200 C115 210 100 200 100 200 C100 200 115 185 120 160 C128 130 125 90 110 70"
            stroke="rgba(245,240,232,0.45)" stroke-width="1.2" fill="rgba(245,240,232,0.04)"/>
      <circle cx="100" cy="100" r="8" stroke="rgba(212,175,55,0.4)" stroke-width="0.8"/>
    </svg>`,

  bronchialTree: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="100" y1="20" x2="100" y2="100" stroke="rgba(245,240,232,0.5)" stroke-width="3"/>
      <line x1="100" y1="100" x2="65"  y2="150" stroke="rgba(245,240,232,0.45)" stroke-width="2"/>
      <line x1="100" y1="100" x2="135" y2="150" stroke="rgba(245,240,232,0.45)" stroke-width="2"/>
      <line x1="65"  y1="150" x2="48"  y2="190" stroke="rgba(245,240,232,0.38)" stroke-width="1.2"/>
      <line x1="65"  y1="150" x2="82"  y2="190" stroke="rgba(245,240,232,0.38)" stroke-width="1.2"/>
      <line x1="135" y1="150" x2="118" y2="190" stroke="rgba(245,240,232,0.38)" stroke-width="1.2"/>
      <line x1="135" y1="150" x2="152" y2="190" stroke="rgba(245,240,232,0.38)" stroke-width="1.2"/>
      <line x1="48"  y1="190" x2="40"  y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="48"  y1="190" x2="56"  y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="82"  y1="190" x2="74"  y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="82"  y1="190" x2="90"  y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="118" y1="190" x2="110" y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="118" y1="190" x2="126" y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="152" y1="190" x2="144" y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="152" y1="190" x2="160" y2="215" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
    </svg>`,

  diaphragm: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 140 Q100 80 170 140"  stroke="rgba(245,240,232,0.55)" stroke-width="2" fill="rgba(245,240,232,0.03)"/>
      <path d="M30 150 Q100 90 170 150"  stroke="rgba(245,240,232,0.25)" stroke-width="1"/>
      <path d="M30 160 Q100 100 170 160" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="100" y1="80" x2="100" y2="200" stroke="rgba(245,240,232,0.3)" stroke-width="1" stroke-dasharray="4 4"/>
      <circle cx="100" cy="80" r="5" fill="rgba(212,175,55,0.3)"/>
    </svg>`,

  alveoli: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="120" r="30" stroke="rgba(245,240,232,0.4)"  stroke-width="1"/>
      <circle cx="100" cy="120" r="18" stroke="rgba(245,240,232,0.3)"  stroke-width=".8"/>
      <circle cx="55"  cy="95"  r="22" stroke="rgba(245,240,232,0.35)" stroke-width="1"/>
      <circle cx="145" cy="95"  r="22" stroke="rgba(245,240,232,0.35)" stroke-width="1"/>
      <circle cx="70"  cy="155" r="18" stroke="rgba(245,240,232,0.3)"  stroke-width=".8"/>
      <circle cx="130" cy="155" r="18" stroke="rgba(245,240,232,0.3)"  stroke-width=".8"/>
      <circle cx="100" cy="60"  r="15" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
    </svg>`,

  neural: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="50"  r="8" stroke="rgba(245,240,232,0.5)"  stroke-width="1"/>
      <circle cx="60"  cy="110" r="6" stroke="rgba(245,240,232,0.4)"  stroke-width="1"/>
      <circle cx="140" cy="110" r="6" stroke="rgba(245,240,232,0.4)"  stroke-width="1"/>
      <circle cx="40"  cy="170" r="5" stroke="rgba(245,240,232,0.35)" stroke-width=".8"/>
      <circle cx="85"  cy="170" r="5" stroke="rgba(245,240,232,0.35)" stroke-width=".8"/>
      <circle cx="115" cy="170" r="5" stroke="rgba(245,240,232,0.35)" stroke-width=".8"/>
      <circle cx="160" cy="170" r="5" stroke="rgba(245,240,232,0.35)" stroke-width=".8"/>
      <line x1="100" y1="58"  x2="60"  y2="104" stroke="rgba(245,240,232,0.18)" stroke-width=".8"/>
      <line x1="100" y1="58"  x2="140" y2="104" stroke="rgba(245,240,232,0.18)" stroke-width=".8"/>
      <line x1="60"  y1="116" x2="40"  y2="165" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="60"  y1="116" x2="85"  y2="165" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="140" y1="116" x2="115" y2="165" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="140" y1="116" x2="160" y2="165" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
    </svg>`,

  silence: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="120" r="70" stroke="rgba(245,240,232,0.3)"  stroke-width="1"/>
      <circle cx="100" cy="120" r="50" stroke="rgba(245,240,232,0.2)"  stroke-width=".8"/>
      <circle cx="100" cy="120" r="30" stroke="rgba(245,240,232,0.15)" stroke-width=".6"/>
      <circle cx="100" cy="120" r="10" stroke="rgba(245,240,232,0.25)" stroke-width="1" fill="rgba(245,240,232,0.03)"/>
      <line x1="30"  y1="120" x2="170" y2="120" stroke="rgba(245,240,232,0.08)" stroke-width=".5"/>
      <line x1="100" y1="50"  x2="100" y2="190" stroke="rgba(245,240,232,0.08)" stroke-width=".5"/>
    </svg>`,

  // ── New illustrations ────────────────────────────────────────

  heart: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Heart outline -->
      <path d="M100 190 C60 160 20 130 20 90 C20 60 45 40 70 40 C82 40 93 46 100 55 C107 46 118 40 130 40 C155 40 180 60 180 90 C180 130 140 160 100 190Z"
            stroke="rgba(245,240,232,0.45)" stroke-width="1.2" fill="rgba(245,240,232,0.03)"/>
      <!-- Aorta -->
      <path d="M100 55 L100 25 C100 25 115 20 120 30" stroke="rgba(245,240,232,0.35)" stroke-width="1.5"/>
      <!-- Pulmonary artery -->
      <path d="M88 50 C80 35 65 30 60 35" stroke="rgba(245,240,232,0.3)" stroke-width="1"/>
      <!-- Chambers divider -->
      <line x1="100" y1="60" x2="100" y2="160" stroke="rgba(245,240,232,0.15)" stroke-width=".8" stroke-dasharray="3 3"/>
      <!-- Apex dot -->
      <circle cx="100" cy="188" r="3" fill="rgba(212,175,55,0.5)"/>
    </svg>`,

  spine: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Vertebral column -->
      <line x1="100" y1="20" x2="100" y2="220" stroke="rgba(245,240,232,0.2)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Vertebrae -->
      <rect x="82" y="28"  width="36" height="14" rx="3" stroke="rgba(245,240,232,0.45)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="52"  width="36" height="14" rx="3" stroke="rgba(245,240,232,0.42)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="76"  width="36" height="14" rx="3" stroke="rgba(245,240,232,0.40)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="100" width="36" height="14" rx="3" stroke="rgba(245,240,232,0.38)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="124" width="36" height="14" rx="3" stroke="rgba(245,240,232,0.35)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="148" width="36" height="14" rx="3" stroke="rgba(245,240,232,0.30)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <rect x="82" y="172" width="36" height="14" rx="3" stroke="rgba(245,240,232,0.25)" stroke-width="1" fill="rgba(245,240,232,0.04)"/>
      <!-- Transverse processes -->
      <line x1="82" y1="35" x2="60" y2="35" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="118" y1="35" x2="140" y2="35" stroke="rgba(245,240,232,0.25)" stroke-width=".8"/>
      <line x1="82" y1="83" x2="58" y2="83" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="118" y1="83" x2="142" y2="83" stroke="rgba(245,240,232,0.2)" stroke-width=".8"/>
      <line x1="82" y1="131" x2="60" y2="131" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <line x1="118" y1="131" x2="140" y2="131" stroke="rgba(245,240,232,0.15)" stroke-width=".8"/>
      <!-- Sacrum -->
      <path d="M82 196 Q100 215 118 196" stroke="rgba(212,175,55,0.3)" stroke-width="1" fill="rgba(212,175,55,0.04)"/>
    </svg>`,

  ribcage: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sternum -->
      <line x1="100" y1="30" x2="100" y2="180" stroke="rgba(245,240,232,0.4)" stroke-width="2"/>
      <!-- Rib pairs — left -->
      <path d="M100 50 C80 50 55 60 50 80"  stroke="rgba(245,240,232,0.4)" stroke-width="1.2" fill="none"/>
      <path d="M100 68 C78 68 52 78 46 100" stroke="rgba(245,240,232,0.38)" stroke-width="1.1" fill="none"/>
      <path d="M100 86 C76 86 50 98 44 120" stroke="rgba(245,240,232,0.35)" stroke-width="1" fill="none"/>
      <path d="M100 104 C76 104 50 116 46 138" stroke="rgba(245,240,232,0.3)" stroke-width="1" fill="none"/>
      <path d="M100 122 C78 122 55 132 52 152" stroke="rgba(245,240,232,0.25)" stroke-width=".9" fill="none"/>
      <path d="M100 140 C82 140 62 148 60 165" stroke="rgba(245,240,232,0.2)" stroke-width=".8" fill="none"/>
      <!-- Rib pairs — right -->
      <path d="M100 50 C120 50 145 60 150 80"  stroke="rgba(245,240,232,0.4)" stroke-width="1.2" fill="none"/>
      <path d="M100 68 C122 68 148 78 154 100" stroke="rgba(245,240,232,0.38)" stroke-width="1.1" fill="none"/>
      <path d="M100 86 C124 86 150 98 156 120" stroke="rgba(245,240,232,0.35)" stroke-width="1" fill="none"/>
      <path d="M100 104 C124 104 150 116 154 138" stroke="rgba(245,240,232,0.3)" stroke-width="1" fill="none"/>
      <path d="M100 122 C122 122 145 132 148 152" stroke="rgba(245,240,232,0.25)" stroke-width=".9" fill="none"/>
      <path d="M100 140 C118 140 138 148 140 165" stroke="rgba(245,240,232,0.2)" stroke-width=".8" fill="none"/>
      <!-- Costal cartilage arc -->
      <path d="M60 165 Q100 185 140 165" stroke="rgba(212,175,55,0.25)" stroke-width="1" fill="none"/>
    </svg>`,

  skull: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cranium -->
      <path d="M60 130 C55 100 60 60 100 45 C140 60 145 100 140 130 C138 145 130 155 120 160 L80 160 C70 155 62 145 60 130Z"
            stroke="rgba(245,240,232,0.45)" stroke-width="1.2" fill="rgba(245,240,232,0.03)"/>
      <!-- Eye sockets -->
      <ellipse cx="82"  cy="118" rx="14" ry="11" stroke="rgba(245,240,232,0.35)" stroke-width="1" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="118" cy="118" rx="14" ry="11" stroke="rgba(245,240,232,0.35)" stroke-width="1" fill="rgba(0,0,0,0.3)"/>
      <!-- Nasal cavity -->
      <path d="M93 135 L100 148 L107 135 Q100 130 93 135Z" stroke="rgba(245,240,232,0.3)" stroke-width=".8" fill="rgba(0,0,0,0.2)"/>
      <!-- Suture lines -->
      <path d="M100 45 L100 90" stroke="rgba(245,240,232,0.15)" stroke-width=".6" stroke-dasharray="3 2"/>
      <path d="M62 95 Q100 85 138 95" stroke="rgba(245,240,232,0.12)" stroke-width=".6" stroke-dasharray="3 2"/>
      <!-- Mandible -->
      <path d="M80 160 Q100 195 120 160" stroke="rgba(245,240,232,0.35)" stroke-width="1.2" fill="rgba(245,240,232,0.03)"/>
      <!-- Teeth suggestion -->
      <line x1="88"  y1="160" x2="88"  y2="170" stroke="rgba(245,240,232,0.2)" stroke-width="1"/>
      <line x1="96"  y1="160" x2="96"  y2="172" stroke="rgba(245,240,232,0.2)" stroke-width="1"/>
      <line x1="104" y1="160" x2="104" y2="172" stroke="rgba(245,240,232,0.2)" stroke-width="1"/>
      <line x1="112" y1="160" x2="112" y2="170" stroke="rgba(245,240,232,0.2)" stroke-width="1"/>
    </svg>`,

  bloodVessel: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Main artery -->
      <path d="M100 20 C100 20 95 60 105 100 C115 140 95 180 100 220"
            stroke="rgba(245,240,232,0.5)" stroke-width="3" fill="none"/>
      <!-- Branching vessels left -->
      <path d="M97 70 C80 75 60 70 45 80"   stroke="rgba(245,240,232,0.38)" stroke-width="1.5" fill="none"/>
      <path d="M103 110 C85 115 65 108 50 118" stroke="rgba(245,240,232,0.32)" stroke-width="1.2" fill="none"/>
      <path d="M97 155 C80 158 62 152 48 160" stroke="rgba(245,240,232,0.28)" stroke-width="1" fill="none"/>
      <!-- Branching vessels right -->
      <path d="M103 70 C120 75 140 70 155 80"   stroke="rgba(245,240,232,0.38)" stroke-width="1.5" fill="none"/>
      <path d="M97 110 C115 115 135 108 150 118" stroke="rgba(245,240,232,0.32)" stroke-width="1.2" fill="none"/>
      <path d="M103 155 C120 158 138 152 152 160" stroke="rgba(245,240,232,0.28)" stroke-width="1" fill="none"/>
      <!-- Capillary hints -->
      <path d="M45 80 C38 85 35 92 40 98"   stroke="rgba(245,240,232,0.18)" stroke-width=".7" fill="none"/>
      <path d="M155 80 C162 85 165 92 160 98" stroke="rgba(245,240,232,0.18)" stroke-width=".7" fill="none"/>
      <!-- Flow dots -->
      <circle cx="100" cy="50"  r="3" fill="rgba(212,175,55,0.35)"/>
      <circle cx="100" cy="120" r="3" fill="rgba(212,175,55,0.25)"/>
      <circle cx="100" cy="190" r="3" fill="rgba(212,175,55,0.2)"/>
    </svg>`,

  eye: `
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer eye form -->
      <path d="M30 120 Q100 60 170 120 Q100 180 30 120Z"
            stroke="rgba(245,240,232,0.45)" stroke-width="1.2" fill="rgba(245,240,232,0.02)"/>
      <!-- Iris -->
      <circle cx="100" cy="120" r="35" stroke="rgba(245,240,232,0.4)" stroke-width="1"/>
      <!-- Iris detail rings -->
      <circle cx="100" cy="120" r="28" stroke="rgba(245,240,232,0.2)" stroke-width=".6"/>
      <circle cx="100" cy="120" r="20" stroke="rgba(245,240,232,0.15)" stroke-width=".5"/>
      <!-- Pupil -->
      <circle cx="100" cy="120" r="13" stroke="rgba(245,240,232,0.3)" stroke-width="1" fill="rgba(0,0,0,0.6)"/>
      <!-- Iris radial lines -->
      <line x1="100" y1="85"  x2="100" y2="107" stroke="rgba(245,240,232,0.15)" stroke-width=".5"/>
      <line x1="100" y1="133" x2="100" y2="155" stroke="rgba(245,240,232,0.15)" stroke-width=".5"/>
      <line x1="65"  y1="120" x2="87"  y2="120" stroke="rgba(245,240,232,0.15)" stroke-width=".5"/>
      <line x1="113" y1="120" x2="135" y2="120" stroke="rgba(245,240,232,0.15)" stroke-width=".5"/>
      <line x1="75"  y1="95"  x2="90"  y2="107" stroke="rgba(245,240,232,0.1)" stroke-width=".5"/>
      <line x1="125" y1="95"  x2="110" y2="107" stroke="rgba(245,240,232,0.1)" stroke-width=".5"/>
      <!-- Highlight -->
      <circle cx="110" cy="112" r="4" fill="rgba(212,175,55,0.15)"/>
      <!-- Optic nerve suggestion -->
      <line x1="135" y1="120" x2="170" y2="120" stroke="rgba(245,240,232,0.2)" stroke-width="1.5"/>
    </svg>`,
}

// ── Sacred geometry overlays ─────────────────────────────────
const GEOMETRY = {
  vesicaPiscis: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.7" opacity="0.9">
        <circle cx="85"  cy="120" r="55"/>
        <circle cx="115" cy="120" r="55"/>
        <circle cx="100" cy="120" r="70"/>
      </g>
    </svg>`,

  starOfDavid: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.7" opacity="0.9">
        <polygon points="100,50 160,155 40,155"/>
        <polygon points="100,190 40,85 160,85"/>
        <circle cx="100" cy="120" r="65"/>
      </g>
    </svg>`,

  metatron: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.9">
        <circle cx="100" cy="120"    r="55"/>
        <circle cx="100" cy="65"     r="55"/>
        <circle cx="147.6" cy="92.5" r="55"/>
        <circle cx="147.6" cy="147.5" r="55"/>
        <circle cx="100" cy="175"    r="55"/>
        <circle cx="52.4" cy="147.5" r="55"/>
        <circle cx="52.4" cy="92.5"  r="55"/>
      </g>
    </svg>`,

  sriYantra: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.7" opacity="0.9">
        <polygon points="100,55 162,160 38,160"/>
        <polygon points="100,185 162,80 38,80"/>
        <polygon points="100,70 155,150 45,150"/>
        <polygon points="100,170 155,90 45,90"/>
        <circle cx="100" cy="120" r="55"/>
        <circle cx="100" cy="120" r="25"/>
      </g>
    </svg>`,

  pentagram: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.7" opacity="0.9">
        <polygon points="100,50 168,152 34,100 166,100 32,152"/>
        <circle cx="100" cy="120" r="70"/>
        <circle cx="100" cy="120" r="38"/>
      </g>
    </svg>`,

  torus: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.9">
        <ellipse cx="100" cy="120" rx="65" ry="25"/>
        <ellipse cx="100" cy="120" rx="65" ry="45"/>
        <ellipse cx="100" cy="120" rx="65" ry="65"/>
        <circle cx="100" cy="120" r="65"/>
        <line x1="35" y1="120" x2="165" y2="120"/>
        <line x1="100" y1="55" x2="100" y2="185"/>
      </g>
    </svg>`,

  flowerOfLife: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.9">
        <circle cx="100" cy="120" r="40"/>
        <circle cx="100" cy="80"  r="40"/>
        <circle cx="134.6" cy="100" r="40"/>
        <circle cx="134.6" cy="140" r="40"/>
        <circle cx="100" cy="160" r="40"/>
        <circle cx="65.4" cy="140" r="40"/>
        <circle cx="65.4" cy="100" r="40"/>
        <circle cx="100" cy="120" r="80"/>
      </g>
    </svg>`,

  goldenSpiral: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.7" opacity="0.9">
        <path d="M100 120 Q100 60 160 60 Q160 180 40 180 Q40 40 160 40"/>
        <rect x="40"  y="60"  width="60" height="60"/>
        <rect x="100" y="60"  width="60" height="60"/>
        <rect x="40"  y="120" width="120" height="60"/>
        <circle cx="100" cy="120" r="55"/>
      </g>
    </svg>`,

  kabbalah: `
    <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#D4AF37" stroke-width="0.6" opacity="0.9">
        <!-- Tree of Life nodes -->
        <circle cx="100" cy="30"  r="8"/>
        <circle cx="60"  cy="70"  r="7"/>
        <circle cx="140" cy="70"  r="7"/>
        <circle cx="60"  cy="120" r="7"/>
        <circle cx="140" cy="120" r="7"/>
        <circle cx="100" cy="100" r="7"/>
        <circle cx="100" cy="155" r="7"/>
        <circle cx="60"  cy="175" r="6"/>
        <circle cx="140" cy="175" r="6"/>
        <circle cx="100" cy="210" r="8"/>
        <!-- Paths -->
        <line x1="100" y1="38"  x2="60"  y2="63"/>
        <line x1="100" y1="38"  x2="140" y2="63"/>
        <line x1="60"  y1="77"  x2="140" y2="77"/>
        <line x1="60"  y1="77"  x2="60"  y2="113"/>
        <line x1="140" y1="77"  x2="140" y2="113"/>
        <line x1="60"  y1="77"  x2="100" y2="93"/>
        <line x1="140" y1="77"  x2="100" y2="93"/>
        <line x1="60"  y1="127" x2="100" y2="148"/>
        <line x1="140" y1="127" x2="100" y2="148"/>
        <line x1="100" y1="162" x2="60"  y2="169"/>
        <line x1="100" y1="162" x2="140" y2="169"/>
        <line x1="60"  y1="181" x2="100" y2="202"/>
        <line x1="140" y1="181" x2="100" y2="202"/>
      </g>
    </svg>`,
}

// ── Card definitions ─────────────────────────────────────────
// cardKey maps to matrix.cards.{cardKey}.title / .subtitle in translation files
// Named 'cardKey' (not 'key') to avoid collision with React's reserved 'key' prop.
const CARDS = [
  {
    number: '01', cardKey: 'lungField',
    tags: ['lungs', 'pulmonary', 'breath', 'respiratory'],
    baseColor: '#1a1208',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.35), rgba(255,140,0,0.15) 50%, transparent 70%)',
    anatomySVG: ANATOMY.lungs,
    geometrySVG: GEOMETRY.vesicaPiscis,
  },
  {
    number: '02', cardKey: 'bronchialTree',
    tags: ['bronchial', 'tree', 'airways', 'fractal'],
    baseColor: '#0d1318',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.3), rgba(100,180,255,0.12) 50%, transparent 70%)',
    anatomySVG: ANATOMY.bronchialTree,
    geometrySVG: GEOMETRY.starOfDavid,
  },
  {
    number: '03', cardKey: 'diaphragm',
    tags: ['diaphragm', 'muscle', 'breath', 'movement'],
    baseColor: '#120d18',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.32), rgba(180,100,255,0.15) 50%, transparent 70%)',
    anatomySVG: ANATOMY.diaphragm,
    geometrySVG: GEOMETRY.metatron,
  },
  {
    number: '04', cardKey: 'alveolarBloom',
    tags: ['alveoli', 'bloom', 'oxygen', 'exchange'],
    baseColor: '#0f1a0f',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.28), rgba(80,220,120,0.15) 50%, transparent 70%)',
    anatomySVG: ANATOMY.alveoli,
    geometrySVG: GEOMETRY.sriYantra,
  },
  {
    number: '05', cardKey: 'neuralBreath',
    tags: ['neural', 'nervous', 'rhythm', 'signal'],
    baseColor: '#1a0f0f',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.35), rgba(255,80,80,0.12) 50%, transparent 70%)',
    anatomySVG: ANATOMY.neural,
    geometrySVG: GEOMETRY.pentagram,
  },
  {
    number: '06', cardKey: 'theSilence',
    tags: ['silence', 'pause', 'stillness', 'void'],
    baseColor: '#0a0a0a',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.4), rgba(255,255,255,0.08) 50%, transparent 70%)',
    anatomySVG: ANATOMY.silence,
    geometrySVG: GEOMETRY.torus,
  },
  {
    number: '07', cardKey: 'sacredHeart',
    tags: ['heart', 'pulse', 'cardiac', 'circulation'],
    baseColor: '#1a0808',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.38), rgba(255,60,60,0.18) 50%, transparent 70%)',
    anatomySVG: ANATOMY.heart,
    geometrySVG: GEOMETRY.flowerOfLife,
  },
  {
    number: '08', cardKey: 'spinalColumn',
    tags: ['spine', 'vertebrae', 'axis', 'column', 'skeletal'],
    baseColor: '#0d0d18',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.3), rgba(120,120,255,0.15) 50%, transparent 70%)',
    anatomySVG: ANATOMY.spine,
    geometrySVG: GEOMETRY.kabbalah,
  },
  {
    number: '09', cardKey: 'ribCage',
    tags: ['ribs', 'ribcage', 'thorax', 'skeletal', 'chest'],
    baseColor: '#101510',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.32), rgba(80,200,100,0.12) 50%, transparent 70%)',
    anatomySVG: ANATOMY.ribcage,
    geometrySVG: GEOMETRY.goldenSpiral,
  },
  {
    number: '10', cardKey: 'cranialVault',
    tags: ['skull', 'cranium', 'head', 'brain', 'consciousness'],
    baseColor: '#181210',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.35), rgba(200,150,80,0.15) 50%, transparent 70%)',
    anatomySVG: ANATOMY.skull,
    geometrySVG: GEOMETRY.metatron,
  },
  {
    number: '11', cardKey: 'vascularRivers',
    tags: ['blood', 'vessel', 'artery', 'vein', 'circulation', 'flow'],
    baseColor: '#180a0a',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.36), rgba(255,40,40,0.14) 50%, transparent 70%)',
    anatomySVG: ANATOMY.bloodVessel,
    geometrySVG: GEOMETRY.sriYantra,
  },
  {
    number: '12', cardKey: 'innerEye',
    tags: ['eye', 'iris', 'vision', 'sight', 'optic'],
    baseColor: '#080d18',
    overlayGradient: 'radial-gradient(ellipse at center, rgba(212,175,55,0.4), rgba(60,120,255,0.18) 50%, transparent 70%)',
    anatomySVG: ANATOMY.eye,
    geometrySVG: GEOMETRY.goldenSpiral,
  },
]

// ── Search Bar ───────────────────────────────────────────────
function SearchBar({ value, onChange, t }) {
  return (
    <div style={{
      position: 'relative',
      maxWidth: '420px',
      margin: '2.5rem auto 0',
    }}>
      {/* Search icon */}
      <svg
        viewBox="0 0 24 24" fill="none"
        style={{
          position: 'absolute', left: '14px', top: '50%',
          transform: 'translateY(-50%)',
          width: '14px', height: '14px',
          pointerEvents: 'none',
        }}
      >
        <circle cx="11" cy="11" r="7" stroke="rgba(212,175,55,0.45)" strokeWidth="1.5"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="rgba(212,175,55,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('matrix.gallery.searchPlaceholder', 'Search — lungs, heart, spine…')}
        style={{
          width: '100%',
          padding: '0.75rem 2.5rem 0.75rem 2.5rem',
          background: 'rgba(212,175,55,0.04)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '2px',
          color: '#f5f0e8',
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '12px',
          letterSpacing: '0.15em',
          outline: 'none',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.55)'}
        onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.2)'}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)',
            background: 'none', border: 'none',
            color: 'rgba(212,175,55,0.45)',
            fontSize: '16px', cursor: 'pointer',
            lineHeight: 1, padding: 0,
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── Gallery ──────────────────────────────────────────────────
export default function Gallery() {
  const headerRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeCard, setActiveCard] = useState(null)
  const { t } = useTranslation()

  const filtered = query.trim() === ''
    ? CARDS
    : CARDS.filter(card => {
        const q = query.toLowerCase()
        const title    = t(`matrix.cards.${card.cardKey}.title`,    '')
        const subtitle = t(`matrix.cards.${card.cardKey}.subtitle`, '')
        return (
          title.toLowerCase().includes(q) ||
          subtitle.toLowerCase().includes(q) ||
          card.tags.some(tag => tag.includes(q))
        )
      })

  // Scroll-triggered fade-in for the gallery header
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ padding: 'clamp(3rem,8vw,6rem) clamp(0.75rem,3vw,1.5rem)', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Section header */}
      <div
        ref={headerRef}
        className="fade-in"
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '10px', letterSpacing: '0.6em',
          color: '#D4AF37', textTransform: 'uppercase',
          marginBottom: '1.5rem', opacity: 0.7,
        }}>
          {t('matrix.gallery.label', 'Collection')}
        </p>
        <div style={{
          width: '60px', height: '1px',
          background: 'linear-gradient(to right, #D4AF37, transparent)',
          margin: '0 auto 2rem',
        }} />
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 300, color: '#f5f0e8',
        }}>
          {t('matrix.gallery.title', 'The Living')}{' '}
          <em style={{ fontStyle: 'italic', color: '#D4AF37' }}>{t('matrix.gallery.titleItalic', 'Architecture')}</em>
        </h2>
        <p style={{
          fontFamily: 'Raleway, sans-serif', fontWeight: 200,
          fontSize: '0.85rem', letterSpacing: '0.3em',
          color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase',
          marginTop: '1.5rem',
        }}>
          {t('matrix.gallery.subtitle', 'Hover to reveal sacred geometry within')}
        </p>

        {/* Search */}
        <SearchBar value={query} onChange={setQuery} t={t} />

        {/* Result count */}
        {query.trim() !== '' && (
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '10px', letterSpacing: '0.3em',
            color: 'rgba(212,175,55,0.4)', textTransform: 'uppercase',
            marginTop: '1rem',
          }}>
            {filtered.length} {filtered.length === 1 ? t('matrix.gallery.results', 'result') : t('matrix.gallery.resultsPlural', 'results')} found
          </p>
        )}
      </div>

      {/* Card grid — staggered scroll-reveal: each card fades + rises in sequence */}
      {filtered.length > 0 ? (
        <div className="gallery-grid">
          {filtered.map((card, index) => (
            <motion.div
              key={card.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.65,
                // Stagger: each card delays by 60ms relative to its position
                // Cap at 8 so the last rows don't wait too long
                delay: Math.min(index % 3, 2) * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <InteractiveCard
                {...card}
                title={t(`matrix.cards.${card.cardKey}.title`, card.cardKey)}
                subtitle={t(`matrix.cards.${card.cardKey}.subtitle`, '')}
                onClick={() => setActiveCard(card)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(245,240,232,0.3)',
          }}>
            {t('matrix.gallery.noResults', 'No illustrations found')}
          </p>
          <p style={{
            fontFamily: 'Raleway, sans-serif', fontWeight: 200,
            fontSize: '11px', letterSpacing: '0.3em',
            color: 'rgba(212,175,55,0.3)', textTransform: 'uppercase',
            marginTop: '0.75rem',
          }}>
            {t('matrix.gallery.noResultsSub', 'Try: lungs, heart, spine, diaphragm…')}
          </p>
        </div>
      )}

      {/* Card detail modal */}
      {activeCard && (
        <CardModal card={activeCard} onClose={() => setActiveCard(null)} />
      )}
    </div>
  )
}
