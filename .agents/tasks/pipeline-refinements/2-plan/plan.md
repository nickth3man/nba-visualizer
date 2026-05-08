# Pipeline Refinements - Implementation Plan

## Research Risk Resolution
| Research question/risk | Resolution | Deferred? | Notes |
|---|---|---|---|
| Skip policy conflict | Root and source-of-truth docs will allow only explicitly approved, recorded skips. | No | Removes contradiction while preserving emergency escape hatch. |
| Approval history drift | Approval transitions will require appending `approval_history`. | No | Validator will flag missing entries for completed or skipped phases. |
| Final phase ambiguity | Review completion will use `action: "complete"` and keep `current_phase` at `4-review`. | No | Makes terminal state deterministic. |
| Phase-specific work ambiguity | Docs will distinguish pipeline artifacts from planned product code edits. | No | Prevents accidental refusal to edit app code. |
| Template handoff gaps | All phase templates will include fresh-agent handoff sections. | No | Reduces context loss. |
| Validation gaps | Add `pipeline-state.schema.json`, tighten `state.schema.json`, and add validation scripts. | No | Makes drift detectable. |
| Raw manifest looseness | Add exact count, critical-file, and byte-tolerance validation guidance. | No | Keeps data-dependent work grounded. |

## Subtask Breakdown

### Subtask 1: Tighten Pipeline Instructions
- **Files**: `AGENTS.md`, `.agents/AGENTS.md`
- **Dependencies**: None.
- **Steps**:
  1. Resolve skip-policy wording.
  2. Add approval-history transition rules.
  3. Add final review terminal rules.
  4. Clarify active-task handling and phase-artifact boundaries.
- **Expected output**: Pipeline instructions are internally consistent and easier to resume.
- **Verification**: Manual review plus pipeline validator.
- **Commit**: None unless user later requests it.

### Subtask 2: Strengthen Schemas and Validators
- **Files**: `.agents/schema/state.schema.json`, `.agents/schema/pipeline-state.schema.json`, `.agents/scripts/validate-pipeline.ps1`, `.agents/scripts/verify-raw-manifest.ps1`
- **Dependencies**: Subtask 1.
- **Steps**:
  1. Add status-specific schema requirements.
  2. Add schema for `pipeline-state.json`.
  3. Add pipeline state/order validation script.
  4. Add raw manifest verification script.
- **Expected output**: Common drift can be detected with local commands.
- **Verification**: Run both scripts.
- **Commit**: None unless user later requests it.

### Subtask 3: Update Templates and Manifest
- **Files**: `.agents/templates/*.md`, `.agents/raw-data-manifest.md`
- **Dependencies**: Subtask 1.
- **Steps**:
  1. Add fresh-agent handoff sections to all phase templates.
  2. Add decision traceability to the decision template.
  3. Replace loose raw-data verification guidance with exact validation guidance.
- **Expected output**: Future phase outputs capture enough context for accurate handoff.
- **Verification**: Manual review plus script checks.
- **Commit**: None unless user later requests it.

### Subtask 4: Record Implementation and Review
- **Files**: `.agents/tasks/pipeline-refinements/3-implement/tasks.md`, `.agents/tasks/pipeline-refinements/4-review/review.md`
- **Dependencies**: Subtasks 1-3.
- **Steps**:
  1. Record changed files and verification results.
  2. Write final review traceability.
  3. Ensure task state records approvals implied by the user's "Apply all" instruction.
- **Expected output**: Pipeline task is complete and auditable.
- **Verification**: Run validators after final state updates.
- **Commit**: None unless user later requests it.

## Dependency Graph
- Subtask 1: No dependencies.
- Subtask 2: Depends on Subtask 1.
- Subtask 3: Depends on Subtask 1.
- Subtask 4: Depends on Subtasks 1-3.

## Global Verification
- `Get-Content -Raw .agents/pipeline-state.json | ConvertFrom-Json | Out-Null`: JSON parses.
- `Get-Content -Raw .agents/tasks/pipeline-refinements/state.json | ConvertFrom-Json | Out-Null`: JSON parses.
- `Get-Content -Raw .agents/schema/state.schema.json | ConvertFrom-Json | Out-Null`: JSON parses.
- `Get-Content -Raw .agents/schema/pipeline-state.schema.json | ConvertFrom-Json | Out-Null`: JSON parses.
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1`: Pipeline state passes.
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1`: Local raw data matches manifest.

## Review Traceability Targets
- Every audit recommendation is represented in docs, templates, schemas, or scripts.
- Validation commands are recorded with pass/fail results.
- No files in `/raw` are edited.

## Fresh-Agent Handoff
- **Inputs read**: `.agents/tasks/pipeline-refinements/1-research/findings.md`, root and source-of-truth pipeline docs.
- **Decisions made**: Implement all audit refinements directly in pipeline files.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run global verification after implementation.
- **Next allowed action**: Implementation phase may edit listed files only.

