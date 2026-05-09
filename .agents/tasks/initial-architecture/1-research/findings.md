# NBA Visualizer - Research Findings

## Task Understanding
- **Task**: Initial data inventory, ecosystem research, and architecture recommendations for building a comprehensive NBA data visualization and analysis web application.
- **Scope**: Full-stack web app with team performance, player deep-dive, shot charts, betting odds, play-by-play analysis, and historical league trends.
- **Tech stack**: FastAPI backend, React + D3.js frontend, SQLite data layer.
- **Success criteria**: Data sources are inventoried, relevant external projects and tools are cited, architecture risks are identified, and planning can begin without repeating basic discovery.
- **Out of scope for this phase**: Implementing ETL, backend APIs, frontend views, or production deployment.
- **Current year context**: The year is 2026. Any current-season, library, API, repository, or deployment fact should be re-checked before it drives a plan decision.

## Codebase Context
- **Existing app code**: None at time of research; this is a greenfield project.
- **Expected project structure**: `/backend/`, `/frontend/`, `/etl/`, `/data/`, `/raw/`.
- **Pipeline files**: `.agents/AGENTS.md`, `.agents/pipeline-state.json`, `.agents/tasks/initial-architecture/state.json`.
- **Raw data rule**: Do not edit `/raw`. It is gitignored and local-only.
- **Data layer direction**: Use SQLite as the primary query layer. Convert or attach large raw CSV/parquet data into queryable SQLite structures for FastAPI.

## Raw Data Manifest Check
- **Manifest checked**: Yes.
- **Manifest path**: `.agents/raw-data-manifest.md`.
- **Local `/raw` match**: Fresh verifier run passed with 85 baseline files present. It reports four additional raw SQLite sidecar files as allowed: `raw/sportsdata/sqlite/nba_stats.sqlite-wal`, `raw/sportsdata/sqlite/nba_stats_pbp.sqlite-wal`, `raw/sportsdata/sqlite/nba_stats.sqlite-shm`, and `raw/sportsdata/sqlite/nba_stats_pbp.sqlite-shm`.
- **Important caveat**: `/raw` is gitignored. A fresh clone is not fully reproducible unless the user provides the same local raw data or an updated manifest. Do not edit `/raw`; keep SQLite sidecar handling explicit in ETL and deployment planning.

## Local Data Inventory

### Scope Correction
- The platform scope is not a shot-chart app. Shot charts are one important visualization slice, but every related data family under `/raw` should have a planned representation in the data model, API surface, and frontend information architecture.
- Planning should treat `/raw` as a multi-domain NBA warehouse: historical Basketball Reference season/career context, NBA.com-style team-game summaries, SportsData.io schedules/players/box scores/play-by-play/odds, Pinnacle odds snapshots, processed box-score shortcuts, and metadata documentation.
- The first implementation milestone can still be incremental, but the architecture should not make future coverage of odds, awards, drafts, schedules, play-by-play, or historical trends feel bolted on.

### 1. `raw/cumulative_scraped/` - Game-Level Team Stats
- **Files**: `games_traditional.csv`, `games_advanced.csv`, `games_four-factors.csv`, `games_misc.csv`, `games_scoring.csv`.
- **Approx rows**: 51,105 games from 2006 to present.
- **Useful columns**: `GAME_ID`, `TEAM_ID`, matchup, points, shooting, rebounds, assists, turnovers, steals, blocks, fouls, plus-minus, offensive rating, defensive rating, net rating, pace, PIE, effective FG%, true shooting%, usage%, four factors, scoring breakdowns, and miscellaneous scoring.

### 2. `raw/play_by_play/` - Event-Level Data
- **Files**: 30 season CSVs, `pbp1997.csv` through `pbp2026.csv`, plus `parquet/PlayByPlay.parquet`.
- **Approx size**: 3.1 GB.
- **Columns**: `gameid`, `period`, `clock`, `h_pts`, `a_pts`, `team`, `playerid`, `player`, `type`, `subtype`, `result`, `x`, `y`, `dist`, `desc`.
- **Key feature**: `x`, `y`, and `dist` enable shot charts and spatial analysis.

### 3. `raw/processed/` - Pre-Merged Data
- **Files**: `games_boxscores.csv`, `teams_boxscores.csv`, `column_mapping.json`.
- **Use**: Fast path for early backend queries and frontend prototypes.
- **Known shape**: `games_boxscores.csv` is game-level with home/visitor stats side-by-side; `teams_boxscores.csv` is one row per team per game.

### 4. `raw/basketball_reference/` - Historical Player/Team Data
- **Files**: 22 CSVs across player, team, opponent, awards, and draft data.
- **Use**: Historical league trends, player career arcs, awards, draft analysis, and long-range context.

### 5. `raw/sportsdata/` - SportsData.io Export
- **Files**: 18 manifest-listed files, including CSVs and SQLite databases, plus four actual SQLite sidecar files currently reported as manifest omissions.
- **SQLite DBs**: `nba_stats.sqlite`, `nba_stats_pbp.sqlite`.
- **Use**: Player stats, team stats, schedules, odds, box scores, and alternate play-by-play source.

### 6. `raw/odds/` - Pinnacle Betting Odds
- **Files**: `main_lines.csv` and `detailed_odds.csv` for NBA and NBA preseason.
- **Use**: Odds movement, market efficiency, spread/total comparisons, and actual result overlays.

### 7. `raw/metadata/`
- **Files**: `data_dictionary.csv`.
- **Use**: Column descriptions, data types, and source documentation.

## All-Raw Representation Matrix

