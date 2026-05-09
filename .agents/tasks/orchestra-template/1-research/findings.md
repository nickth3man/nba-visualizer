# Orchestra Template - Research Findings

## Task Understanding
- **Refined description**: Create a reusable agent pipeline template named Orchestra that can be used in any future coding project.
- **In scope**: Generic root `AGENTS.md`, generic `.agents/AGENTS.md`, schemas, templates, pipeline validator, starter task, `.gitignore`, and README.
- **Out of scope**: NBA-specific rules, `/raw` rules, local data manifests, language/framework-specific assumptions, and project-specific product code.
- **Success criteria**: `Orchestra/` reads like a standalone repo, validates its starter task, and contains no domain-specific references.
- **Verification needed**: Search for project-specific residue and run the pipeline validator against `Orchestra/.agents`.

## Codebase Context
- **Relevant files and directories**: Current `.agents` pipeline files, `Orchestra/`.
- **Existing patterns to follow**: Four-phase Research -> Plan -> Implement -> Review pipeline.
- **Reusable code or assets**: Pipeline schemas, templates, and `validate-pipeline.ps1`.
- **Constraints**: Keep the template project-agnostic.

## Raw Data Manifest Check
- **Manifest checked**: N/A.
- **Manifest path**: N/A.
- **Local `/raw` match**: N/A.
- **Notes**: Raw/local-input handling is specific to this NBA project and must not be included in Orchestra core.

## External Research
- **Libraries, APIs, or tools considered**: None.
- **Reference implementations**: None.
- **Key findings**: This is a local packaging task.

## Source Ledger
| Claim or decision supported | Source | URL | Accessed | Source date | Notes |
|---|---|---|---|---|---|
| Existing pipeline mechanics are reusable | `.agents/AGENTS.md` | `.agents/AGENTS.md` | 2026-05-08 | 2026-05-08 | Basis for Orchestra's generic pipeline. |
| Raw/local input support is project-specific | User clarification | N/A | 2026-05-08 | 2026-05-08 | Must be excluded from Orchestra core. |

## Decisions Needed Before Planning
| Decision | Options | Recommendation | Owner |
|---|---|---|---|
| Include raw/local data support | Include core support, optional recipe, or exclude from core | Exclude from core | Agent |
| Include language assumptions | Pick common stack or remain agnostic | Remain agnostic | Agent |

## Open Questions / Risks
- [x] **Project-specific residue**: Remove `/raw`, NBA, and data-directory assumptions.
- [x] **Template validation**: Run validator against `Orchestra/.agents`.

## Fresh-Agent Handoff
- **Inputs read**: Existing pipeline docs, templates, schemas, scripts, and user clarifications.
- **Decisions made**: Orchestra core is only pipeline mechanics.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run residue search and validators after implementation.
- **Next allowed action**: Build/correct `Orchestra/`.

