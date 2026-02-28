# Testing Patterns

**Analysis Date:** 2025-02-23

## Test Framework

**Runner:**
- Node.js built-in test runner (`node:test`).
- Config: Executed directly via npm scripts without external configuration files.

**Assertion Library:**
- Node.js built-in assert module (`node:assert`).
- Matchers: `assert.strictEqual`, `assert.deepStrictEqual`, `assert.ok`.

**Run Commands:**
```bash
npm test                              # Run all tests
npm run test:coverage                 # Coverage report using c8
```

## Test File Organization

**Location:**
- Tests are located in a dedicated `tests/` directory at the project root.

**Naming:**
- `[module].test.cjs` (e.g., `core.test.cjs`, `config.test.cjs`).

**Structure:**
```
tests/
  core.test.cjs
  config.test.cjs
  init.test.cjs
  helpers.cjs
```

## Test Structure

**Suite Organization:**
```javascript
const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

describe('moduleName', () => {
  describe('functionName', () => {
    let tmpDir;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-test-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    test('should do expected behavior', () => {
      // test logic
      assert.strictEqual(actual, expected);
    });
  });
});
```

**Patterns:**
- `describe` blocks group tests by function or module.
- `beforeEach` and `afterEach` hooks are extensively used to scaffold and teardown isolated temporary directories.
- Tests often explicitly document regression testing (e.g., adding `(REG-01)` to test names).

## Mocking

**Framework:**
- Minimal external mocking. Node.js `fs` and `child_process` are tested by working with actual temporary filesystem environments instead of virtual mocks.

**Patterns:**
```javascript
let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-core-test-'));
  fs.mkdirSync(path.join(tmpDir, '.planning'), { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});
```

**What to Mock:**
- File system scenarios are mocked manually by building temporary directories (`fs.mkdtempSync`) and writing dummy configurations, markdown files, and phase directories.

**What NOT to Mock:**
- Pure internal utility functions are tested natively.

## Fixtures and Factories

**Test Data:**
- Minimal standalone fixture files.
- Test data (like `config.json` or `ROADMAP.md` contents) is written dynamically during the test setup or within the test itself using helper functions.

**Location:**
- Inline helper functions like `writeConfig(obj)` are declared directly within test suites.

## Coverage

**Requirements:**
- 70% line coverage is enforced via CI/CD.

**Configuration:**
- Uses the `c8` tool.
- Includes: `get-shit-done/bin/lib/*.cjs`.
- Excludes: `tests/**`.

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Fast, isolated testing of core logic functions (`tests/core.test.cjs`) using dynamic files.

**Integration Tests:**
- Many tests cover higher-level integration involving file parsing, path resolution, and configuration defaults (e.g., `tests/commands.test.cjs`).

## Common Patterns

**Error and Default Fallback Testing:**
Tests explicitly check safe fallback scenarios where files are missing or malformed.
```javascript
test('returns defaults when config.json is missing', () => {
  const config = loadConfig(tmpDir);
  assert.strictEqual(config.model_profile, 'balanced');
});

test('returns defaults when config.json contains invalid JSON', () => {
  fs.writeFileSync(path.join(tmpDir, '.planning', 'config.json'), 'not valid json {{{{');
  const config = loadConfig(tmpDir);
  assert.strictEqual(config.commit_docs, true);
});
```