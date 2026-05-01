import { createClient } from '@sanity/client'
import { SANITY } from '../config'

// Only create client if projectId is configured
export const sanityClient = SANITY.projectId && SANITY.projectId !== 'YOUR_PROJECT_ID'
  ? createClient({
      projectId:  SANITY.projectId,
      dataset:    SANITY.dataset,
      apiVersion: SANITY.apiVersion,
      useCdn:     false,   // Disable CDN to always get fresh data and avoid CORS issues
      withCredentials: false,
    })
  : null

// Module-level in-memory cache — survives route changes, cleared on page reload
export const queryCache = new Map()

// Clear cache on module load to prevent stale data from previous sessions
queryCache.clear()

// Debug: log Sanity config in development
if (import.meta.env.DEV) {
  console.log('[Sanity] Client configured:', {
    projectId: SANITY.projectId,
    dataset:   SANITY.dataset,
    connected: !!sanityClient,
  })
}
