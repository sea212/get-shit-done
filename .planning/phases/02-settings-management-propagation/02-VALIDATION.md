# Phase 02 Validation Plan: Settings Management & Propagation

## Overview
This document outlines the validation strategy for Phase 02, ensuring that model settings propagation to `.gemini/settings.json` is reliable, safe, and follows the "Lazy on Gemini Use" principle.

## Requirements Coverage

| ID | Requirement | Validation Method |
|----|-------------|-------------------|
| GEM-03-01 | Create `.gemini/settings.json` if missing | Unit Test (tests/core.test.cjs) |
| GEM-03-02 | Maintain `modelConfigs.overrides` section | Unit Test (tests/core.test.cjs) |
| GEM-03-03 | Merge without overwriting user settings | Unit Test (tests/core.test.cjs) |
| GEM-05-01 | Update settings with agent mappings | Unit Test (tests/core.test.cjs) |
| GEM-05-02 | Map Claude-tier models to Gemini | Unit Test (tests/core.test.cjs) |

## Automated Tests

### Unit Tests
The core logic for synchronization resides in `get-shit-done/bin/lib/core.cjs`. Tests are implemented in `tests/core.test.cjs`.

**Command:** `node tests/core.test.cjs`

**Key Scenarios:**
- **Initial Setup:** Verify `.gemini/settings.json` is created with correct defaults when absent.
- **Merge Integrity:** Verify existing non-GSD overrides are preserved while GSD overrides are updated.
- **Atomic Writes:** Verify that the file is not corrupted during the write process (simulated via file checks).
- **Environment Gating:** Verify no sync occurs when `GEMINI_CLI !== '1'`.
- **Lazy Trigger:** Verify `syncGeminiSettings` is called exactly once per process when models are resolved.
- **Model Mapping:** Verify that Claude-tier aliases in GSD are correctly translated to Gemini model names in the settings file.

## Manual Verification (UAT)
After automated tests pass, the following manual steps should be performed:

1. **Gated Propagation:**
   - Run a GSD command (e.g., `/gsd:help`) without `GEMINI_CLI=1`.
   - **Expected:** `.gemini/settings.json` is NOT created or modified.
2. **Lazy Propagation:**
   - Run `GEMINI_CLI=1 /gsd:help`.
   - **Expected:** `.gemini/settings.json` IS created/updated.
3. **User Preservation:**
   - Manually add a custom override to `.gemini/settings.json` with a scope like `my-custom-tool`.
   - Run `GEMINI_CLI=1 /gsd:help`.
   - **Expected:** `my-custom-tool` override remains in the file.

## Success Criteria
- [ ] All unit tests in `tests/core.test.cjs` pass.
- [ ] `.gemini/settings.json` consistently reflects the active GSD model profile.
- [ ] No recursive loops occur during model resolution.
- [ ] User-defined settings are never lost.
