# Coding Conventions

**Analysis Date:** 2025-03-05

## Naming Patterns

**Files:**
- [CommonJS Modules]: `[module].cjs` - Primary logic files (e.g., `get-shit-done/bin/lib/core.cjs`).
- [Test Files]: `[module].test.cjs` - Test files in the `tests/` directory (e.g., `tests/core.test.cjs`).
- [CLI Hooks]: `gsd-[name].js` - Integration hooks (e.g., `hooks/gsd-statusline.js`).

**Functions:**
- [Standard Functions]: `camelCase` (e.g., `loadConfig`, `resolveModelInternal`).
- [Command Functions]: `cmd[Name]` (e.g., `cmdGenerateSlug`, `cmdListTodos`).

**Variables:**
- [Local Variables]: `camelCase`.
- [Constants]: `UPPER_CASE` for configuration-like objects or tables (e.g., `MODEL_PROFILES`, `GSD_CODEX_MARKER`).

**Types:**
- Not explicitly typed (plain JavaScript/CommonJS).

## Code Style

**Formatting:**
- [Manual]: 2-space indentation, consistent semicolon usage for statements.
- [Cross-Platform]: Use `toPosixPath` to normalize paths with forward slashes for AI tool compatibility.

**Linting:**
- Not explicitly configured via ESLint/Prettier in the codebase, but consistent internal style is observed.

## Import Organization

**Order:**
1. [Built-in Modules]: `fs`, `path`, `os`, `child_process`.
2. [Project Utilities]: `require('./core.cjs')`, `require('./frontmatter.cjs')`.
3. [Package Manifest]: `require('../package.json')`.

**Path Aliases:**
- No path aliases are used. Use relative paths with `require`.

## Error Handling

**Patterns:**
- [Core Utilities]: Use `try...catch` for file operations, returning `null` or defaults on failure (e.g., `safeReadFile`).
- [CLI Commands]: Use helper functions like `error(message)` to print to `stderr` and `process.exit(1)` (defined in `get-shit-done/bin/lib/core.cjs`).
- [Success Exit]: Use `output(result, raw, rawValue)` to print results and `process.exit(0)`.

## Logging

**Framework:** `process.stdout.write` and `process.stderr.write`.

**Patterns:**
- Use `output()` for JSON or raw string results intended for AI tools or users.
- Use `error()` for failure messages and early termination.

## Comments

**When to Comment:**
- [Section Dividers]: Use `// ─── [Section] ───` to organize large files by purpose (e.g., `// ─── Git utilities ───`).
- [File Header]: Brief description at the top of the file.

**JSDoc/TSDoc:**
- Used for some key functions to describe purpose and parameters (e.g., `/** Normalize a relative path... */`).

## Function Design

**Size:** Functions are typically kept concise, though installer logic in `bin/install.js` is quite large due to cross-runtime support.

**Parameters:** Use object destructuring for optional parameters (e.g., `cmdScaffold(cwd, type, options, raw)`).

**Return Values:** Prefer returning objects for structured data or `null`/`false` for failure in utility functions.

## Module Design

**Exports:**
- Use `module.exports = { ... }` at the bottom of the file to export multiple functions.

**Barrel Files:**
- Not used; modules import directly from specific `.cjs` files.

---

*Convention analysis: 2025-03-05*
