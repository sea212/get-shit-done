const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { resolveModelInternal, _resetSyncFlag } = require('../get-shit-done/bin/lib/core.cjs');

describe('Task 1: Explicit null mappings', () => {
  let tmpDir;
  let originalEnv;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-task1-test-'));
    fs.mkdirSync(path.join(tmpDir, '.planning'), { recursive: true });
    originalEnv = process.env.GEMINI_CLI;
    process.env.GEMINI_CLI = '1';
    _resetSyncFlag();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalEnv === undefined) delete process.env.GEMINI_CLI;
    else process.env.GEMINI_CLI = originalEnv;
  });

  function writeConfig(obj) {
    fs.writeFileSync(
      path.join(tmpDir, '.planning', 'config.json'),
      JSON.stringify(obj, null, 2)
    );
  }

  test('explicit null mapping triggers warning and flash model', () => {
    writeConfig({
      gemini: {
        mappings: {
          opus: null
        }
      }
    });

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('Missing/invalid mapping for tier: opus')) {
        warningEmitted = true;
      }
    };

    try {
      const result = resolveModelInternal(tmpDir, 'gsd-planner'); // gsd-planner uses opus by default
      assert.strictEqual(result, 'gemini-3-flash-latest', 'should fall back to flash model');
      assert.strictEqual(warningEmitted, true, 'should emit warning for null mapping');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('missing config.json uses default mappings without warning', () => {
    // No config file created
    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      warningEmitted = true;
    };

    try {
      const result = resolveModelInternal(tmpDir, 'gsd-planner');
      assert.strictEqual(result, 'gemini-3-pro-latest', 'should use default pro model');
      assert.strictEqual(warningEmitted, false, 'should not emit any warnings');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('incomplete mappings in config.json should fallback to defaults silently', () => {
    writeConfig({
      gemini: {
        mappings: {
          opus: 'custom-pro'
          // sonnet and haiku are missing
        }
      }
    });

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      warningEmitted = true;
    };

    try {
      // gsd-codebase-mapper (balanced) uses haiku
      const result = resolveModelInternal(tmpDir, 'gsd-codebase-mapper');
      assert.strictEqual(result, 'gemini-2.5-flash-lite-latest', 'should fall back to default haiku model');
      assert.strictEqual(warningEmitted, false, 'should NOT emit warning for missing mapping if default is available');
    } finally {
      console.warn = originalWarn;
    }
  });
});
