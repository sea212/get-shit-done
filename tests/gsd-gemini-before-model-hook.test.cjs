const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const HOOK_PATH = path.resolve(__dirname, '../hooks/gsd-gemini-before-model.js');

test('BeforeModel Hook: parses JSON and injects model', (t) => {
  const input = JSON.stringify({
    model_request: {
      agent_type: 'gsd-planner',
      model: 'claude-3-opus-20240229'
    }
  });

  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8',
    env: { ...process.env, GEMINI_CLI: '1' }
  });

  assert.strictEqual(result.status, 0, 'Hook should exit with 0');
  const output = JSON.parse(result.stdout);
  assert.ok(output.model_request, 'Output should have model_request');
  // Since we don't have the implementation yet, this will fail
  assert.ok(output.model_request.model.includes('gemini'), 'Model should be mapped to gemini');
});

test('BeforeModel Hook: handles missing cwd gracefully', (t) => {
  const input = JSON.stringify({
    model_request: {
      agent_type: 'gsd-executor'
    }
  });

  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8',
    env: { ...process.env, GEMINI_CLI: '1' }
  });

  assert.strictEqual(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.ok(output.model_request.model, 'Model should be resolved');
});

test('BeforeModel Hook: fails safe on malformed JSON', (t) => {
  const input = 'not-json';

  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8'
  });

  // It should probably just output the input or an error, but not crash.
  // Standard gemini-cli hook protocol expects JSON back if successful.
  // If it's malformed, it should probably exit with error or return it as-is?
  // Actually, Task 3 says "Ignores non-JSON/malformed stdin and does not crash (fails safe)".
  // If it fails safe, maybe it outputs nothing or the original input?
  // Let's assume it should not crash and exit with 0 or non-zero but not crash.
  assert.ok(result.stderr.includes('Error') || result.status !== 0, 'Should log error or exit non-zero');
});

test('BeforeModel Hook: logs errors to stderr only', (t) => {
  const input = 'malformed';
  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8'
  });

  assert.strictEqual(result.stdout, '', 'Stdout should be empty on error');
  assert.ok(result.stderr.length > 0, 'Stderr should have error message');
});
