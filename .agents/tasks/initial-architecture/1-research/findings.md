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
- **Local `/raw` match**: Matches the expected seven top-level source directories as of 2026-05-08.
- **Important caveat**: `/raw` is gitignored. A fresh clone is not fully reproducible unless the user provides the same local raw data or an updated manifest.

## Local Data Inventory

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
- **Files**: 18 files, including CSVs and SQLite databases.
- **SQLite DBs**: `nba_stats.sqlite`, `nba_stats_pbp.sqlite`.
- **Use**: Player stats, team stats, schedules, odds, box scores, and alternate play-by-play source.

### 6. `raw/odds/` - Pinnacle Betting Odds
- **Files**: `main_lines.csv` and `detailed_odds.csv` for NBA and NBA preseason.
- **Use**: Odds movement, market efficiency, spread/total comparisons, and actual result overlays.

### 7. `raw/metadata/`
- **Files**: `data_dictionary.csv`.
- **Use**: Column descriptions, data types, and source documentation.

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

## Key Insights and Recommendations

### What Makes This Dataset Strong
1. **Multi-source integration**: Box scores, play-by-play, betting odds, SportsData.io exports, and historical Basketball Reference data are all available locally.
2. **Long play-by-play history**: Season files cover 1997 through 2026.
3. **Spatial events**: Play-by-play coordinates support shot charts, player heatmaps, and spatial shot profiles.
4. **Odds data**: Timestamped odds enable movement analysis and market-vs-result comparisons.
5. **Pre-merged processed data**: Existing processed box score files can accelerate early prototypes.
6. **Existing SQLite DBs**: SportsData.io includes queryable SQLite files, which supports the chosen data-layer direction.

### Candidate Architecture Direction
1. Build an ETL layer under `/etl/` that inventories raw data, normalizes IDs, and writes a unified SQLite database under `/data/`.
2. Build FastAPI under `/backend/` with read-only query endpoints for teams, players, games, shots, play-by-play slices, odds, and trends.
3. Build React + D3 under `/frontend/` for custom basketball visualizations, especially court-based shot charts and time-series views.
4. Use pre-aggregated tables or materialized query tables for expensive play-by-play views.
5. Treat external API refreshes as a later phase unless the user confirms live or incremental data is required.

## Decisions Needed Before Planning

| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Unified database scope | One SQLite DB, multiple attached DBs, or hybrid | Start with one generated SQLite DB plus documented source tables | User/agent |
| Play-by-play performance strategy | Raw query, indexes, materialized tables, pre-aggregations | Plan indexes plus materialized summary tables for common views | Agent proposes, user approves |
| Player/team ID mapping | Use one canonical source or bridge tables | Create canonical team/player tables plus source-specific ID bridge tables | Agent proposes, user approves |
| Frontend charting | D3-only, D3 plus React chart helpers, or chart library-first | Use D3 for court/spatial views; consider React-native chart helpers for simpler non-spatial charts | User/agent |
| Data refresh | One-time local ETL, manual refresh, scheduled refresh, live API | Start local/historical only unless user requests live updates | User |
| Deployment | Local-only, private deployment, public deployment | Defer until architecture plan unless user has a hosting target | User |

## Open Questions / Risks
- [ ] **Data unification**: Which source is canonical for games, teams, players, and seasons?
- [ ] **PBP scale**: Play-by-play data is large enough that raw ad hoc queries may be slow without indexes and pre-aggregation.
- [ ] **Player/team ID mapping**: Different sources likely use different IDs and abbreviations.
- [ ] **Frontend chart complexity**: D3 + React integration needs clear component boundaries.
- [ ] **ETL refresh model**: One-time generation is simpler, but scheduled refreshes require stronger idempotency and source tracking.
- [ ] **Deployment target**: Hosting choice affects database file path, cache strategy, and backend/frontend build setup.
- [ ] **Live data**: Not confirmed. Do not design around real-time/live games unless the user asks.
- [ ] **Raw data reproducibility**: `/raw` is local-only; a fresh agent must check `.agents/raw-data-manifest.md`.

## Handoff Notes
- Research is ready for user approval, but no phase is formally completed until approval is recorded in `state.json`.
- Next allowed action: ask the user whether to advance from `1-research` to `2-plan`.
- During planning, resolve or explicitly defer every item in "Decisions Needed Before Planning" and "Open Questions / Risks".
- Do not edit `/raw`.