| Raw source or file family | Primary domain | ETL / SQLite representation | Backend endpoint group | Frontend representation |
|---|---|---|---|---|
| `raw/basketball_reference/awards/*.csv` | Awards, All-Star selections, end-of-season teams, award voting shares | `award_selections`, `award_votes`, linked to canonical `players`, `teams`, and `seasons` where possible | `/awards`, `/players/{id}/awards`, `/seasons/{season}/awards` | Awards timeline, MVP/award share explorer, player accolade panels |
| `raw/basketball_reference/draft/Draft Pick History.csv` | Draft history and player entry context | `draft_picks` with season, round, pick, team alias, player bridge | `/draft`, `/players/{id}/draft`, `/teams/{id}/draft` | Draft board explorer, team draft history, player career origin context |
| `raw/basketball_reference/player/*.csv` | Historical player season, career, shooting, advanced, per-possession, position, and play-by-play-derived summaries | `player_seasons`, `player_careers`, `player_shooting_seasons`, `player_advanced_seasons`, plus source bridge rows for Basketball Reference `player_id` | `/players`, `/players/{id}`, `/players/{id}/seasons`, `/trends/players` | Player deep dive, career arcs, season comparison, shooting profile, leaderboard tables |
| `raw/basketball_reference/team/*.csv` | Historical team seasons, franchise/team aliases, team summaries | `team_seasons`, `team_totals`, `team_aliases`, `team_franchise_history` | `/teams`, `/teams/{id}/seasons`, `/trends/teams` | Team performance dashboard, historical franchise trends, pace/efficiency era charts |
| `raw/basketball_reference/opponent/*.csv` | Opponent defensive context by season | `team_opponent_seasons`, joinable to `team_seasons` by team/season | `/teams/{id}/opponents`, `/trends/defense` | Defense profile cards, four-factor trend lines, offense-vs-defense comparisons |
| `raw/cumulative_scraped/games_*.csv` | NBA.com-style team-game stats from 2006 onward | `team_game_stats` wide table or metric-family tables keyed by source `GAME_ID` and `TEAM_ID` | `/games`, `/teams/{id}/games`, `/metrics/team-games`, `/leaderboards/team-games` | Team game logs, matchup pages, rolling form charts, four-factor breakdowns |
| `raw/processed/games_boxscores.csv` and `teams_boxscores.csv` | Pre-merged game and team-game box scores | Bootstrap/staging tables and optionally `game_boxscores` / `team_boxscores` materialized views | `/games/{id}/boxscore`, `/teams/{id}/boxscores` | Fast first dashboard tables, game detail page, team-game comparison |
| `raw/processed/column_mapping.json` | Display names and normalized metric slugs | `metric_dictionary` seed or application metadata loaded by ETL/API | `/metadata/metrics` | Friendly labels, units/help text, metric picker/search |
| `raw/metadata/data_dictionary.csv` | Source column descriptions and documentation | `data_dictionary` and `source_columns` metadata tables | `/metadata/sources`, `/metadata/columns` | Data catalog, column glossary, analyst help drawer |
| `raw/odds/leagues/nba/*.csv` | Regular-season betting lines and detailed market snapshots | `odds_snapshots`, `odds_main_lines`, `odds_markets`, `odds_game_links`, with game/team matching status | `/odds`, `/games/{id}/odds`, `/teams/{id}/odds` | Odds movement view, market timeline, closing-line-vs-result panel |
| `raw/odds/leagues/nba_preseason/*.csv` | Preseason odds | Same odds tables with competition/season-type flag | `/odds?season_type=preseason` | Preseason market explorer and separate filter from regular season |
| `raw/play_by_play/csv_by_season/pbp*.csv` | Event-level history from 1997 through 2026 | `play_by_play_events` partition-aware load into SQLite, with indexes by game, season, team, player, period, event type | `/games/{id}/play-by-play`, `/players/{id}/events`, `/teams/{id}/events` | Game flow, event feed, clutch sequence explorer, shot/event filters |
| `raw/play_by_play/parquet/PlayByPlay.parquet` | Combined event-level source | Preferred staging source if faster/reliable; cross-check against season CSVs | Same as play-by-play endpoints | Same as play-by-play views; useful for ETL speed, not separate UX |
| `raw/play_by_play` shot-like event fields (`x`, `y`, `dist`, `type`, `subtype`, `result`) | Spatial shot and event analysis | `shots` materialized table/view derived from play-by-play with coordinate validation metadata | `/shots`, `/players/{id}/shots`, `/teams/{id}/shots` | Shot charts, shot density, spatial efficiency, make/miss maps |
| `raw/sportsdata/csv/Games*.csv`, `games_index.csv`, `games_schedule.csv`, `schedules/*.csv` | Schedule, game identity, season metadata | Canonical `games` seed candidates and source ID bridge rows | `/schedule`, `/games`, `/seasons/{season}/schedule` | Schedule browser, game search, daily slate, matchup navigation |
| `raw/sportsdata/csv/Players.csv` | Player identity and biographical roster data | `players` seed candidate plus `player_source_ids` | `/players`, `/search/players` | Player search/autocomplete, roster identity cards |
| `raw/sportsdata/csv/player_boxscores.csv`, `PlayerStatistics*.csv` | Player game and season/stat detail | `player_game_stats`, `player_stat_lines`, optional extended metric tables | `/players/{id}/games`, `/leaderboards/players`, `/games/{id}/players` | Player game logs, leaderboards, box score player tables |
| `raw/sportsdata/csv/team_boxscores.csv`, `TeamStatistics*.csv`, `TeamHistories.csv` | Team game/season stats and franchise context | `team_game_stats_sportsdata`, `team_stat_lines`, `team_histories`, bridge to canonical teams | `/teams/{id}/games`, `/teams/{id}/history` | Team profile, franchise history, team leaderboards |
| `raw/sportsdata/csv/play_by_play.csv` and `sqlite/nba_stats_pbp.sqlite` | Alternate play-by-play source | Source-specific staging and reconciliation tables; do not blindly union with other PBP until event keys are validated | `/sources/sportsdata/play-by-play` for diagnostics, canonical endpoints after reconciliation | Data quality comparison, later lineup/event completeness diagnostics |
| `raw/sportsdata/csv/game_odds.csv` | SportsData odds source | `sportsdata_odds` staging plus normalized `odds_snapshots` when matchable | `/odds/sources`, `/games/{id}/odds` | Odds source comparison and market coverage diagnostics |
| `raw/sportsdata/sqlite/*.sqlite` plus sidecars | Existing queryable SportsData databases | Read-only attached/staged source during ETL; checkpoint/copy policy required before reuse | Internal ETL source first; direct diagnostic endpoints only if needed | Not a user-facing source by itself; powers imported views |

## Target Product Areas From Data Coverage

