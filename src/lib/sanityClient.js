import { createClient } from '@sanity/client'
import { SANITY } from '../config'

// Only create client if projectId is configured
export const sanityClient = SANITY.projectId && SANITY.projectId !== 'YOUR_PROJECT_ID'
  ? createClient({
      projectId:  SANITY.projectId,
      dataset:    SANITY.dataset,
      apiVersion: SANITY.apiVersion,
      useCdn:     SANITY.useCdn,
    })
  : null

// Module-level in-memory cache — survives route changes, cleared on page reload
export const queryCache = new Map()
