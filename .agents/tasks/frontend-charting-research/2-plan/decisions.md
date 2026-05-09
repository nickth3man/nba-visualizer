# Frontend Charting Strategy - Decisions

## Decision: Standard Dashboard Charting Library

- **Status**: Accepted
- **Options considered**: Recharts, Nivo, Chart.js, ECharts, Tremor (Recharts wrapper), MUI X Charts
- **Chosen**: **Recharts** (raw, not Tremor wrapper)
- **Rationale**: Declarative JSX API is the most natural fit for React; 1.8M weekly downloads; used by the closest reference project (NBA-Stat-Spot); composable component model; syncId for tooltip/brush coordination; shadcn/ui charts module is built on Recharts (future-proof). Raw Recharts chosen over Tremor because Tremor's pre-built blocks add an opinionated abstraction layer that limits customization for basketball-specific charts; Recharts can always be wrapped with Tremor later if dashboard development velocity becomes the bottleneck.
- **Tradeoffs**: SVG-only (performance ceiling at ~5K data points per chart); 370KB bundle (mitigated by route-level code-splitting); manual theming required (no built-in dark mode).
- **Traceability**: Affects all standard chart component subtasks (Line, Bar, Area, Pie, Scatter). Review must verify Recharts components follow project's theming conventions.
- **Follow-up**: None.

## Decision: Custom Basketball Visuals Strategy

- **Status**: Accepted
- **Options considered**: D3 standalone, D3 + Visx primitives, Visx only, d3-shotchart npm package
- **Chosen**: **D3 standalone (declarative React pattern)**
- **Rationale**: Every NBA shot chart reference project uses raw D3; declarative React+D3 pattern (D3 math computes SVG props, React renders DOM) avoids virtual DOM conflicts; maximum control for court geometry, hexbin spatial analysis, and game-flow timelines. Visx adds an unnecessary abstraction — for basketball-specific spatial viz, the Visx primitives don't map cleanly to court coordinate systems. The d3-shotchart npm package is unmaintained since 2015.
- **Tradeoffs**: Steeper learning curve than charting libraries; requires careful useEffect management for transitions/animations; manual ARIA annotations.
- **Traceability**: Affects shot chart, court SVG, game-flow timeline, and play-by-play visualization subtasks. Review must verify no D3 DOM manipulation conflicts with React.
- **Follow-up**: Revisit Visx if D3 imperative patterns become hard to manage at scale.

## Decision: Large Dataset Rendering Strategy

- **Status**: Accepted
- **Options considered**: Nivo Canvas, Chart.js Canvas, uPlot, ECharts Canvas, server-side aggregation only
- **Chosen**: **Server-side aggregation first; uPlot as optional enhancement for real-time time-series**
- **Rationale**: Most dashboard views show aggregated data (<1K points per chart). Play-by-play views should use server-paginated cursors. uPlot (Canvas, 166K points in 25ms, ~50KB bundle) is the best option for betting odds timelines and live score progression, but falls outside MVP scope. This avoids premature optimization while keeping the architecture Canvas-capable.
- **Tradeoffs**: Some views (full-season play-by-play timeline) cannot render raw client-side without Canvas; these must be designed with server-side windowing from the start.
- **Traceability**: Affects API design (cursors/pagination) and play-by-play visualization subtask. Review must verify no component attempts to render >5K SVG DOM nodes.
- **Follow-up**: Evaluate uPlot adoption when odds timeline or live play-by-play views are prioritized.

## Decision: Shot Chart Implementation

