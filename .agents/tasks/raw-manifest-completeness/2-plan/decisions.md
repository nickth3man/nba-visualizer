# Raw Manifest Completeness - Decisions

## Decision: Manifest Inventory Is Source Of Truth
- **Status**: Accepted
- **Options considered**: Hardcoded expected files in the script; manifest inventory parsed by the script.
- **Chosen**: Parse the manifest inventory table from `.agents/raw-data-manifest.md`.
- **Rationale**: Keeps human-readable documentation and machine validation tied together.
- **Tradeoffs**: The table format must remain stable.
- **Traceability**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`.
- **Follow-up**: If raw data changes, update the complete inventory and rerun verification.

## Decision: Exact Per-File Byte Validation
- **Status**: Accepted
- **Options considered**: Check file paths only; check aggregate bytes; check exact per-file bytes.
- **Chosen**: Check exact per-file bytes.
- **Rationale**: Ensures the manifest accounts for both presence and local content size without adding expensive checksums for multi-GB files.
- **Tradeoffs**: Intentional data refreshes require manifest updates.
- **Traceability**: `.agents/raw-data-manifest.md`, `.agents/scripts/verify-raw-manifest.ps1`.
- **Follow-up**: Consider adding optional checksums later only if needed.

