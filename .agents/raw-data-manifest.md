# Raw Data Manifest

Last verified: 2026-05-08

This file documents the required baseline local `/raw` inputs for agents. `/raw` is gitignored and must not be edited by agents. Use this manifest to detect removed or mismatched baseline data before research, planning, ETL, backend, or visualization work that depends on raw datasets.

Runtime tools may add files under `/raw`, especially SQLite sidecars such as `*.sqlite-wal` and `*.sqlite-shm`. Additive files are allowed and should be reported by validation, not treated as failures. The hard rule is that nothing listed in this manifest should be removed from `/raw`.

## Expected Top-Level Sources

| Source directory | Expected files | Approx bytes | Required? | Notes |
|---|---:|---:|---|---|
| `raw/basketball_reference/` | 22 | 32641274 | Yes | Historical player, team, opponent, awards, and draft CSVs. |
| `raw/cumulative_scraped/` | 6 | 26950932 | Yes | Game-level team stats CSVs plus `.gitkeep`. |
| `raw/metadata/` | 1 | 11974 | Yes | Data dictionary. |
| `raw/odds/` | 4 | 17899889 | Yes | Pinnacle NBA and preseason odds CSVs. |
| `raw/play_by_play/` | 31 | 3085850797 | Yes | Season CSVs plus combined parquet. |
| `raw/processed/` | 3 | 37709158 | Yes | Pre-merged box scores and column mapping. |
| `raw/sportsdata/` | 18 | 11857425128 | Yes | SportsData.io CSVs and SQLite DBs. |

## Complete Raw File Inventory

This table is the required baseline inventory for `/raw`. The verifier parses this table and fails if any listed file is missing from disk, any duplicate path is listed, or any listed file byte count differs. Additional runtime files under `/raw` are allowed and reported separately.

