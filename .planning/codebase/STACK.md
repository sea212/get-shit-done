# Technology Stack

**Analysis Date:** 2025-02-14

## Languages

**Primary:**
- JavaScript (Node.js) - Core logic, CLI commands, and sub-agent implementation.
- Markdown - Agent definitions, prompt templates, and project documentation.

## Runtime

**Environment:**
- Node.js >= 16.7.0

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Native Node.js APIs - Used for file system operations, process management, and networking.
- CommonJS - Module system used across the codebase (`.cjs` files or `.js` with `package.json` overrides).

**Testing:**
- Custom Test Runner - `scripts/run-tests.cjs`
- `c8` - Coverage reporting.

**Build/Dev:**
- `esbuild` - Used for bundling hooks in `hooks/` to `hooks/dist/`.
- `scripts/build-hooks.js` - Build script for bundling.

## Key Dependencies

**Critical:**
- `fs`, `path`, `child_process`, `crypto`, `os`, `readline` - Standard Node.js modules for all core functionality.

**Infrastructure:**
- `esbuild` - Development-only dependency for bundling.
- `c8` - Development-only dependency for test coverage.

## Configuration

**Environment:**
- Configured via environment variables (e.g., `BRAVE_API_KEY`, `CLAUDE_CONFIG_DIR`).
- Local project configuration stored in `.planning/config.json`.

**Build:**
- `package.json` - Defines scripts and devDependencies.
- `scripts/build-hooks.js` - Orchestrates the build process for hooks.

## Platform Requirements

**Development:**
- Node.js and npm.
- Git (required for most GSD commands).

**Production:**
- Target environments: Claude Code, OpenCode, Gemini CLI, or Codex.

---

*Stack analysis: 2025-02-14*
