# Raw Manifest Completeness - Research Findings

## Task Understanding
- **Refined description**: Ensure every file under `/raw` is explicitly accounted for by `.agents/raw-data-manifest.md` and enforced by `.agents/scripts/verify-raw-manifest.ps1`.
- **In scope**: Read-only recursive `/raw` inventory, manifest updates, verifier updates, and task/review artifacts.
- **Out of scope**: Editing `/raw`, checksumming large files, data quality analysis, ETL, or changing architecture recommendations.
- **Success criteria**: The manifest names all 85 raw files and the verifier fails on any missing, extra, or size-mismatched file.
- **Verification needed**: Run `verify-raw-manifest.ps1` and `validate-pipeline.ps1`.

## Codebase Context
- **Relevant files and directories**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`, `/raw`.
- **Existing patterns to follow**: Pipeline maintenance is recorded under `.agents/tasks/<task>/`.
- **Reusable code or assets**: Existing raw manifest source summaries and validator scaffolding.
- **Constraints**: Do not edit `/raw`; only read file metadata.

## Raw Data Manifest Check
- **Manifest checked**: Yes.
- **Manifest path**: `.agents/raw-data-manifest.md`
- **Local `/raw` match**: Recursive inventory found 85 files across seven top-level source directories.
- **Notes**: The previous script checked source counts and 16 critical files, but did not compare every raw path against an explicit manifest inventory.

## External Research
- **Libraries, APIs, or tools considered**: None.
- **Reference implementations**: None.
- **Key findings**: This is a local manifest completeness task.

## Source Ledger
| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| `/raw` currently contains 85 files | Local filesystem inventory | `/raw` | 2026-05-08 | 2026-05-08 | Read-only recursive file listing. |
| Existing verifier checked only aggregates and critical files | `.agents/scripts/verify-raw-manifest.ps1` | `.agents/scripts/verify-raw-manifest.ps1` | 2026-05-08 | 2026-05-08 | Needed exact path inventory enforcement. |

## Decisions Needed Before Planning
| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Manifest source of truth | Hardcode files in script or parse manifest inventory | Parse manifest inventory so docs and verifier cannot diverge silently | Agent |
| Size enforcement | Path-only, aggregate bytes, or per-file bytes | Enforce exact per-file bytes from manifest | Agent |

## Open Questions / Risks
- [x] **Skipped nested files**: Resolved by adding every recursive file path to the manifest inventory.
- [x] **Script/manifest drift**: Resolved by making the script parse the manifest inventory table.
- [x] **Raw edits**: No raw files were edited.

## Fresh-Agent Handoff
- **Inputs read**: Pipeline state, active task state, `.agents/AGENTS.md`, `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`, and recursive `/raw` file metadata.
- **Decisions made**: Manifest will include a complete file inventory and the verifier will parse it.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run verifier and pipeline validator after implementation.
- **Next allowed action**: Planning may specify manifest and verifier edits.