| Path | Bytes | Source |
|---|---:|---|
| `raw/basketball_reference/awards/All-Star Selections.csv` | 92617 | basketball_reference |
| `raw/basketball_reference/awards/End of Season Teams (Voting).csv` | 328826 | basketball_reference |
| `raw/basketball_reference/awards/End of Season Teams.csv` | 110988 | basketball_reference |
| `raw/basketball_reference/awards/Player Award Shares.csv` | 213848 | basketball_reference |
| `raw/basketball_reference/draft/Draft Pick History.csv` | 462002 | basketball_reference |
| `raw/basketball_reference/opponent/Opponent Stats Per 100 Poss.csv` | 216881 | basketball_reference |
| `raw/basketball_reference/opponent/Opponent Stats Per Game.csv` | 270919 | basketball_reference |
| `raw/basketball_reference/opponent/Opponent Totals.csv` | 274343 | basketball_reference |
| `raw/basketball_reference/player/Advanced.csv` | 4662734 | basketball_reference |
| `raw/basketball_reference/player/Per 100 Poss.csv` | 4255803 | basketball_reference |
| `raw/basketball_reference/player/Per 36 Minutes.csv` | 4620323 | basketball_reference |
| `raw/basketball_reference/player/Player Career Info.csv` | 515762 | basketball_reference |
| `raw/basketball_reference/player/Player Per Game.csv` | 4721100 | basketball_reference |
| `raw/basketball_reference/player/Player Play By Play.csv` | 1794892 | basketball_reference |
| `raw/basketball_reference/player/Player Season Info.csv` | 1513430 | basketball_reference |
| `raw/basketball_reference/player/Player Shooting.csv` | 2884414 | basketball_reference |
| `raw/basketball_reference/player/Player Totals.csv` | 4525355 | basketball_reference |
| `raw/basketball_reference/team/Team Abbrev.csv` | 66512 | basketball_reference |
| `raw/basketball_reference/team/Team Stats Per 100 Poss.csv` | 216771 | basketball_reference |
| `raw/basketball_reference/team/Team Stats Per Game.csv` | 277068 | basketball_reference |
| `raw/basketball_reference/team/Team Summaries.csv` | 336183 | basketball_reference |
| `raw/basketball_reference/team/Team Totals.csv` | 280503 | basketball_reference |
| `raw/cumulative_scraped/.gitkeep` | 0 | cumulative_scraped |
| `raw/cumulative_scraped/games_advanced.csv` | 6262195 | cumulative_scraped |
| `raw/cumulative_scraped/games_four-factors.csv` | 4727423 | cumulative_scraped |
| `raw/cumulative_scraped/games_misc.csv` | 3763122 | cumulative_scraped |
| `raw/cumulative_scraped/games_scoring.csv` | 6483999 | cumulative_scraped |
| `raw/cumulative_scraped/games_traditional.csv` | 5714193 | cumulative_scraped |
| `raw/metadata/data_dictionary.csv` | 11974 | metadata |
| `raw/odds/leagues/nba/detailed_odds.csv` | 14925823 | odds |
| `raw/odds/leagues/nba/main_lines.csv` | 1610657 | odds |
| `raw/odds/leagues/nba_preseason/detailed_odds.csv` | 1230576 | odds |
| `raw/odds/leagues/nba_preseason/main_lines.csv` | 132833 | odds |
| `raw/play_by_play/csv_by_season/pbp1997.csv` | 67595210 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp1998.csv` | 69083950 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp1999.csv` | 43125239 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2000.csv` | 70531910 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2001.csv` | 69229124 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2002.csv` | 68650589 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2003.csv` | 69609204 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2004.csv` | 69165167 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2005.csv` | 72163560 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2006.csv` | 71961720 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2007.csv` | 71965951 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2008.csv` | 71864924 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2009.csv` | 71791823 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2010.csv` | 71934189 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2011.csv` | 72436264 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2012.csv` | 58828819 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2013.csv` | 72783526 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2014.csv` | 75015646 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2015.csv` | 74819122 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2016.csv` | 77506748 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2017.csv` | 77441250 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2018.csv` | 75370445 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2019.csv` | 78491908 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2020.csv` | 68946456 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2021.csv` | 68941441 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2022.csv` | 78162011 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2023.csv` | 78758375 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2024.csv` | 82067675 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2025.csv` | 75735586 | play_by_play |
| `raw/play_by_play/csv_by_season/pbp2026.csv` | 79609354 | play_by_play |
| `raw/play_by_play/parquet/PlayByPlay.parquet` | 932263611 | play_by_play |
| `raw/processed/column_mapping.json` | 1614 | processed |
| `raw/processed/games_boxscores.csv` | 21431445 | processed |
| `raw/processed/teams_boxscores.csv` | 16276099 | processed |
| `raw/sportsdata/csv/game_odds.csv` | 95556270 | sportsdata |
| `raw/sportsdata/csv/Games.csv` | 11196475 | sportsdata |
| `raw/sportsdata/csv/Games_1.csv` | 11199896 | sportsdata |
| `raw/sportsdata/csv/games_index.csv` | 5236144 | sportsdata |
| `raw/sportsdata/csv/games_schedule.csv` | 214914 | sportsdata |
| `raw/sportsdata/csv/play_by_play.csv` | 3182501402 | sportsdata |
| `raw/sportsdata/csv/player_boxscores.csv` | 765805135 | sportsdata |
| `raw/sportsdata/csv/Players.csv` | 524037 | sportsdata |
| `raw/sportsdata/csv/PlayerStatistics.csv` | 389443048 | sportsdata |
| `raw/sportsdata/csv/PlayerStatisticsExtended.csv` | 452908343 | sportsdata |
| `raw/sportsdata/csv/team_boxscores.csv` | 61007875 | sportsdata |
| `raw/sportsdata/csv/TeamHistories.csv` | 6947 | sportsdata |
| `raw/sportsdata/csv/TeamStatistics.csv` | 36001807 | sportsdata |
| `raw/sportsdata/csv/TeamStatisticsExtended.csv` | 38153223 | sportsdata |
| `raw/sportsdata/schedules/LeagueSchedule24_25.csv` | 147173 | sportsdata |
| `raw/sportsdata/schedules/LeagueSchedule25_26.csv` | 187527 | sportsdata |
| `raw/sportsdata/sqlite/nba_stats.sqlite` | 1234792448 | sportsdata |
| `raw/sportsdata/sqlite/nba_stats_pbp.sqlite` | 5572542464 | sportsdata |

