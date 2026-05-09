# Frontend Charting Strategy - Implementation Plan

## Research Risk Resolution

| Research question/risk | Resolution | Deferred? | Notes |
|---|---|---|---|
| Standard dashboard charting library | **Recharts** (raw, not Tremor wrapper) — React-first JSX API, 1.8M weekly downloads, used by NBA-Stat-Spot, shadcn/ui compatible | No | |
| Custom basketball visuals strategy | **D3 standalone** with declarative React pattern — D3 math computes SVG props, React renders DOM. No Visx layer. | No | |
| Canvas fallback for large datasets | **Server-side aggregation first** — no Canvas library in MVP. Most dashboard views <1K points. Play-by-play views use server-paginated cursors. | No | |
| Shot chart implementation | **Custom from scratch** using D3 hexbin + React. No d3-shotchart (unmaintained 2015) or shotchart.d3.ts (stale 2023). | No | |
| Theming/styling approach | **Tailwind CSS + shared chart theme config** — a JavaScript constants file exporting palette, fonts, stroke widths. Recharts gets style props; D3 gets inline styles. | No | |
| Tremor vs raw Recharts | **Raw Recharts** — Tremor adds opinionated blocks that limit basketball-specific customization needs. Raw Recharts can always be wrapped with Tremor later. | No | |
| Time-series library for odds/play-by-play | **None in MVP** — server-side aggregation handles this. uPlot documented as optional enhancement for future time-series heavy views. | No | decision recorded in decisions.md |
| Accessibility compliance target | **Deferred to user** — Nivo (WCAG 2.1 AA) is the backup if AA is required; Highcharts (WCAG 2.2 AA) is the backup if 2.2 is required. Current Recharts+Tailwind path has no built-in accessibility. | Yes | User must decide before standard chart component implementation |
| Frontend scaffold | **Create here as Subtask 1** — initial-architecture task is also in planning; waiting would block all implementation. Scaffold uses Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query. | No | |
| TanStack React Charts deprecation | **Avoid entirely** — deprecated March 2025. Use only Recharts + D3. | No | |
| Recharts bundle size (~370KB) | Acceptable — mitigated by route-level code-splitting (chart components lazy-loaded on dashboard pages). | No | |
| D3 + React boundary | Declarative pattern (D3 math + React SVG) for all components. Imperative `useEffect` blocks only for D3 axis generators and brush/lasso. | No | |
| Shot coordinate validation | Document coordinate conventions in code comments. Validation deferred until backend serves real data. | Yes | Backend-dependent |

## Subtask Breakdown

### Subtask 1: Frontend Scaffold
- **Files**: `/frontend/` (create directory tree)
- **Dependencies**: None
- **Steps**:
  1. Create Vite + React 19 + TypeScript project in `/frontend/` with `npm create vite@latest`
  2. Install and configure Tailwind CSS v4
  3. Install TanStack Query (`@tanstack/react-query`)
  4. Create directory structure: `src/components/charts/`, `src/components/court/`, `src/hooks/`, `src/lib/`, `src/pages/`
  5. Create `src/lib/api.ts` — typed fetch wrapper for FastAPI backend
  6. Create `src/lib/query-client.ts` — TanStack Query client config with default staleTime
  7. Verify `npm run dev` starts and displays a blank page
- **Expected output**: Working Vite dev server with React 19, TypeScript, Tailwind v4, and TanStack Query installed
- **Verification**: `npm run dev` starts without errors; `npm run build` succeeds
- **Commit**: No (unless user requests)

### Subtask 2: Install Charting Dependencies
- **Files**: `frontend/package.json`, `frontend/tsconfig.json`
- **Dependencies**: Subtask 1
- **Steps**:
  1. Install Recharts packages: `npm install recharts`
  2. Install D3 packages: `npm install d3 @types/d3 d3-hexbin`
  3. Add charting dependencies to package.json (exact versions recorded)
  4. Verify imports resolve in TypeScript
- **Expected output**: Recharts and D3 importable in TypeScript without type errors
- **Verification**: Create a temporary `.tsx` file importing from `recharts` and `d3`; `npm run typecheck` passes
- **Commit**: No (unless user requests)

