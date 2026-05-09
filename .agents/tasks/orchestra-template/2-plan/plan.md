# Orchestra Template - Implementation Plan

## Research Risk Resolution
| Research question/risk | Resolution | Deferred? | Notes |
|---|---|---|---|
| Raw/local input support is project-specific | Remove it from Orchestra core. | No | Future projects can add their own project-specific rules. |
| Domain assumptions could leak in | Search and remove references to NBA, raw, sports, specific app directories, and stack choices. | No | Keeps template universal. |
| Template must validate | Run `validate-pipeline.ps1` with `-Root Orchestra/.agents`. | No | Confirms starter task state is internally consistent. |

## Subtask Breakdown

### Subtask 1: Create Generic Orchestra Scaffold
- **Files**: `Orchestra/**`
- **Dependencies**: None.
- **Steps**:
  1. Create repo-like `README.md`.
  2. Add generic root `AGENTS.md`.
  3. Add generic `.agents/AGENTS.md`, schemas, templates, validator, starter task, and `.gitignore`.
- **Expected output**: `Orchestra/` can be copied into a new project.
- **Verification**: Readback and search.
- **Commit**: None.

### Subtask 2: Remove Project-Specific Support
- **Files**: `Orchestra/**`
- **Dependencies**: Subtask 1.
- **Steps**:
  1. Remove raw-data manifest and raw verifier.
  2. Remove startup references to local data/input manifests.
  3. Remove NBA, sports, stack, and directory assumptions.
- **Expected output**: Orchestra is domain-agnostic.
- **Verification**: `rg` search for project-specific terms.
- **Commit**: None.

### Subtask 3: Validate and Record
- **Files**: `.agents/tasks/orchestra-template/**`, `.agents/pipeline-state.json`
- **Dependencies**: Subtasks 1-2.
- **Steps**:
  1. Run Orchestra pipeline validation.
  2. Run root pipeline validation.
  3. Record review results.
- **Expected output**: Both pipeline states validate.
- **Verification**: Validation commands pass.
- **Commit**: None.

## Dependency Graph
- Subtask 1: No dependencies.
- Subtask 2: Depends on Subtask 1.
- Subtask 3: Depends on Subtasks 1-2.

## Global Verification
- `rg -n "raw|local input|input data|data-dependent|verify-raw|manifest|NBA|sports|basketball|backend|frontend|etl|/data|2026|SQLite|sqlite" Orchestra`: No matches.
- `powershell -ExecutionPolicy Bypass -File Orchestra/.agents/scripts/validate-pipeline.ps1 -Root Orchestra/.agents`: Pass.
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1`: Pass.

## Review Traceability Targets
- `Orchestra/README.md` titled `Orchestra`.
- No raw/local input support in Orchestra core.
- No domain/language/framework assumptions in Orchestra core.

## Fresh-Agent Handoff
- **Inputs read**: Research findings and current Orchestra scaffold.
- **Decisions made**: Strip Orchestra to generic pipeline mechanics.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run global verification.
- **Next allowed action**: Implement corrections and validate.

