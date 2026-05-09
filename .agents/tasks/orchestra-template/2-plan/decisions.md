# Orchestra Template - Decisions

## Decision: No Raw Or Local Input Support In Core
- **Status**: Accepted
- **Options considered**: Include raw manifest support; mention optional local inputs; exclude from core.
- **Chosen**: Exclude from core.
- **Rationale**: Local raw data was specific to the NBA project, not a universal agent pipeline concern.
- **Tradeoffs**: Projects that need local data manifests must add project-specific rules.
- **Traceability**: `Orchestra/README.md`, `Orchestra/AGENTS.md`, `Orchestra/.agents/AGENTS.md`.
- **Follow-up**: None.

## Decision: Domain-Agnostic Core
- **Status**: Accepted
- **Options considered**: Provide stack examples; remain fully generic.
- **Chosen**: Remain fully generic.
- **Rationale**: The template should work across domains and programming languages.
- **Tradeoffs**: New projects must fill in their own stack/conventions.
- **Traceability**: `Orchestra/README.md`, `Orchestra/AGENTS.md`.
- **Follow-up**: None.

