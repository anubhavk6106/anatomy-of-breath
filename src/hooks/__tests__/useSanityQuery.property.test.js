// Feature: platform-expansion, Property 13: Sanity query cache prevents redundant fetches within 60 seconds

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import fc from 'fast-check'
import { useSanityQuery } from '../useSanityQuery'
import { sanityClient, queryCache } from '../../lib/sanityClient'

// vi.hoisted runs before vi.mock hoisting, so mockQueryCache is available
// inside the factory and also importable by the tests below.
const { mockQueryCache } = vi.hoisted(() => ({
  mockQueryCache: new Map(),
}))

// Mock the sanityClient module entirely.
// We provide a real Map for queryCache so the hook's caching logic is exercised,
// and a vi.fn() for sanityClient.fetch so we can assert call counts.
vi.mock('../../lib/sanityClient', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
  queryCache: mockQueryCache,
}))

/**
 * Validates: Requirements 6.5, 12.6
 *
 * Property 13: Sanity query cache prevents redundant fetches within 60 seconds.
 * A second call to useSanityQuery with the same query within 60 s must return
 * cached data without invoking sanityClient.fetch again (fetch called exactly
 * once). After 60 s have elapsed the next call must trigger one new fetch
 * (fetch called twice total).
 */
describe('useSanityQuery — Property 13: cache TTL', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    queryCache.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('returns cached data on second call within 60 s (no extra fetch)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.array(fc.integer(), { minLength: 0, maxLength: 10 }),
        async (query, mockData) => {
          // Reset state for each generated example
          queryCache.clear()
          sanityClient.fetch.mockResolvedValue(mockData)

          // First render — should call fetch once
          const { result: result1, unmount: unmount1 } = renderHook(() =>
            useSanityQuery(query)
          )
          // Flush the resolved promise so the useEffect .then() runs
          await act(() => vi.runAllTimersAsync())
          expect(result1.current.loading).toBe(false)
          expect(sanityClient.fetch).toHaveBeenCalledTimes(1)

          // Second render within 60 s — must use cache, no additional fetch
          const { result: result2, unmount: unmount2 } = renderHook(() =>
            useSanityQuery(query)
          )
          await act(() => vi.runAllTimersAsync())
          expect(result2.current.loading).toBe(false)
          expect(sanityClient.fetch).toHaveBeenCalledTimes(1) // still exactly 1
          expect(result2.current.data).toEqual(mockData)

          unmount1()
          unmount2()
          sanityClient.fetch.mockClear()
        }
      ),
      { numRuns: 20 } // 20 async runs keeps the suite fast while covering the property
    )
  }, 60_000)

  it('re-fetches after 60 s TTL expires', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.array(fc.integer(), { minLength: 0, maxLength: 10 }),
        async (query, mockData) => {
          // Reset state for each generated example
          queryCache.clear()
          sanityClient.fetch.mockResolvedValue(mockData)

          // First render — populates the cache
          const { result: result1, unmount: unmount1 } = renderHook(() =>
            useSanityQuery(query)
          )
          await act(() => vi.runAllTimersAsync())
          expect(result1.current.loading).toBe(false)
          expect(sanityClient.fetch).toHaveBeenCalledTimes(1)
          unmount1()

          // Advance fake clock past the 60 s TTL
          vi.advanceTimersByTime(61_000)

          // Second render after TTL — cache entry is stale, must re-fetch
          const { result: result2, unmount: unmount2 } = renderHook(() =>
            useSanityQuery(query)
          )
          await act(() => vi.runAllTimersAsync())
          expect(result2.current.loading).toBe(false)
          expect(sanityClient.fetch).toHaveBeenCalledTimes(2) // one new fetch

          unmount2()
          sanityClient.fetch.mockClear()
        }
      ),
      { numRuns: 20 }
    )
  }, 60_000)
})