1. **Data catalog and search**: A source/column/metric catalog prevents a broad dataset from feeling opaque and gives every raw source a visible representation.
2. **Team performance**: Team profile, season trends, game logs, four factors, opponent context, and matchup pages using cumulative scraped, processed, SportsData, and Basketball Reference team data.
3. **Player deep dive**: Player identity, career and season stats, game logs, shooting profile, awards, draft context, and event/shot filters.
4. **Game center**: Schedule, game metadata, box score, team/player stats, play-by-play feed, game flow, shot chart, and odds movement for matched games.
5. **Betting/odds explorer**: Regular season and preseason odds, market snapshots, line movement, game mapping status, and result overlays with informational-only framing.
6. **Historical league trends**: Era-level team/player/offense/defense trends from compact Basketball Reference tables and source-bridged current data.
7. **Data quality and source reconciliation**: Source coverage, unmatched odds, ambiguous teams/players, duplicate games, and play-by-play source comparison should be visible to developers and optionally in an admin/debug view.

## External Research

### Reference Projects

1. **danchyy/Basketball_Analytics**
   - **URL**: https://github.com/danchyy/Basketball_Analytics
   - **Accessed**: 2026-05-08.
   - **Observed**: Public GitHub repo with notebook-based NBA analytics, shot charts, play-by-play analysis, assist analysis, clutch work, and team efficiency views.
   - **Takeaway**: Strong reference for analytical ideas and basketball-specific chart types, but not a deployable full-stack dashboard.

2. **boyarkogc/nba-analytics-dashboard**
   - **URL**: https://github.com/boyarkogc/nba-analytics-dashboard
   - **Accessed**: 2026-05-08.
   - **Observed**: Streamlit + Plotly dashboard using NBA API data and an AWS S3/Glue/Athena pipeline.
   - **Takeaway**: Useful reference for clean separation between data pipeline, query layer, and dashboard.

3. **nogibjj/BallersDash**
   - **URL**: https://github.com/nogibjj/BallersDash
   - **Accessed**: 2026-05-08.
   - **Observed**: NBA dashboard oriented around head-to-head analytics, raw statistics, interactive visualizations, probability distributions, rankings, injuries, and betting/fantasy users.
   - **Takeaway**: Good product-scope reference for a broad NBA analytics dashboard.

4. **helenaschatz/NBA-Dashboard**
   - **URL**: https://github.com/helenaschatz/NBA-Dashboard
   - **Accessed**: 2026-05-08.
   - **Observed**: Flask API, JavaScript, HTML/CSS, and SQLite NBA dashboard.
   - **Takeaway**: Confirms SQLite can be a reasonable embedded query layer for a small-to-medium NBA dashboard.

5. **slieb74/NBA-Shot-Analysis**
   - **URL**: https://github.com/slieb74/NBA-Shot-Analysis
   - **Accessed**: 2026-05-08.
   - **Observed**: Shot-location analysis with ETL, classification models, binned shot charts, frequency heatmaps, and player/team shot visualizations.
   - **Takeaway**: Useful visual reference for shot charts and shot-frequency/efficiency displays.

### Tools and Libraries

1. **swar/nba_api**
   - **URL**: https://github.com/swar/nba_api
   - **Accessed**: 2026-05-08.
   - **Observed**: Python client for NBA.com APIs, with stats endpoints, live data endpoints, static player/team data, and pandas-compatible outputs.
   - **Planning note**: Useful for future refresh jobs, but NBA endpoint behavior is time-sensitive and should be verified before depending on it.

2. **jaebradley/basketball_reference_web_scraper**
   - **URL**: https://github.com/jaebradley/basketball_reference_web_scraper
   - **Accessed**: 2026-05-08.
   - **Observed**: Python scraper/API wrapper for Basketball Reference data.
   - **Planning note**: Useful as reference or fallback, but the local raw Basketball Reference export may be enough for initial work.

3. **JovaniPink/awesome-nba-data**
   - **URL**: https://github.com/JovaniPink/awesome-nba-data
   - **Accessed**: 2026-05-08.
   - **Observed**: Curated list of NBA data sources, APIs, analytics sites, and learning resources.
   - **Planning note**: Useful index for finding alternate data sources or validating source choices.

4. **mpope9/nba-sql**
   - **URL**: https://github.com/mpope9/nba-sql
   - **Accessed**: 2026-05-08.
   - **Observed**: Public project that builds NBA databases backed by SQLite, Postgres, MySQL, or MariaDB. It includes normalized tables such as `player`, `team`, `game`, `play_by_play`, `player_game_log`, `team_game_log`, `player_season`, `team_season`, `player_general_traditional_total`, and `shot_chart_detail`.
   - **Planning note**: Strong schema and ETL reference for converting NBA API style data into relational tables. Its README warns full historical database builds can take hours and calls out `play_by_play`, `play_by_playv3`, `shot_chart_detail`, and `pgtt` as especially slow tables.

5. **shufinskiy/nba-on-court**
   - **URL**: https://github.com/shufinskiy/nba-on-court
   - **Accessed**: 2026-05-08.
   - **Observed**: Python package for loading NBA play-by-play data, adding ten on-court player columns to play-by-play events, and merging play-by-play datasets from different sources by game/event identifiers or descriptions.
   - **Planning note**: Useful reference for later lineup, on/off, rotation, and teammate-context analysis. It reinforces that event-level joins across sources require careful key selection.

6. **mitchelldawkinsjr/NBA-Stat-Spot**
   - **URL**: https://github.com/mitchelldawkinsjr/NBA-Stat-Spot
   - **Accessed**: 2026-05-08.
   - **Observed**: Current FastAPI plus React/TypeScript NBA betting analytics application. README lists FastAPI, SQLite/Postgres via `DATABASE_URL`, SQLAlchemy, Alembic, pandas, httpx, optional Redis, React 19, Vite, TanStack Query, Recharts, Tailwind, Docker, and Nginx.
   - **Planning note**: Useful full-stack reference for backend/frontend separation, typed API contracts, optional production database migration path, caching, deployment docs, and betting-specific feature framing.

7. **GitHub `nba-analytics` topic page**
   - **URL**: https://github.com/topics/nba-analytics
   - **Accessed**: 2026-05-08.
   - **Observed**: Topic page listed 242 public repositories, with many notebook projects, Python packages, betting models, SQL builders, and visualization tools.
   - **Planning note**: Confirms the ecosystem is broad but fragmented; this project should differentiate by unifying local multi-source data with an interactive app rather than becoming another notebook-only analysis.

