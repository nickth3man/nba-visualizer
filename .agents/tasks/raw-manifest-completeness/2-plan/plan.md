# Raw Manifest Completeness - Implementation Plan

## Research Risk Resolution
| Research question/risk | Resolution | Deferred? | Notes |
|---|---|---|---|
| Manifest could skip nested files | Add a complete recursive file inventory table. | No | Inventory contains 85 files. |
| Verifier could pass with unlisted files | Compare actual recursive path set to manifest path set. | No | Missing and extra files both fail. |
| Manifest/script could drift | Make the script parse the manifest table. | No | Manifest becomes source of truth. |
| Size changes could go unnoticed | Verify exact per-file byte counts. | No | Any refreshed dataset must update the manifest intentionally. |

## Subtask Breakdown

### Subtask 1: Add Complete Manifest Inventory
- **Files**: `.agents/raw-data-manifest.md`
- **Dependencies**: None.
- **Steps**:
  1. Add a complete raw file inventory with path, bytes, and source.
  2. Update verification language to say every file is enforced.
- **Expected output**: Every raw file is named in the manifest.
- **Verification**: Run raw manifest verifier.
- **Commit**: None.

### Subtask 2: Update Raw Manifest Verifier
- **Files**: `.agents/scripts/verify-raw-manifest.ps1`
- **Dependencies**: Subtask 1.
- **Steps**:
  1. Parse complete inventory rows from the manifest.
  2. Compare actual recursive files to expected manifest files.
  3. Fail on missing, extra, duplicate, or byte-mismatched files.
- **Expected output**: The verifier cannot pass while skipping files.
- **Verification**: Run raw manifest verifier.
- **Commit**: None.

### Subtask 3: Record and Validate
- **Files**: `.agents/tasks/raw-manifest-completeness/3-implement/tasks.md`, `.agents/tasks/raw-manifest-completeness/4-review/review.md`
- **Dependencies**: Subtasks 1-2.
- **Steps**:
  1. Record changed files.
  2. Run validators.
  3. Record final review.
- **Expected output**: Pipeline artifacts show the work and verification result.
- **Verification**: Run pipeline validator.
- **Commit**: None.

## Dependency Graph
- Subtask 1: No dependencies.
- Subtask 2: Depends on Subtask 1.
- Subtask 3: Depends on Subtasks 1-2.

## Global Verification
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1`: Raw file inventory passes.
- `powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1`: Pipeline state passes.

## Review Traceability Targets
- Manifest contains 85 raw files.
- Verifier derives expected file list from the manifest.
- Verifier reports no missing, extra, duplicate, or size-mismatched files.

## Fresh-Agent Handoff
- **Inputs read**: Research findings and current raw manifest/verifier.
- **Decisions made**: Complete inventory table plus manifest-parsing verifier.
- **Decisions deferred**: None.
- **Open blockers**: None.
- **Verification run or still needed**: Run both validators after edits.
- **Next allowed action**: Implement the manifest and script changes.

