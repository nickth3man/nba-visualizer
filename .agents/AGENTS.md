# Agent Pipeline

## Overview

All tasks flow through a 4-phase pipeline:

```
Research -> Plan -> Implement -> Review
```

Each phase produces an output file that feeds the next phase. A fresh agent session can resume at any phase by reading the state files and phase outputs on disk.

The year is 2026. Treat current-year facts, URLs, APIs, library behavior, sports data availability, and repository metadata as time-sensitive. Verify them before using them for decisions.

## Terminology

- **Task**: A top-level unit listed in `.agents/pipeline-state.json`. Each task has a `state.json` file and phase directories under `.agents/tasks/<task-id>/`.
- **Phase**: One of `1-research`, `2-plan`, `3-implement`, or `4-review` within a task.
- **Subtask**: A numbered implementation work item created in `2-plan/plan.md` and tracked in `3-implement/tasks.md`.
- **Completed work**: A phase with `status: "completed"` or a subtask with `Status` set to `completed` in `3-implement/tasks.md`. A `ready_for_approval`, `blocked`, or `skipped` phase is not completed work.

## Startup Sequence

Every session starts here:

1. Read `.agents/pipeline-state.json` to identify the active task.
2. Read `.agents/tasks/<active_task>/state.json` to identify the current phase and status.
3. Read every completed phase output for the active task.
4. Read any existing output or tracker file for the current phase.
5. Read `.agents/raw-data-manifest.md` before work that depends on local `/raw` data.
6. Follow the instructions for the current phase below.

If a phase status is `ready_for_approval`, do not begin the next phase. Summarize the output and ask the user whether to advance.

If the user's request clearly belongs to a different task than the active task, create or switch to the appropriate task before editing project files. Preserve the prior task state exactly unless the user also approves changes to it.

If the user explicitly approves a concrete action such as "apply all", that approval may be recorded for the relevant phase transitions, but every required phase output and state transition still must be written.

## State Lifecycle

Use `.agents/schema/state.schema.json` as the machine-checkable schema for task state files. Use `.agents/schema/pipeline-state.schema.json` as the machine-checkable schema for `.agents/pipeline-state.json`.

Allowed phase statuses:

- `pending`: Phase has not started.
- `in_progress`: Phase work is underway.
- `ready_for_approval`: Required phase output exists and is waiting for user approval.
- `completed`: User approved advancing past this phase.
- `blocked`: Phase cannot continue without external input.
- `skipped`: Phase was intentionally skipped with explicit user approval.

Normal transition:

```
pending -> in_progress -> ready_for_approval -> completed
```

Approved skip transition:

```
pending|in_progress|ready_for_approval -> skipped
```

Skipping is exceptional. Do not skip a phase unless the user explicitly approves the skip, and record `skip_reason`, `approved_at`, `approved_by`, `completed_at`, and an `approval_history` entry with `action: "skip"`.

When phase work is done:

1. Write the required output file.
2. Set that phase to `ready_for_approval`.
3. Add `ready_at` and `output_file`.
4. Ask the user for approval to advance.

When the user approves advancing:

1. Set the current phase to `completed`.
2. Add `completed_at`, `approved_at`, and `approved_by`.
3. Append an `approval_history` entry with `action: "advance"`.
4. Set `current_phase` to the next phase.
5. Set the next phase to `in_progress` with `started_at`.

When the user approves final pipeline completion from `4-review`:

1. Set `4-review` to `completed`.
2. Add `completed_at`, `approved_at`, and `approved_by`.
3. Append an `approval_history` entry with `action: "complete"`.
4. Keep `current_phase` set to `4-review`.

A task is complete only when all four phases are `completed` or explicitly approved as `skipped`, and `4-review` is `completed`.

`pipeline-state.json` changes only when creating, deleting, or switching the active task.

After editing `pipeline-state.json`, any task `state.json`, schemas, templates, or raw-manifest instructions, run the relevant validator from `.agents/scripts/` when it exists.

## Answering Status Questions

When the user asks "What is the current state of the pipeline?":

1. Read `.agents/pipeline-state.json`.
2. Read `.agents/tasks/<active_task>/state.json`.
3. Answer with the active task, current phase, phase status, required output file, and next allowed action.

When the user asks "What are the current tasks and their states of completion?":

1. List all tasks from `.agents/pipeline-state.json`.
2. For each task, read `.agents/tasks/<task-id>/state.json` and summarize its phases.
3. If `.agents/tasks/<task-id>/3-implement/tasks.md` exists, also summarize subtasks separately.

