/**
 * BarChart.tsx — Grouped or stacked bar chart built on Recharts.
 *
 * Supports horizontal and vertical orientations and optional value labels.
 */

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { ChartContainer } from './ChartContainer'
import { chartTheme } from '../../lib/chart-theme'
import type { SeriesConfig } from './LineChart'

export interface BarChartProps {
  data: Record<string, unknown>[]
  xKey: string
  series: SeriesConfig[]
  /** 'grouped' (default) or 'stacked'. */
  mode?: 'grouped' | 'stacked'
  /** 'vertical' (default) or 'horizontal'. */
  orientation?: 'vertical' | 'horizontal'
  /** Show value labels on bars. */
  showLabels?: boolean
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

export function BarChart({
  data,
  xKey,
  series,
  mode = 'grouped',
  orientation = 'vertical',
  showLabels = false,
  xLabel,
  yLabel,
  title,
  height = 300,
  loading = false,
  error = null,
  className,
}: BarChartProps) {
  const isEmpty = !loading && !error && data.length === 0
  const isHorizontal = orientation === 'horizontal'

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
        <RechartsBarChart
          data={data}
          layout={isHorizontal ? 'vertical' : 'horizontal'}
          margin={chartTheme.geometry.margin}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartTheme.colors.ui.grid}
            horizontal={!isHorizontal}
            vertical={isHorizontal}
          />
          <XAxis
            type={isHorizontal ? 'number' : 'category'}
            dataKey={isHorizontal ? undefined : xKey}
            label={
              xLabel
                ? {
                    value: xLabel,
                    position: 'insideBottom',
                    offset: -8,
                    style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color },
                  }
                : undefined
            }
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
            stroke={chartTheme.colors.ui.axis}
          />
          <YAxis
            type={isHorizontal ? 'category' : 'number'}
            dataKey={isHorizontal ? xKey : undefined}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: chartTheme.typography.axisLabel.fontSize, fill: chartTheme.typography.axisLabel.color },
                  }
                : undefined
            }
            tick={{ fontSize: chartTheme.typography.axisTick.fontSize, fill: chartTheme.typography.axisTick.color }}
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
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.label}
              fill={s.color ?? chartTheme.colors.series[i % chartTheme.colors.series.length]}
              stackId={mode === 'stacked' ? 'stack' : undefined}
              radius={mode === 'grouped' ? [chartTheme.geometry.barRadius, chartTheme.geometry.barRadius, 0, 0] : undefined}
            >
              {showLabels && <LabelList dataKey={s.dataKey} position="top" style={{ fontSize: 10, fill: chartTheme.typography.axisTick.color }} />}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
