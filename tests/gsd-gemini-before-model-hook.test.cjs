const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const HOOK_PATH = path.resolve(__dirname, '../hooks/gsd-gemini-before-model.js');

test('BeforeModel Hook: parses JSON and injects model', (t) => {
  const input = JSON.stringify({
    llm_request: {
      config: {
        overrideScope: 'gsd-planner'
      },
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
  assert.ok(output.hookSpecificOutput, 'Output should have hookSpecificOutput');
  assert.ok(output.hookSpecificOutput.llm_request, 'Output should have llm_request');
  assert.ok(output.hookSpecificOutput.llm_request.model.includes('gemini'), 'Model should be mapped to gemini');
});

test('BeforeModel Hook: handles missing cwd gracefully', (t) => {
  const input = JSON.stringify({
    llm_request: {
      config: {
        overrideScope: 'gsd-executor'
      }
    }
  });

  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8',
    env: { ...process.env, GEMINI_CLI: '1' }
  });

  assert.strictEqual(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.ok(output.hookSpecificOutput.llm_request.model, 'Model should be resolved');
});

test('BeforeModel Hook: fails safe on malformed JSON', (t) => {
  const input = 'not-json';

  const result = spawnSync('node', [HOOK_PATH], {
    input,
    encoding: 'utf-8'
  });

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
