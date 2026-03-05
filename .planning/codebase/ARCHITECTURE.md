# Architecture

**Analysis Date:** 2025-03-04

## Pattern Overview

**Overall:** Modular CLI-driven framework with a "File-as-Database" pattern.

**Key Characteristics:**
- **Decoupled Logic:** Implementation logic is separated from agent role definitions and workflow procedures.
- **Markdown-Native State:** Project state is stored in human-readable Markdown files (`STATE.md`, `ROADMAP.md`) within the user's codebase.
- **Environment Agnostic:** Supports multiple AI environments (Claude Code, OpenCode, Gemini, Codex) through an adaptive installation process.

## Layers

**Interface Layer:**
- Purpose: Defines how AI agents and users interact with the system.
- Location: `agents/` and `commands/gsd/`
- Contains: Agent role definitions and command documentation in Markdown.
- Depends on: Orchestration Layer (workflows) and Logic Layer (CLI tools).

**Orchestration Layer:**
- Purpose: Defines standard operating procedures (SOPs) for complex GSD tasks.
- Location: `get-shit-done/workflows/`
- Contains: Step-by-step guides for agents to follow.
- Used by: AI agents during execution.

**Logic Layer:**
- Purpose: Provides the programmatic implementation of GSD operations.
- Location: `get-shit-done/bin/lib/`
- Contains: Domain-specific modules (`state.cjs`, `phase.cjs`, `roadmap.cjs`, etc.).
- Depends on: Common Utility Layer.

**Common Utility Layer:**
- Purpose: Shared helpers for filesystem, git, and formatting.
- Location: `get-shit-done/bin/lib/core.cjs`
- Contains: Path normalization, config loading, git wrappers, and phase numbering logic.

**Data Layer:**
- Purpose: Manages persistent state within the project being managed.
- Location: `.planning/` (in the target project root)
- Contains: `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, and individual phase/plan/summary files.

## Data Flow

**Command Execution Flow:**

1. Agent/User invokes a GSD command (e.g., `/gsd:plan-phase`).
2. The host environment executes `gsd-tools.cjs` via the Logic Layer.
3. `gsd-tools.cjs` routes the request to the appropriate module in `get-shit-done/bin/lib/`.
4. The module reads current state from `.planning/` files using `core.cjs` and `frontmatter.cjs`.
5. Logic is applied, and the `.planning/` files are updated.
6. `state.cjs` ensures `STATE.md` frontmatter is synchronized with the markdown body.
7. Results are returned as JSON (default) or raw text for the agent to consume.

**State Management:**
- **Source of Truth:** Markdown files in `.planning/`.
- **Synchronization:** `get-shit-done/bin/lib/state.cjs` uses regex and frontmatter parsing to keep human-readable sections and machine-readable metadata in sync within `STATE.md`.

## Key Abstractions

**Phase:**
- Purpose: A logical unit of work within a milestone.
- Examples: `.planning/phases/01-setup/`
- Pattern: Identified by a normalized number (e.g., `01`, `01A`, `01A.1`).

**Plan:**
- Purpose: A detailed set of tasks and instructions for a specific phase execution.
- Examples: `.planning/phases/01-setup/PLAN.md`
- Pattern: Accompanied by a `SUMMARY.md` once completed.

**Milestone:**
- Purpose: A collection of phases representing a major version or goal.
- Location: `.planning/milestones/` (for archived phases).

## Entry Points

**gsd-tools CLI:**
- Location: `get-shit-done/bin/gsd-tools.cjs`
- Triggers: Agent tool calls or manual terminal usage.
- Responsibilities: Routing, argument parsing, and standardized output formatting.

## Error Handling

**Strategy:** Fail fast and exit with non-zero status.

**Patterns:**
- **Validation Errors:** Modules validate inputs and filesystem state, calling `error()` from `core.cjs` if requirements aren't met.
- **Standardized Output:** Error messages are written to `stderr` to avoid polluting the JSON `stdout` expected by agents.

## Cross-Cutting Concerns

**Logging:** Handled via `process.stdout` and `process.stderr`. No dedicated logging framework is used to minimize dependencies.
**Validation:** Frontmatter validation is handled in `get-shit-done/bin/lib/frontmatter.cjs` and `get-shit-done/bin/lib/verify.cjs`.
**Authentication:** Relies on environment variables (e.g., `BRAVE_API_KEY`) and standard git credentials.

---

*Architecture analysis: 2025-03-04*
