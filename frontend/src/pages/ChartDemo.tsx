/**
 * ChartDemo.tsx — Demo page rendering all chart components with mock data.
 *
 * This page exercises every chart type to verify they all render correctly
 * with no console errors. Replace mock data with real API hooks when the
 * backend is ready.
 */

import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import { AreaChart } from '../components/charts/AreaChart'
import { PieChart } from '../components/charts/PieChart'
import { ScatterChart } from '../components/charts/ScatterChart'
import { ShotChart } from '../components/court/ShotChart'
import { GameFlow } from '../components/charts/GameFlow'
import type { GameFlowPoint } from '../components/charts/GameFlow'
import type { ShotAttempt } from '../hooks/useShotData'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const TEAM_SCORING_TREND = [
  { game: 'G1', lakers: 112, celtics: 105 },
  { game: 'G2', lakers: 98,  celtics: 117 },
  { game: 'G3', lakers: 121, celtics: 109 },
  { game: 'G4', lakers: 104, celtics: 115 },
  { game: 'G5', lakers: 118, celtics: 102 },
  { game: 'G6', lakers: 107, celtics: 112 },
  { game: 'G7', lakers: 124, celtics: 116 },
]

const PLAYER_COMPARISON = [
  { player: 'James', ppg: 27.1, rpg: 7.4, apg: 8.3 },
  { player: 'Tatum',  ppg: 26.9, rpg: 8.1, apg: 4.9 },
  { player: 'Davis',  ppg: 24.7, rpg: 12.6, apg: 3.1 },
  { player: 'Brown',  ppg: 22.2, rpg: 5.4, apg: 3.6 },
]

const CUMULATIVE_STATS = [
  { game: 'G1', lakers: 112, celtics: 105 },
  { game: 'G2', lakers: 210, celtics: 222 },
  { game: 'G3', lakers: 331, celtics: 331 },
  { game: 'G4', lakers: 435, celtics: 446 },
  { game: 'G5', lakers: 553, celtics: 548 },
  { game: 'G6', lakers: 660, celtics: 660 },
  { game: 'G7', lakers: 784, celtics: 776 },
]

const SHOT_DISTRIBUTION = [
  { name: 'Paint',       value: 32, color: '#3b82f6' },
  { name: 'Mid-Range',   value: 18, color: '#f97316' },
  { name: 'Corner 3',    value: 14, color: '#22c55e' },
  { name: 'Above Break', value: 29, color: '#a855f7' },
  { name: 'Free Throw',  value: 7,  color: '#eab308' },
]

const EFFICIENCY_VOLUME = Array.from({ length: 30 }, (_, i) => ({
  x: 5 + Math.random() * 20,   // usage rate
  y: 0.45 + Math.random() * 0.25, // TS%
  label: `Player ${i + 1}`,
}))

// Mock game-flow: 4 quarters, score oscillates
const GAME_FLOW_DATA: GameFlowPoint[] = Array.from({ length: 120 }, (_, i) => {
  const t = i * 24  // every 24 seconds
  const period = Math.floor(t / (12 * 60)) + 1
  // Simple sinusoidal differential
  const diff = Math.round(Math.sin(i / 8) * 12 + Math.cos(i / 3) * 5)
  return { timeSeconds: t, differential: diff, period: Math.min(period, 4) }
})

// Mock shots: scattered across half court
function randomShot(i: number): ShotAttempt {
  const angle = (i / 80) * Math.PI
  const dist = 4 + Math.random() * 22
  const x = 25 + dist * Math.cos(angle)
  const y = 4.75 + dist * Math.sin(angle)
  return {
    x: Math.max(0.5, Math.min(49.5, x)),
    y: Math.max(0.5, Math.min(46, y)),
    made: Math.random() > 0.55,
    distance: Math.round(dist),
    period: Math.ceil(Math.random() * 4),
    playerName: ['LeBron', 'Tatum', 'Davis', 'Brown'][Math.floor(Math.random() * 4)],
    zone: dist < 7 ? 'Paint' : dist < 16 ? 'Mid-Range' : 'Three',
  }
}
const MOCK_SHOTS: ShotAttempt[] = Array.from({ length: 80 }, (_, i) => randomShot(i))

