# Pipeline Refinements - Research Findings

## Task Understanding
- **Refined description**: Apply all drift-reducing refinements identified in the pipeline audit.
- **In scope**: Pipeline mechanics, state schemas, templates, raw-data manifest verification guidance, and local validation scripts.
- **Out of scope**: Product architecture, backend/frontend/ETL implementation, raw data edits, and changing the active architecture research findings.
- **Success criteria**: Instructions have no skip-policy contradiction, approval history is required in transitions, terminal review rules are explicit, templates include fresh-agent handoff checklists, and validators can catch common state drift.
- **Verification needed**: Parse JSON files and run pipeline/raw manifest validation scripts.

## Codebase Context
- **Relevant files and directories**: `AGENTS.md`, `.agents/AGENTS.md`, `.agents/schema/`, `.agents/templates/`, `.agents/raw-data-manifest.md`, `.agents/tasks/`.
- **Existing patterns to follow**: Four-phase task pipeline with per-task `state.json`, phase outputs, and approval gating.
- **Reusable code or assets**: Existing templates and schema are the base for updates.
- **Constraints**: Do not edit `/raw`; pipeline artifacts must stay under `.agents/tasks/<task>/<phase>/`.

## Raw Data Manifest Check
- **Manifest checked**: Yes.
- **Manifest path**: `.agents/raw-data-manifest.md`
- **Local `/raw` match**: Existing manifest states the seven expected top-level sources were verified on 2026-05-08.
- **Notes**: This task depends on the manifest instructions, not raw data contents. No raw files were edited.

## External Research
- **Libraries, APIs, or tools considered**: None.
- **Reference implementations**: None.
- **Key findings**: This is an internal pipeline maintenance task; all decisions are based on local repo files.

## Source Ledger
| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| Pipeline mechanics and phase gating are defined locally | `.agents/AGENTS.md` | `.agents/AGENTS.md` | 2026-05-08 | 2026-05-08 | Source of truth for pipeline mechanics. |
| Root agent rules include non-negotiable project constraints | `AGENTS.md` | `AGENTS.md` | 2026-05-08 | 2026-05-08 | Applies to every agent session. |
| Raw data expectations are documented locally | `.agents/raw-data-manifest.md` | `.agents/raw-data-manifest.md` | 2026-05-08 | 2026-05-08 | Manifest should be tightened with exact checks. |

## Decisions Needed Before Planning
| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Skip policy | Ban skips entirely, or allow only explicit approved skips | Allow only explicit approved skips recorded in state | Agent |
| Approval history | Optional summary field, or required transition ledger | Require updates whenever approvals advance, skip, or complete phases | Agent |
| Validation | Prose only, schema only, or schema plus script | Add schemas plus PowerShell validators | Agent |
| Raw manifest checks | Approximate prose, or exact command/script checks | Add exact file-count and critical-file validation with byte tolerance | Agent |

## Open Questions / Risks
- [x] **Skip contradiction**: Resolve by allowing skips only with explicit user approval and recorded metadata.
- [x] **Approval drift**: Resolve by requiring `approval_history` entries for approval transitions.
- [x] **Final review ambiguity**: Resolve by adding terminal completion rules.
- [x] **Template handoff gaps**: Resolve by adding fresh-agent handoff sections.
- [x] **Validation gap**: Resolve by adding local scripts.

## Fresh-Agent Handoff
- **Inputs read**: Root `AGENTS.md`, `.agents/AGENTS.md`, pipeline state, task state, schema, templates, raw manifest, and active research findings.
- **Decisions made**: Apply all audit refinements as a dedicated pipeline maintenance task.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run JSON parse checks, pipeline validator, and raw manifest validator after implementation.
- **Next allowed action**: Planning phase may specify concrete file changes.

