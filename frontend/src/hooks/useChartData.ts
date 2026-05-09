/**
 * useChartData.ts — Generic typed hook for fetching chart data from the
 * FastAPI backend via TanStack Query.
 *
 * Usage:
 * ```ts
 * const { data, isLoading, error } = useChartData<TeamStat[]>(
 *   ['team-stats', teamId, season],
 *   `/api/teams/${teamId}/stats?season=${season}`,
 * )
 * ```
 */

import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import { STALE_TIMES } from '../lib/query-client'

export interface UseChartDataResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

/**
 * Generic chart data hook.
 *
 * @param queryKey - TanStack Query key array. Must include all filter
 *   parameters so cache entries are properly namespaced.
 * @param endpoint - Backend API path (e.g. `/api/teams/1/stats`).
 * @param options - Optional overrides for staleTime and enabled flag.
 */
export function useChartData<T>(
  queryKey: readonly unknown[],
  endpoint: string,
  options?: {
    staleTime?: number
    enabled?: boolean
  },
): UseChartDataResult<T> {
  const { data, isLoading, error } = useQuery<T, Error>({
    queryKey,
    queryFn: () => apiFetch<T>(endpoint),
    staleTime: options?.staleTime ?? STALE_TIMES.HISTORICAL,
    enabled: options?.enabled ?? true,
  })

  return { data, isLoading, error }
}
