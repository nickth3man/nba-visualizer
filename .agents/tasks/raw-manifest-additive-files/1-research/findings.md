# Raw Manifest Additive Files - Research Findings

## Task Understanding
- **Refined description**: Update raw validation so SQLite sidecar/shim files created under `/raw` do not fail the verifier.
- **In scope**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`, and pipeline artifacts for this rule change.
- **Out of scope**: Editing `/raw`, adding sidecars to the baseline manifest, ETL behavior changes, or product code.
- **Success criteria**: The verifier fails when manifest-listed baseline files are missing, but allows additional files under `/raw`.
- **Verification needed**: Run `verify-raw-manifest.ps1` and `validate-pipeline.ps1`.

## Codebase Context
- **Relevant files and directories**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`, `/raw/sportsdata/sqlite/`.
- **Existing patterns to follow**: Pipeline maintenance tasks record research, plan, implementation tracker, and review.
- **Reusable code or assets**: Existing manifest inventory parsing logic.
- **Constraints**: Do not edit `/raw`.

## Raw Data Manifest Check
- **Manifest checked**: Yes.
- **Manifest path**: `.agents/raw-data-manifest.md`
- **Local `/raw` match**: Existing initial-architecture research records SQLite `-wal` and `-shm` sidecar files as actual additive files.
- **Notes**: SQLite sidecars may appear when SQLite databases are opened. Validation should not require an exact raw file set.

## External Research
- **Libraries, APIs, or tools considered**: None.
- **Reference implementations**: None.
- **Key findings**: This is a local policy correction.

## Source Ledger
| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| SQLite sidecars under `/raw` can appear during use | User clarification and initial research findings | `.agents/tasks/initial-architecture/1-research/findings.md` | 2026-05-08 | 2026-05-08 | Raw validation should allow additive sidecar files. |
| Raw manifest verifier currently fails on extra files | `.agents/scripts/verify-raw-manifest.ps1` | `.agents/scripts/verify-raw-manifest.ps1` | 2026-05-08 | 2026-05-08 | Exact actual-vs-manifest set comparison was too strict. |

## Decisions Needed Before Planning
| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Extra files under `/raw` | Fail, ignore, or allow and report | Allow and report | Agent |
| Baseline enforcement | Exact full set, or baseline must be present | Baseline must be present; nothing manifest-listed may be removed | Agent |

## Open Questions / Risks
- [x] **SQLite sidecars trip validation**: Resolve by allowing additive files.
- [x] **Baseline files may disappear unnoticed**: Keep missing manifest-listed files as hard failures.
- [x] **Raw edits**: No raw files will be modified.

## Fresh-Agent Handoff
- **Inputs read**: Pipeline state, active research, `.agents/AGENTS.md`, raw manifest, and verifier script.
- **Decisions made**: Manifest inventory is a baseline, not an exhaustive runtime file set.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run raw and pipeline validators after implementation.
- **Next allowed action**: Update manifest language and verifier behavior.

