/**
 * ShotHexbin.tsx — Hexagonal binning of shot attempts on the court SVG.
 *
 * Uses d3-hexbin to aggregate shots into spatial bins and color-encodes
 * each bin by field-goal percentage (FG%). Bin size is controlled by the
 * `radius` prop (in feet, converted to SVG pixels).
 *
 * Color scale:
 *   Low FG% → chartTheme.colors.hexbin.low (dark blue)
 *   League avg → chartTheme.colors.hexbin.mid (gray)
 *   High FG% → chartTheme.colors.hexbin.high (orange)
 */

import { useMemo } from 'react'
import { hexbin as d3Hexbin } from 'd3-hexbin'
import * as d3 from 'd3'
import { chartTheme } from '../../lib/chart-theme'
import type { ShotAttempt } from '../../hooks/useShotData'

export interface ShotHexbinProps {
  shots: ShotAttempt[]
  svgWidth: number
  svgHeight: number
  scaleX: (x: number) => number
  scaleY: (y: number) => number
  /**
   * Hexbin radius in SVG pixels.
   * Typical values: 15–25px for a 600px wide court.
   */
  radius?: number
  /** Minimum shots per bin to render a hex (filters sparse bins). */
  minBinSize?: number
}

export function ShotHexbin({
  shots,
  svgWidth,
  svgHeight,
  scaleX,
  scaleY,
  radius = 18,
  minBinSize = 2,
}: ShotHexbinProps) {
  const { hexbins, colorScale } = useMemo(() => {
    if (shots.length === 0) return { hexbins: [], colorScale: null }

    const hexbinGenerator = d3Hexbin<ShotAttempt>()
      .x((d) => scaleX(d.x))
      .y((d) => scaleY(d.y))
      .radius(radius)
      .extent([[0, 0], [svgWidth, svgHeight]])

    const bins = hexbinGenerator(shots).filter((b) => b.length >= minBinSize)

    // Compute FG% per bin
    const fgPcts = bins.map((b) => b.filter((s) => s.made).length / b.length)

    const fgExtent = d3.extent(fgPcts) as [number, number]

    const t = chartTheme.colors.hexbin
    const scale = d3
      .scaleSequential(d3.interpolateRgb(t.low, t.high))
      .domain(fgExtent[0] === fgExtent[1] ? [0, 1] : fgExtent)

    const binsWithFg = bins.map((b, i) => ({
      bin: b,
      path: hexbinGenerator.hexagon(radius * 0.9),
      fgPct: fgPcts[i],
      color: scale(fgPcts[i]),
    }))

    return { hexbins: binsWithFg, colorScale: scale }
  }, [shots, radius, minBinSize, scaleX, scaleY, svgWidth, svgHeight])

  // Suppress unused variable lint for colorScale (used by legend, future)
  void colorScale

  return (
    <>
      {hexbins.map(({ bin, path, fgPct, color }, i) => (
        <path
          key={i}
          d={path}
          transform={`translate(${bin.x},${bin.y})`}
          fill={color}
          fillOpacity={0.8}
          stroke={chartTheme.colors.court.lines}
          strokeWidth={0.5}
        >
          <title>
            {bin.length} shots · {(fgPct * 100).toFixed(1)}% FG
          </title>
        </path>
      ))}
    </>
  )
}
