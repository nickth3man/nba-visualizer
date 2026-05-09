/**
 * Court.tsx — Pure SVG NBA court component.
 *
 * Renders accurate NBA court markings scaled to the requested width/height.
 * Accepts a children prop so shot markers and annotations can be overlaid
 * inside the SVG coordinate space without a separate positioning layer.
 *
 * Coordinate system: all children receive SVG user-space coordinates where
 * the origin is the top-left of the SVG viewport. Use the `scaleX`/`scaleY`
 * helpers exported from this file to convert court-feet coordinates to
 * SVG pixels.
 *
 * @example
 * ```tsx
 * <Court width={600} height={564} orientation="vertical">
 *   <circle cx={scaleX(25, 600)} cy={scaleY(4.75, 564)} r={4} fill="green" />
 * </Court>
 * ```
 */

import { type ReactNode } from 'react'
import { chartTheme } from '../../lib/chart-theme'
import { COURT } from './court-dimensions'

export type CourtOrientation = 'vertical' | 'horizontal'

export interface CourtProps {
  /** SVG width in pixels. */
  width: number
  /** SVG height in pixels. */
  height: number
  /**
   * 'vertical' = top-down half-court view (default).
   * 'horizontal' = side view (full width = court length).
   */
  orientation?: CourtOrientation
  /** When true, render full court instead of half court. */
  fullCourt?: boolean
  children?: ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Scale helpers (exported so children can convert feet → SVG px)
// ---------------------------------------------------------------------------

/** Convert court X coordinate (feet, 0–50) to SVG X pixel. */
export function scaleX(courtX: number, svgWidth: number): number {
  return (courtX / COURT.fullWidth) * svgWidth
}

/** Convert court Y coordinate (feet, 0–47 half or 0–94 full) to SVG Y pixel.
 *  Y=0 is the baseline (bottom of court), rendered at the SVG bottom.
 */
export function scaleY(
  courtY: number,
  svgHeight: number,
  fullCourt = false,
): number {
  const length = fullCourt ? COURT.fullLength : COURT.halfLength
  // Invert so Y=0 (baseline) maps to the SVG bottom
  return svgHeight - (courtY / length) * svgHeight
}

// ---------------------------------------------------------------------------
// Court component
// ---------------------------------------------------------------------------

export function Court({
  width,
  height,
  orientation = 'vertical',
  fullCourt = false,
  children,
  className = '',
}: CourtProps) {
  const t = chartTheme.colors.court
  const sw = chartTheme.geometry.strokeWidth

  const courtLength = fullCourt ? COURT.fullLength : COURT.halfLength

  // For vertical (top-down) orientation:
  //   svg x → court x (sideline), svg y → court y (baseline at bottom)
  // For horizontal orientation, swap axes.
  const sx = (cx: number) =>
    orientation === 'vertical'
      ? (cx / COURT.fullWidth) * width
      : (cx / courtLength) * width

  const sy = (cy: number) =>
    orientation === 'vertical'
      ? height - (cy / courtLength) * height
      : height - (cy / COURT.fullWidth) * height

  const { hoop, paint, threePoint, restrictedArea, freeThrowCircle, centerCircle, backboard } = COURT

  // Three-point arc: two straight corner segments + arc
  // Arc from cornerY up and around the arc, stop at the other corner.
  const arcR = threePoint.radius * (orientation === 'vertical' ? width / COURT.fullWidth : height / COURT.fullWidth)
  const hoopcx = sx(hoop.x)
  const hoopcy = sy(hoop.y)
  const cornerYpx = sy(threePoint.cornerY)
  const corner1x = sx(threePoint.cornerX1)
  const corner2x = sx(threePoint.cornerX2)
  const cornerBaseline = sy(0)

  // Compute arc start/end points at cornerY
  // Arc intersects x=cornerX1 at y=cornerY
  const dx1 = sx(threePoint.cornerX1) - hoopcx
  const dy1at = Math.sqrt(Math.max(0, arcR * arcR - dx1 * dx1))
  const arcStart = { x: sx(threePoint.cornerX1), y: hoopcy - dy1at }
  const dx2 = sx(threePoint.cornerX2) - hoopcx
  const dy2at = Math.sqrt(Math.max(0, arcR * arcR - dx2 * dx2))
  const arcEnd = { x: sx(threePoint.cornerX2), y: hoopcy - dy2at }

  const threePointPath = [
    `M ${corner1x} ${cornerBaseline}`,
    `L ${corner1x} ${cornerYpx}`,
    `L ${arcStart.x} ${arcStart.y}`,
    `A ${arcR} ${arcR} 0 0 1 ${arcEnd.x} ${arcEnd.y}`,
    `L ${corner2x} ${cornerYpx}`,
    `L ${corner2x} ${cornerBaseline}`,
  ].join(' ')

  const lineStyle = {
    stroke: t.lines,
    strokeWidth: sw.courtLines,
    fill: 'none',
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: 'block' }}
    >
      {/* Court floor */}
      <rect x={0} y={0} width={width} height={height} fill={t.floor} />

      {/* Paint area */}
      <rect
        x={sx(paint.x1)}
        y={sy(paint.y2)}
        width={sx(paint.x2) - sx(paint.x1)}
        height={sy(0) - sy(paint.y2)}
        fill={t.paint}
        stroke={t.lines}
        strokeWidth={sw.courtLines}
      />

      {/* Restricted area arc */}
      <circle
        cx={hoopcx}
        cy={hoopcy}
        r={restrictedArea.radius * (width / COURT.fullWidth)}
        fill="none"
        stroke={t.lines}
        strokeWidth={sw.courtLines}
        clipPath="url(#halfClip)"
      />

      {/* Free-throw circle — top half only */}
      <circle
        cx={sx(freeThrowCircle.x)}
        cy={sy(freeThrowCircle.y)}
        r={freeThrowCircle.radius * (width / COURT.fullWidth)}
        fill="none"
        stroke={t.lines}
        strokeWidth={sw.courtLines}
      />

      {/* Three-point line */}
      <path d={threePointPath} {...lineStyle} />

      {/* Baseline */}
      <line x1={0} y1={sy(0)} x2={width} y2={sy(0)} {...lineStyle} />

      {/* Backboard */}
      <line
        x1={sx(backboard.x1)}
        y1={sy(backboard.y)}
        x2={sx(backboard.x2)}
        y2={sy(backboard.y)}
        stroke={t.lines}
        strokeWidth={sw.courtLines + 0.5}
      />

      {/* Hoop */}
      <circle
        cx={hoopcx}
        cy={hoopcy}
        r={hoop.radius * (width / COURT.fullWidth)}
        fill="none"
        stroke={t.lines}
        strokeWidth={sw.courtLines}
      />

      {/* Half-court line (only for full court) */}
      {fullCourt && (
        <>
          <line
            x1={0}
            y1={sy(COURT.halfLength)}
            x2={width}
            y2={sy(COURT.halfLength)}
            {...lineStyle}
          />
          <circle
            cx={sx(centerCircle.x)}
            cy={sy(centerCircle.y)}
            r={centerCircle.radius * (width / COURT.fullWidth)}
            fill="none"
            stroke={t.lines}
            strokeWidth={sw.courtLines}
          />
        </>
      )}

      {/* Children (shot markers, annotations) */}
      {children}
    </svg>
  )
}
