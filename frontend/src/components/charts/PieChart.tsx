/**
 * PieChart.tsx — Donut chart with percentage labels, built on Recharts.
 */

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipContentProps } from 'recharts/types/component/Tooltip'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { ChartContainer } from './ChartContainer'
import { chartTheme } from '../../lib/chart-theme'

export interface PieDataItem {
  /** Slice label. */
  name: string
  /** Slice value. */
  value: number
  /** Override color; defaults to chartTheme.colors.series[index]. */
  color?: string
}

export interface PieChartProps {
  data: PieDataItem[]
  /** Inner radius ratio (0 = solid pie, >0 = donut). Default: 55. */
  innerRadius?: number
  /** Outer radius. Default: 80. */
  outerRadius?: number
  title?: string
  height?: number
  loading?: boolean
  error?: Error | string | null
  className?: string
}

function CustomTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const ui = chartTheme.colors.ui.tooltip
  const total = payload.reduce((sum: number, p) => sum + (Number(p.value) || 0), 0) || 1
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
      <div style={{ color: entry.color }}>{entry.name}</div>
      <div>{entry.value} ({((Number(entry.value) || 0) / total * 100).toFixed(1)}%)</div>
    </div>
  )
}

export function PieChart({
  data,
  innerRadius = 55,
  outerRadius = 80,
  title,
  height = 300,
  loading = false,
  error = null,
  className,
}: PieChartProps) {
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
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={entry.color ?? chartTheme.colors.series[i % chartTheme.colors.series.length]}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
          <Legend
            wrapperStyle={{
              fontSize: chartTheme.typography.legend.fontSize,
              color: chartTheme.typography.legend.color,
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