When the user asks "What tasks have been completed?":

1. List tasks that satisfy the terminal completion rule: all phases are `completed` or explicitly `skipped`, and `4-review` is `completed`.
2. List completed phases within in-progress tasks.
3. List entries in `approval_history`.
4. If `3-implement/tasks.md` exists, list subtasks with `Status` set to `completed`.
5. Do not count `ready_for_approval` as completed.

## Research Source Requirements

All external research claims that influence architecture, library choice, data-source choice, or project scope must include:

- Source name.
- URL.
- Accessed date in `YYYY-MM-DD` format.
- Observation date or publication date when the source provides one.
- Short note explaining why the source matters.

If a source is time-sensitive, stale, unavailable, or uncited, treat the finding as unverified and either re-check it or mark it as a planning risk.

## Fresh-Agent Handoff Requirements

Every phase output must include enough context for a fresh agent to continue without this conversation:

- Inputs read.
- Decisions made.
- Decisions deferred.
- Open blockers.
- Verification run or still needed.
- Next allowed action under the phase gating rules.

For data-dependent work, include whether `.agents/raw-data-manifest.md` was checked and whether local `/raw` contents matched expectations.

Each phase output must include a `Fresh-Agent Handoff` section with these fields:

- Inputs read.
- Decisions made.
- Decisions deferred.
- Open blockers.
- Verification run or still needed.
- Next allowed action under phase gating.

## Creating a New Task

1. Add the task to `.agents/pipeline-state.json` and set `active_task` if it should become active:

   ```json
   {
     "active_task": "<task-id>",
     "tasks": {
       "<task-id>": {
         "description": "...",
         "created_at": "YYYY-MM-DD"
       }
     }
   }
   ```

2. Create `.agents/tasks/<task-id>/state.json`:

   ```json
   {
     "schema_version": "1.0",
     "task_id": "<task-id>",
     "description": "...",
     "current_phase": "1-research",
     "auto_commit": false,
     "phases": {
       "1-research": {
         "status": "in_progress",
         "started_at": "YYYY-MM-DD"
       },
       "2-plan": {
         "status": "pending"
       },
       "3-implement": {
         "status": "pending"
       },
       "4-review": {
         "status": "pending"
       }
     },
     "approval_history": []
   }
   ```

3. Create empty phase directories:

   ```text
   .agents/tasks/<task-id>/1-research/
   .agents/tasks/<task-id>/2-plan/
   .agents/tasks/<task-id>/3-implement/
   .agents/tasks/<task-id>/4-review/
   ```

