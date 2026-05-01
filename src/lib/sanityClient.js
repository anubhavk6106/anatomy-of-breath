// src/lib/sanityClient.js

import { createClient } from '@sanity/client'

// Read directly from Vite env
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01'

// 🔥 Validate env (helps debugging)
if (!projectId) {
  console.error('❌ Missing VITE_SANITY_PROJECT_ID in environment variables')
}

// ✅ Create client (always create, no null)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ✅ MUST be true in production (fast + stable)
})

// ✅ In-memory cache (optional but useful)
export const queryCache = new Map()

// ✅ Debug log (safe for both dev + prod)
console.log('[Sanity] Config:', {
  projectId,
  dataset,
  apiVersion,
})