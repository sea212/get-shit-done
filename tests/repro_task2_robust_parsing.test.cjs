const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { syncGeminiSettings } = require('../get-shit-done/bin/lib/core.cjs');

describe('Task 2: Robust settings parsing in syncGeminiSettings', () => {
  let tmpDir;
  let originalEnv;
  let geminiDir;
  let settingsPath;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsd-task2-test-'));
    geminiDir = path.join(tmpDir, '.gemini');
    settingsPath = path.join(geminiDir, 'settings.json');
    fs.mkdirSync(path.join(tmpDir, '.planning'), { recursive: true });
    originalEnv = process.env.GEMINI_CLI;
    process.env.GEMINI_CLI = '1';
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalEnv === undefined) delete process.env.GEMINI_CLI;
    else process.env.GEMINI_CLI = originalEnv;
  });

  test('Empty .gemini/settings.json is handled silently without parse warnings', () => {
    fs.mkdirSync(geminiDir, { recursive: true });
    fs.writeFileSync(settingsPath, '', 'utf-8');

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      warningEmitted = true;
    };

    try {
      syncGeminiSettings(tmpDir);
      assert.strictEqual(warningEmitted, false, 'should not emit warning for empty file');
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      assert.ok(settings.modelConfigs.overrides.length > 0, 'should have initialized settings');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Whitespace-only .gemini/settings.json is handled silently without parse warnings', () => {
    fs.mkdirSync(geminiDir, { recursive: true });
    fs.writeFileSync(settingsPath, '   \n   ', 'utf-8');

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      warningEmitted = true;
    };

    try {
      syncGeminiSettings(tmpDir);
      assert.strictEqual(warningEmitted, false, 'should not emit warning for whitespace-only file');
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      assert.ok(settings.modelConfigs.overrides.length > 0, 'should have initialized settings');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Invalid JSON in .gemini/settings.json is backed up and reset with a warning', () => {
    fs.mkdirSync(geminiDir, { recursive: true });
    fs.writeFileSync(settingsPath, '{ invalid json }', 'utf-8');

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('corrupt') || msg.includes('Invalid')) {
        warningEmitted = true;
      }
    };

    try {
      syncGeminiSettings(tmpDir);
      assert.strictEqual(warningEmitted, true, 'should emit warning for invalid JSON');
      
      const files = fs.readdirSync(geminiDir);
      const backupExists = files.some(f => f.startsWith('settings.json.bak-'));
      assert.strictEqual(backupExists, true, 'should have created a backup');
      
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      assert.ok(settings.modelConfigs.overrides.length > 0, 'should have reset and initialized settings');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Non-object JSON (null) is treated as corrupt and reset with a warning', () => {
    fs.mkdirSync(geminiDir, { recursive: true });
    fs.writeFileSync(settingsPath, 'null', 'utf-8');

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('corrupt') || msg.includes('Invalid')) {
        warningEmitted = true;
      }
    };

    try {
      syncGeminiSettings(tmpDir);
      assert.strictEqual(warningEmitted, true, 'should emit warning for null JSON');
      
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      assert.ok(settings !== null && typeof settings === 'object', 'should be an object');
      assert.ok(settings.modelConfigs.overrides.length > 0, 'should have reset and initialized settings');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Non-object JSON (number) is treated as corrupt and reset with a warning', () => {
    fs.mkdirSync(geminiDir, { recursive: true });
    fs.writeFileSync(settingsPath, '123', 'utf-8');

    let warningEmitted = false;
    const originalWarn = console.warn;
    console.warn = (msg) => {
      if (msg.includes('corrupt') || msg.includes('Invalid')) {
        warningEmitted = true;
      }
    };

    try {
      syncGeminiSettings(tmpDir);
      assert.strictEqual(warningEmitted, true, 'should emit warning for numeric JSON');
      
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      assert.strictEqual(typeof settings, 'object', 'should be an object');
    } finally {
      console.warn = originalWarn;
    }
  });
});
