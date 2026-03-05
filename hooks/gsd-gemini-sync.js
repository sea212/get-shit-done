#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { syncGeminiSettings } = require('../get-shit-done/bin/lib/core.cjs');

// Read JSON from stdin
let input = '';
// Timeout guard: if stdin doesn't close within 3000ms, exit silently instead of hanging.
const stdinTimeout = setTimeout(() => process.exit(0), 3000);

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    let cwd = process.cwd();
    if (input.trim()) {
      try {
        const data = JSON.parse(input);
        if (data.workspace && data.workspace.current_dir) {
          cwd = data.workspace.current_dir;
        }
      } catch (parseError) {
        // Fall back to process.cwd() if parsing fails
      }
    }

    // Synchronize GSD settings to .gemini/settings.json
    syncGeminiSettings(cwd);

    // Protocol response
    console.log(JSON.stringify({ status: "ok" }));
  } catch (error) {
    // Log error to stderr and exit with 0 (non-fatal error, do not block CLI startup)
    // Do not pollute stdout as it breaks the CLI's JSON parser.
    console.error(`GSD Gemini Sync Hook Error: ${error.message}`);
    process.exit(0);
  }
});
