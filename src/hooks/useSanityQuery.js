import { useState, useEffect } from 'react'
import { sanityClient, queryCache } from '../lib/sanityClient'

/**
 * Hook for fetching data from Sanity CMS with in-memory caching.
 * Returns { data, loading, error }.
 * Cache TTL: 60 seconds. Uses module-level queryCache Map from sanityClient.
 * 
 * If Sanity is not configured, returns error state immediately.
 */
export function useSanityQuery(query, params = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    // If Sanity client is not configured, return error immediately
    if (!sanityClient) {
      setState({ 
        data: null, 
        loading: false, 
        error: new Error('Sanity CMS is not configured. Add VITE_SANITY_PROJECT_ID to .env') 
      })
      return
    }

    const cacheKey = JSON.stringify({ query, params })
    const cached = queryCache.get(cacheKey)

    if (cached && Date.now() - cached.ts < 60_000) {
      setState({ data: cached.data, loading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    sanityClient.fetch(query, params)
      .then(data => {
        queryCache.set(cacheKey, { data, ts: Date.now() })
        setState({ data, loading: false, error: null })
      })
      .catch(error => setState({ data: null, loading: false, error }))
  }, [query, JSON.stringify(params)])

  return state
}

export default useSanityQuery