## Critical Files

| Path | Purpose |
|---|---|
| `raw/cumulative_scraped/games_traditional.csv` | Core game/team box score facts. |
| `raw/cumulative_scraped/games_advanced.csv` | Advanced team metrics. |
| `raw/cumulative_scraped/games_four-factors.csv` | Four-factor metrics. |
| `raw/cumulative_scraped/games_misc.csv` | Miscellaneous scoring/team metrics. |
| `raw/cumulative_scraped/games_scoring.csv` | Scoring breakdown metrics. |
| `raw/metadata/data_dictionary.csv` | Column and source documentation. |
| `raw/play_by_play/csv_by_season/pbp1997.csv` | Earliest play-by-play season file. |
| `raw/play_by_play/csv_by_season/pbp2026.csv` | Latest play-by-play season file as of this manifest. |
| `raw/play_by_play/parquet/PlayByPlay.parquet` | Combined play-by-play parquet file. |
| `raw/processed/games_boxscores.csv` | Pre-merged game-level box scores. |
| `raw/processed/teams_boxscores.csv` | Pre-merged team-game box scores. |
| `raw/processed/column_mapping.json` | Display-name to slug mapping. |
| `raw/odds/leagues/nba/main_lines.csv` | NBA main betting lines. |
| `raw/odds/leagues/nba/detailed_odds.csv` | NBA detailed odds. |
| `raw/sportsdata/sqlite/nba_stats.sqlite` | SportsData.io SQLite stats database. |
| `raw/sportsdata/sqlite/nba_stats_pbp.sqlite` | SportsData.io SQLite play-by-play database. |

## Verification Command

Run this read-only check before data-dependent work:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1
```

The script verifies:

- The complete raw file inventory table has the required baseline files expected under `/raw`.
- Every listed manifest file exists on disk.
- Every listed file byte count matches exactly.
- The exact expected top-level source directory names.
- Exact baseline file counts for each expected source directory.
- Critical file presence.
- Total source bytes match the manifest source summaries.
- Additional files under `/raw` are allowed and reported.

For manual inspection, this command summarizes the same source directories:

```powershell
Get-ChildItem -Force raw -Directory | ForEach-Object {
  $files = Get-ChildItem -LiteralPath $_.FullName -Recurse -File -ErrorAction SilentlyContinue
  [PSCustomObject]@{
    Name = $_.Name
    FileCount = ($files | Measure-Object).Count
    TotalBytes = ($files | Measure-Object -Property Length -Sum).Sum
  }
} | Format-Table -AutoSize
```

Expected source directory names:

```text
basketball_reference
cumulative_scraped
metadata
odds
play_by_play
processed
sportsdata
```

Validation rules:

- Complete inventory paths and per-file byte counts are exact for the required baseline. A missing baseline file or byte mismatch must be recorded in the current phase output before continuing.
- Source file counts and byte totals must equal the complete inventory baseline.
- Actual `/raw` may contain additional runtime files. Do not remove them, and do not treat them as validation failures unless a task explicitly depends on an exact no-extra-files snapshot.
- Critical files listed above are mandatory for data-dependent work unless the task explicitly scopes around the missing source.

## Fresh-Agent Handling

- If `/raw` is missing, do not make data architecture decisions from memory. Mark the data-dependent work blocked and ask the user to restore `/raw`.
- If baseline counts, baseline byte counts, or critical files differ, record the mismatch in the current phase output before continuing.
- If a dataset has changed since this manifest, update this manifest only after reading metadata and confirming the change with the user.
- Do not add raw data, derived data, samples, SQLite sidecars, or checksums of large raw files to git unless the user explicitly asks.
