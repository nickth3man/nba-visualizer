/**
 * useGameData.ts — Typed hook for game-level data.
 *
 * Fetches scores, game-flow differentials, and play-by-play slices.
 * Uses a 5-minute staleTime (STALE_TIMES.GAME) since scores change during
 * live games.
 */

import { useChartData } from './useChartData'
import { STALE_TIMES } from '../lib/query-client'
import type { GameFlowPoint } from '../components/charts/GameFlow'

export interface GameSummary {
  gameId: number
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: 'scheduled' | 'in_progress' | 'final'
  period?: number
  clock?: string
}

export interface PlayByPlaySlice {
  eventId: number
  timeSeconds: number
  period: number
  description: string
  homeScore: number
  awayScore: number
  playerId?: number
  playerName?: string
  teamId?: number
}

export interface GameData {
  summary: GameSummary
  flow: GameFlowPoint[]
  plays: PlayByPlaySlice[]
}

export interface UseGameDataResult {
  game: GameData | undefined
  isLoading: boolean
  error: Error | null
}

export function useGameData(gameId: number | null): UseGameDataResult {
  const { data, isLoading, error } = useChartData<GameData>(
    ['game', gameId],
    `/api/games/${gameId ?? 0}`,
    {
      staleTime: STALE_TIMES.GAME,
      enabled: gameId !== null,
    },
  )

  return {
    game: data,
    isLoading,
    error,
  }
}
