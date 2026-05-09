/**
 * ShotScatter.tsx — Individual shot markers rendered on the court SVG.
 *
 * Color-encodes make (green) vs miss (red). Shows a tooltip on hover with
 * player, distance, and period.
 *
 * Coordinate mapping:
 *   Shot data arrives in feet with origin at bottom-left of the court
 *   (same as court-dimensions.ts). Use scaleX/scaleY from Court.tsx to
 *   convert to SVG pixels.
 */

import { useState } from 'react'
import { chartTheme } from '../../lib/chart-theme'
import type { ShotAttempt } from '../../hooks/useShotData'

export interface ShotScatterProps {
  shots: ShotAttempt[]
  /** SVG width — must match the Court component's width. */
  svgWidth: number
  /** SVG height — must match the Court component's height. */
  svgHeight: number
  /** Function to convert court X (feet) → SVG X (px). */
  scaleX: (x: number) => number
  /** Function to convert court Y (feet) → SVG Y (px). */
  scaleY: (y: number) => number
  dotRadius?: number
}

interface TooltipState {
  shot: ShotAttempt
  svgX: number
  svgY: number
}

export function ShotScatter({
  shots,
  scaleX,
  scaleY,
  dotRadius = 4,
}: ShotScatterProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const t = chartTheme.colors.shot
  const ui = chartTheme.colors.ui.tooltip

  return (
    <>
      {shots.map((shot, i) => {
        const cx = scaleX(shot.x)
        const cy = scaleY(shot.y)
        const fill = shot.made ? t.make : t.miss

        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={dotRadius}
            fill={fill}
            fillOpacity={0.75}
            stroke={shot.made ? '#16a34a' : '#dc2626'}
            strokeWidth={1}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltip({ shot, svgX: cx, svgY: cy })}
            onMouseLeave={() => setTooltip(null)}
          />
        )
      })}

      {/* Tooltip rendered as SVG foreignObject for rich HTML styling */}
      {tooltip && (
        <foreignObject
          x={tooltip.svgX + 8}
          y={tooltip.svgY - 40}
          width={160}
          height={80}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: ui.background,
              border: `1px solid ${ui.border}`,
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 11,
              color: ui.text,
              lineHeight: 1.5,
            }}
          >
            {tooltip.shot.playerName && <div style={{ fontWeight: 600 }}>{tooltip.shot.playerName}</div>}
            <div>{tooltip.shot.made ? 'Made' : 'Missed'}{tooltip.shot.distance != null ? ` · ${tooltip.shot.distance}ft` : ''}</div>
            {tooltip.shot.period != null && <div>Q{tooltip.shot.period}</div>}
            {tooltip.shot.zone && <div style={{ color: '#9ca3af' }}>{tooltip.shot.zone}</div>}
          </div>
        </foreignObject>
      )}
    </>
  )
}
