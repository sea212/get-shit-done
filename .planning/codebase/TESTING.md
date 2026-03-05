# Testing Patterns

**Analysis Date:** 2025-03-05

## Test Framework

**Runner:**
- Node.js Built-in Test Runner (`node --test`)
- Triggered by `node scripts/run-tests.cjs`

**Assertion Library:**
- Node.js Built-in `node:assert`

**Run Commands:**
```bash
npm test                      # Run all tests using scripts/run-tests.cjs
npm run test:coverage         # Run tests with c8 coverage tracking
```

## Test File Organization

**Location:**
- Separate `tests/` directory (e.g., `tests/core.test.cjs`).

**Naming:**
- `[name].test.cjs` - Matches source file being tested.

**Structure:**
```
tests/
├── core.test.cjs
├── commands.test.cjs
├── ...
└── helpers.cjs
```

## Test Structure

**Suite Organization:**
```typescript
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');

describe('moduleName', () => {
  let tmpDir;

  beforeEach(() => {
    // Setup (often involving temp directories for filesystem tests)
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-test-'));
  });

  afterEach(() => {
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('should perform specific behavior', () => {
    // Act & Assert
    const result = someFunction(tmpDir);
    assert.strictEqual(result, expectedValue);
  });
});
```

**Patterns:**
- [Setup]: Frequent use of `fs.mkdtempSync` for isolated filesystem tests.
- [Teardown]: Use `fs.rmSync` or `process.chdir()` back to original CWD.
- [Assertion]: Use `assert.strictEqual` for primitives, `assert.deepStrictEqual` for objects/arrays.

## Mocking

**Framework:** Minimal use of external mocking libraries.

**Patterns:**
- No explicit mock library (like sinon) is used; mocks are often implemented as simple local functions or by providing a temporary filesystem for IO operations.
- `execGit` or other process-calling functions are sometimes overridden if necessary, but usually, tests run against a real (but temporary) git repo.

**What to Mock:**
- Network requests (e.g., Brave search API).
- Large or dangerous system-level calls.

**What NOT to Mock:**
- Filesystem operations (prefer temporary directories in `/tmp`).
- Git operations (prefer temporary `git init` repos).

## Fixtures and Factories

**Test Data:**
- Hand-written in `beforeEach` or within tests.
- Uses `fs.writeFileSync` to create necessary file structures (e.g., `.planning/ROADMAP.md`).

**Location:**
- Inline within test files or in `tests/helpers.cjs` if shared.

## Coverage

**Requirements:**
- Minimum 70% line coverage is enforced via `c8` in `package.json`.

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Majority of tests in `tests/*.test.cjs` are unit tests for individual functions in `core.cjs`, `commands.cjs`, etc.

**Integration Tests:**
- Tests that verify CLI command logic across multiple files or involving the filesystem are considered integration tests.

**E2E Tests:**
- Not explicitly labeled as E2E, but tests involving `git` operations in temp directories act as E2E tests for GSD's git integration.

## Common Patterns

**Async Testing:**
- Use `async` test functions when testing `fetch` or other promise-returning operations.
```javascript
test('async behavior', async () => {
  const result = await asyncFn();
  assert.ok(result);
});
```

**Error Testing:**
- Use `assert.throws` or check return values from `try...catch` blocks.
```javascript
test('invalid input should throw', () => {
  assert.throws(() => {
    invalidFn();
  }, /Error message pattern/);
});
```

---

*Testing analysis: 2025-03-05*
