# Frontend Charting Strategy - Research Findings

## Task Understanding
- **Refined description**: Evaluate React charting library options to resolve the deferred frontend charting strategy from the initial architecture research. Determine which library (or combination) will handle standard dashboard charts (line, bar, area, pie, scatter) alongside the already-chosen D3 for bespoke basketball visuals (court drawings, shot charts, hexbin plots, play-by-play timelines).
- **In scope**: React-compatible charting libraries, rendering performance, bundle size, TypeScript support, NBA-specific visualization patterns, D3 integration strategy, TanStack Query compatibility.
- **Out of scope**: Backend data layer, ETL, deployment, non-React frameworks, 3D rendering, mobile (React Native).
- **Success criteria**: A clear recommended library (or two-layer approach) with justification, code examples, and documented trade-offs so planning can define exact packages without further research.
- **Verification needed**: The recommendation must be verifiable by code examples, npm trends, and community health signals.

## Codebase Context
- **Relevant files**: `.agents/tasks/initial-architecture/1-research/findings.md` (lines 213-214, 298: already recommends D3 for court/spatial views, React chart helpers for routine charts), `.agents/pipeline-state.json` (task list), `state.json` (this task's definition).
- **Existing patterns**: The initial architecture research references several React + D3 NBA projects: `tingkaiwu/nba-shot-visualization` (React + D3 + Styled Components), `MoonSulong/NBAVis` (React + D3 + Ant Design + d3-shotchart), `ebaek/NBAShotTracker` (D3 hexbin shot charts), `michaelmirandi/shotchart.d3.ts` (TypeScript React + D3 shot chart library).
- **Closest reference**: `mitchelldawkinsjr/NBA-Stat-Spot` — FastAPI + React 19 + Vite + TanStack Query + **Recharts** + Tailwind + Docker. This is the most current and architecturally similar reference project.
- **Frontend directory**: `/frontend/` does not exist yet (greenfield).
- **Constraints**: The initial architecture recommends a read-only API with filter-driven, paginated, cacheable endpoints using TanStack Query. Chart library must work with this data-fetching pattern.

## Raw Data Manifest Check
- **Manifest checked**: No — this research task does not depend on local raw data.
- **Relevance**: Charting library choice is independent of raw data format. Raw data awareness matters for planning (API shape) but not for library evaluation.

## External Research

### Library Landscape Summary (2026)

| Library | Weekly Downloads | Rendering | Bundle Size | Chart Types | React-Native API | TypeScript | Best For |
|---|---|---|---|---|---|---|---|
| **Recharts** | ~1.8M | SVG | ~370KB | 10+ | JSX components | Good (v2.5+) | Standard dashboards, shadcn/ui integration |
| **Nivo** | ~450K | SVG + Canvas + HTML | Modular (~40KB core) | 30+ | Props-based | Excellent | Beautiful defaults, accessibility, specialized charts |
| **Visx** (Airbnb) | ~300K | SVG (D3) | Modular (~12KB core) | Unlimited (primitives) | Component primitives | Excellent (TypeScript-first) | Custom visualizations, maximum control |
| **Chart.js** (react-chartjs-2) | ~4.1M / ~1.6M | Canvas | ~65KB | 30+ | Config objects | Good (v3+) | Large datasets, non-React codebase migration |
| **ECharts for React** | ~500K | Canvas + SVG | ~300KB+ | 50+ | Config objects | Good | Massive datasets (100K+), 3D, maps |
| **Victory** | ~270K | SVG | ~1.16MB | 15+ | JSX components | Good | Cross-platform (React Native) |
| **Observable Plot** | ~200K | SVG | ~50KB | Mark-based | useRef/useEffect | Good | Quick exploratory viz, concise API |
| **React Vis** (Uber) | ~1.2M (legacy) | SVG + Canvas | ~2.18MB | 20+ | JSX components | Fair | Archived 2022 — **not recommended** |

### Library Deep Dives

#### Recharts
- **Strengths**: React-first declarative JSX API; composable components (`<LineChart>`, `<Bar>`, `<Tooltip>`, `<Legend>`); responsive via `ResponsiveContainer`; uses lightweight D3 submodules; shadcn/ui charts module is built on Recharts; solid TypeScript types; large community (24.8K GitHub stars, 2026).
- **Weaknesses**: SVG-only means slow for >5K data points (each point becomes a DOM node); monolith bundle (~370KB); animation customization limited; complex composited charts get verbose.
- **NBA relevance**: Used by NBA-Stat-Spot (the closest reference project). Good for team trend lines, player comparison bars, season stat pies, and scatter plots with <5K points.
- **Code example** (line chart with tooltip):
  ```tsx
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  const data = [
    { month: 'Oct', recharts: 1400, nivo: 280 },
    { month: 'Nov', recharts: 1500, nivo: 310 },
  ];

  function DownloadChart() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="recharts" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="nivo" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  ```

#### Nivo
- **Strengths**: Multi-renderer (SVG, Canvas, HTML); Canvas variants (`ResponsiveLineCanvas`, `ResponsiveBarCanvas`) handle 10K+ points; beautiful defaults out of the box; spring-based animations via react-spring; WCAG 2.1 AA accessibility built-in (ARIA labels, keyboard nav); 30+ chart types including specialized ones (Sankey, HeatMap, Chord, Waffle, SwarmPlot); interactive playground at nivo.rocks; server-side rendering; SVG patterns and gradients via `defs` prop.
- **Weaknesses**: Per-chart packages (`@nivo/line`, `@nivo/bar`, etc.) add up in bundle; config-heavy (more props than Recharts); less low-level control than Visx; smaller community than Recharts (13.5K stars).
- **NBA relevance**: Canvas mode for large play-by-play or shot datasets; Sankey diagrams for player movement; HeatMap for shot efficiency zones; built-in accessibility is valuable for a data-heavy dashboard.
- **Code example** (responsive line chart):
  ```tsx
  import { ResponsiveLine } from '@nivo/line';

  const nivoData = [{
    id: "Team A",
    color: "hsl(248, 70%, 50%)",
    data: [{ x: "Oct", y: 1400 }, { x: "Nov", y: 1500 }],
  }];

  function NivoChart() {
    return (
      <div style={{ height: 300 }}>
        <ResponsiveLine
          data={nivoData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          curve="cardinal"
          axisBottom={{ legend: 'Month', legendOffset: 36 }}
          axisLeft={{ legend: 'Value', legendOffset: -40 }}
          useMesh={true}
        />
      </div>
    );
  }
  ```
- **Canvas variant** for large datasets:
  ```tsx
  import { ResponsiveLineCanvas } from '@nivo/line';
  // Same API, renders via Canvas for 10K+ data points
  ```

#### Visx (Airbnb)
- **Strengths**: D3 primitives as React components — use D3's math and React's DOM; modular architecture (install only what you need: `@visx/shape`, `@visx/scale`, `@visx/axis`, etc.); TypeScript-first; ~19.9K GitHub stars; active Airbnb maintenance; maximum customization; `@visx/xychart` provides higher-level Cartesian charts when needed; integrates with react-spring for animations.
- **Weaknesses**: Steep learning curve — teams without D3 experience take 2-3x longer; no pre-built chart types (you compose everything); requires manual scale, axis, and layout configuration; tooltip setup is manual.
- **NBA relevance**: Best for custom court drawings, shot charts, and play-by-play timelines that need pixel-perfect control. Can replace raw D3 for components that need React integration while keeping D3 math.
- **XYChart example** (higher-level API when needed):
  ```tsx
  import { AnimatedAxis, AnimatedGrid, AnimatedLineSeries, XYChart, Tooltip } from '@visx/xychart';

  const accessors = { xAccessor: (d) => d.x, yAccessor: (d) => d.y };

  <XYChart height={300} xScale={{ type: 'band' }} yScale={{ type: 'linear' }}>
    <AnimatedAxis orientation="bottom" />
    <AnimatedGrid columns={false} numTicks={4} />
    <AnimatedLineSeries dataKey="Line 1" data={data1} {...accessors} />
    <Tooltip snapTooltipToDatumX snapTooltipToDatumY showVerticalCrosshair showSeriesGlyphs />
  </XYChart>
  ```

#### D3.js (standalone)
- **Strengths**: Maximum control; ideal for basketball court geometry, hexbin spatial analysis, custom game-flow timelines; extensive ecosystem of spatial modules (d3-hexbin, d3-contour, d3-geo-like projections); every NBA shot chart reference project uses D3.
- **Weaknesses**: No built-in React integration; DOM manipulation model (selections, enter/update/exit) conflicts with React's virtual DOM; requires careful ref/useEffect management.
- **D3 + React Integration patterns** (from D3 docs, 2026):
  1. **Declarative (preferred)**: Use D3 modules that don't touch the DOM (d3-scale, d3-shape, d3-array) directly in JSX — compute SVG props with D3 math, render with React.
  2. **Imperative (for axes/transitions)**: Use `useRef` + `useEffect` to attach D3 axis generators or transitions to SVG groups React owns.
  3. **Hybrid**: React owns the SVG, D3 handles axis rendering and complex transitions in isolated `useEffect` blocks.
- **Code example** (declarative D3 in React):
  ```tsx
  import * as d3 from "d3";

  function LinePlot({ data, width = 640, height = 400 }) {
    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data), [height - marginBottom, marginTop]);
    const line = d3.line((d, i) => x(i), y);
    return (
      <svg width={width} height={height}>
        <path fill="none" stroke="currentColor" strokeWidth="1.5" d={line(data)} />
        <g fill="white" stroke="currentColor">
          {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />)}
        </g>
      </svg>
    );
  }
  ```

#### ECharts for React
- **Strengths**: Handles 100K+ data points; progressive rendering for millions of points; 50+ chart types; 3D and GL extensions; dual Canvas/SVG rendering; `dataZoom` for interactive range selection; `visualMap` for multi-dimensional mapping; TypeScript definitions.
- **Weaknesses**: Configuration-heavy API (not React-idiomatic); large bundle; steeper learning curve; less natural integration with React state patterns.
- **NBA relevance**: Could handle play-by-play event volume and odds time-series at scale, but the config-heavy API is less aligned with the React-first stack.

#### Chart.js (react-chartjs-2)
- **Strengths**: Canvas rendering handles 100K+ points at 60fps; tree-shakable v4; plugin ecosystem (zoom, annotation, financial); 30+ chart types; largest community (67K+ GitHub stars).
- **Weaknesses**: Configuration-object API (not JSX); less React-idiomatic; TypeScript types require separate handling; animation on data updates requires careful ref management.
- **NBA relevance**: Best raw performance for large datasets, but the configuration-based API is less natural in a React codebase.

### Rejected Libraries
- **React Vis** (Uber): Archived in late 2022. No updates. Not recommended for new projects.
- **Victory**: Large bundle (~1.16MB). SVG-only performance ceiling. Cross-platform features (React Native) provide no value for this web-only project.
- **Observable Plot**: Excellent for quick exploratory viz but lacks the interactive dashboard capabilities (custom tooltips, brush selection, synchronized charts) needed for a production NBA dashboard.

### Five More Obscure Libraries (Firecrawl Agent Round 2)

These five libraries were discovered by the Firecrawl autonomous research agent and are rarely covered in mainstream comparisons but offer unique capabilities for an NBA dashboard.

---

#### 1. Tremor (acquired by Vercel, January 2025)

- **URL**: https://tremor.so | **npm**: `@tremor/react`
- **Rendering**: SVG (built on Recharts) | **Bundle**: ~200KB (Recharts core)
- **License**: MIT (since Vercel acquisition) | **Latest release**: Active 2026

**What makes it unique**: Tremor is the **only purpose-built dashboard component library** for React. It ships 35+ dashboard-specific components (KPI cards, charts, tables, inputs, tabs, layouts) as copy-paste blocks, all built on Recharts + Tailwind CSS + Radix UI. Acquired by Vercel in January 2025 and now MIT-licensed and free, it is being integrated into Vercel's v0 AI design tool.

**Pros**:
- 300+ copy-paste dashboard blocks — fastest path to a working dashboard
- Built on Recharts under the hood — familiar API, inherits Recharts ecosystem
- Native Tailwind CSS integration — dark mode via `dark:` variants
- Modular and accessible by design (Radix UI accessibility primitives)
- Backed by Vercel with active development
- KPI cards, area charts, bar charts, scatter plots, donut charts all pre-built
- Works naturally with TanStack Query (pass data as props)

**Cons**:
- Inherits Recharts' SVG performance ceiling (<5K data points)
- Opinionated component API — customizing beyond the block API requires Recharts knowledge
- Relatively new ecosystem (acquired 2025, still maturing)
- May be overkill if only charts are needed (it is a full dashboard framework)
- Dependencies: Recharts, Tailwind, Radix UI, date-fns, numeral

**NBA relevance**: Excellent for rapid dashboard development with the planned tech stack (React 19 + Vite + TanStack Query + Tailwind). Pre-built KPI cards for team stats, trend charts for performance comparisons, layout components for multi-chart dashboards. The Recharts foundation means a gradual escape hatch exists — start with Tremor blocks, then customize with raw Recharts when needed.

**Code example**:
```tsx
import { Card, AreaChart, Title } from "@tremor/react";

const chartdata = [
  { date: "Jan 22", "SemiAnalysis": 2890, "The Pragmatic Engineer": 2338 },
  { date: "Feb 22", "SemiAnalysis": 2756, "The Pragmatic Engineer": 2103 },
];

export default function Example() {
  return (
    <Card>
      <Title>Newsletter revenue over time (USD)</Title>
      <AreaChart data={chartdata} index="date"
        categories={["SemiAnalysis", "The Pragmatic Engineer"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}
```

---

#### 2. uPlot

- **URL**: https://github.com/leeoniya/uPlot | **npm**: `uplot` | **React wrapper**: `uplot-react` (community)
- **Rendering**: HTML Canvas 2D | **Bundle**: ~50KB minified
- **License**: MIT | **Latest release**: v1.6.x (active 2026)

**What makes it unique**: uPlot is a hyper-optimized time-series charting library. It benchmarks at **166,650 data points rendered in 25ms** and ~100,000 points per millisecond processing speed. It achieves this through raw Canvas 2D drawing without any abstraction layers. It is purpose-built for high-frequency, continuously updating time-series data — exactly the shape of betting odds movement and play-by-play event streams.

**Pros**:
- Extreme performance — handles 100K+ data points at 60fps streaming
- Tiny bundle (~50KB) — the smallest full-featured charting library
- Live-streaming data support with efficient append/render cycle
- Works with any framework via a thin React wrapper (`uplot-react`)
- Memory-efficient — designed for long-running real-time dashboards
- Free and open source (MIT)
- Time zone support and date/time axis scaling

**Cons**:
- Canvas-only — no SVG accessibility (no per-element ARIA, no CSS styling)
- Minimal default styling — must configure axis colors, grid lines, tooltips manually
- Lower-level API than Recharts/Nivo — more setup code required
- Community React wrappers (`uplot-react`) are third-party, not official
- Only supports XY chart types (line, area, bar, scatter, candlestick) — no pie, radar, heatmap
- No built-in responsive container

**NBA relevance**: Best library for betting odds tracking views. An odds-movement timeline spanning a full season with 30,000+ data points renders at 60fps. Play-by-play event timelines at the game level. Live score progression with per-second updates. Any view where time-series data volume exceeds 5K points per chart.

---

#### 3. Highcharts React

- **URL**: https://github.com/highcharts/highcharts-react | **npm**: `highcharts-react-official`
- **Rendering**: SVG (Canvas fallback available) | **Bundle**: ~300KB per module
- **License**: Commercial (free for non-commercial/personal use) | **Latest release**: Active 2026

**What makes it unique**: Highcharts is the **only charting library with WCAG 2.2 Level AA compliance** out of the box. Its dedicated Accessibility module provides automatic alt-text generation, keyboard navigation, screen reader support (NVDA, JAWS, VoiceOver), and sonification (audio representation of data). It has been the gold standard for accessible data visualization for over a decade and now has an official React wrapper.

**Pros**:
- WCAG 2.2 AA accessibility — required for government/public sector dashboards
- Automatic alt-text generation for charts — no manual ARIA work
- Keyboard navigation of chart elements without coding
- Sonification module — data as audio for visually impaired users
- High contrast mode and pattern fill for color-blind users
- 40+ chart types including specialized ones (waterfall, funnel, heatmap, gantt)
- Export to PNG/JPEG/PDF/SVG/CSV/XLS built in
- Drill-down support for hierarchical data exploration
- Annotations module for adding contextual markers
- Internationalization with RTL support

**Cons**:
- Commercial license required for most use cases (free for non-commercial)
- Large bundle (need to load chart-specific modules)
- Configuration-object API, not JSX — less React-idiomatic
- Official React wrapper is a thin bridge, not a React-native experience
- Older API patterns — feels like a jQuery-era library adapted to React

**NBA relevance**: If the dashboard needs to be publicly accessible (ADA compliance, gov/edu use), Highcharts is the only choice that meets WCAG 2.2 AA without extensive custom work. The drill-down could power game → quarter → play-level exploration. The annotations could mark significant game events on timelines. Export for sharing charts as images/PDFs.

---

#### 4. MUI X Charts

- **URL**: https://mui.com/x/react-charts/ | **npm**: `@mui/x-charts`
- **Rendering**: SVG | **Bundle**: ~200KB core
- **License**: MIT (core), commercial for advanced features | **Latest release**: Active 2026

**What makes it unique**: MUI X Charts is the **only design-system-native charting library** — charts automatically inherit MUI's theme, palette, typography, spacing, and dark mode. If the project already uses Material UI, charts look consistent with zero theming effort. It is built by the same team behind MUI (formerly Material UI), the most popular React component library.

**Pros**:
- Automatic dark mode via MUI ThemeProvider — no per-chart theme config
- Inherits MUI's color palette, typography, and spacing system
- Consistent look with MUI data grid, selects, and inputs
- Responsive by default (no ResponsiveContainer wrapper needed)
- Strong TypeScript types (MUI team is TypeScript-first)
- Good for teams already invested in the MUI ecosystem
- Server-side rendering support
- Accessible via MUI's accessibility framework

**Cons**:
- Requires MUI dependency (Material UI v5+)
- Locked to Material Design aesthetic
- Smaller chart type selection than Recharts (~10: line, bar, pie, scatter, sparkline)
- SVG-only (performance ceiling for large datasets)
- Newer library — less community content than Recharts/Nivo
- Material Design may not fit a basketball-themed visual identity

**NBA relevance**: Only worth considering if the project already uses MUI for UI components (buttons, selects, data grids). The automatic dark mode is genuinely useful for a sports dashboard that users might view in dimly-lit settings. The MUI data grid integration for stats tables alongside charts is a compelling data-centric pattern.

---

#### 5. AG Charts (from AG Grid)

- **URL**: https://github.com/ag-grid/ag-charts | **npm**: `ag-charts-react`
- **Rendering**: HTML Canvas | **Bundle**: ~250KB
- **License**: MIT (community), commercial for enterprise features | **Latest release**: Active 2026

**What makes it unique**: AG Charts is the standalone charting library from the AG Grid team (the most popular JavaScript data grid). It offers **native cross-filtering between data grid and charts** — click a chart element to filter the grid, select rows in the grid to highlight chart series. This is a genuinely unique capability not available in any other charting library. It also achieves WCAG 2.0 Level AA compliance with full keyboard navigation and screen reader support.

**Pros**:
- Cross-filtering between charts and AG Grid data tables — unique capability
- Full keyboard navigation (Tab, Arrow, Page Up/Down, Home/End)
- Screen reader support (NVDA, JAWS, VoiceOver, Windows Narrator)
- WCAG 2.0 Level AA compliance — second-best after Highcharts
- 30+ chart types including financial, maps, radial, waterfall, heatmap
- High-performance Canvas rendering
- Framework-agnostic (React, Angular, Vue, vanilla JS)
- Real-time data updates supported
- Built-in zoom, pan, and tooltip interactivity
- Free community edition covers all standard chart types

**Cons**:
- Canvas rendering means no CSS styling per element
- Accessibility is good but falls short of Highcharts' WCAG 2.2
- Newer standalone library — smaller community and fewer tutorials
- Enterprise features (annotations, advanced maps, financial charts) require commercial license
- Chart-to-chart coordination (without the grid) is less mature than ECharts' `connect()`
- Larger bundle than Chart.js or uPlot

**NBA relevance**: The grid+chart cross-filtering pattern is genuinely useful for an NBA dashboard. Click a bar in a team-standing chart to filter the player-stats table to that team's roster. Select players in a stats grid to highlight them in a scatter chart. The accessibility features are good enough for most use cases. The maps module could show team geography without needing a separate mapping library.

---

### Firecrawl Agent Round 2 - Summary Table

| Library | Stars | Rendering | License | Killer Feature | NBA Best Fit |
|---|---|---|---|---|---|
| **Tremor** | 18K+ | SVG (Recharts) | MIT | Dashboard-first React blocks with Tailwind | Rapid dashboard prototyping, KPI cards, standard charts |
| **uPlot** | 9K+ | Canvas 2D | MIT | 166K points in 25ms, ~50KB bundle | Live odds timelines, play-by-play event streams |
| **Highcharts React** | 12K+ | SVG | Commercial | WCAG 2.2 AA accessibility, sonification | Public-facing accessible dashboards |
| **MUI X Charts** | N/A (MUI: 95K+) | SVG | MIT | Auto dark mode via MUI ThemeProvider | MUI-based projects, dark mode UIs |
| **AG Charts** | 1K+ | Canvas | MIT / Commercial | Cross-filtering with AG Grid data tables | Data-grid + chart interactive dashboards |

**Agent's key warnings**:
- **TanStack React Charts is DEPRECATED** as of March 2025 — do not use (superseded by TanStack Start's visualization primitives)
- **React Vis (Uber) is archived** since 2022 — avoid
- **d3.basketball-shot-chart** is unmaintained since 2015 — use D3/Visx instead

**Agent's architecture recommendation**: Combine specialized tools — Tremor for standard dashboard components, ECharts for coordinated multi-chart views, uPlot for real-time time-series, Visx for custom shot charts, Nivo for geographic maps. Lazy-load chart components by route to manage bundle size.

**Agent's TBU stack-specific recommendation**: **Tremor** is the highest-confidence fit for React 19 + Vite + TanStack Query + Tailwind, being built on exactly that stack. Start with Tremor blocks, customize with raw Recharts/D3 when Tremor's opinionated API limits flexibility.

### D3 + React Integration: Two-Layer Approach

The consistent finding across all research is that **no single library** is ideal for both standard dashboard charts and custom basketball spatial visualizations. The evidence supports a two-layer strategy:

| Layer | Library | Use Cases |
|---|---|---|
| **Standard dashboard charts** | Recharts or Nivo | Line charts (trends), bar charts (comparisons), area charts (cumulative), pie/donut (distributions), scatter plots (<5K points), radar charts |
| **Custom basketball visuals** | D3 (+ optionally Visx) | Basketball court SVG, shot chart (scatter), shot density (hexbin), game-flow timeline, play-by-play event visualizations, player movement diagrams |

Both layers integrate with TanStack Query for data fetching — charts receive API data as props, and query keys determine cache/refetch behavior.

### NBA-Specific Visualization References

1. **tingkaiwu/nba-shot-visualization** (React + D3 + Styled Components)
   - URL: https://github.com/tingkaiwu/nba-shot-visualization
   - Player profile view, autocomplete search, four filters, hexbin and scatter themes.
   - Confirms D3 is the right tool for shot charts.

2. **ebaek/NBAShotTracker** (D3 hexbin shot tracker)
   - URL: https://github.com/ebaek/NBAShotTracker
   - Hexagonal binning, player/game/quarter filters, season breakdown pies, debounced search.
   - Confirms hexbin approach for shot density visualization.

3. **CodeSandbox: d3-nba-hex-chart**
   - URL: https://codesandbox.io/s/d3-nba-hex-chart-i9pwh
   - Working D3 + React + NBA hex chart example.

4. **michaelmirandi/shotchart.d3.ts**
   - URL: https://github.com/michaelmirandi/shotchart.d3.ts
   - TypeScript React + D3 shot chart library with Halfcourt/ZonedShotchart components.
   - Concept reference only — last updated 2023, do not adopt as dependency.

5. **d3-shotchart** (npm package)
   - A D3 plugin for basketball shot charts.
   - May be useful as a reference for court geometry and coordinate conventions.

### Performance Benchmarks (from 2026 comparison articles)

- **<1,000 data points**: All libraries perform at 60fps — choice is purely about API preference.
- **1,000–5,000 points**: SVG libraries (Recharts, Nivo SVG) are fine. Recharts may show slowdown near 5K.
- **5,000–50,000 points**: Canvas libraries (Nivo Canvas, Chart.js, ECharts) are needed. SVG becomes sluggish as DOM nodes multiply.
- **50,000+ points**: Chart.js or ECharts Canvas. D3 with canvas rendering or WebGL.

**For this project**: Team season stats and player stats will be <1,000 points per chart. Play-by-play events and shot data could exceed 10K points per view — Canvas rendering or server-side aggregation will be needed.

### Community and Ecosystem (2026)

- **Recharts**: 24.8K GitHub stars, 1.8M weekly npm downloads, shadcn/ui integration, active maintenance, v3 released with React 18/19 support.
- **Nivo**: 13.5K GitHub stars, ~450K weekly downloads, modular package ecosystem, interactive playground at nivo.rocks.
- **Visx**: 19.9K GitHub stars, ~300K weekly downloads (per package), active Airbnb maintenance, D3 knowledge transfers.
- **D3**: 109K GitHub stars, 10M+ weekly downloads, gold standard for custom visualization.
- **TanStack Query**: 50K+ GitHub stars, dominant React server-state library.
- **Tremor**: 18K+ GitHub stars, acquired by Vercel Jan 2025, now MIT licensed, built on Recharts + Tailwind + Radix UI.
- **uPlot**: 9K+ GitHub stars, fastest Canvas 2D time-series library (166K points in 25ms), ~50KB bundle.
- **Highcharts**: 12K+ GitHub stars, WCAG 2.2 AA accessible, commercial license, 40+ chart types.
- **MUI X Charts**: Part of MUI ecosystem (95K+ stars), auto dark mode via ThemeProvider.
- **AG Charts**: 1K+ stars, Canvas-based, WCAG 2.0 AA, cross-filtering with AG Grid.

## Source Ledger

| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| Recharts is the most popular React charting library with 1.8M weekly downloads, declarative JSX API, and 370KB bundle | PkgPulse: Recharts vs Chart.js vs Nivo vs Visx 2026 | https://www.pkgpulse.com/blog/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026 | 2026-05-08 | 2026-03-09 | Comprehensive 2026 comparison with code examples, performance data, and community metrics |
| Recharts uses D3 submodules, supports composable React components, handles 1K-5K points in SVG | Querio: 8 Top React Chart Libraries 2026 | https://querio.ai/articles/top-react-chart-libraries-data-visualization | 2026-05-08 | 2026-02-19 | Detailed comparison of 8 libraries with rendering engine and dataset capacity |
| Nivo provides SVG, Canvas, and HTML rendering with spring animations, WCAG accessibility, and 30+ chart types | DeepWiki: plouc/nivo | https://deepwiki.com/plouc/nivo | 2026-05-08 | 2026-05-08 | Repository architecture analysis covering rendering strategies, component patterns, interactivity |
| Nivo Canvas variants handle large datasets with same API as SVG | Nivo Rendering Strategies (DeepWiki) | https://deepwiki.com/search/what-are-the-key-advantages-of_eaf0ba1d-cd13-469e-8c75-06da5a0c5ac7 | 2026-05-08 | 2026-05-08 | Canvas vs SVG vs HTML tradeoffs, per-element interactivity, SSR support |
| Visx blends D3 math with React rendering, provides primitives and higher-level XYChart | DeepWiki: airbnb/visx | https://deepwiki.com/search/how-does-visx-integrate-with-d_dd760936-5d98-4436-8787-49b7c667a816 | 2026-05-08 | 2026-05-08 | XYChart architecture, context system, primitives vs high-level comparison |
| Recharts handles large datasets via dataStartIndex/dataEndIndex, recommends data simplification for 50K+ points | DeepWiki: recharts/recharts | https://deepwiki.com/search/how-does-recharts-handle-large_c990577b-7a7f-48c4-9f8a-16389de4008d | 2026-05-08 | 2026-05-08 | Performance optimization patterns, component isolation, stable references |
| D3 can be used declaratively in React (no DOM conflicts) for scales/shapes or imperatively (useRef/useEffect) for axes/transitions | D3 Getting Started docs | https://d3js.org/getting-started | 2026-05-08 | 2026-05-08 (Context7) | Official D3 + React integration guidance |
| D3 declarative line plot and imperative axis in React patterns | D3 docs via Context7 (/d3/d3) | https://github.com/d3/d3/blob/main/docs/getting-started.md | 2026-05-08 | 2026-05-08 | Complete code examples for both integration patterns |
| Recharts custom tooltip, LineChart, BarChart patterns | Recharts via Context7 (/recharts/recharts) | https://context7.com/recharts/recharts/llms.txt | 2026-05-08 | 2026-05-08 | Production code examples for common dashboard charts |
| Nivo theming, patterns, gradients, pie chart, line chart patterns | Nivo via Context7 (/plouc/nivo) | https://context7.com/plouc/nivo/llms.txt | 2026-05-08 | 2026-05-08 | Complete Nivo chart configurations with themes and interactivity |
| NBA shot visualization projects use D3 + React (tingkaiwu, ebaek, MoonSulong, CodeSandbox) | GitHub + Firecrawl search | https://github.com/tingkaiwu/nba-shot-visualization, https://github.com/ebaek/NBAShotTracker, https://github.com/MoonSulong/NBAVis, https://codesandbox.io/s/d3-nba-hex-chart-i9pwh | 2026-05-08 | Various (2019-2023) | All NBA shot chart projects use D3, confirming D3 as the right tool for basketball spatial viz |
| NBA-Stat-Spot uses Recharts + TanStack Query + React 19 + FastAPI | GitHub: mitchelldawkinsjr/NBA-Stat-Spot | https://github.com/mitchelldawkinsjr/NBA-Stat-Spot | 2026-05-08 | Active May 2026 | Closest reference architecture match |
| ECharts handles 100K+ data points with progressive rendering | Querio + ECharts docs | https://querio.ai/articles/top-react-chart-libraries-data-visualization, https://echarts.apache.org/ | 2026-05-08 | 2026-02-19 | Performance benchmarks for large datasets |
| Canvas-based libraries (Chart.js) render 100K points at smooth framerates; SVG degrades at scale | PkgPulse + Velt comparison | https://www.pkgpulse.com/blog/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026 | 2026-05-08 | 2026-03-09 | SVG vs Canvas performance data |
| Nivo accessibility-first approach meets WCAG 2.1 AA without extra work | PkgPulse: Recharts vs Chart.js vs Nivo vs Visx 2026 | https://www.pkgpulse.com/blog/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026 | 2026-05-08 | 2026-03-09 | Accessibility comparison across charting libraries |
| Recharts is the default choice in shadcn/ui ecosystem | PkgPulse: Real-World Adoption section | https://www.pkgpulse.com/blog/recharts-vs-chartjs-vs-nivo-vs-visx-react-charting-2026 | 2026-05-08 | 2026-03-09 | Real-world usage patterns in 2026 |
| ECharts dataset component, mixed series, multi-grid layouts | ECharts docs via Context7 (/apache/echarts-doc) | https://github.com/apache/echarts-doc | 2026-05-08 | 2026-05-08 | Configuration examples for complex ECharts layouts |
| Basketball court D3.js interactive example with season slider | D3 Examples (d3og.com) | https://d3og.com/YouthBread/4481cdd85d60a503a986d658404232c8/ | 2026-05-08 | 2026-05-08 | Working D3 basketball court with interactive features |
| Firecrawl autonomous agent discovered Tremor (Vercel-acquired dashboard library), uPlot (hyper-fast Canvas time-series), Highcharts React (WCAG 2.2 AA), MUI X Charts (design-system-native), AG Charts (cross-filtering with grid) | Firecrawl Agent (spark-1-pro) | https://opencode.ai | 2026-05-08 | 2026-05-08 | Comprehensive agent-researched findings covering dashboard frameworks, event-data libraries, accessibility, map integration, and NBA-specific projects |
| Tremor is a dashboard-first React library built on Recharts + Tailwind + Radix UI, acquired by Vercel Jan 2025, now MIT licensed, 35+ dashboard components | Tremor GitHub + Firecrawl agent | https://tremor.so, https://github.com/tremorlabs/tremor | 2026-05-08 | 2026-05-08 | Highest-fit library for React 19 + Vite + TanStack + Tailwind stack per agent analysis |
| uPlot benchmarks at 166K points in 25ms, handles 100K+ streaming at 60fps, ~50KB bundle — best performance-to-size ratio for time-series | uPlot GitHub + Firecrawl agent | https://github.com/leeoniya/uPlot | 2026-05-08 | 2026-05-08 | Best library for betting odds timelines and play-by-play event streams |
| Highcharts has WCAG 2.2 AA compliance, sonification, automatic alt-text — only library meeting strict accessibility standards without custom work | Highcharts React + Firecrawl agent | https://github.com/highcharts/highcharts-react, https://highcharts.com | 2026-05-08 | 2026-05-08 | Reference for accessibility compliance requirements in public-facing dashboards |
| AG Charts offers cross-filtering between charts and AG Grid, WCAG 2.0 AA, 30+ chart types with free community edition | AG Charts + Firecrawl agent | https://github.com/ag-grid/ag-charts, https://www.ag-grid.com/charts/react-charts/ | 2026-05-08 | 2026-05-08 | Unique grid-chart cross-filtering pattern for interactive data exploration |
| TanStack React Charts is DEPRECATED as of March 2025 — do not use; Visx is the alternative for headless React + D3 | Firecrawl agent discovery | https://github.com/tannerlinsley/react-charts | 2026-05-08 | March 2025 | Critical deprecation warning — prevents wasted planning on a dead library |
| React-Vis (Uber) is archived since 2022; d3.basketball-shot-chart unmaintained since 2015 — both should be avoided | Firecrawl agent discovery | GitHub repos | 2026-05-08 | 2022 / 2015 | Deprecation warnings for obsolete libraries |
| ECharts supports echarts.connect(groupId) for synchronized multi-chart tooltips, zoom, and brush events — best-in-class coordination | ECharts docs + Firecrawl agent | https://echarts.apache.org | 2026-05-08 | 2026-05-08 | Coordination patterns relevant for multi-view NBA dashboards |
| Recharts has built-in syncId prop for synchronizing tooltips and brush across multiple charts | Recharts docs | https://recharts.org | 2026-05-08 | 2026-05-08 | Recharts coordination capability not previously documented |
| MUI X Charts auto-inherits dark mode from MUI ThemeProvider — unique design-system-native theming | MUI X Charts docs | https://mui.com/x/react-charts/ | 2026-05-08 | 2026-05-08 | Theming integration pattern useful if MUI is adopted |
| TanStack React Charts documentation and code examples | Context7 /tanstack/react-charts | https://context7.com/tanstack/react-charts/llms.txt | 2026-05-08 | 2026-05-08 | Code examples and API reference (noted as deprecated but informative)

## Decisions Needed Before Planning

| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Standard dashboard charting library | Recharts, Nivo, ECharts, Chart.js | **Recharts** — React-first JSX API, highest adoption in React ecosystem (1.8M weekly), used by closest reference project (NBA-Stat-Spot), good TypeScript, shadcn/ui compatible, covers 90% of standard dashboard needs | Agent recommends, user approves |
| Custom basketball visuals strategy | D3 standalone, D3 + Visx primitives, Visx only | **D3 standalone** with React declarative pattern — D3 math + React SVG rendering. More control for court geometry; every NBA shot chart reference uses raw D3. Visx can be added later if D3 DOM manipulation becomes problematic | Agent recommends, user approves |
| Canvas fallback for large datasets | Nivo Canvas, Chart.js, ECharts, none (server-side aggregation) | **Server-side aggregation first**, then Nivo Canvas components if needed. Most dashboard views will show aggregated data (<1K points). Play-by-play views should use server-paginated cursors, not client-side rendering of all events | Agent recommends, user approves |
| Shot chart helper library | d3-shotchart (npm), shotchart.d3.ts, custom from scratch | **Custom from scratch** using D3 hexbin + React. Reference existing projects for court dimensions and coordinate conventions. Do not adopt unmaintained third-party shot chart packages | Agent recommends, user approves |
| Theme/styling approach | Library built-in themes, custom CSS, Tailwind | **Tailwind CSS + custom D3 styles**. Recharts accepts standard React props (works with Tailwind tokens). D3 court/styling uses inline styles or CSS modules. No additional theme library needed | Agent recommends, user approves |

## Open Questions / Risks
- [ ] **Recharts bundle size** (~370KB): Is this acceptable for the initial build? Could be mitigated by code-splitting so chart libraries load only on dashboard pages.
- [ ] **D3 + React boundary**: Declarative D3 in React works well for static/interactive charts but complex transitions (game-flow animation, shot chart brushing) may require imperative patterns. Plan component boundaries carefully.
- [ ] **Canvas rendering need**: If the app needs to render 10K+ raw data points client-side (e.g., full season play-by-play timeline), Canvas is required. Server-side aggregation should handle this for MVP, but the architecture must not preclude Canvas.
- [ ] **Shot coordinate validation**: Local play-by-play `x`, `y`, and `dist` fields need verification before court plotting. External references use NBA API coordinate conventions (origin at rim, units of 1/10 foot).
- [ ] **Accessibility**: Nivo is the only library with WCAG 2.1 AA out of the box. If accessibility is a hard requirement, Nivo should replace Recharts for standard charts. D3 custom visuals will need manual ARIA annotations regardless.
- [ ] **shadcn/ui dependency**: If the project adopts shadcn/ui for the component library, Recharts becomes the natural choice since shadcn/ui charts are built on Recharts.
- [ ] **Tremor vs raw Recharts**: Tremor provides 35+ pre-built dashboard blocks on top of Recharts + Tailwind, acquired by Vercel (Jan 2025, now MIT-licensed). It accelerates dashboard development but reduces customization flexibility. Decision: start with Tremor for speed, or raw Recharts for full control?
- [ ] **Time-series performance**: uPlot (Canvas, 166K points in 25ms, ~50KB) outperforms all other libraries for time-series data. Should odds timelines and play-by-play views use uPlot instead of Recharts?
- [ ] **Accessibility compliance target**: WCAG AA (Nivo, AG Charts) or WCAG 2.2 AA (Highcharts, commercial)? Public-facing dashboards may require the higher standard.

## Handoff Notes
- The planning phase should specify exact npm packages and versions for both layers.
- D3 integration patterns (declarative vs imperative) should be documented in the plan for each chart type.
- TanStack Query integration should be part of the component architecture, not an afterthought.
- Court component design (dimensions, coordinate system, overlays) deserves its own planning subtask.
- The plan should include a "standard chart component" pattern that wraps Recharts with consistent theming, tooltips, and responsive containers.

## Fresh-Agent Handoff
- **Inputs read**: `.agents/pipeline-state.json`, `.agents/tasks/frontend-charting-research/state.json`, `.agents/AGENTS.md`, `.agents/tasks/initial-architecture/1-research/findings.md` (full), `.agents/templates/findings.md`, DeepWiki for recharts, nivo, visx, d3, observablehq/plot, deck.gl, react-financial-charts, plotly/react-plotly.js, f5/unovis repos; Firecrawl searches/scrapes of pkgpulse.com, querio.ai, github.com, github.com/f5/unovis, github.com/apexcharts/react-apexcharts, tanstack.com, scichart.com; Context7 query docs for recharts, nivo, d3, echarts, tanstack/react-charts; Firecrawl Agent (spark-1-pro) autonomous research producing comprehensive findings on Tremor, uPlot, Highcharts, MUI X Charts, AG Charts, accessibility patterns, NBA dashboard references, and multi-chart synchronization patterns.
- **Decisions made**: Recommend a two-layer approach: **Recharts (or Tremor) for standard dashboard charts** and **D3 for custom basketball spatial visuals**. For time-series heavy views (odds, play-by-play), **uPlot** is the best performance option. For dashboards needing accessibility compliance, **Highcharts** (WCAG 2.2 AA) or **Nivo** (WCAG 2.1 AA). Use declarative D3-in-React pattern. Build shot charts custom from scratch. **TanStack React Charts is DEPRECATED — do not use.** **React Vis and d3.basketball-shot-chart are archived/unmaintained — avoid.**
- **Decisions deferred**: Tremor vs raw Recharts for dashboard layer, exact npm package versions, shadcn/ui adoption, accessibility compliance level, Canvas rendering strategy, court coordinate system design, whether to adopt uPlot for time-series or use server-side aggregation.
- **Open blockers**: None. Research is comprehensive enough for planning.
- **Verification run or still needed**: Ran `.agents/scripts/validate-pipeline.ps1`; it passed. No verifiable product code exists yet. Planning will define verification commands.
- **Next allowed action under phase gating**: Research phase complete. Ask the user whether to advance to Phase 2 (planning) or switch to a different task.
