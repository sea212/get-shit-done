# Codebase Structure

**Analysis Date:** 2025-02-14

## Directory Layout

```
get-shit-done/
├── agents/             # LLM agent persona and instruction definitions (Markdown)
├── assets/             # Images, logos, and UI assets (SVG/PNG)
├── bin/                # Installation and setup scripts (JS)
├── commands/           # GSD CLI command documentation and workflow guides (Markdown)
├── docs/               # General documentation (User Guide, Context Monitor)
├── get-shit-done/      # Core tool implementation and templates
│   ├── bin/            # CLI entry point and modular library logic (CJS)
│   │   ├── gsd-tools.cjs # Main CLI router
│   │   └── lib/        # Core business logic (state, phase, roadmap, etc.)
│   ├── references/     # Conceptual guides and technical specifications
│   ├── templates/      # Markdown templates for project documentation
│   └── workflows/      # Multi-step instructions for complex operations
├── hooks/              # System-level integrations and monitors (JS)
├── scripts/            # Build and utility scripts
├── tests/              # Core library unit and integration tests (CJS)
├── package.json        # Project metadata and dependencies
└── README.md           # Project overview and introduction
```

## Directory Purposes

**agents/:**
- Purpose: Defines the behavior and context for different LLM sub-agents.
- Contains: Markdown files describing roles (Planner, Executor, etc.).
- Key files: `agents/gsd-planner.md`, `agents/gsd-executor.md`.

**commands/gsd/:**
- Purpose: Provides the documentation and workflow entry points for the `gsd` CLI commands.
- Contains: Markdown files, one for each command.
- Key files: `commands/gsd/new-project.md`, `commands/gsd/execute-phase.md`.

**get-shit-done/bin/lib/:**
- Purpose: The core logic of the GSD system.
- Contains: CommonJS modules for interacting with the `.planning/` filesystem.
- Key files: `get-shit-done/bin/lib/core.cjs`, `get-shit-done/bin/lib/state.cjs`.

**get-shit-done/templates/:**
- Purpose: Blueprints for all Markdown files created by the tool.
- Contains: Standardized structures for Plans, Summaries, Roadmap, and State.
- Key files: `get-shit-done/templates/milestone.md`, `get-shit-done/templates/phase-prompt.md`.

**get-shit-done/workflows/:**
- Purpose: Complex, multi-step procedures for orchestration.
- Contains: Detailed process definitions for high-level tasks.
- Key files: `get-shit-done/workflows/execute-phase.md`, `get-shit-done/workflows/plan-phase.md`.

**tests/:**
- Purpose: Ensures the reliability of the core library.
- Contains: Vitest-compatible test files covering all `lib/` modules.
- Key files: `tests/core.test.cjs`, `tests/state.test.cjs`.

## Key File Locations

**Entry Points:**
- `get-shit-done/bin/gsd-tools.cjs`: The primary CLI entry point for all atomic operations.

**Configuration:**
- `package.json`: Project dependencies and scripts.
- `.planning/config.json`: (Generated at runtime) Local project configuration.
- `.planning/STATE.md`: (Generated at runtime) Current project state and metadata.

**Core Logic:**
- `get-shit-done/bin/lib/`: All business logic for the GSD system.

**Testing:**
- `tests/`: Directory for all test-related files.

## Naming Conventions

**Files:**
- CLI Logic: `lowercase-with-hyphens.cjs` (e.g., `gsd-tools.cjs`)
- Library Modules: `lowercase.cjs` (e.g., `state.cjs`)
- Templates/Workflows: `kebab-case.md` (e.g., `execute-phase.md`)
- Agents: `gsd-agent-name.md` (e.g., `gsd-planner.md`)

**Directories:**
- Structural: `lowercase-with-hyphens` (e.g., `get-shit-done`)
- Phase Storage: `00L-slug` (e.g., `01A-setup`)

## Where to Add New Code

**New Atomic Command:**
1. Implementation: Add to a relevant module in `get-shit-done/bin/lib/` or create a new one.
2. Routing: Register the command in `get-shit-done/bin/gsd-tools.cjs`.
3. Documentation: Add a new file in `commands/gsd/`.

**New Workflow or Agent:**
- Implementation: Add a new Markdown file to `get-shit-done/workflows/` or `agents/`.

**New Template:**
- Implementation: Add a new Markdown file to `get-shit-done/templates/`.

**New Test:**
- Implementation: Add a new `.test.cjs` file to `tests/`.

## Special Directories

**.planning/:**
- Purpose: (Runtime) Contains all project metadata, roadmap, state, and phase data.
- Generated: Yes
- Committed: Yes (standard GSD practice)

**assets/:**
- Purpose: Branding and visual assets.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2025-02-14*
