# NBA Visualizer & Data Analysis

An interactive web application for exploring and analyzing NBA data from multiple sources, covering 30+ years of basketball history.

## Data Sources

The `/raw` directory contains NBA data from several integrated sources (gitignored, not tracked):

| Source | Contents | Scope |
|--------|----------|-------|
| `cumulative_scraped/` | Game-level team stats (traditional, advanced, four-factors, misc, scoring) | 2006–present, ~51K games |
| `play_by_play/` | Event-level play-by-play with shot coordinates | 1997–2026, ~15M+ events |
| `basketball_reference/` | Player/team/opponent/awards/draft history | 1947–present |
| `sportsdata/` | Games, players, stats, box scores, schedules, SQLite DBs | Multi-source |
| `odds/` | Pinnacle betting odds (moneyline, spread, totals) with timestamps | Current seasons |
| `processed/` | Pre-merged denormalized box scores | 2006–present |

## Tech Stack (Planned)

- **Backend**: FastAPI (Python)
- **Frontend**: React with D3.js
- **Data Layer**: SQLite (existing `sportsdata/` DBs + new unified DB)
- **Visualizations**: D3.js (shot charts, court visualizations, interactive charts)
- **Data Processing**: Pandas/Polars for ETL into SQLite

## Feature Roadmap

- [ ] **Team Performance** — Efficiency trends, four factors, home/away splits, season comparisons
- [ ] **Player Deep-Dive** — Career arcs, per-game stats, player comparisons, draft analysis
- [ ] **Shot Charts & Spatial Analysis** — Heatmaps from PBP coordinates, player shot zones, distance analysis
- [ ] **Betting Odds Analysis** — Odds movement, line vs actual, spread coverage trends
- [ ] **Play-by-Play Analysis** — Clutch time performance, run detection, lineup +/- tracking, assist networks
- [ ] **Historical League Trends** — Evolution of pace, 3P rate, scoring, and efficiency (1997–present)

## Project Structure

```
nba-visualizer/
├── raw/                  # Raw data (gitignored)
├── planning/             # Research and planning documents
├── backend/              # FastAPI application (planned)
├── frontend/             # React application (planned)
├── etl/                  # Data pipeline scripts (planned)
└── data/                 # SQLite databases (planned)
```

## Getting Started

*Project is in planning phase. Implementation coming soon.*