8. **tingkaiwu/nba-shot-visualization**
   - **URL**: https://github.com/tingkaiwu/nba-shot-visualization
   - **Accessed**: 2026-05-08.
   - **Observed**: React + D3 shot dashboard with player profile view, autocomplete search, four filters, and two shot themes: hexbin and scatter.
   - **Planning note**: Good frontend reference for the minimum useful shot chart interaction set: search, filters, scatter mode, and density/hexbin mode.

9. **MoonSulong/NBAVis**
   - **URL**: https://github.com/MoonSulong/NBAVis
   - **Accessed**: 2026-05-08.
   - **Observed**: React, D3, Ant Design player shooting dashboard that uses `d3-shotchart` for basketball court visualization.
   - **Planning note**: Suggests considering a court-drawing helper or local court component instead of hand-rolling every court path from scratch, while preserving enough control for custom overlays.

10. **ebaek/NBAShotTracker**
    - **URL**: https://github.com/ebaek/NBAShotTracker
    - **Accessed**: 2026-05-08.
    - **Observed**: D3 shot tracker with NBA court dimensions, hexagonal binning, player/game/quarter/defending-team filters, season breakdown pies, and a debounced player search.
    - **Planning note**: Strong product reference for shot chart UX. It notes shot coordinates were interpreted with origin at the rim and units of one-tenth of a foot, which should be validated against this project's local `x`, `y`, and `dist` fields before plotting.

11. **naveedgol/NBARotationChart**
    - **URL**: https://github.com/naveedgol/NBARotationChart
    - **Accessed**: 2026-05-08.
    - **Observed**: Archived visualization for displaying team performance against player rotations during NBA games.
    - **Planning note**: Useful concept reference for a later rotation/on-off feature, but archived status means it should not drive dependency choices.

12. **SQLite Write-Ahead Logging documentation**
    - **URL**: https://www.sqlite.org/wal.html
    - **Accessed**: 2026-05-08.
    - **Source date**: Page last updated 2026-04-13.
    - **Observed**: WAL mode adds `-wal` and `-shm` sidecar files, can improve read/write concurrency, requires checkpointing awareness, and the WAL file can be part of persistent database state if retained after abnormal close or persistent WAL settings.
    - **Planning note**: Relevant to the raw manifest mismatch and deployment/copy strategy for generated SQLite databases. The app should either avoid serving copied WAL-mode databases without sidecars or deliberately checkpoint/close/convert before distribution.

13. **D3 documentation: What is D3?**
    - **URL**: https://d3js.org/what-is-d3
    - **Accessed**: 2026-05-08.
    - **Observed**: D3 is a low-level toolbox for bespoke, dynamic, web-standard visualizations, not a conventional charting library. The docs suggest high-level libraries such as Observable Plot unless low-level control is needed.
    - **Planning note**: Use D3 where basketball-specific geometry matters, especially court and play-by-play visualizations. Avoid forcing every simple dashboard chart into custom D3 when a higher-level React chart can be faster and more maintainable.

14. **FastAPI SQL database tutorial**
    - **URL**: https://fastapi.tiangolo.com/tutorial/sql-databases/
    - **Accessed**: 2026-05-08.
    - **Observed**: FastAPI's SQL tutorial covers SQLModel/SQLAlchemy style session dependency injection and typed request/response models.
    - **Planning note**: Useful for endpoint/service shape, but this project may prefer read-only SQLAlchemy Core or `sqlite3`/`aiosqlite` for analytics queries if ORM models become too heavy for wide denormalized tables.

15. **NBA-Betting/NBA_AI**
    - **URL**: https://github.com/NBA-Betting/NBA_AI
    - **Accessed**: 2026-05-08.
    - **Observed**: Active 2026 public NBA betting/prediction project with a SQLite-backed data collection layer, play-by-play, box scores, betting lines, injuries, predictions, a Flask web app, a dashboard, starter database releases, and manual/cron pipeline update guidance.
    - **Planning note**: Useful reference for app-ready local SQLite distribution, daily update/backfill expectations, and separating the web app from data refresh execution. It reinforces that the NBA visualizer should not fetch data opportunistically from frontend requests.

16. **kyleskom/NBA-Machine-Learning-Sports-Betting**
    - **URL**: https://github.com/kyleskom/NBA-Machine-Learning-Sports-Betting
    - **Accessed**: 2026-05-08.
    - **Observed**: Popular NBA betting ML repo updated in 2026 that pulls NBA team stats into SQLite, pulls sportsbook odds/scores into a separate SQLite database, merges team stats, odds, scores, and rest days into game features, supports odds backfills, and includes a Flask app.
    - **Planning note**: Strong evidence for keeping stats and odds ingestion/reconciliation explicit. For this project, odds should be staged independently, matched to canonical games with status fields, and only then promoted to game-facing views.

17. **OddsMatrix sports data stack guide**
    - **URL**: https://oddsmatrix.com/sports-data-stack/
    - **Accessed**: 2026-05-08.
    - **Source date**: 2025-12-17.
    - **Observed**: Describes sportsbook data stacks around ingestion, storage/modeling, analytics dashboards, governance, and canonical entities such as event, market, selection, and odds history. It highlights identifier mapping across providers and pre-aggregations for dashboard responsiveness.
    - **Planning note**: Useful non-NBA-specific architecture reference for odds data. The local odds model should include event/game, market, selection, odds history, provider/source, timestamp, and match quality rather than flattening lines into only game rows.

18. **TanStack Query documentation**
    - **URL**: https://tanstack.com/query/latest
    - **Accessed**: 2026-05-08 via Context7 `/tanstack/query`.
    - **Observed**: TanStack Query supports server-state caching with query keys, `staleTime`, paginated queries using `placeholderData: keepPreviousData`, and infinite/cursor queries with `useInfiniteQuery`.
    - **Planning note**: Strong candidate for React API state because this app will have many filter-driven, paginated, cacheable read-only endpoints. Query keys must include all filters that affect the backend query.

