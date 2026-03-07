---
phase: 03-lifecycle-hooks-sync
plan: 04
subsystem: "Gemini CLI Integration"
tags: ["settings", "sync", "hooks", "gap-closure"]
dependency_graph:
  requires: ["GEM-04-01", "GEM-04-02"]
  provides: ["GEM-04-02", "GEM-04-03", "GEM-07-02"]
  affects: ["get-shit-done/bin/lib/core.cjs", "hooks/gsd-gemini-sync.js"]
tech_stack:
  added: []
  patterns: ["Force-flag bypass for environment guards", "Template-based config defaults"]
key_files:
  created: []
  modified: ["get-shit-done/bin/lib/core.cjs", "hooks/gsd-gemini-sync.js"]
decisions:
  - "Use a 'force' flag in syncGeminiSettings to allow the lifecycle hook to run even if GEMINI_CLI=1 is not in its environment."
  - "Load base defaults from templates/config.json in loadConfig to ensure all required settings are populated if not overridden."
metrics:
  duration: 10m
  completed_at: "2026-03-07T10:00:00Z"
---

# Phase 03 Plan 04: Fix config synchronization and bypass guard in hook Summary

## Substantive One-liner
Ensures consistent Gemini settings synchronization by integrating template defaults and enabling a force-sync flag for the lifecycle hook.

## Accomplishments
- **Template Defaults Integration**: Updated `loadConfig` in `core.cjs` to merge settings from `templates/config.json` as the base for all configuration, providing a fallback for missing values.
- **Force Sync Flag**: Added a `force` option to `syncGeminiSettings` to bypass the `GEMINI_CLI === '1'` environment check.
- **Hook Optimization**: Updated `hooks/gsd-gemini-sync.js` to call `syncGeminiSettings` with `{ force: true }`, resolving a UAT gap where settings were not updated during CLI startup.

## Deviations from Plan
None - plan executed exactly as written.

## Self-Check: PASSED
- [x] `loadConfig` merges template settings.
- [x] `syncGeminiSettings` respects the `force` flag.
- [x] `gsd-gemini-sync.js` uses the `force` flag.
- [x] Automated verification successful.