// ---------------------------------------------------------------------------
// Demo page
// ---------------------------------------------------------------------------

const sectionStyle: React.CSSProperties = {
  marginBottom: 40,
}

const headingStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: '#e5e7eb',
  marginBottom: 12,
  borderBottom: '1px solid #374151',
  paddingBottom: 8,
}

export function ChartDemo() {
  return (
    <div
      style={{
        padding: '32px 24px',
        maxWidth: 900,
        margin: '0 auto',
        fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
        color: '#f9fafb',
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        NBA Visualizer — Chart Demo
      </h1>
      <p style={{ color: '#9ca3af', marginBottom: 40 }}>
        All chart components rendered with mock data. Replace with live API hooks when backend is ready.
      </p>

      {/* 1. Line chart — team scoring trend */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Team Scoring Trend (Line Chart)</div>
        <LineChart
          title="Points per game — LAL vs BOS"
          data={TEAM_SCORING_TREND}
          xKey="game"
          series={[
            { dataKey: 'lakers', label: 'Lakers' },
            { dataKey: 'celtics', label: 'Celtics' },
          ]}
          yLabel="Points"
          height={260}
        />
      </div>

      {/* 2. Bar chart — player comparison */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Player Stat Comparison (Bar Chart)</div>
        <BarChart
          title="PPG · RPG · APG"
          data={PLAYER_COMPARISON}
          xKey="player"
          series={[
            { dataKey: 'ppg', label: 'PPG' },
            { dataKey: 'rpg', label: 'RPG' },
            { dataKey: 'apg', label: 'APG' },
          ]}
          mode="grouped"
          height={260}
        />
      </div>

      {/* 3. Area chart — cumulative points */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Cumulative Series Points (Area Chart)</div>
        <AreaChart
          title="Total points across 7 games"
          data={CUMULATIVE_STATS}
          xKey="game"
          series={[
            { dataKey: 'lakers', label: 'Lakers' },
            { dataKey: 'celtics', label: 'Celtics' },
          ]}
          stacked={false}
          height={240}
        />
      </div>

      {/* 4. Pie chart — shot distribution */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Shot Distribution (Donut Chart)</div>
        <PieChart
          title="Shot zone breakdown"
          data={SHOT_DISTRIBUTION}
          height={280}
        />
      </div>

      {/* 5. Scatter chart — efficiency vs volume */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Efficiency vs Volume (Scatter Chart)</div>
        <ScatterChart
          title="True Shooting % vs Usage Rate"
          data={EFFICIENCY_VOLUME}
          xLabel="Usage Rate %"
          yLabel="TS%"
          referenceLines={[
            { axis: 'y', value: 0.565, label: 'Lg Avg', color: '#6b7280' },
            { axis: 'x', value: 20, label: 'Avg Usage', color: '#6b7280' },
          ]}
          height={280}
        />
      </div>

      {/* 6. Shot chart — scatter mode */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Shot Chart — Scatter Mode</div>
        <ShotChart
          title="Shot attempts (scatter)"
          shots={MOCK_SHOTS}
          mode="scatter"
          width={500}
          height={470}
        />
      </div>

      {/* 7. Shot chart — hexbin mode */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Shot Chart — Hexbin Mode (FG% encoded)</div>
        <ShotChart
          title="Shot attempts (hexbin FG%)"
          shots={MOCK_SHOTS}
          mode="hexbin"
          width={500}
          height={470}
        />
      </div>

      {/* 8. Game-flow timeline */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Game-Flow Timeline</div>
        <GameFlow
          title="Score differential — LAL vs BOS"
          data={GAME_FLOW_DATA}
          homeTeam="LAL"
          awayTeam="BOS"
          width={820}
          height={220}
        />
      </div>
    </div>
  )
}