19. **FastAPI response model and pagination documentation**
    - **URL**: https://fastapi.tiangolo.com/tutorial/response-model/
    - **Accessed**: 2026-05-08 via Context7 `/fastapi/fastapi`.
    - **Observed**: FastAPI path operations can use `response_model` for validation, filtering, and OpenAPI docs. FastAPI examples show offset/limit pagination with a capped `limit` using `Query(le=100)`.
    - **Planning note**: Backend plan should define typed response models and capped pagination/limit parameters for large player, game, odds, shot, and play-by-play result sets.

20. **D3 React integration documentation**
    - **URL**: https://d3js.org/getting-started
    - **Accessed**: 2026-05-08 via Context7 `/d3/d3`.
    - **Observed**: D3 can be used declaratively with React by using D3 scales/shape generators to compute SVG props, or imperatively for axes/selections through refs and effects.
    - **Planning note**: Prefer React-rendered SVG plus D3 math for most charts. Use imperative D3 DOM manipulation only for isolated chart internals where it is clearly simpler, with component boundaries that avoid React/D3 ownership conflicts.

21. **michaelmirandi/shotchart.d3.ts**
    - **URL**: https://github.com/michaelmirandi/shotchart.d3.ts
    - **Accessed**: 2026-05-08.
    - **Observed**: TypeScript React + D3 basketball shot chart library with `Halfcourt` and `ZonedShotchart` components, NBA/college court settings, zones, themes, and Storybook documentation. Repo appears small and last updated in 2023.
    - **Planning note**: Useful concept reference for component boundaries, court settings, and zone-based shot chart APIs. Do not adopt as a dependency without checking package health and coordinate compatibility.

## Additional Research Synthesis

### Reference Architecture Patterns
- **Local-first analytics**: Use the local `/raw` export and generated `/data` SQLite database as the source of truth for the first milestone. Defer live API refresh until the app has a stable schema and user-facing views.
- **Relational core plus summary tables**: Use normalized dimensions for teams, players, games, seasons, and source IDs. Use fact tables for team-game stats, player-game stats, play-by-play events, shots, and odds snapshots. Add summary tables for common dashboard views to avoid scanning large play-by-play tables on every request.
- **Source bridge tables**: Plan source-specific identifiers explicitly, such as Basketball Reference `player_id`, NBA/SportsData player IDs, team abbreviations, game IDs, and odds matchup names. Do not rely on names alone for joins.
- **Read-only backend contract**: Make FastAPI endpoints read-only for the initial app: filtered query endpoints, typed response models, pagination/limits for large event results, and explicit error messages when data is unavailable.
- **Frontend split**: Use D3 for court drawings, shot charts, play-by-play timelines, and custom spatial visuals. Use React state, typed API clients, and possibly a higher-level chart library for routine KPI cards, line charts, bar charts, and tables.
- **Refresh separate from serving**: Keep ETL/update jobs separate from FastAPI request handling. Current NBA betting references distribute or update SQLite databases through explicit pipeline commands, not frontend-triggered collection.
- **Odds as time-series facts**: Model odds as event-market-selection time-series snapshots with provider/source, timestamp, line/price, and match status. Do not collapse odds to a single closing line until a materialized summary table is created.
- **Capped paginated APIs**: Use backend-enforced limits for endpoints that can return many rows, especially play-by-play, shots, odds snapshots, game logs, and leaderboards.
- **Server-state cache discipline**: Use filter-complete frontend query keys and stale-time policies so changing season/team/player/game/market filters results in correct caching and refetch behavior.

### Data Model Implications
- **Games**: Need a canonical `games` table with season, game date, home/away teams, source game IDs, and final scores.
- **Teams**: Need canonical team rows plus aliases/history because historical abbreviations and franchise names change.
- **Players**: Need canonical player rows plus source ID bridges; handle multi-team season rows such as `2TM` separately from team-specific rows.
- **Shots**: Need a shot-specific table or materialized view derived from play-by-play with `game_id`, period, clock, team, player, result, shot type/subtype, `x`, `y`, `dist`, and score context when available.
- **Odds**: Need odds snapshot tables keyed by normalized teams, market, selection, line, price, timestamp, and game mapping status. Some odds rows may remain unmatched until matchup parsing is implemented.
- **Play-by-play**: Need indexes by `gameid`, `season`, `period`, `team`, `playerid`, and event type. Large raw scans should not be exposed directly to the frontend.
- **Markets and selections**: Add explicit `markets` and `selections` tables or typed columns for odds data so moneyline, spread, total, and detailed prop-like rows can be normalized consistently.
- **Update/run metadata**: Add ETL run tracking tables for source file, load time, row counts, checksum or byte metadata where appropriate, and warnings. This supports local reproducibility without editing `/raw`.
- **Materialized summaries**: Plan materialized tables for first/last odds, closing lines, team rolling stats, player season summaries, shot aggregates, and game-flow summaries to keep the API responsive.

### Visualization Implications
- **Shot charts**: Minimum viable shot chart should include scatter and density/hexbin modes, player/team filters, season/date filters, make/miss encoding, court overlay, and coordinate-system validation against known makes/shot distances.
- **Team performance**: Start with season and game-level team cards using pre-merged `raw/processed` or `raw/cumulative_scraped` data.
- **Player deep dive**: Start with season stats, game log, shooting profile, and shot chart. Add teammate/on-court and rotation context later.
- **Betting odds**: Start with line movement and closing line comparison, not prediction. Any betting feature should include clear informational-only wording.
- **Historical trends**: Use Basketball Reference team/player season tables for long-horizon league trends because they are compact and easier to query than play-by-play.
- **Data catalog**: Include a lightweight data catalog/metric dictionary early so users and future agents can understand which source powers each metric and whether a row is canonical, staged, or unmatched.
- **Game center**: Use the game detail page as the integration surface where schedule, box score, play-by-play, shots, odds, and source-matching quality can converge.
- **Source diagnostics**: Keep unmatched odds, ambiguous team aliases, unmapped players, and alternate play-by-play source comparisons visible in developer-facing tables rather than hiding data quality issues.
- **Paginated/event-heavy UX**: Use load-more or cursor-style UX for play-by-play and odds histories rather than rendering complete event histories by default.
- **React/D3 boundary**: For court and timeline visuals, prefer React-owned SVG with D3 scales/generators unless D3's join/axis behavior materially simplifies the implementation. This keeps component state predictable.
- **Odds dashboard framing**: Since betting references often emphasize prediction and wagering, this project should initially frame odds as informational analytics: market movement, consensus/closing comparison, and historical context rather than gambling advice.

