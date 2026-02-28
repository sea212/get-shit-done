# Coding Conventions

**Analysis Date:** 2025-02-23

## Naming Patterns

**Files:**
- kebab-case for tool files (e.g., `get-shit-done/bin/gsd-tools.cjs`)
- kebab-case for library and hook files (e.g., `get-shit-done/bin/lib/core.cjs`, `hooks/gsd-check-update.js`)
- `*.test.cjs` for test files (e.g., `tests/core.test.cjs`)

**Functions:**
- camelCase for all functions (e.g., `loadConfig`, `generateSlugInternal`)
- `cmd[CommandName]` prefix for CLI command handler functions (e.g., `cmdStateJson`, `cmdCommit`)

**Variables:**
- camelCase for variables (e.g., `rawIndex`, `tmpDir`)
- UPPER_SNAKE_CASE for global constants (e.g., `MODEL_PROFILES`)

**Types:**
- The codebase uses plain JavaScript/CommonJS, so no TypeScript types or interfaces are used.

## Code Style

**Formatting:**
- No automated formatter (like Prettier) is explicitly configured.
- 2 space indentation.
- Single quotes for strings.
- Semicolons are required at the end of statements.

**Linting:**
- No automated linter (like ESLint) is configured in `package.json`.

## Import Organization

**Order:**
1. Built-in Node.js modules (`fs`, `path`, `child_process`, `os`)
2. Internal modules (`./lib/core.cjs`, `./lib/state.cjs`)

**Grouping:**
- `require` statements are block-grouped at the top of the file using `const`.
- No path aliases are used; relative paths are standard.

## Error Handling

**Patterns:**
- Custom `error(message)` function imported from `core.cjs` that writes to `process.stderr` and calls `process.exit(1)` for fatal errors.
- Broad use of `try/catch` blocks around file system operations.
- Operations that fail typically return `null` or a default object instead of crashing or throwing exceptions upwards.

## Logging

**Framework:**
- Custom `output(result, raw, rawValue)` and `error(message)` functions in `core.cjs` proxy to `process.stdout.write` and `process.stderr.write`.
- No external logging framework (like Pino or Winston) is used.

**Patterns:**
- Standardized output formatter checks if output exceeds 50KB to avoid buffer overflow, optionally writing to a temp file and prefixing with `@file:`.

## Comments

**When to Comment:**
- Section separators use a distinct ASCII line pattern: `// ─── Section Name ─────────────────────────────────────────────────────────────`
- Inline comments explain context, such as workarounds or optional overrides.

**JSDoc/TSDoc:**
- Top-level block comments (`/** ... */`) describe the file/module's purpose.
- Minimal JSDoc is used; parameters and return types are generally not documented formally.

## Function Design

**Size:**
- The main CLI router (`main()` in `gsd-tools.cjs`) is large, handling deep switch/case routing.
- Library utility functions are typically small and strictly focused.

**Parameters:**
- `cwd` (Current Working Directory) is a ubiquitous first parameter for functions interacting with the file system.
- A `raw` boolean flag is passed through most command functions to govern whether output should be formatted as JSON or raw strings.

**Return Values:**
- Most CLI functions do not return values but exit via the `output()` helper.
- Internal helper utilities explicitly return data, commonly falling back to defaults via `try/catch`.

## Module Design

**Exports:**
- Standard CommonJS `module.exports = { ... }` block at the bottom of library files.
- Command-line entry points run immediately by invoking `main();` at the bottom of the script.