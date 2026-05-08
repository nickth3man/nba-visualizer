# Pipeline Refinements - Subtask Tracker

| # | Subtask | Status | Changed files | Verification | Commit | Notes |
|---|---|---|---|---|---|---|
| 1 | Tighten Pipeline Instructions | completed | `AGENTS.md`, `.agents/AGENTS.md` | pass | - | Resolved skip wording, approval history, terminal review, task switching, and scope boundary. |
| 2 | Strengthen Schemas and Validators | completed | `.agents/schema/state.schema.json`, `.agents/schema/pipeline-state.schema.json`, `.agents/scripts/validate-pipeline.ps1`, `.agents/scripts/verify-raw-manifest.ps1` | pass | - | Added semantic pipeline validator and raw manifest checker. |
| 3 | Update Templates and Manifest | completed | `.agents/templates/findings.md`, `.agents/templates/plan.md`, `.agents/templates/tasks.md`, `.agents/templates/review.md`, `.agents/templates/decisions.md`, `.agents/raw-data-manifest.md` | pass | - | Added fresh-agent handoff sections and stricter raw validation guidance. |
| 4 | Record Implementation and Review | completed | `.agents/tasks/pipeline-refinements/3-implement/tasks.md`, `.agents/tasks/pipeline-refinements/4-review/review.md`, `.agents/tasks/pipeline-refinements/state.json`, `.agents/pipeline-state.json` | pass | - | Recorded approvals implied by user's "Apply all" instruction. |

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
| `Get-Content -Raw .agents/pipeline-state.json | ConvertFrom-Json | Out-Null` | pass | JSON parses. |
| `Get-Content -Raw .agents/tasks/pipeline-refinements/state.json | ConvertFrom-Json | Out-Null` | pass | JSON parses. |
| `Get-Content -Raw .agents/schema/state.schema.json | ConvertFrom-Json | Out-Null` | pass | Schema parses as JSON. |
| `Get-Content -Raw .agents/schema/pipeline-state.schema.json | ConvertFrom-Json | Out-Null` | pass | Schema parses as JSON. |
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1` | pass | Pipeline validation passed. |
| `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1` | pass | Raw manifest verification passed. |

## Fresh-Agent Handoff
- **Inputs read**: Pipeline audit findings, `.agents/tasks/pipeline-refinements/2-plan/plan.md`, and `.agents/tasks/pipeline-refinements/2-plan/decisions.md`.
- **Decisions made**: Implemented all requested drift-reduction refinements.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: JSON parse checks, pipeline validation, and raw manifest verification passed.
- **Next allowed action**: Review phase may mark this maintenance task complete.
