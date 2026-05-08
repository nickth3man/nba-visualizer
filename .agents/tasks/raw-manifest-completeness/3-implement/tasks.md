# Raw Manifest Completeness - Subtask Tracker

| # | Subtask | Status | Changed files | Verification | Commit | Notes |
|---|---|---|---|---|---|---|
| 1 | Add Complete Manifest Inventory | completed | `.agents/raw-data-manifest.md` | pass | - | Added 85-row complete raw file inventory with exact byte counts. |
| 2 | Update Raw Manifest Verifier | completed | `.agents/scripts/verify-raw-manifest.ps1` | pass | - | Script now parses the manifest inventory and fails on missing, extra, duplicate, or byte-mismatched files. |
| 3 | Record and Validate | completed | `.agents/tasks/raw-manifest-completeness/**`, `.agents/pipeline-state.json` | pass | - | Added task artifacts and validation records. |

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
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1` | pass | Raw manifest verification passed; 85 files accounted for. |
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1` | pass | Pipeline validation passed. |

## Fresh-Agent Handoff
- **Inputs read**: Plan, decisions, raw manifest, verifier script, and read-only recursive `/raw` inventory.
- **Decisions made**: Manifest inventory is the verifier's source of truth; exact per-file bytes are enforced.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Raw manifest verification and pipeline validation passed.
- **Next allowed action**: Report completion.