### Subtask 3: Chart Theme Configuration
- **Files**: `frontend/src/lib/chart-theme.ts` (create)
- **Dependencies**: Subtask 2
- **Steps**:
  1. Define color palette: primary team series colors, home/away colors, make/miss colors, court colors
  2. Define typography: font family, sizes for titles, axes, tooltips, legends
  3. Define stroke widths and style defaults for lines, bars, gridlines
  4. Define spacing constants for margins and padding
  5. Export a typed `ChartTheme` object and a `chartTheme()` helper function
- **Expected output**: Single source of truth for chart styling, usable by both Recharts props and D3 inline styles
- **Verification**: TypeScript compiles; manual review of exported theme object structure
- **Commit**: No (unless user requests)

### Subtask 4: Recharts Standard Chart Components
- **Files**: `frontend/src/components/charts/LineChart.tsx`, `BarChart.tsx`, `AreaChart.tsx`, `PieChart.tsx`, `ScatterChart.tsx`, `ChartContainer.tsx` (create)
- **Dependencies**: Subtask 3
- **Steps**:
  1. Create `ChartContainer.tsx` — responsive wrapper with loading/error/empty states, consistent margin defaults
  2. Create `LineChart.tsx` — multi-series line chart with synced tooltips, legend, grid, axis config
  3. Create `BarChart.tsx` — grouped/stacked bar chart with value labels, horizontal/vertical modes
  4. Create `AreaChart.tsx` — filled area chart with gradient support, cumulative mode
  5. Create `PieChart.tsx` — donut chart with percentage labels, custom color mapping
  6. Create `ScatterChart.tsx` — scatter plot with customizable point size, color encoding, reference lines
  7. All components accept `data`, `series`, `height`, `loading`, `error` as typed props
  8. All components use chart-theme.ts tokens for colors and styling
- **Expected output**: Five standardized chart components that accept typed props and render consistently
- **Verification**: `npm run typecheck` passes; `npm run build` succeeds
- **Commit**: No (unless user requests)

### Subtask 5: NBA Court SVG Component
- **Files**: `frontend/src/components/court/Court.tsx`, `court-dimensions.ts` (create)
- **Dependencies**: Subtask 3
- **Steps**:
  1. Define NBA court dimensions in `court-dimensions.ts`: floor bounds, hoop position, three-point arc, key, restricted area, corners, center circle
  2. Create `Court.tsx` — pure SVG component rendering court markings using D3 path generators
  3. Support `width` and `height` props with automatic scaling using D3 scale functions
  4. Support court orientation: `"vertical"` (top-down) and `"horizontal"` (side view) via prop
  5. Accept children prop for overlaying shot markers and annotations
  6. Document coordinate conventions in comments: origin at bottom-left corner, units in feet
- **Expected output**: Reusable SVG court component with accurate NBA court markings
- **Verification**: `npm run typecheck` passes; court renders in browser with correct proportions
- **Commit**: No (unless user requests)

### Subtask 6: Shot Chart Components
- **Files**: `frontend/src/components/court/ShotChart.tsx`, `ShotHexbin.tsx`, `ShotScatter.tsx` (create)
- **Dependencies**: Subtask 5
- **Steps**:
  1. Create `ShotScatter.tsx` — renders individual shot markers on the court; encodes make/miss with color; tooltip on hover shows player, distance, quarter
  2. Create `ShotHexbin.tsx` — uses `d3-hexbin` to aggregate shots into hex bins; color-encodes FG% per bin; supports `radius` prop for bin size
  3. Create `ShotChart.tsx` — container component with mode toggle (scatter/hexbin), player/team/season/date-range filter props
  4. All shot markers scale `x`/`y` coordinates to court SVG coordinates
  5. Support empty state (no shots for selected filters) and loading state
- **Expected output**: Functional shot chart with scatter and hexbin modes, integrated with Court component
- **Verification**: `npm run typecheck` passes; shot chart renders with mock data in both modes
- **Commit**: No (unless user requests)

### Subtask 7: Game-Flow Timeline Component
- **Files**: `frontend/src/components/charts/GameFlow.tsx` (create)
- **Dependencies**: Subtask 3
- **Steps**:
  1. Create `GameFlow.tsx` — D3-based area chart showing score differential over game time
  2. Add per-period separators (vertical lines at quarter breaks)
  3. Add lead-change markers and largest-lead annotations
  4. Support home/away team color encoding from chart theme
  5. Add tooltip showing exact score, time remaining, and period on hover
- **Expected output**: Interactive game-flow timeline showing score progression with period markers
- **Verification**: `npm run typecheck` passes; component renders with mock game data
- **Commit**: No (unless user requests)

