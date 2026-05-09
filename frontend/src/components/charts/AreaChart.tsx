/**
 * AreaChart.tsx — Filled area chart with gradient support, built on Recharts.
 *
 * Supports cumulative mode (stacked areas) and gradient fills.
 */

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { ChartContainer } from './ChartContainer'
import { chartTheme } from '../../lib/chart-theme'
import type { SeriesConfig } from './LineChart'

export interface AreaChartProps {
  data: Record<string, unknown>[]
  xKey: string
  series: SeriesConfig[]
  /** Stack areas (cumulative totals). */
  stacked?: boolean
  xLabel?: string
  yLabel?: string
  title?: string
  height?: number
  loading?: boolean
  error?: Error | string | null
  className?: string
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  const t = chartTheme.typography.tooltip
  const ui = chartTheme.colors.ui.tooltip
  return (
    <div
      style={{
        background: ui.background,
        border: `1px solid ${ui.border}`,
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: t.fontSize,
        color: ui.text,
      }}
    >
      <div style={{ marginBottom: 4, fontSize: t.labelFontSize, color: '#9ca3af' }}>{label}</div>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  )
}

export function AreaChart({
  data,
  xKey,
  series,
  stacked = false,
  xLabel,
  yLabel,
  title,
  height = 300,
  loading = false,
  error = null,
  className,
}: AreaChartProps) {
  const isEmpty = !loading && !error && data.length === 0

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
        <RechartsAreaChart data={data} margin={chartTheme.geometry.margin}>
          <defs>
            {series.map((s, i) => {
              const color = s.color ?? chartTheme.colors.series[i % chartTheme.colors.series.length]
              return (
                <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              )
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.ui.grid} />
          <XAxis
            dataKey={xKey}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -8, style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color } } : undefined}
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
            stroke={chartTheme.colors.ui.axis}
          />
          <YAxis
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color } } : undefined}
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
            stroke={chartTheme.colors.ui.axis}
          />
          <Tooltip content={CustomTooltip} />
          <Legend wrapperStyle={{ fontSize: chartTheme.typography.legend.fontSize, color: chartTheme.typography.legend.color }} />
          {series.map((s, i) => {
            const color = s.color ?? chartTheme.colors.series[i % chartTheme.colors.series.length]
            return (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label}
                stroke={color}
                strokeWidth={chartTheme.geometry.strokeWidth.series}
                fill={`url(#grad-${s.dataKey})`}
                stackId={stacked ? 'stack' : undefined}
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