### Technical Risks Added By Research
- **SQLite sidecars**: Existing SportsData SQLite files have WAL/SHM sidecars on disk. Generated app databases should document journal mode and checkpoint policy so copies do not lose uncheckpointed transactions.
- **Coordinate semantics**: External shot chart projects use NBA API coordinate conventions, but local play-by-play coordinate semantics must be verified before drawing court overlays.
- **Slow historical builds**: Other NBA database builders report multi-hour full builds, especially for play-by-play and shot detail. Plan incremental/idempotent ETL and per-source checkpoints.
- **Archived/old frontend examples**: Several shot chart references are old Create React App or vanilla JS projects. Use them for UX concepts, not dependency versions.
- **Notebook bias**: Many NBA analytics repos are notebooks. This project needs stronger API contracts, cached query patterns, and app-ready data shapes than notebook examples require.
- **Scope drift toward one visual**: Because shot charts are visually compelling, planning could accidentally under-model awards, draft, odds, schedules, and metadata. Use the All-Raw Representation Matrix as a planning checklist.
- **Odds matching ambiguity**: Pinnacle odds rows use matchup names and timestamps, while game tables use IDs/dates/teams. Plan explicit match status and do not drop unmatched rows silently.
- **Duplicate/alternate source conflicts**: SportsData, cumulative scraped, processed, and play-by-play exports can describe overlapping games and stats. Plan source priority rules and reconciliation diagnostics instead of assuming all duplicate-looking rows agree.

## Source Ledger

| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| Local raw data has seven expected source directories and large local-only data | Raw data manifest | `.agents/raw-data-manifest.md` | 2026-05-08 | 2026-05-08 | Manifest created from local filesystem metadata; `/raw` remains gitignored. |
| Notebook projects are useful for analytical chart ideas but not dashboard architecture | danchyy/Basketball_Analytics | https://github.com/danchyy/Basketball_Analytics | 2026-05-08 | Observed 2026-05-08 | Shot charts, play-by-play, assists, clutch, and team efficiency references. |
| Streamlit/AWS project separates pipeline/query/dashboard concerns | boyarkogc/nba-analytics-dashboard | https://github.com/boyarkogc/nba-analytics-dashboard | 2026-05-08 | Observed 2026-05-08 | Useful architecture comparison even though target stack differs. |
| Broad NBA dashboards often include head-to-head, rankings, distributions, injuries, and betting/fantasy use cases | nogibjj/BallersDash | https://github.com/nogibjj/BallersDash | 2026-05-08 | Observed 2026-05-08 | Product-scope reference. |
| SQLite can support an NBA dashboard architecture | helenaschatz/NBA-Dashboard | https://github.com/helenaschatz/NBA-Dashboard | 2026-05-08 | Observed 2026-05-08 | Flask + JS + SQLite reference. |
| Shot chart work should support binned and heatmap views | slieb74/NBA-Shot-Analysis | https://github.com/slieb74/NBA-Shot-Analysis | 2026-05-08 | Observed 2026-05-08 | Shot visualization reference. |
| NBA API client may support future refresh/live-data work | swar/nba_api | https://github.com/swar/nba_api | 2026-05-08 | Observed 2026-05-08 | Verify endpoint behavior before depending on it. |
| Basketball Reference scraper may be useful as a fallback/reference | jaebradley/basketball_reference_web_scraper | https://github.com/jaebradley/basketball_reference_web_scraper | 2026-05-08 | Observed 2026-05-08 | Local raw export may make scraping unnecessary initially. |
| Curated NBA data source list can support future source validation | JovaniPink/awesome-nba-data | https://github.com/JovaniPink/awesome-nba-data | 2026-05-08 | Observed 2026-05-08 | Good index for alternate APIs and data sites. |
| Local raw manifest baseline currently verifies, with SQLite sidecars allowed as additional files | Raw manifest verifier | `.agents/scripts/verify-raw-manifest.ps1` | 2026-05-08 | Observed 2026-05-08 | Fresh verifier output: 85 baseline files present; four SportsData SQLite `-wal`/`-shm` sidecars present as allowed additional raw files. |
| NBA relational schema can be modeled around players, teams, games, logs, play-by-play, and shot chart detail | mpope9/nba-sql | https://github.com/mpope9/nba-sql | 2026-05-08 | README observed 2026-05-08; latest repo activity Jan 2025 | Useful schema and ETL reference for SQLite/Postgres-compatible NBA database generation. |
| Play-by-play enriched with players-on-court enables lineup and rotation analysis | shufinskiy/nba-on-court | https://github.com/shufinskiy/nba-on-court | 2026-05-08 | README observed 2026-05-08; latest release May 2024 | Good reference for later lineup/on-off enrichment and multi-source PBP joins. |
| FastAPI plus React NBA betting app provides a current full-stack reference | mitchelldawkinsjr/NBA-Stat-Spot | https://github.com/mitchelldawkinsjr/NBA-Stat-Spot | 2026-05-08 | README observed 2026-05-08; repo active May 2026 | Useful reference for project structure, FastAPI backend, React frontend, Docker, caching, and betting disclaimers. |
| NBA analytics GitHub ecosystem is broad but fragmented | GitHub nba-analytics topic | https://github.com/topics/nba-analytics | 2026-05-08 | Topic observed 2026-05-08 | Listed 242 public repositories; reinforces need for app-ready multi-source integration. |
| React + D3 shot dashboards commonly use search, filters, scatter, and hexbin modes | tingkaiwu/nba-shot-visualization | https://github.com/tingkaiwu/nba-shot-visualization | 2026-05-08 | README observed 2026-05-08 | Useful UX reference for shot chart MVP interactions. |
| D3 shot chart helpers can reduce custom court-rendering effort | MoonSulong/NBAVis | https://github.com/MoonSulong/NBAVis | 2026-05-08 | README observed 2026-05-08 | References `d3-shotchart` and Ant Design; useful as a concept reference. |
| Shot chart UX should include hexbin density, make/miss encoding, filters, and coordinate validation | ebaek/NBAShotTracker | https://github.com/ebaek/NBAShotTracker | 2026-05-08 | README observed 2026-05-08 | Strong shot chart UX reference; coordinate assumptions must be validated locally. |
| Rotation views can show team performance against player rotations | naveedgol/NBARotationChart | https://github.com/naveedgol/NBARotationChart | 2026-05-08 | README observed 2026-05-08; archived Jan 2023 | Useful future feature concept, not a dependency reference. |
| SQLite WAL mode creates `-wal` and `-shm` sidecars and needs checkpoint/copy awareness | SQLite WAL documentation | https://www.sqlite.org/wal.html | 2026-05-08 | Page updated 2026-04-13 | Important for handling local SQLite files and generated app database distribution. |
| D3 is best reserved for bespoke, dynamic visualizations rather than routine dashboard charts | D3 documentation | https://d3js.org/what-is-d3 | 2026-05-08 | Observed 2026-05-08 | Supports D3 for court/spatial views and higher-level charts for routine views. |
| FastAPI supports typed database-backed endpoints with dependency-injected SQL sessions | FastAPI SQL database tutorial | https://fastapi.tiangolo.com/tutorial/sql-databases/ | 2026-05-08 | Observed 2026-05-08 | Useful baseline for backend endpoint/session patterns. |
| NBA local analytics apps can distribute/update SQLite databases via explicit pipelines rather than request-time fetching | NBA-Betting/NBA_AI | https://github.com/NBA-Betting/NBA_AI | 2026-05-08 | README observed 2026-05-08; latest commit Apr 2026 | Uses SQLite, play-by-play, box scores, betting lines, starter DB releases, and manual/cron data update commands. |
| Betting data pipelines often stage stats and odds separately before feature/game joins | kyleskom/NBA-Machine-Learning-Sports-Betting | https://github.com/kyleskom/NBA-Machine-Learning-Sports-Betting | 2026-05-08 | README observed 2026-05-08; latest release Jan 2026 | Pulls team stats into SQLite, sportsbook odds/scores into a separate SQLite DB, then merges stats, odds, scores, and rest days. |
| Odds analytics should model event, market, selection, odds history, provider mapping, and pre-aggregations | OddsMatrix sports data stack guide | https://oddsmatrix.com/sports-data-stack/ | 2026-05-08 | Published 2025-12-17 | Useful sportsbook data modeling reference; reinforces canonical event/market/selection entities and identifier mapping. |
| React API state should use filter-complete query keys, stale times, and pagination/infinite query patterns | TanStack Query docs | https://tanstack.com/query/latest | 2026-05-08 | Context7 observed 2026-05-08 | Supports cached read-only API UX for many filtered dashboard endpoints. |
| FastAPI endpoints should use typed response models and capped pagination for large result sets | FastAPI response model and pagination docs | https://fastapi.tiangolo.com/tutorial/response-model/ | 2026-05-08 | Context7 observed 2026-05-08 | Supports OpenAPI contracts and limit caps for large rows such as events, shots, odds, and leaderboards. |
| React + D3 can be integrated declaratively with D3 math or imperatively through refs for isolated DOM-managed chart internals | D3 getting started docs | https://d3js.org/getting-started | 2026-05-08 | Context7 observed 2026-05-08 | Guides component boundaries for custom court, shot, and timeline visualizations. |
| React+D3 basketball shot chart libraries can inform court/zone component APIs but require dependency-health review | michaelmirandi/shotchart.d3.ts | https://github.com/michaelmirandi/shotchart.d3.ts | 2026-05-08 | README observed 2026-05-08; last repo activity Jun 2023 | Useful concept reference for Halfcourt/ZonedShotchart components, NBA court settings, and Storybook-documented chart APIs. |

