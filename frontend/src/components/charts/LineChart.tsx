/**
 * LineChart.tsx — Multi-series line chart built on Recharts.
 *
 * Uses chart-theme.ts for all colors and typography — no hardcoded values.
 * All series are synced via syncId so tooltip/brush coordination works across
 * multiple LineChart instances on the same page.
 */

import {
  LineChart as RechartsLineChart,
  Line,
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

export interface SeriesConfig {
  /** Key in the data object for this series' y-values. */
  dataKey: string
  /** Display label in the legend and tooltip. */
  label: string
  /** Override color; defaults to chartTheme.colors.series[index]. */
  color?: string
  /** Whether this series renders as dashed. */
  dashed?: boolean
}

export interface LineChartProps {
  /** Array of data objects. Each must contain `xKey` plus all series dataKeys. */
  data: Record<string, unknown>[]
  /** Key in the data objects used for the X axis. */
  xKey: string
  /** Series definitions (max 8 before palette repeats). */
  series: SeriesConfig[]
  /** X-axis label. */
  xLabel?: string
  /** Y-axis label. */
  yLabel?: string
  /** Chart title. */
  title?: string
  height?: number
  loading?: boolean
  error?: Error | string | null
  /** syncId passed to Recharts for cross-chart tooltip/brush sync. */
  syncId?: string
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
      <div style={{ marginBottom: 4, fontSize: t.labelFontSize, color: '#9ca3af' }}>
        {label}
      </div>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  )
}

export function LineChart({
  data,
  xKey,
  series,
  xLabel,
  yLabel,
  title,
  height = 300,
  loading = false,
  error = null,
  syncId,
  className,
}: LineChartProps) {
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
        <RechartsLineChart
          data={data}
          margin={chartTheme.geometry.margin}
          syncId={syncId}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartTheme.colors.ui.grid}
          />
          <XAxis
            dataKey={xKey}
            label={
              xLabel
                ? {
                    value: xLabel,
                    position: 'insideBottom',
                    offset: -8,
                    style: {
                      fontSize: chartTheme.typography.axisLabel.fontSize,
                      fill: chartTheme.typography.axisLabel.color,
                    },
                  }
                : undefined
            }
            tick={{
              fontSize: chartTheme.typography.axisTick.fontSize,
              fill: chartTheme.typography.axisTick.color,
            }}
            stroke={chartTheme.colors.ui.axis}
          />
          <YAxis
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: {
                      fontSize: chartTheme.typography.axisLabel.fontSize,
                      fill: chartTheme.typography.axisLabel.color,
                    },
                  }
                : undefined
            }
            tick={{
              fontSize: chartTheme.typography.axisTick.fontSize,
              fill: chartTheme.typography.axisTick.color,
            }}
            stroke={chartTheme.colors.ui.axis}
          />
          <Tooltip content={CustomTooltip} />
          <Legend
            wrapperStyle={{
              fontSize: chartTheme.typography.legend.fontSize,
              color: chartTheme.typography.legend.color,
            }}
          />
          {series.map((s, i) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label}
              stroke={s.color ?? chartTheme.colors.series[i % chartTheme.colors.series.length]}
              strokeWidth={chartTheme.geometry.strokeWidth.series}
              strokeDasharray={s.dashed ? '5 5' : undefined}
              dot={{ r: chartTheme.geometry.dotRadius.inactive }}
              activeDot={{ r: chartTheme.geometry.dotRadius.active }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
