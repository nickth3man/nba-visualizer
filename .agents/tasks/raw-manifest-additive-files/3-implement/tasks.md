# Raw Manifest Additive Files - Subtask Tracker

| # | Subtask | Status | Changed files | Verification | Commit | Notes |
|---|---|---|---|---|---|---|
| 1 | Update Manifest Policy | completed | `.agents/raw-data-manifest.md` | pass | - | Manifest now defines the inventory as a required baseline and allows additive runtime files. |
| 2 | Update Verifier | completed | `.agents/scripts/verify-raw-manifest.ps1` | pass | - | Extra raw files are reported as allowed; missing baseline files still fail. |
| 3 | Record and Validate | completed | `.agents/tasks/raw-manifest-additive-files/**`, `.agents/pipeline-state.json` | pass | - | Pipeline validation passed. |

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
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1` | pass | Passed with 85 baseline files present and 4 additional SQLite sidecar files reported as allowed. |
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1` | pass | Pipeline validation passed. |

## Fresh-Agent Handoff
- **Inputs read**: Research findings, plan, decisions, manifest, verifier script, and validation output.
- **Decisions made**: Additive raw files are allowed and reported; baseline removals remain failures.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Raw verifier and pipeline validator passed.
- **Next allowed action**: Report completion.