## Key Insights and Recommendations

### What Makes This Dataset Strong
1. **Multi-source integration**: Box scores, play-by-play, betting odds, SportsData.io exports, and historical Basketball Reference data are all available locally.
2. **Long play-by-play history**: Season files cover 1997 through 2026.
3. **Spatial events**: Play-by-play coordinates support shot charts, player heatmaps, and spatial shot profiles.
4. **Odds data**: Timestamped odds enable movement analysis and market-vs-result comparisons.
5. **Pre-merged processed data**: Existing processed box score files can accelerate early prototypes.
6. **Existing SQLite DBs**: SportsData.io includes queryable SQLite files, which supports the chosen data-layer direction.
7. **App-ready feature breadth**: The dataset can support not just static season charts but also shot maps, rotation context, odds movement, lineup/on-off analysis, and historical comparisons if the data model includes bridge IDs and summary tables.

### Candidate Architecture Direction
1. Build an ETL layer under `/etl/` that inventories raw data, normalizes IDs, and writes a unified SQLite database under `/data/`.
2. Build FastAPI under `/backend/` with read-only query endpoints for metadata, teams, players, games, schedules, box scores, shots, play-by-play slices, odds, awards, draft, and trends.
3. Build React + D3 under `/frontend/` for custom basketball visualizations, especially court-based shot charts, game-flow timelines, and source-aware analytic pages.
4. Use pre-aggregated tables or materialized query tables for expensive play-by-play views.
5. Treat external API refreshes as a later phase unless the user confirms live or incremental data is required.
6. Document SQLite journal/checkpoint policy for generated databases before any app deployment or database copying workflow.
7. Add a data catalog/metric dictionary endpoint and UI early, using `raw/metadata/data_dictionary.csv` and `raw/processed/column_mapping.json`, so the breadth of the raw data is discoverable.
8. Keep source-specific staging tables for overlapping SportsData, Basketball Reference, cumulative scraped, processed, odds, and play-by-play data; promote records into canonical tables only after mapping rules are explicit.
9. Keep refresh/backfill commands outside FastAPI request handlers. The backend should serve the current generated database; ETL should update or rebuild it through explicit commands.
10. Use TanStack Query or an equivalent server-state library for frontend API data if React remains the frontend choice. Query keys must include all filters and large result sets should use paginated or infinite-query patterns.
11. Treat odds as first-class time-series data with event, market, selection, provider, timestamp, price/line, and match status. Derive closing/opening summaries separately.

## Decisions Needed Before Planning

| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Unified database scope | One SQLite DB, multiple attached DBs, or hybrid | Start with one generated SQLite DB plus documented source tables | User/agent |
| Play-by-play performance strategy | Raw query, indexes, materialized tables, pre-aggregations | Plan indexes plus materialized summary tables for common views | Agent proposes, user approves |
| Player/team ID mapping | Use one canonical source or bridge tables | Create canonical team/player tables plus source-specific ID bridge tables | Agent proposes, user approves |
| Frontend charting | D3-only, D3 plus React chart helpers, or chart library-first | Use D3 for court/spatial views; consider React-native chart helpers for simpler non-spatial charts | User/agent |
| Data refresh | One-time local ETL, manual refresh, scheduled refresh, live API | Start local/historical only unless user requests live updates | User |
| Deployment | Local-only, private deployment, public deployment | Defer until architecture plan unless user has a hosting target | User |
| SQLite journal mode | WAL, DELETE, or mode-specific per workflow | Use whichever is safest for ETL, but checkpoint/close and document sidecar handling before serving or copying DB files | Agent proposes, user approves |
| First implementation slice | Data catalog, team dashboard, player deep dive, game center, odds dashboard, historical trends | Start with data catalog plus game/team/player primitives, then add one visually rich slice such as game center or player shot chart | User |
| Source reconciliation policy | Pick one source, merge all sources blindly, or stage-and-promote with bridge tables | Stage source-specific tables, define canonical tables, and expose match status for ambiguous rows | Agent proposes, user approves |
| Raw source coverage gate | Build one feature at a time without coverage tracking, or require every raw family to map to a planned table/API/view | Use the All-Raw Representation Matrix as the planning checklist | Agent |
| Frontend server-state library | Manual fetch state, Redux-style global store, TanStack Query, SWR | Prefer TanStack Query for read-only filtered APIs unless project setup reveals a lighter existing convention | Agent proposes, user approves |
| Odds fact grain | One row per game, one row per market, or time-series event-market-selection snapshots | Use time-series event-market-selection snapshots plus materialized opening/closing summaries | Agent proposes, user approves |
| ETL/run tracking | No tracking, logs only, or SQLite load metadata tables | Add load metadata tables with source file, row count, load timestamp, and warnings | Agent proposes, user approves |

## Open Questions / Risks
- [ ] **Data unification**: Which source is canonical for games, teams, players, and seasons?
- [ ] **PBP scale**: Play-by-play data is large enough that raw ad hoc queries may be slow without indexes and pre-aggregation.
- [ ] **Player/team ID mapping**: Different sources likely use different IDs and abbreviations.
- [ ] **Frontend chart complexity**: D3 + React integration needs clear component boundaries.
- [ ] **ETL refresh model**: One-time generation is simpler, but scheduled refreshes require stronger idempotency and source tracking.
- [ ] **Deployment target**: Hosting choice affects database file path, cache strategy, and backend/frontend build setup.
- [ ] **Live data**: Not confirmed. Do not design around real-time/live games unless the user asks.
- [ ] **Raw data reproducibility**: `/raw` is local-only; a fresh agent must check `.agents/raw-data-manifest.md`.
- [ ] **Raw sidecar handling**: `verify-raw-manifest.ps1` currently passes and treats four SportsData SQLite sidecar files as allowed additional raw files, but ETL/deployment still needs a journal/checkpoint policy before copying or serving SQLite databases.
- [ ] **SQLite WAL/copy behavior**: Generated SQLite DB handling must specify journal mode, checkpointing, and whether sidecar files are expected.
- [ ] **Shot coordinate validation**: Local `x`, `y`, and `dist` semantics must be verified before the first court visualization.
- [ ] **Odds-game matching**: Odds matchup names and timestamps need a match pipeline to canonical game IDs; preserve unmatched odds rows with reasons.
- [ ] **Source conflicts**: Overlapping game/team/player statistics across SportsData, processed, cumulative scraped, and Basketball Reference may disagree. Planning must define source priority and diagnostics.
- [ ] **All-source representation**: Planning must verify that every row in the All-Raw Representation Matrix maps to at least one planned table, endpoint, and frontend/admin view.
- [ ] **API result sizes**: Event, shot, odds, and leaderboard endpoints need hard caps and pagination to avoid accidental huge responses.
- [ ] **Dependency choice**: TanStack Query and shot chart helper libraries are only research-backed candidates; planning must decide whether to add dependencies or keep the first frontend minimal.
- [ ] **Refresh semantics**: Planning must define whether generated SQLite databases are rebuilt, incrementally updated, or copied from existing SportsData DBs, and how ETL run metadata is recorded.

## Fresh-Agent Handoff
- **Inputs read**: `INDEX.md`, `.agents/pipeline-state.json`, `.agents/tasks/initial-architecture/state.json`, `.agents/AGENTS.md`, `.agents/raw-data-manifest.md`, prior `.agents/tasks/initial-architecture/1-research/findings.md`, external sources in the Source Ledger, Firecrawl search/scrape results for NBA betting and sports data stack references, and Context7 documentation for TanStack Query, FastAPI, and D3.
- **Decisions made**: Continue with FastAPI, React + D3, and SQLite. Treat local `/raw` as the first data source. The project is a comprehensive NBA data platform, not a shot-chart-only app. Use D3 for bespoke court/spatial/game-flow visuals and consider higher-level React charts for routine dashboards. Plan for canonical dimensions, source ID bridges, fact tables, source-specific staging tables, metadata/catalog tables, and pre-aggregated summary tables.
- **Decisions deferred**: Canonical source for game/player/team IDs, first implementation slice, exact SQLite journal/checkpoint policy, deployment target, live refresh strategy, source priority/reconciliation rules, and odds-game matching rules.
- **Open blockers**: No current blocker to planning. SQLite sidecar handling remains a documented planning risk, not a manifest verification blocker.
- **Verification run or still needed**: Ran `.agents/scripts/validate-pipeline.ps1`; it passed. Ran `.agents/scripts/verify-raw-manifest.ps1`; it passed with 85 baseline files present and four allowed additional SQLite sidecars.
- **Next allowed action under phase gating**: Research is ready for approval. Ask the user whether to advance from `1-research` to `2-plan`. Planning must resolve or explicitly defer every decision and risk above.
- **Do not edit**: Do not edit `/raw`.
