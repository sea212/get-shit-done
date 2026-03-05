---
plan: 03-02
status: completed
updated: 2026-03-05
---

# Plan 03-02 Summary: Update Installer to Register Sync Hook

Updated the GSD installer to automatically register `gsd-gemini-sync.js` as a `SessionStart` hook when installing for the Gemini runtime. This ensures the synchronization hook is executed by the Gemini CLI without requiring manual user setup.

## Key Changes
- Updated `bin/install.js` to include `gsd-gemini-sync.js` in the `gsdHooks` array for cleanup.
- Updated `uninstall` logic in `bin/install.js` to filter out `gsd-gemini-sync` from `SessionStart` hooks.
- Updated `install` logic in `bin/install.js` to register `gsd-gemini-sync.js` as a `SessionStart` hook when `runtime === 'gemini'`.
- Added logic to prevent duplicate hook registration.

## Key Files Modified
- `bin/install.js`

## Self-Check: PASSED
- [x] Installer correctly registers the hook under `SessionStart`.
- [x] Installer cleans up the hook properly on uninstall.
- [x] Hook registration is only performed when targeting the Gemini runtime.
