# Testing Patterns

**Analysis Date:** 2025-02-27

## Test Framework

**Runner:**
- Node.js built-in test runner (`node --test`)
- Config: None (command-line based)

**Assertion Library:**
- `node:assert` (e.g., `assert.strictEqual`, `assert.deepStrictEqual`)

**Run Commands:**
```bash
npm test                      # Run all tests using node --test tests/*.test.cjs
npm run test:coverage         # Run with coverage using c8
```

## Test File Organization

**Location:**
- Separate directory: `tests/` at the project root.

**Naming:**
- `[module].test.cjs` (e.g., `tests/core.test.cjs`, `tests/phase.test.cjs`)

**Structure:**
```
tests/
├── commands.test.cjs
├── config.test.cjs
├── core.test.cjs
├── dispatcher.test.cjs
├── frontmatter-cli.test.cjs
├── frontmatter.test.cjs
├── helpers.cjs
├── init.test.cjs
├── milestone.test.cjs
├── phase.test.cjs
├── roadmap.test.cjs
├── state.test.cjs
├── verify-health.test.cjs
└── verify.test.cjs
```

## Test Structure

**Suite Organization:**
```javascript
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');

describe('Module Section', () => {
  beforeEach(() => {
    // Setup logic (e.g., creating temporary directories)
  });

  afterEach(() => {
    // Cleanup logic
  });

  test('should perform specific action', () => {
    // Test logic and assertions
    assert.strictEqual(actual, expected);
  });
});
```

**Patterns:**
- `beforeEach`: Common setup for file system tests. Uses `fs.mkdtempSync` for isolated test environments.
- `afterEach`: Clean up temporary directories using `fs.rmSync(tmpDir, { recursive: true, force: true })`.
- `Assertion pattern`: Strict equality (`assert.strictEqual`) and deep object comparison (`assert.deepStrictEqual`).

## Mocking

**Framework:**
- Manual mocking/stubbing (no dedicated library like Sinon or Jest mocks detected).

**Patterns:**
- Mocking the file system by redirecting operations to temporary directories created in `beforeEach`.
- Mocking global state by saving and restoring (e.g., `originalCwd = process.cwd(); ... process.chdir(tmpDir);`).

**What to Mock:**
- File system operations.
- Configuration loading.
- Git operations (some tests may mock `execSync` indirectly).

**What NOT to Mock:**
- Core logic and utility functions.

## Fixtures and Factories

**Test Data:**
- Programmatic creation of test files and configurations within `beforeEach` or specific tests.
- Example: `fs.writeFileSync(path.join(tmpDir, '.planning', 'config.json'), JSON.stringify(obj, null, 2));`

**Location:**
- Inlined within test files as helper functions (e.g., `writeConfig(obj)` in `tests/core.test.cjs`).

## Coverage

**Requirements:**
- Target: 70% line coverage (defined in `package.json`).

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Majority of tests in `tests/` focus on individual exported functions (e.g., `core.test.cjs`, `frontmatter.test.cjs`).

**Integration Tests:**
- Tests that verify command interactions with the file system (e.g., `phase.test.cjs`, `milestone.test.cjs`).

**E2E Tests:**
- Not explicitly labeled, but CLI dispatcher tests (`dispatcher.test.cjs`) may cover end-to-end command execution.

## Common Patterns

**Async Testing:**
- Standard async/await in test functions if needed, although many tests are synchronous.

**Error Testing:**
- Testing `try/catch` behavior and ensuring `null` or defaults are returned on failure (e.g., `safeReadFile` testing for missing files).

**Regression Testing:**
- Identified in comments (e.g., `REG-01`, `REG-02` in `tests/core.test.cjs`).

---

*Testing analysis: 2025-02-27*
