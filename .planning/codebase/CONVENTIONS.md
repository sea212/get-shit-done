# Coding Conventions

**Analysis Date:** 2025-02-27

## Naming Patterns

**Files:**
- Main logic: `kebab-case.cjs` (e.g., `get-shit-done/bin/lib/core.cjs`)
- CLI entry points: `gsd-tools.cjs`
- Tests: `kebab-case.test.cjs` (e.g., `tests/core.test.cjs`)

**Functions:**
- Internal: `camelCase` (e.g., `safeReadFile`, `loadConfig`)
- CLI Command Handlers: `cmd[CommandName]` (e.g., `cmdPhasesList`, `cmdGenerateSlug`)
- Internal helpers: `[name]Internal` suffix (e.g., `findPhaseInternal`, `generateSlugInternal`)

**Variables:**
- `camelCase` (e.g., `phasesDir`, `normalized`, `result`)

**Types:**
- Plain JavaScript (CommonJS), no explicit type definitions.

**Constants:**
- `UPPER_SNAKE_CASE` (e.g., `MODEL_PROFILES`)

## Code Style

**Formatting:**
- Indentation: Two spaces
- Semicolons: Required (e.g., `const fs = require('fs');`)
- Quotes: Single quotes preferred for strings (e.g., `require('fs')`)

**Linting:**
- Not detected (no `.eslintrc` or `.prettierrc` present)
- Developers follow existing style manually

## Import Organization

**Order:**
1. Node.js built-ins (e.g., `fs`, `path`, `child_process`)
2. Local project files (e.g., `./core.cjs`, `./frontmatter.cjs`)

**Path Aliases:**
- None detected. Relative paths are used (e.g., `require('../get-shit-done/bin/lib/core.cjs')`).

## Error Handling

**Patterns:**
- `try/catch` blocks used extensively for file system operations.
- CLI-level error handler `error(message)` in `get-shit-done/bin/lib/core.cjs` writes to `stderr` and exits with code 1.
- `safeReadFile` style: returns `null` or a default value on failure instead of throwing.

## Logging

**Framework:**
- `output(result, raw, rawValue)` in `get-shit-done/bin/lib/core.cjs` handles all CLI output.
- Logs JSON by default, or raw values if `raw` flag is set.
- Handles large payloads by writing to temporary files.

## Comments

**When to Comment:**
- File headers describe module purpose.
- Major sections are delineated with decorative lines.

**JSDoc/TSDoc:**
- Minimal usage. Header comments use a block format:
  ```javascript
  /**
   * Module Name — Brief Description
   */
  ```

## Function Design

**Size:**
- Moderate to large. Functions handle logical units of CLI commands (e.g., `cmdPhasesList` is ~60 lines).

**Parameters:**
- CLI handlers typically take `(cwd, options, raw)` or `(cwd, arg1, arg2, ..., raw)`.

**Return Values:**
- Most functions use `output()` to send data back to the caller and exit.
- Internal functions return objects or primitive values.

## Module Design

**Exports:**
- CommonJS `module.exports` object at the end of the file (e.g., `get-shit-done/bin/lib/core.cjs`).

**Barrel Files:**
- None detected. Files import directly from specific modules.

---

*Convention analysis: 2025-02-27*
