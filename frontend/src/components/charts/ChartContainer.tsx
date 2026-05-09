/**
 * ChartContainer.tsx — Responsive wrapper with loading, error, and empty states.
 *
 * All Recharts chart components render inside this container so that chrome
 * (loading spinner, error message, empty state) is handled once.
 */

import { type ReactNode } from 'react'
import { chartTheme } from '../../lib/chart-theme'

interface ChartContainerProps {
  /** Chart title displayed above the visualization. */
  title?: string
  /** Height of the chart area in pixels (default: 300). */
  height?: number
  /** When true, shows a loading skeleton instead of children. */
  loading?: boolean
  /** When set, shows an error message instead of children. */
  error?: Error | string | null
  /** When true, shows an empty-state message instead of children. */
  isEmpty?: boolean
  /** Custom empty-state message. */
  emptyMessage?: string
  children: ReactNode
  className?: string
}

export function ChartContainer({
  title,
  height = 300,
  loading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No data available',
  children,
  className = '',
}: ChartContainerProps) {
  const errorMessage =
    error instanceof Error ? error.message : (error ?? null)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
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

      <div style={{ height, position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(17,24,39,0.6)',
              borderRadius: 4,
            }}
          >
            <span style={{ color: chartTheme.typography.axisLabel.color, fontSize: 13 }}>
              Loading…
            </span>
          </div>
        )}

        {!loading && errorMessage && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              fontSize: 13,
            }}
          >
            Error: {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && isEmpty && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: chartTheme.colors.ui.emptyState,
              fontSize: 13,
            }}
          >
            {emptyMessage}
          </div>
        )}

        {!loading && !errorMessage && !isEmpty && children}
      </div>
    </div>
  )
}
