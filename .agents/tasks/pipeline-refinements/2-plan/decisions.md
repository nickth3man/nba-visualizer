# Pipeline Refinements - Decisions

## Decision: Approved Skips Only
- **Status**: Accepted
- **Options considered**: Ban skips entirely; allow skips only with explicit user approval and recorded state.
- **Chosen**: Allow skips only with explicit user approval and `approval_history` entry.
- **Rationale**: The schema already supports `skipped`; the instruction should make the allowed path explicit instead of contradicting it.
- **Tradeoffs**: Agents must distinguish normal phase flow from rare approved skips.
- **Follow-up**: Validator checks skipped phases for approval metadata.

## Decision: Approval History Required
- **Status**: Accepted
- **Options considered**: Keep approval metadata only on phase objects; require a separate approval ledger.
- **Chosen**: Require both phase metadata and `approval_history` entries.
- **Rationale**: The phase object captures current state; the ledger supports status summaries and handoff.
- **Tradeoffs**: Slightly more state to maintain.
- **Follow-up**: Validator flags completed or skipped phases without matching history entries.

## Decision: Terminal Review State
- **Status**: Accepted
- **Options considered**: Add a fifth done phase; keep `current_phase` at `4-review`; clear `current_phase`.
- **Chosen**: Keep `current_phase` at `4-review` and mark it completed with `action: "complete"`.
- **Rationale**: Avoids schema expansion while making completion deterministic.
- **Tradeoffs**: A completed task still has a current phase value.
- **Follow-up**: Status answers should treat all four phases completed as task complete.

## Decision: Local Validators
- **Status**: Accepted
- **Options considered**: Documentation only; JSON schemas only; scripts plus schemas.
- **Chosen**: Add scripts plus schemas.
- **Rationale**: Agents can reliably run scripts in this Windows workspace, and semantic phase-order checks exceed simple schema validation.
- **Tradeoffs**: Scripts must be maintained as pipeline rules evolve.
- **Follow-up**: Run validators after state or manifest changes.

