# Technology Stack

**Analysis Date:** 2025-02-17

## Languages

**Primary:**
- JavaScript (Node.js) - Entire codebase uses CommonJS modules (`.cjs`).

**Secondary:**
- None - Project is a Node.js CLI tool.

## Runtime

**Environment:**
- Node.js >=16.7.0 (specified in `package.json`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Pure Node.js - No major application frameworks (Express, React, etc.) used. It's a CLI tool using built-in modules like `fs`, `path`, `child_process`, and `os`.

**Testing:**
- Node.js Built-in Test Runner (`node --test`) - Used for all test files in `tests/`.
- `c8` - Used for code coverage.

**Build/Dev:**
- `esbuild` ^0.24.0 - Used for building hooks (`scripts/build-hooks.js`).

## Key Dependencies

**Critical:**
- None in `dependencies` (only `devDependencies`). The project aims to be zero-dependency at runtime for the core CLI tools.

**Infrastructure:**
- `c8` ^11.0.0 - Code coverage tool used in `package.json` scripts.
- `esbuild` ^0.24.0 - Fast bundler used for build scripts.

## Configuration

**Environment:**
- Configured via environment variables (e.g., `BRAVE_API_KEY`) and local config files.

**Build:**
- `package.json`: Main manifest and script definition.
- `scripts/build-hooks.js`: Custom build script for hooks.

## Platform Requirements

**Development:**
- Node.js >=16.7.0

**Production:**
- Any environment with Node.js >=16.7.0 installed. Designed to be run as a CLI tool within developer workspaces.

---

*Stack analysis: 2025-02-17*
