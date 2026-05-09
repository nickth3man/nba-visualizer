/**
 * chart-theme.ts — Single source of truth for all chart styling.
 *
 * Usage with Recharts:
 *   stroke={chartTheme.colors.series[0]}
 *   style={{ fontSize: chartTheme.typography.axisLabel.fontSize }}
 *
 * Usage with D3 inline styles:
 *   .attr('fill', chartTheme.colors.shot.make)
 *   .attr('stroke', chartTheme.colors.court.lines)
 */

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

/** Team/series palette — up to 8 series per chart. */
const SERIES_COLORS = [
  '#3b82f6', // blue-500   — primary series
  '#f97316', // orange-500 — secondary series
  '#22c55e', // green-500  — third series
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
  '#6366f1', // indigo-500
] as const

const COLORS = {
  /** Ordered series colors — assign by index for consistent multi-series charts. */
  series: SERIES_COLORS,

  /** Home and away team color aliases. */
  team: {
    home: SERIES_COLORS[0],
    away: SERIES_COLORS[1],
  },

  /** Shot chart make/miss encoding. */
  shot: {
    make: '#22c55e',  // green-500
    miss: '#ef4444',  // red-500
    neutral: '#6b7280', // gray-500 — for hexbin fill when FG% unknown
  },

  /** Hexbin FG% color scale anchors (interpolated by D3 scaleSequential). */
  hexbin: {
    low: '#1e3a5f',   // low FG% — dark blue
    mid: '#6b7280',   // league average
    high: '#f97316',  // high FG% — orange (hot)
  },

  /** NBA court markings. */
  court: {
    floor: '#f5e6c8',  // hardwood tan
    lines: '#c8a96a',  // darker tan for court lines
    paint: '#dce3f0',  // light blue paint area
    restrictedArea: '#e5e7eb',
    threePointArc: '#c8a96a',
  },

  /** Score differential chart (game-flow). */
  lead: {
    home: '#3b82f6',    // home team leading — blue
    away: '#f97316',    // away team leading — orange
    tied: '#6b7280',
  },

  /** Chart chrome. */
  ui: {
    grid: '#374151',       // gray-700 — subtle gridlines on dark bg
    axis: '#6b7280',       // gray-500
    tooltip: {
      background: '#1f2937', // gray-800
      border: '#374151',
      text: '#f9fafb',
    },
    background: 'transparent',
    emptyState: '#4b5563',  // gray-600
  },
} as const

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

const TYPOGRAPHY = {
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",

  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f9fafb', // gray-50
  },

  axisLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9ca3af', // gray-400
  },

  axisTick: {
    fontSize: 10,
    color: '#6b7280', // gray-500
  },

  legend: {
    fontSize: 12,
    color: '#d1d5db', // gray-300
  },

  tooltip: {
    fontSize: 12,
    labelFontSize: 11,
    color: '#f9fafb',
  },

  annotation: {
    fontSize: 10,
    color: '#9ca3af',
  },
} as const

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

const GEOMETRY = {
  /** Default chart margins (pixels). Match Recharts `margin` prop shape. */
  margin: {
    top: 16,
    right: 24,
    bottom: 32,
    left: 48,
  },

  strokeWidth: {
    series: 2,
    referenceLine: 1,
    courtLines: 1.5,
    axisLine: 1,
    dot: 1.5,
  },

  dotRadius: {
    inactive: 3,
    active: 5,
  },

  barRadius: 2,

  /** Default hexbin bin radius (feet, scaled by court SVG scale factor). */
  hexbinRadius: 0.75,
} as const

// ---------------------------------------------------------------------------
// Exported theme object
// ---------------------------------------------------------------------------

export const chartTheme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  geometry: GEOMETRY,
} as const

export type ChartTheme = typeof chartTheme

/**
 * Convenience accessor — returns the complete theme object.
 * Allows future dynamic theming (e.g., light/dark switching) without
 * changing the call sites.
 */
export function getChartTheme(): ChartTheme {
  return chartTheme
}
