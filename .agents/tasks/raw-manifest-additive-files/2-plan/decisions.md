# Raw Manifest Additive Files - Decisions

## Decision: Manifest Inventory Is A Baseline
- **Status**: Accepted
- **Options considered**: Exact actual file set; required baseline plus allowed additive files.
- **Chosen**: Required baseline plus allowed additive files.
- **Rationale**: SQLite sidecar files can appear under `/raw` when databases are used, and they should not force manifest churn.
- **Tradeoffs**: The verifier no longer fails for every unexpected file; it reports them instead.
- **Traceability**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`.
- **Follow-up**: Promote additive files into the baseline only if they become durable required inputs.

## Decision: Missing Baseline Files Remain Failures
- **Status**: Accepted
- **Options considered**: Warning-only validation; hard fail when manifest-listed files disappear.
- **Chosen**: Hard fail when manifest-listed files or critical files are missing.
- **Rationale**: The user's rule is that nothing should be removed from `/raw`.
- **Tradeoffs**: Intentional raw source replacement still requires manifest update.
- **Traceability**: `.agents/scripts/verify-raw-manifest.ps1`.
- **Follow-up**: None.

