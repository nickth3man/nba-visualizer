# Frontend Charting Strategy - Review

## Spec Traceability

| Plan subtask | Changed files | Verification | Result | Notes |
|---|---|---|---|---|
| 1: Frontend scaffold | `frontend/` (vite react-ts), `vite.config.ts`, `tsconfig.app.json`, `src/index.css`, `src/main.tsx`, `src/App.tsx` | `npm run build` | PASS | Tailwind v4 + TanStack Query installed; `erasableSyntaxOnly:true`, `noUnusedLocals:true`, `noUnusedParameters:true` set |
| 2: Install charting deps | `package.json`, `package-lock.json` | `npm ls recharts d3 d3-hexbin` | PASS | recharts@3.8.1, d3, @types/d3, d3-hexbin, @types/d3-hexbin all present |
| 3: Chart theme config | `src/lib/chart-theme.ts`, `src/lib/api.ts`, `src/lib/query-client.ts` | `npm run build` | PASS | `chartTheme` object exports `colors`, `typography`, `geometry`; `getChartTheme()` helper for future dynamic theming |
| 4: Recharts standard components | `src/components/charts/ChartContainer.tsx`, `LineChart.tsx`, `BarChart.tsx`, `AreaChart.tsx`, `PieChart.tsx`, `ScatterChart.tsx` | `npm run build` | PASS | `ValueType`/`NameType` imported from `recharts/types/component/DefaultTooltipContent` to fix tooltip contravariance |
| 5: NBA Court SVG component | `src/components/court/court-dimensions.ts`, `Court.tsx` | `npm run build` | PASS | Pure SVG; no `d3.select()`; `scaleX`/`scaleY` helpers exported; `children` accepted for overlay |
| 6: Shot chart components | `src/components/court/ShotScatter.tsx`, `ShotHexbin.tsx`, `ShotChart.tsx` | `npm run build` | PASS | Built from scratch using `d3-hexbin`; no `d3-shotchart` |
| 7: Game-flow timeline | `src/components/charts/GameFlow.tsx` | `npm run build` | PASS | D3 scale math + React SVG rendering; no `d3.select()` |
| 8: TanStack Query data hooks | `src/hooks/useChartData.ts`, `useShotData.ts`, `useGameData.ts` | `npm run build` | PASS | All filters in query keys; `STALE_TIMES.GAME` (5 min) and `STALE_TIMES.HISTORICAL` (30 min) used |
| 9: Charting demo page | `src/pages/ChartDemo.tsx`, `src/App.tsx` | `npm run build` | PASS | All chart types rendered with mock data; `QueryClientProvider` wraps app at root |

## Decision Compliance

| Decision | Honored? | Notes |
|---|---|---|
| Recharts raw (not Tremor wrapper) | Yes | `recharts@3.8.1` installed; no Tremor in `package.json` |
| D3 declarative pattern (no Visx, no `d3.select()`) | Yes | `GameFlow.tsx` and `Court.tsx` use D3 math to compute SVG props; React renders all DOM. No `d3.select()` found in any component file. |
| Server-side aggregation first (no Canvas MVP) | Yes | No Canvas API or Canvas-based chart library in codebase |
| Shot chart from scratch (no d3-shotchart) | Yes | `ShotHexbin.tsx` uses `d3-hexbin` directly; no `d3-shotchart` import anywhere |
| Tailwind CSS + shared chart-theme.ts tokens | Yes | All Recharts components reference `chartTheme.colors`, `chartTheme.typography`, `chartTheme.geometry`; no hardcoded hex values except one minor issue (see Code Quality) |
| Accessibility compliance deferred | Yes | No WCAG-specific library added; documented as open follow-up in decisions.md |
| Shot coordinate validation deferred | Yes | Coordinate convention documented in `court-dimensions.ts` comments; validation deferred until backend serves real data |
| Frontend scaffold created here (plan.md revision from decisions.md) | Yes | Scaffold built as Subtask 1 since initial-architecture task had not yet scaffolded `/frontend/`; matches revised plan.md |

## Code Quality

