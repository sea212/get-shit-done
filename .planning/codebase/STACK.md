# Technology Stack

**Analysis Date:** 2025-02-15

## Languages

**Primary:**
- JavaScript (Node.js/CommonJS) - All application code and tooling (`.cjs`, `.js` extensions)

**Secondary:**
- Markdown (`.md`) - Extensively used for agent prompts and phase planning templates

## Runtime

**Environment:**
- Node.js >= 16.7.0 (CLI execution)
- Relies heavily on built-in Node modules (`fs`, `path`, `child_process`, `os`, `crypto`, `readline`)

**Package Manager:**
- npm (v10+, implied by lockfile and `devDependencies`)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- None (Vanilla Node.js CLI tool)

**Testing:**
- Node.js native test runner (`node:test`) - Unit and integration tests
- `node:assert` - Assertion library

**Build/Dev:**
- `esbuild` ^0.24.0 - Used via npm scripts for bundling hooks
- `c8` ^11.0.0 - Test coverage reporting

## Key Dependencies

**Critical:**
- None (Zero runtime dependencies in `package.json`)

**Infrastructure:**
- `child_process.execSync` - System integration for Git operations and filesystem commands.

## Configuration

**Environment:**
- No strictly required environment variables for core functionality.
- Optional variables: `BRAVE_API_KEY` for search capabilities. Configured paths for CLI AI tools (e.g., `CLAUDE_CONFIG_DIR`, `OPENCODE_CONFIG_DIR`, `GEMINI_CONFIG_DIR`, `CODEX_HOME`).

**Build:**
- Minimal. Script `scripts/build-hooks.js` configured to bundle output to `hooks/dist`.

## Platform Requirements

**Development:**
- Any platform with Node.js >= 16.7.0

**Production:**
- Distributed via git or npm, installed and run locally or globally.
- Compatible with Unix and Windows paths.

---

*Stack analysis: 2025-02-15*