### Subtask 8: TanStack Query Data Hooks
- **Files**: `frontend/src/hooks/useChartData.ts`, `useShotData.ts`, `useGameData.ts` (create)
- **Dependencies**: Subtask 1
- **Steps**:
  1. Create `useChartData.ts` — generic hook accepting query key, endpoint URL, and filters; returns `{ data, isLoading, error }` from TanStack Query
  2. Create `useShotData.ts` — typed hook for shot endpoint with player/team/season/date filters
  3. Create `useGameData.ts` — typed hook for game-level data (scores, play-by-play slices, odds)
  4. All hooks use filter-complete query keys for proper caching
  5. Configure stale times: 5 minutes for game data, 30 minutes for historical/season data
- **Expected output**: Typed React hooks that components use to fetch data from the backend
- **Verification**: `npm run typecheck` passes; hooks instantiate without errors
- **Commit**: No (unless user requests)

### Subtask 9: Charting Demo Page
- **Files**: `frontend/src/pages/ChartDemo.tsx`, `frontend/src/App.tsx` (modify)
- **Dependencies**: Subtasks 4, 6, 7, 8
- **Steps**:
  1. Create `ChartDemo.tsx` — demo page rendering all chart components with mock data
  2. Include: line chart (team scoring trend), bar chart (player comparison), area chart (cumulative stats), pie chart (shot distribution), scatter plot (efficiency vs volume)
  3. Include: court SVG with shot scatter, shot hexbin with FG% encoding
  4. Include: game-flow timeline with mock game data
  5. Wire demo page as App default route
- **Expected output**: Single-page demo showcasing all charting components with mock data
- **Verification**: `npm run dev` then open browser — all charts render with mock data, no console errors
- **Commit**: No (unless user requests)

## Dependency Graph

```
Subtask 1 (Scaffold)
  ├─→ Subtask 2 (Dependencies)
  │     ├─→ Subtask 3 (Theme config)
  │     │     ├─→ Subtask 4 (Recharts components)
  │     │     ├─→ Subtask 5 (Court SVG)
  │     │     └─→ Subtask 7 (Game-flow timeline)
  │     └─→ (directly feeds Subtask 4, 5, 7 via npm package availability)
  │
  └─→ Subtask 8 (Data hooks)

Subtasks 4, 5, 6, 7, 8
  └─→ Subtask 9 (Demo page)

Subtasks 4 and 7 are independent (can run in parallel)
Subtasks 5 and 8 are independent (can run in parallel)
Subtask 6 depends on 5 (court component)
```

## Global Verification

- `npm run typecheck`: Must pass with zero errors
- `npm run build`: Must produce a successful production build
- `npm run dev`: Demo page must render all chart types without console errors
- Visual check: Court SVG shows accurate NBA markings; shot hexbin color encodes FG% correctly; game-flow timeline has period separators

## Review Traceability Targets

- Verify Recharts components use chart-theme.ts tokens (not hardcoded colors)
- Verify D3 components use declarative React+SVG pattern (no `d3.select()` DOM manipulation on React-owned elements)
- Verify no deprecated libraries imported (TanStack React Charts, React Vis, d3-shotchart)
- Verify court dimensions match NBA regulation measurements
- Verify shot chart handles empty/loading/error states
- Verify TanStack Query hooks use filter-complete query keys
- Verify theme config exported shape is consumed by both Recharts and D3 components

## Fresh-Agent Handoff

- **Inputs read**: `1-research/findings.md` (full 487 lines), `state.json`, `pipeline-state.json`, `decisions.md`, `.agents/templates/plan.md`, `.agents/templates/decisions.md`, `initial-architecture/1-research/findings.md`
- **Decisions made**: Recharts for standard charts (raw, not Tremor), D3 declarative pattern for custom visuals, custom shot charts from scratch, Tailwind + shared theme config, scaffold created here (not deferred), server-side aggregation over Canvas MVP, uPlot as optional future enhancement
- **Decisions deferred**: Accessibility compliance target (user must decide), shot coordinate validation (backend-dependent)
- **Open blockers**: None. Scaffold will be created as Subtask 1. Accessibility decision gating only applies if user requires AA compliance before implementation.
- **Verification run or still needed**: Pipeline validator will be run after state.json is updated. No product code exists to verify yet.
- **Next allowed action**: Set 2-plan to `ready_for_approval`, ask user to approve advancing to implementation.
