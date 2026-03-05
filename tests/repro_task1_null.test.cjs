const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { loadConfig, resolveModelInternal, _resetSyncFlag } = require('../get-shit-done/bin/lib/core.cjs');

describe('Task 1 Repro: gemini.mappings resolution', () => {
  let tmpDir;
  let originalCwd;
  let originalGeminiCli;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-task1-repro-'));
    fs.mkdirSync(path.join(tmpDir, '.planning'), { recursive: true });
    originalCwd = process.cwd();
    originalGeminiCli = process.env.GEMINI_CLI;
    if (typeof _resetSyncFlag === 'function') _resetSyncFlag();
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalGeminiCli === undefined) delete process.env.GEMINI_CLI;
    else process.env.GEMINI_CLI = originalGeminiCli;
  });

  function writeConfig(obj) {
    fs.writeFileSync(
      path.join(tmpDir, '.planning', 'config.json'),
      JSON.stringify(obj, null, 2)
    );
  }

  test('Warning should not be emitted and should use default when opus mapping is explicitly null', () => {
    process.env.GEMINI_CLI = '1';
    writeConfig({ 
      gemini: { 
        mappings: { 
          opus: null
        } 
      } 
    });
    
    let warningCalled = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('Warning: Missing/invalid mapping')) {
        warningCalled = true;
      }
      originalWarn(msg);
    };

    try {
      const model = resolveModelInternal(tmpDir, 'gsd-planner');
      assert.strictEqual(model, 'gemini-3.1-pro-preview');
      assert.strictEqual(warningCalled, false, 'Should NOT have logged a warning and should have used default mapping');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Warning should not be emitted and should use default when opus mapping is empty string', () => {
    process.env.GEMINI_CLI = '1';
    writeConfig({ 
      gemini: { 
        mappings: { 
          opus: ""
        } 
      } 
    });
    
    let warningCalled = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('Warning: Missing/invalid mapping')) {
        warningCalled = true;
      }
      originalWarn(msg);
    };

    try {
      const model = resolveModelInternal(tmpDir, 'gsd-planner');
      assert.strictEqual(model, 'gemini-3.1-pro-preview');
      assert.strictEqual(warningCalled, false, 'Should NOT have logged a warning for empty string mapping');
    } finally {
      console.warn = originalWarn;
    }
  });
});
