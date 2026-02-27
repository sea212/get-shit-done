# Architecture

**Analysis Date:** 2025-02-14

## Pattern Overview

**Overall:** Command-based CLI with a Modular Core Library

**Key Characteristics:**
- **Markdown-First Strategy:** All project state, roadmap, and plans are stored as human-readable Markdown files with YAML frontmatter.
- **Atomic Operations:** CLI commands (`gsd-tools.cjs`) perform specific, idempotent actions on the filesystem.
- **Agentic Orchestration:** High-level workflows are described as instructions for LLM sub-agents (`agents/` and `get-shit-done/workflows/`).

## Layers

**CLI Entry Point:**
- Purpose: CLI routing, argument parsing, and environment setup.
- Location: `get-shit-done/bin/gsd-tools.cjs`
- Contains: CLI router, subcommand dispatch logic, and basic I/O helpers.
- Depends on: `get-shit-done/bin/lib/*.cjs`
- Used by: Users and LLM sub-agents.

**Core Library:**
- Purpose: Encapsulate the core logic for managing the GSD filesystem structure.
- Location: `get-shit-done/bin/lib/`
- Contains: Modules for `state`, `phase`, `roadmap`, `config`, `milestone`, `verify`, etc.
- Depends on: Node.js built-in modules (`fs`, `path`, `child_process`).
- Used by: `gsd-tools.cjs`, `tests/`.

**Templates & References:**
- Purpose: Provide the blueprints for generating project documentation.
- Location: `get-shit-done/templates/`, `get-shit-done/references/`
- Contains: Markdown templates and conceptual documentation.
- Depends on: None.
- Used by: `template.cjs`, `init.cjs`.

**Workflow & Agent Definitions:**
- Purpose: Define how to orchestrate the atomic CLI commands for complex tasks.
- Location: `agents/`, `get-shit-done/workflows/`
- Contains: Markdown instructions for sub-agents and step-by-step guides.
- Depends on: `gsd-tools` commands.
- Used by: Orchestrators and LLM sub-agents.

## Data Flow

**CLI Command Execution:**

1. **Invocation**: User or agent runs `node gsd-tools.cjs <command> <subcommand> [args]`.
2. **Routing**: `gsd-tools.cjs` parses the command and delegates to the corresponding library module (e.g., `state.cjs`).
3. **Execution**: The library module reads/writes files in `.planning/` (e.g., `STATE.md`, `ROADMAP.md`), potentially using `frontmatter.cjs` for metadata.
4. **Response**: The result is written to `stdout` as JSON (or raw text if `--raw` is used). Large outputs are written to a temp file, and the path is returned (prefixed with `@file:`).

**State Management:**
- **In-Memory**: The current project state is loaded into a JSON object via `state.cmdStateLoad` in `get-shit-done/bin/lib/state.cjs`.
- **Persistent**: State is stored in `.planning/STATE.md` using YAML frontmatter for structured data and Markdown sections for narrative content.

## Key Abstractions

**Phase:**
- Purpose: A discrete unit of work, represented by a numbered directory.
- Examples: `.planning/phases/01A-setup/`, `.planning/phases/02B-feature-x/`.
- Pattern: Contains `PLAN.md`, `SUMMARY.md`, and optional `RESEARCH.md`, `CONTEXT.md`, `VERIFICATION.md`.

**Milestone:**
- Purpose: A collection of phases representing a version or major release.
- Examples: `.planning/milestones/v1.0-phases/`.
- Pattern: Managed via `get-shit-done/bin/lib/milestone.cjs`.

**Roadmap:**
- Purpose: The master plan of the project, tracking phase status and goals.
- Location: `.planning/ROADMAP.md`
- Pattern: Parsed and updated by `get-shit-done/bin/lib/roadmap.cjs`.

## Entry Points

**gsd-tools CLI:**
- Location: `get-shit-done/bin/gsd-tools.cjs`
- Triggers: Manual execution or agent-driven command calls.
- Responsibilities: Routing, argument parsing, error handling, and output formatting.

**Agent Personas:**
- Location: `agents/`
- Triggers: Orchestrator `gsd` command execution.
- Responsibilities: Providing the logic and instructions for specific roles (Planner, Executor, etc.).

## Error Handling

**Strategy:** Fail fast with descriptive error messages.

**Patterns:**
- **`error(message)`**: Utility in `get-shit-done/bin/lib/core.cjs` that writes to `stderr` and exits with code 1.
- **Validation Commands**: `gsd-tools validate health` and `gsd-tools validate consistency` are used to proactively check for filesystem integrity.

## Cross-Cutting Concerns

**Logging:** Minimal CLI output to `stdout` (JSON/Raw).
**Validation:** Structured validation of frontmatter schemas via `frontmatter.cjs`.
**Authentication:** Not applicable (local filesystem operations).
**Git Integration:** Automated commits for planning documents via `get-shit-done/bin/lib/commands.cjs` (using `execGit` helper).

---

*Architecture analysis: 2025-02-14*