- **Status**: Accepted
- **Options considered**: d3-shotchart npm package, shotchart.d3.ts library, custom from scratch
- **Chosen**: **Custom from scratch using D3 hexbin + React**
- **Rationale**: d3-shotchart is unmaintained since 2015; shotchart.d3.ts is stale since 2023. Both hardcode coordinate conventions that may not match our data. Building from scratch gives full control over coordinate mapping (we have both NBA and Basketball Reference coordinate conventions to reconcile), color scales, filtering, and court overlay integration. The reference projects (ebaek/NBAShotTracker, tingkaiwu/nba-shot-visualization) provide proven patterns to follow.
- **Tradeoffs**: More implementation work upfront; must source court dimensions and coordinate conventions independently.
- **Traceability**: Affects court SVG and shot chart subtasks. Review must verify coordinate conventions are documented and data mappings are verified.
- **Follow-up**: Validate coordinate conventions against local play-by-play data before plotting.

## Decision: Frontend Scaffold Dependency

- **Status**: Accepted
- **Options considered**: Scaffold frontend here, defer to initial-architecture task
- **Chosen**: **Defer to initial-architecture task**
- **Rationale**: The initial-architecture task (currently in 2-plan phase) owns the project scaffold (Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query). This charting task depends on that scaffold. Charting-specific dependencies (Recharts, D3, d3-hexbin) will be installed as part of this task's implementation.
- **Tradeoffs**: Charting implementation may be delayed if the initial-architecture scaffold is not ready. A standalone charting demo page with mock data can be built independently if needed.
- **Traceability**: Subtask 1 (Dependency Installation) in plan assumes the scaffold exists. Review must verify charting code integrates with the scaffolded project structure.
- **Follow-up**: Verify scaffold readiness before starting charting implementation.

## Decision: Accessibility Compliance Target

- **Status**: Deferred
- **Options considered**: WCAG 2.2 AA (Highcharts, commercial), WCAG 2.1 AA (Nivo, built-in), WCAG 2.0 AA (AG Charts), manual ARIA (Recharts + custom D3)
- **Chosen**: **Deferred to user**
- **Rationale**: This is a user-facing product decision. MVP with Recharts offers no built-in accessibility. Nivo provides WCAG 2.1 AA out of the box but requires a different API. Highcharts provides WCAG 2.2 AA but requires a commercial license. The cost/schedule tradeoff is significant.
- **Tradeoffs**: Choosing accessibility later may require rewriting chart components. Choosing it now constrains the charting library choice.
- **Traceability**: If WCAG AA is required, the standard chart library decision must be revisited (Recharts → Nivo or Highcharts).
- **Follow-up**: User must decide accessibility compliance target before standard chart component implementation begins.

## Decision: Theming and Styling Approach

- **Status**: Accepted
- **Options considered**: Library built-in themes, Tailwind CSS, CSS modules, custom theme provider
- **Chosen**: **Tailwind CSS + Recharts style props + D3 inline styles**
- **Rationale**: Tailwind is the project's CSS framework; Recharts accepts standard React style/CSS props that can reference Tailwind tokens via CSS variables; D3 court and spatial visuals use inline styles for precise SVG positioning. A shared chart theme config (color palette, font sizes, stroke widths) will be defined as a JavaScript constants file usable by both Recharts and D3 components.
- **Tradeoffs**: Recharts verbose style props (no Tailwind className support); D3 SVG elements cannot use Tailwind utility classes.
- **Traceability**: Affects chart theme provider subtask. Review must verify consistent theming across Recharts and D3 charts.
- **Follow-up**: None.

## Fresh-Agent Handoff

- **Inputs read**: `findings.md` (full), `state.json`, `plan.md` template, `decisions.md` template, initial-architecture `state.json`, `raw-data-manifest.md`
- **Decisions made**: Recharts for standard charts, D3 for custom viz, server-side aggregation first, custom shot charts, defer frontend scaffold, Tailwind theming, uPlot as optional enhancement
- **Decisions deferred**: Accessibility compliance target (user decision)
- **Open blockers**: Frontend scaffold not yet created (owned by initial-architecture task)
- **Verification run or still needed**: `validate-pipeline.ps1` will be run after plan is written
- **Next allowed action**: Write plan.md, mark 2-plan as ready_for_approval, ask user to approve
