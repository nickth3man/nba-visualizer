/**
 * useShotData.ts — Typed hook for shot chart data.
 *
 * Fetches shot attempts from the backend with player, team, season, and
 * date-range filters. All filters are included in the query key to ensure
 * correct cache separation.
 */

import { useChartData } from './useChartData'
import { STALE_TIMES } from '../lib/query-client'

export interface ShotAttempt {
  /** Shot X coordinate in feet (origin: bottom-left of the court). */
  x: number
  /** Shot Y coordinate in feet. */
  y: number
  /** Whether the shot was made. */
  made: boolean
  /** Shot zone label (e.g. "Left Corner 3", "Paint", "Mid-Range"). */
  zone?: string
  /** Player name. */
  playerName?: string
  /** Game period (1–4 for regulation, 5+ for OT). */
  period?: number
  /** Shot distance in feet. */
  distance?: number
}

export interface ShotFilters {
  playerId?: number
  teamId?: number
  season?: string
  dateFrom?: string
  dateTo?: string
}

export interface UseShotDataResult {
  shots: ShotAttempt[]
  isLoading: boolean
  error: Error | null
}

export function useShotData(filters: ShotFilters): UseShotDataResult {
  const params = new URLSearchParams()
  if (filters.playerId !== undefined) params.set('player_id', String(filters.playerId))
  if (filters.teamId !== undefined) params.set('team_id', String(filters.teamId))
  if (filters.season) params.set('season', filters.season)
  if (filters.dateFrom) params.set('date_from', filters.dateFrom)
  if (filters.dateTo) params.set('date_to', filters.dateTo)

  const endpoint = `/api/shots?${params.toString()}`

  const queryKey = [
    'shots',
    filters.playerId ?? null,
    filters.teamId ?? null,
    filters.season ?? null,
    filters.dateFrom ?? null,
    filters.dateTo ?? null,
  ] as const

  const { data, isLoading, error } = useChartData<ShotAttempt[]>(
    queryKey,
    endpoint,
    { staleTime: STALE_TIMES.HISTORICAL },
  )

  return {
    shots: data ?? [],
    isLoading,
    error,
  }
}