4. Validate the new task state:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1
   ```

## Phase 1: Research - "Understand before building"

**Goal**: Fully understand what needs to be built, what already exists, and what approach to take.

**Input**: Task description from `.agents/tasks/<task>/state.json`.

**Process**:

1. Read the task description from `state.json`.
2. Ask clarifying questions when scope, constraints, or success criteria are ambiguous. If a question tool is available, use it; otherwise ask the user directly.
3. Explore the codebase for relevant files, patterns, reusable code, conventions, and constraints.
4. Research libraries, APIs, reference implementations, and best practices when needed.
5. Record external sources with URLs and accessed dates.
6. Check `.agents/raw-data-manifest.md` when the task depends on local raw data.
7. Write `.agents/tasks/<task>/1-research/findings.md`.
8. Set phase status to `ready_for_approval` and ask: "Research phase complete. Ready to proceed to planning?"

**Output**: `.agents/tasks/<task>/1-research/findings.md`

Use `.agents/templates/findings.md` as the template.

**Completion criteria**: `findings.md` is comprehensive enough that planning can begin without further research, includes a source ledger for external research, records accessed dates for URLs, and records the raw data manifest check when data-dependent.

## Phase 2: Plan - "Specify before building"

**Goal**: Break the task into concrete, verifiable implementation steps.

**Input**: `.agents/tasks/<task>/1-research/findings.md`

**Process**:

1. Review `findings.md` thoroughly.
2. Resolve or explicitly defer every open question and risk from research.
3. Re-check uncited, stale, or time-sensitive external research before using it for decisions.
4. Ask the user to confirm scope, priorities, and technical decisions when ambiguity remains.
5. Break work into discrete, numbered subtasks.
6. For each subtask, specify files affected, steps, expected output, and verification.
7. Identify dependencies between subtasks.
8. Define global verification commands.
9. Write `.agents/tasks/<task>/2-plan/plan.md`.
10. Write `.agents/tasks/<task>/2-plan/decisions.md` for any architecture, data model, dependency, external-source, deployment, or long-lived implementation decision.
11. Set phase status to `ready_for_approval` and ask: "Plan phase complete. Ready to proceed to implementation?"

**Output**: `.agents/tasks/<task>/2-plan/plan.md`

Use `.agents/templates/plan.md` as the template.

**Decision log**: Use `.agents/templates/decisions.md` when decisions or deferrals must be recorded. Architecture-heavy tasks must include this file.

**Completion criteria**: Every subtask is concrete enough that implementation requires no further architectural decisions or research.

## Phase 3: Implement - "Execute the plan"

**Goal**: Implement each planned subtask, verifying as you go.

**Input**: `.agents/tasks/<task>/2-plan/plan.md`

**Process**:

1. Read `plan.md` fully.
2. Read `decisions.md` if it exists.
3. Create or update `.agents/tasks/<task>/3-implement/tasks.md` from `.agents/templates/tasks.md`.
4. Execute subtasks in dependency order. Independent subtasks may proceed in parallel when safe.
5. For each subtask:
   - Mark it `in_progress` in `tasks.md`.
   - Implement the changes.
   - Run the subtask verification.
   - Record changed files and verification results.
   - Mark it `completed` when verification passes.
   - Mark it `blocked` if external input is required.
6. Run global verification.
7. Set phase status to `ready_for_approval` and ask: "All subtasks implemented and verified. Ready for review?"

**Output**: `.agents/tasks/<task>/3-implement/tasks.md`

Use `.agents/templates/tasks.md` as the template.

**Commit policy**:

- Do not create commits unless the user explicitly asks or `auto_commit` is `true` in `state.json`.
- If `auto_commit` is `true`, each completed subtask should produce one focused commit.
- Never include unrelated user changes in a commit.

**Completion criteria**: All unblocked subtasks are completed and global verification passes, or blockers are documented with clear unblock paths.

**Scope rule**: Keep phase tracker files, notes, plans, and review artifacts under `.agents/tasks/<task>/<phase>/`. Planned product changes may be made in project directories such as `/backend`, `/frontend`, `/etl`, and `/data` when the approved plan calls for them. Never edit `/raw`.

## Phase 4: Review - "Validate before calling done"

**Goal**: Verify implementation matches the plan and meets quality standards.

**Input**: `plan.md`, optional `decisions.md`, `tasks.md`, and code changes.

**Process**:

1. Compare implementation against `plan.md`.
2. Confirm decisions and deferrals were honored.
3. Review code quality, consistency, tests, secrets, and security-sensitive behavior.
4. Run all global verification commands.
5. Write `.agents/tasks/<task>/4-review/review.md`.
6. Set phase status to `ready_for_approval` and ask the user whether to mark the pipeline complete.

**Output**: `.agents/tasks/<task>/4-review/review.md`

Use `.agents/templates/review.md` as the template.

**Completion criteria**: Review is written, critical issues are fixed or documented as follow-up tasks, and verification results are recorded.

When the user approves completion, mark `4-review` completed, append an `approval_history` entry with `action: "complete"`, and keep `current_phase` set to `4-review`.

## Phase Gating Rules

1. Required phase outputs must exist before a phase can move to `ready_for_approval`.
2. User approval is required before a phase can move from `ready_for_approval` to `completed`.
3. Do not start the next phase until the previous phase is `completed` or explicitly approved as `skipped`.
4. Ask clarifying questions before acting on ambiguous scope or intent.
5. Record deferred decisions explicitly in `decisions.md` or the relevant phase output.
6. Keep all phase-specific pipeline artifacts under `.agents/tasks/<task>/<phase>/`.
7. Do not edit files in `/raw`.
8. Do not move research to `ready_for_approval` if external sources that influence decisions lack URLs and accessed dates.
9. Do not skip a phase unless the user explicitly approves the skip and state records `skipped`, `skip_reason`, approval metadata, and an `approval_history` entry.
10. Do not edit product files for a task whose current phase is `ready_for_approval`, `blocked`, or `pending`.

## Validation Rules

Run validators after state or pipeline-mechanic edits:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/scripts/validate-pipeline.ps1
```

For data-dependent work, run:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/scripts/verify-raw-manifest.ps1
```

If a validator fails, fix the pipeline artifact or record the blocker before continuing.
