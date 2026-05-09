/**
 * ShotChart.tsx — Container component with scatter/hexbin mode toggle.
 *
 * Composes Court + ShotScatter/ShotHexbin and exposes filter props
 * (player, team, season, date range). Handles loading and empty states
 * via the ChartContainer component.
 */

import { useState } from 'react'
import { Court, scaleX as courtScaleX, scaleY as courtScaleY } from './Court'
import { ShotScatter } from './ShotScatter'
import { ShotHexbin } from './ShotHexbin'
import type { ShotAttempt } from '../../hooks/useShotData'
import { chartTheme } from '../../lib/chart-theme'

export type ShotChartMode = 'scatter' | 'hexbin'

export interface ShotChartProps {
  shots: ShotAttempt[]
  loading?: boolean
  error?: Error | string | null
  title?: string
  /** Default mode. */
  mode?: ShotChartMode
  width?: number
  height?: number
  className?: string
}

export function ShotChart({
  shots,
  loading = false,
  error = null,
  title,
  mode: defaultMode = 'scatter',
  width = 500,
  height = 470,
  className = '',
}: ShotChartProps) {
  const [mode, setMode] = useState<ShotChartMode>(defaultMode)

  const isEmpty = !loading && !error && shots.length === 0
  const ui = chartTheme.colors.ui.tooltip

  const sx = (x: number) => courtScaleX(x, width)
  const sy = (y: number) => courtScaleY(y, height)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Title + mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title && (
          <h3
            style={{
              fontSize: chartTheme.typography.chartTitle.fontSize,
              fontWeight: chartTheme.typography.chartTitle.fontWeight,
              color: chartTheme.typography.chartTitle.color,
              margin: 0,
            }}
          >
            {title}
          </h3>
        )}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['scatter', 'hexbin'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '3px 10px',
                borderRadius: 4,
                border: `1px solid ${mode === m ? '#3b82f6' : '#374151'}`,
                background: mode === m ? '#1d4ed8' : 'transparent',
                color: mode === m ? '#fff' : '#9ca3af',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {m === 'scatter' ? 'Scatter' : 'Hexbin'}
            </button>
          ))}
        </div>
      </div>

      {/* Court */}
      {loading && (
        <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827', borderRadius: 6 }}>
          <span style={{ color: chartTheme.typography.axisLabel.color, fontSize: 13 }}>Loading…</span>
        </div>
      )}

      {!loading && error && (
        <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontSize: 13 }}>
          Error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {!loading && !error && isEmpty && (
        <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111827', borderRadius: 6 }}>
          <span style={{ color: ui.text, fontSize: 13 }}>No shots for selected filters</span>
        </div>
      )}

      {!loading && !error && !isEmpty && (
        <Court width={width} height={height} orientation="vertical">
          {mode === 'scatter' && (
            <ShotScatter
              shots={shots}
              svgWidth={width}
              svgHeight={height}
              scaleX={sx}
              scaleY={sy}
            />
          )}
          {mode === 'hexbin' && (
            <ShotHexbin
              shots={shots}
              svgWidth={width}
              svgHeight={height}
              scaleX={sx}
              scaleY={sy}
            />
          )}
        </Court>
      )}
    </div>
  )
}
