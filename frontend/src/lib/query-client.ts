/**
 * query-client.ts — TanStack Query client configuration.
 *
 * staleTime defaults:
 *   - Game-level data: 5 minutes (scores change frequently during live games)
 *   - Historical/season data: 30 minutes (rarely changes mid-session)
 *
 * Individual hooks override these defaults via queryOptions when needed.
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

/** Stale time constants used by individual hooks. */
export const STALE_TIMES = {
  /** Live or same-day game data — refresh frequently. */
  GAME: 5 * 60 * 1000,
  /** Season aggregates and historical stats — stable within a session. */
  HISTORICAL: 30 * 60 * 1000,
} as const
