/**
 * ScatterChart.tsx — Scatter plot with customizable point size and color encoding.
 *
 * Supports reference lines for league-average crosshairs and color-encoded
 * efficiency / volume visualizations.
 */

import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { ChartContainer } from './ChartContainer'
import { chartTheme } from '../../lib/chart-theme'

export interface ScatterPoint {
  x: number
  y: number
  /** Optional label shown in tooltip. */
  label?: string
  /** Override dot color for this point. */
  color?: string
  /** Override dot size for this point (radius in px). */
  size?: number
}

export interface ReferenceLineConfig {
  /** 'x' for vertical line, 'y' for horizontal line. */
  axis: 'x' | 'y'
  value: number
  label?: string
  color?: string
}

export interface ScatterChartProps {
  data: ScatterPoint[]
  xLabel?: string
  yLabel?: string
  /** Default dot color (chartTheme.colors.series[0] if omitted). */
  color?: string
  /** Default dot radius in px (default: 5). */
  dotRadius?: number
  referenceLines?: ReferenceLineConfig[]
  title?: string
  height?: number
  loading?: boolean
  error?: Error | string | null
  className?: string
}

function CustomTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  const point = payload[0]?.payload as ScatterPoint | undefined
  const ui = chartTheme.colors.ui.tooltip
  return (
    <div
      style={{
        background: ui.background,
        border: `1px solid ${ui.border}`,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: chartTheme.typography.tooltip.fontSize,
        color: ui.text,
      }}
    >
      {point?.label && <div style={{ marginBottom: 4, color: '#9ca3af' }}>{point.label}</div>}
      <div>x: {point?.x}</div>
      <div>y: {point?.y}</div>
    </div>
  )
}

export function ScatterChart({
  data,
  xLabel,
  yLabel,
  color,
  dotRadius = 5,
  referenceLines = [],
  title,
  height = 300,
  loading = false,
  error = null,
  className,
}: ScatterChartProps) {
  const isEmpty = !loading && !error && data.length === 0
  const defaultColor = color ?? chartTheme.colors.series[0]

  return (
    <ChartContainer
      title={title}
      height={height}
      loading={loading}
      error={error}
      isEmpty={isEmpty}
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={chartTheme.geometry.margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.ui.grid} />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -8, style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color } } : undefined}
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
            stroke={chartTheme.colors.ui.axis}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color } } : undefined}
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
            stroke={chartTheme.colors.ui.axis}
          />
          <Tooltip content={CustomTooltip} />
          {referenceLines.map((rl, i) =>
            rl.axis === 'x' ? (
              <ReferenceLine
                key={i}
                x={rl.value}
                stroke={rl.color ?? '#6b7280'}
                strokeDasharray="4 4"
                label={{ value: rl.label ?? '', fontSize: 10, fill: '#9ca3af' }}
              />
            ) : (
              <ReferenceLine
                key={i}
                y={rl.value}
                stroke={rl.color ?? '#6b7280'}
                strokeDasharray="4 4"
                label={{ value: rl.label ?? '', fontSize: 10, fill: '#9ca3af' }}
              />
            ),
          )}
          <Scatter
            data={data}
            fill={defaultColor}
            r={dotRadius}
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