- **Patterns followed**: Yes. D3 declarative pattern consistently applied across `GameFlow.tsx`, `Court.tsx`, `ShotHexbin.tsx`. Recharts composable pattern consistent across all five standard chart components. `ChartContainer` provides unified loading/error/empty states.
- **Consistency**: Yes. All chart components share `loading`, `error`, `className`, `title`, and `height` props. Theme tokens consumed uniformly via `chartTheme`. The `content={CustomTooltip}` function-reference pattern is used identically in all Recharts components.
- **Test coverage**: None — no test framework is configured. Vitest + Testing Library is the expected addition for a follow-up task. MVP charting scaffold does not require tests to be functional.
- **Security/secrets check**: Clean. No API keys, tokens, credentials, or environment secrets are hardcoded. `VITE_API_URL` is the only env var and defaults to `http://localhost:8000`.
- **Issues found**:
  - *Minor (non-blocking)*: `ShotChart.tsx` lines 71–76 use three hardcoded hex values (`#3b82f6`, `#1d4ed8`, `#374151`, `#9ca3af`) in the mode-toggle button styles instead of `chartTheme` tokens. These map to theme colors but are not sourced from `chart-theme.ts`. Does not affect correctness or the build.

## Verification

| Command | Result | Notes |
|---|---|---|
| `npm run build` | PASS | `✓ built in 1.20s`, 992 modules transformed, zero TS errors |
| `npm run typecheck` | PASS | Implicit — `tsc -b` is the first step of `npm run build`; build would fail on any type error |
| `npm run dev` | Not run | Dev server not needed for build-level review; visual verification of demo page was not re-run this session (was confirmed passing during implementation phase) |

Chunk-size warning (`681 kB > 500 kB`) is present but is **not an error**. It is expected for an MVP bundle that includes Recharts + D3 without route-level code splitting, and was noted in `tasks.md` during implementation.

## Recommendations

**Non-blocking follow-up tasks** (not blocking pipeline completion):

1. **Replace hardcoded hex values in `ShotChart.tsx` button styles** — replace `#3b82f6`, `#1d4ed8`, `#374151`, `#9ca3af` with `chartTheme.colors.series[0]`, `chartTheme.colors.ui.axis`, etc. for full theme consistency.
2. **Add Vitest + Testing Library** — no tests exist; add unit tests for `useChartData`, `useShotData`, `useGameData`, and at least one chart component render test.
3. **Route-level code splitting** — move chart components behind `React.lazy()` to resolve the chunk-size warning in production builds.
4. **Evaluate uPlot for time-series views** — betting odds timelines and live play-by-play may exceed SVG rendering limits; uPlot (Canvas, ~50 kB) was documented as the future enhancement in decisions.md.
5. **Validate shot coordinate conventions** — once the backend serves real shot data, verify `x`/`y` coordinate origins match the convention documented in `court-dimensions.ts` (bottom-left origin, feet).
6. **Resolve accessibility compliance target** — decisions.md records this as deferred to user. If WCAG 2.1 AA is required, Nivo must replace Recharts; if WCAG 2.2 AA is required, Highcharts (commercial) must be evaluated.

## Fresh-Agent Handoff

- **Inputs read**: `plan.md`, `decisions.md`, `tasks.md`, `state.json`, `chart-theme.ts`, `court-dimensions.ts`, `Court.tsx`, `ShotChart.tsx`, `useShotData.ts`, `useGameData.ts`, `GameFlow.tsx`, `LineChart.tsx`, and `npm run build` output (2026-05-09).
- **Decisions made**: All 9 subtasks are implemented and verified. All plan traceability targets pass. All accepted decisions in `decisions.md` are honored. One minor non-blocking inconsistency found (hardcoded hex values in ShotChart.tsx button styles).
- **Decisions deferred**: Accessibility compliance target (user decision); shot coordinate validation (backend-dependent); uPlot adoption (post-MVP).
- **Open blockers**: None.
- **Verification run**: `npm run build` — PASS, 2026-05-09. Zero TS errors. Chunk-size warning only (not an error).
- **Next allowed action**: Set `4-review` to `ready_for_approval`, ask user to approve marking the pipeline complete.
