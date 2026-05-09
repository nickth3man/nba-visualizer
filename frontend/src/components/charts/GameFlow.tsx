/**
 * GameFlow.tsx — Score differential over game time, D3-based area chart.
 *
 * Renders an area chart (positive = home team leading, negative = away team
 * leading) with vertical separators at quarter breaks and an optional
 * largest-lead annotation.
 *
 * Uses the declarative D3+React pattern: D3 computes scale/path math,
 * React renders SVG elements. No d3.select() DOM manipulation on React-owned
 * elements.
 */

import { useMemo } from 'react'
import * as d3 from 'd3'
import { ChartContainer } from './ChartContainer'
import { chartTheme } from '../../lib/chart-theme'

export interface GameFlowPoint {
  /** Game time in seconds from tip-off. */
  timeSeconds: number
  /** Score differential: home score minus away score. */
  differential: number
  /** Current period (1–4 for regulation, 5+ for OT). */
  period: number
}

export interface GameFlowProps {
  data: GameFlowPoint[]
  /** Home team abbreviation for tooltip. */
  homeTeam?: string
  /** Away team abbreviation for tooltip. */
  awayTeam?: string
  title?: string
  width?: number
  height?: number
  loading?: boolean
  error?: Error | string | null
  className?: string
}

const MARGIN = { top: 24, right: 24, bottom: 40, left: 40 }
const PERIOD_LENGTH = 12 * 60 // 12 minutes in seconds

export function GameFlow({
  data,
  homeTeam = 'Home',
  awayTeam = 'Away',
  title,
  width = 600,
  height = 240,
  loading = false,
  error = null,
  className = '',
}: GameFlowProps) {
  const isEmpty = !loading && !error && data.length === 0

  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom

  const { xScale, yScale, areaHome, areaAway, quarterBreaks, maxLead } = useMemo(() => {
    if (data.length === 0) {
      return { xScale: null, yScale: null, areaHome: '', areaAway: '', quarterBreaks: [], maxLead: null }
    }

    const maxTime = d3.max(data, (d) => d.timeSeconds) ?? PERIOD_LENGTH * 4
    const diffExtent = d3.extent(data, (d) => d.differential) as [number, number]
    const absMax = Math.max(Math.abs(diffExtent[0]), Math.abs(diffExtent[1]), 5)

    const xSc = d3.scaleLinear().domain([0, maxTime]).range([0, innerWidth])
    const ySc = d3.scaleLinear().domain([-absMax, absMax]).range([innerHeight, 0])

    const homeAreaGen = d3
      .area<GameFlowPoint>()
      .x((d) => xSc(d.timeSeconds))
      .y0(ySc(0))
      .y1((d) => ySc(Math.max(0, d.differential)))
      .curve(d3.curveStepAfter)

    const awayAreaGen = d3
      .area<GameFlowPoint>()
      .x((d) => xSc(d.timeSeconds))
      .y0(ySc(0))
      .y1((d) => ySc(Math.min(0, d.differential)))
      .curve(d3.curveStepAfter)

    // Quarter break x positions
    const numPeriods = Math.max(...data.map((d) => d.period))
    const breaks = Array.from({ length: numPeriods - 1 }, (_, i) =>
      xSc((i + 1) * PERIOD_LENGTH),
    )

    // Largest lead annotation
    const maxDiffIdx = d3.maxIndex(data, (d) => Math.abs(d.differential))
    const leadPoint = data[maxDiffIdx]

    return {
      xScale: xSc,
      yScale: ySc,
      areaHome: homeAreaGen(data) ?? '',
      areaAway: awayAreaGen(data) ?? '',
      quarterBreaks: breaks,
      maxLead: leadPoint
        ? { x: xSc(leadPoint.timeSeconds), y: ySc(leadPoint.differential), diff: leadPoint.differential }
        : null,
    }
  }, [data, innerWidth, innerHeight])

  const t = chartTheme.colors
  const typo = chartTheme.typography

  return (
    <ChartContainer
      title={title}
      height={height}
      loading={loading}
      error={error}
      isEmpty={isEmpty}
      className={className}
    >
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="gf-home" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.lead.home} stopOpacity={0.7} />
            <stop offset="100%" stopColor={t.lead.home} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="gf-away" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={t.lead.away} stopOpacity={0.7} />
            <stop offset="100%" stopColor={t.lead.away} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Zero line */}
          {yScale !== null && (
            <line
              x1={0}
              y1={yScale(0)}
              x2={innerWidth}
              y2={yScale(0)}
              stroke={t.ui.grid}
              strokeWidth={1}
            />
          )}

          {/* Home lead area */}
          {areaHome && (
            <path d={areaHome} fill="url(#gf-home)" stroke={t.lead.home} strokeWidth={1.5} />
          )}

          {/* Away lead area */}
          {areaAway && (
            <path d={areaAway} fill="url(#gf-away)" stroke={t.lead.away} strokeWidth={1.5} />
          )}

          {/* Quarter separators */}
          {xScale !== null && yScale !== null && quarterBreaks.map((x, i) => (
            <g key={i}>
              <line
                x1={x}
                y1={0}
                x2={x}
                y2={innerHeight}
                stroke={t.ui.grid}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={x}
                y={innerHeight + 20}
                textAnchor="middle"
                fontSize={typo.axisTick.fontSize}
                fill={typo.axisTick.color}
              >
                Q{i + 2}
              </text>
            </g>
          ))}

          {/* Q1 label */}
          {xScale !== null && (
            <text
              x={0}
              y={innerHeight + 20}
              textAnchor="start"
              fontSize={typo.axisTick.fontSize}
              fill={typo.axisTick.color}
            >
              Q1
            </text>
          )}

          {/* Largest lead annotation */}
          {maxLead !== null && (
            <g>
              <circle cx={maxLead.x} cy={maxLead.y} r={4} fill={maxLead.diff >= 0 ? t.lead.home : t.lead.away} />
              <text
                x={maxLead.x + 6}
                y={maxLead.y - 6}
                fontSize={typo.annotation.fontSize}
                fill={typo.annotation.color}
              >
                {maxLead.diff >= 0 ? homeTeam : awayTeam} +{Math.abs(maxLead.diff)}
              </text>
            </g>
          )}

          {/* Team labels */}
          <text
            x={innerWidth - 4}
            y={yScale !== null ? yScale(0) - 6 : 0}
            textAnchor="end"
            fontSize={typo.annotation.fontSize}
            fill={t.lead.home}
          >
            {homeTeam} leading
          </text>
          <text
            x={innerWidth - 4}
            y={yScale !== null ? yScale(0) + 14 : 0}
            textAnchor="end"
            fontSize={typo.annotation.fontSize}
            fill={t.lead.away}
          >
            {awayTeam} leading
          </text>
        </g>
      </svg>
    </ChartContainer>
  )
}
