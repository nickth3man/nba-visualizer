# Agents

## Non-Negotiable Rules

- Do not edit any files in `/raw`.
- All work must flow through the `.agents/` pipeline. Do not skip phases unless the user explicitly approves the skip and it is recorded as `skipped` in task state.
- Read `.agents/tasks/<active_task>/1-research/findings.md` before making architectural decisions.
- Treat `.agents/AGENTS.md` as the source of truth for pipeline mechanics.
- The year is 2026.

## Startup Checklist

Every session starts by reading:

1. `.agents/pipeline-state.json` to identify the active task.
2. `.agents/tasks/<active_task>/state.json` to identify the current phase and status.
3. All completed phase outputs, plus any existing output/tracker file for the current phase.
4. `.agents/AGENTS.md` for the current phase instructions.
5. `.agents/raw-data-manifest.md` before any work that depends on local raw data.

Never advance a phase until its required output exists and the user has approved moving forward. When a phase output is ready but approval has not been granted, set that phase to `ready_for_approval`.

If the user's request does not belong to the active task, create or switch to the appropriate task under `.agents/tasks/` before editing project files. Preserve unrelated task state, especially phases waiting for approval.

After editing task state, pipeline state, schemas, templates, or manifest instructions, run the relevant validator from `.agents/scripts/` when it exists.

## Terminology

- **Task**: A top-level unit listed in `.agents/pipeline-state.json`, with its own `state.json` and phase directories.
- **Phase**: One of `1-research`, `2-plan`, `3-implement`, or `4-review` for a task.
- **Subtask**: A numbered implementation work item created during planning and tracked in `3-implement/tasks.md`.

## Phase Order

```
1-research/findings.md -> 2-plan/plan.md -> 3-implement/tasks.md -> 4-review/review.md
```

## Project Context

### Tech Stack Decisions

- **Backend**: FastAPI (Python)
- **Frontend**: React + D3.js
- **Data Layer**: SQLite (unify existing DBs into a queryable backend)
- **All features** selected: team performance, player deep-dive, shot charts, betting odds, play-by-play analysis, historical league trends

### Key Files

| File | Purpose |
|------|---------|
| `.agents/AGENTS.md` | Phase instructions for the pipeline |
| `.agents/raw-data-manifest.md` | Expected local `/raw` contents and freshness checks |
| `.agents/tasks/initial-architecture/1-research/findings.md` | Complete data inventory, GitHub research, recommendations |
| `/raw/` | All raw data (gitignored, 7 sources) |

### Data Layer Design

The project will use SQLite as the primary query engine. Existing SQLite DBs exist in `/raw/sportsdata/sqlite/`. Large CSV files (especially play-by-play) will be converted into a unified SQLite database for the backend.

### Conventions

- Backend code in `/backend/`
- Frontend code in `/frontend/`
- ETL scripts in `/etl/`
- Generated/processed data in `/data/` (gitignored)
