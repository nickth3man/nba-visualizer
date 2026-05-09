# Raw Manifest Additive Files - Implementation Plan

## Research Risk Resolution
| Research question/risk | Resolution | Deferred? | Notes |
|---|---|---|---|
| SQLite sidecars can be created under `/raw` | Treat manifest inventory as required baseline, not exact actual file set. | No | Additional files are allowed and reported. |
| Raw files could be removed | Keep missing manifest-listed files and missing critical files as hard failures. | No | This implements "nothing should be removed from /raw." |
| Source summary counts could fail due extras | Compare source summaries to baseline inventory, not actual runtime file set. | No | Extra files do not invalidate baseline summaries. |

## Subtask Breakdown

### Subtask 1: Update Manifest Policy
- **Files**: `.agents/raw-data-manifest.md`
- **Dependencies**: None.
- **Steps**:
  1. Clarify that the complete inventory is a required baseline.
  2. Document additive runtime files, especially SQLite sidecars.
  3. Replace exact actual-file-set language with baseline-presence language.
- **Expected output**: Manifest matches the "nothing removed" rule.
- **Verification**: Manual review and raw verifier.
- **Commit**: None.

### Subtask 2: Update Verifier
- **Files**: `.agents/scripts/verify-raw-manifest.ps1`
- **Dependencies**: Subtask 1.
- **Steps**:
  1. Remove hard failure for actual files not listed in manifest.
  2. Report additive files as informational output.
  3. Keep missing listed files, missing source dirs, duplicate manifest rows, source mismatches, and critical omissions as failures.
- **Expected output**: SQLite sidecars no longer trip validation.
- **Verification**: Run raw verifier.
- **Commit**: None.

### Subtask 3: Record and Validate
- **Files**: `.agents/tasks/raw-manifest-additive-files/3-implement/tasks.md`, `.agents/tasks/raw-manifest-additive-files/4-review/review.md`
- **Dependencies**: Subtasks 1-2.
- **Steps**:
  1. Record changed files and validation results.
  2. Run pipeline validation.
- **Expected output**: Pipeline task is complete and auditable.
- **Verification**: Run pipeline validator.
- **Commit**: None.

## Dependency Graph
- Subtask 1: No dependencies.
- Subtask 2: Depends on Subtask 1.
- Subtask 3: Depends on Subtasks 1-2.

## Global Verification
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1`: Raw baseline validation passes.
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1`: Pipeline state passes.

## Review Traceability Targets
- Additional `/raw` files are allowed and reported.
- Manifest-listed baseline files remain required.
- `/raw` is not edited.

## Fresh-Agent Handoff
- **Inputs read**: Research findings, raw manifest, and verifier script.
- **Decisions made**: Baseline-presence semantics replace exact actual-set semantics.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run validators after edits.
- **Next allowed action**: Implement manifest and verifier changes.

