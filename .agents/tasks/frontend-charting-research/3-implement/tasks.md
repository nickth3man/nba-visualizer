# Frontend Charting Research - Subtask Tracker

| # | Subtask | Status | Changed files | Verification | Notes |
|---|---|---|---|---|---|
| 1 | Frontend scaffold | completed | `frontend/` (vite react-ts), `vite.config.ts`, `tsconfig.app.json`, `src/index.css`, `src/main.tsx`, `src/App.tsx` | `npm run build` passes | Tailwind v4 + TanStack Query installed; `erasableSyntaxOnly:true` set |
| 2 | Install charting deps | completed | `package.json`, `package-lock.json` | `npm ls recharts d3 d3-hexbin` | recharts@3.8.1, d3, @types/d3, d3-hexbin, @types/d3-hexbin |
| 3 | Chart theme config | completed | `src/lib/chart-theme.ts`, `src/lib/api.ts`, `src/lib/query-client.ts` | `npm run build` passes | Single source of truth for all chart styling |
| 4 | Recharts standard components | completed | `src/components/charts/ChartContainer.tsx`, `LineChart.tsx`, `BarChart.tsx`, `AreaChart.tsx`, `PieChart.tsx`, `ScatterChart.tsx` | `npm run build` passes | `ValueType`/`NameType` from `recharts/types/component/DefaultTooltipContent` fixes contravariance |
| 5 | NBA Court SVG component | completed | `src/components/court/court-dimensions.ts`, `Court.tsx` | `npm run build` passes | D3 declarative pattern; no `d3.select` on React-owned nodes |
| 6 | Shot chart components | completed | `src/components/court/ShotScatter.tsx`, `ShotHexbin.tsx`, `ShotChart.tsx` | `npm run build` passes | d3-hexbin for density; built from scratch (no d3-shotchart) |
| 7 | Game-flow timeline | completed | `src/components/charts/GameFlow.tsx` | `npm run build` passes | D3 scales + React SVG rendering; no unused vars |
| 8 | TanStack Query data hooks | completed | `src/hooks/useChartData.ts`, `useShotData.ts`, `useGameData.ts` | `npm run build` passes | VITE_API_URL controls backend base URL |
| 9 | Charting demo page | completed | `src/pages/ChartDemo.tsx`, `src/App.tsx` | `npm run build` passes | All mock data wired; QueryClientProvider wraps app |

## Status Legend
- `pending`: Not started.
- `in_progress`: Work is underway.
- `completed`: Implemented and verified.
- `blocked`: Needs external input.
- `skipped`: Intentionally skipped with user approval.

## Blockers

None.

## Global Verification
| Command | Result | Notes |
|---|---|---|
| `npm run build` | **PASS** (`✓ built in 1.17s`) | 992 modules transformed; chunk-size warning only (not an error) |
| `npm run typecheck` | **PASS** (implicit — `tsc -b` is part of `build`) | All 5 chart tooltip types fixed with `ValueType`/`NameType` from `recharts/types/component/DefaultTooltipContent` |
| `npm run dev` | not run | Dev server not needed for build verification |

## Tooltip Type Fix — Key Lesson

Recharts v3 `ValueType` is `number | string | ReadonlyArray<number | string>` (note: **readonly**).
Using a local alias `Array<number | string>` (mutable) triggers a TS contravariance failure deep inside `TooltipContentProps.formatter`.
The correct fix (confirmed by shadcn-ui/ui #7669) is to import `ValueType` and `NameType` directly from `recharts/types/component/DefaultTooltipContent`.

## Fresh-Agent Handoff
- **Inputs read**: plan.md, decisions.md, state.json, initial-architecture/state.json, raw-data-manifest.md
- **Decisions made**: All 9 subtasks implemented. `ValueType`/`NameType` imported from `recharts/types/component/DefaultTooltipContent`. No Canvas in MVP. D3 declarative pattern throughout.
- **Decisions deferred**: Accessibility compliance target; shot coordinate validation (recorded in decisions.md)
- **Open blockers**: None
- **Verification run**: `npm run build` — PASS (2026-05-09)
- **Next allowed action**: Set phase `3-implement` to `ready_for_approval`, then await user approval to advance to `4-review`
