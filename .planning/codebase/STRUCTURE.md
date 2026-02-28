# Codebase Structure

**Analysis Date:** 2025-02-27

## Directory Layout

```
get-shit-done/
├── agents/             # AI agent persona definitions
├── assets/             # Branding and visual assets
├── bin/                # External executable scripts
├── commands/           
│   └── gsd/            # Claude Code slash command definitions
├── docs/               # User-facing guides
├── get-shit-done/      # Core framework logic and text files
│   ├── bin/            # GSD CLI tool entry points
│   │   └── lib/        # GSD CLI tool sub-modules
│   ├── references/     # AI philosophy and system rules
│   ├── templates/      # Markdown templates for project tracking
│   └── workflows/      # Step-by-step orchestrations
├── hooks/              # Claude Code lifecycle hooks
├── scripts/            # Build and system administration scripts
└── tests/              # Test suites for JS CLI tools
```

## Directory Purposes

**agents/**
- Purpose: specialized persona definitions loaded when spawning sub-tasks.
- Contains: Markdown files setting instructions for LLMs.
- Key files: `gsd-planner.md`, `gsd-roadmapper.md`

**commands/gsd/**
- Purpose: Registration bounds for slash commands available to the user in Claude Code.
- Contains: Command definition markdown files.
- Key files: `new-project.md`, `plan-phase.md`, `execute-phase.md`

**get-shit-done/bin/lib/**
- Purpose: Encapsulate deterministic programmatic actions invoked by workflows.
- Contains: Node.js CommonJS files.
- Key files: `core.cjs`, `state.cjs`, `phase.cjs`, `verify.cjs`

**get-shit-done/workflows/**
- Purpose: Provide strict sequences of actions, interactions, and operations for AI.
- Contains: Markdown files acting as logic loops.
- Key files: `new-project.md`, `execute-phase.md`

**get-shit-done/templates/**
- Purpose: Blueprints to ensure `.planning/` output is cleanly formatted and typed.
- Contains: Raw markdown skeletons populated by frontmatter operations.
- Key files: `project.md`, `roadmap.md`, `codebase/structure.md`

**tests/**
- Purpose: Unit tests validating the deterministic portions of the codebase (the Node CLI).
- Contains: Testing files (`*.test.cjs`).
- Key files: `state.test.cjs`, `frontmatter.test.cjs`

## Key File Locations

**Entry Points:**
- `get-shit-done/bin/gsd-tools.cjs`: Main CLI endpoint for workflow tool executions.
- `bin/install.js`: Installs the system context into `~/.claude/`.

**Configuration:**
- `package.json`: Main project definition and testing scripts.
- `get-shit-done/templates/config.json`: Blueprint for the state config.

**Core Logic:**
- `get-shit-done/bin/lib/commands.cjs`: Aggregated utility bindings.
- `get-shit-done/bin/lib/state.cjs`: Manipulation and querying logic for the project's memory model.

**Testing:**
- `tests/helpers.cjs`: Setup definitions for test environment generation.

**Documentation:**
- `README.md`: Central documentation for installation.
- `docs/USER-GUIDE.md`: Elaborate user interactions.

## Naming Conventions

**Files:**
- `kebab-case.md` for commands, workflows, agents, and templates.
- `kebab-case.cjs` for node modules interacting with the CLI tool.
- `kebab-case.test.cjs` for test files.

**Directories:**
- `kebab-case` generally observed across the framework.

**Special Patterns:**
- `gsd-*.md` used for agents (e.g. `gsd-executor.md`).
- `gsd-*.js` used for shell lifecycle hooks (`gsd-statusline.js`).

## Where to Add New Code

**New Command / Feature:**
- Add command boundary: `commands/gsd/[feature-name].md`
- Add orchestration logic: `get-shit-done/workflows/[feature-name].md`

**New AI Automation Sub-Task Persona:**
- Agent file: `agents/gsd-[persona].md`

**New File Transformation or State Access:**
- CLI extension: Add function to corresponding file in `get-shit-done/bin/lib/`
- Register command: `get-shit-done/bin/gsd-tools.cjs` (in the `switch` statement)

**New Data Artifact Formats:**
- Template: `get-shit-done/templates/[artifact].md`

## Special Directories

**get-shit-done/**
- Purpose: Core assets to be directly transferred or mapped to a user's `~/.claude/` root during install.
- Committed: Yes

**.planning/**
- Purpose: Target data-dir constructed by the system in end-user repos containing their specific project state and context artifacts.
- Committed: Usually generated locally, and heavily operated upon by testing suites in this repo. Ignored globally unless required for testing.

---

*Structure analysis: 2025-02-27*
*Update when directory structure changes*