# Quick Task: Refactor Model Resolution Logic

Refactor `resolveModelInternal` in `get-shit-done/bin/lib/core.cjs` to use dynamic mapping for Gemini and remove hardcoded model assumptions.

## Status
- [x] Research & Planning
- [x] Implementation: `get-shit-done/bin/lib/core.cjs`
- [x] Implementation: Update tests in `tests/core.test.cjs`
- [x] Verification: Run tests

## Proposed Changes

### 1. `get-shit-done/bin/lib/core.cjs`
- Update `resolveModelInternal` to:
    - Assign `resolved` model directly from overrides or profiles (without mapping to `inherit` first).
    - If in Gemini environment:
        - Return if name contains "gemini".
        - Otherwise, search for `DEFAULT_GEMINI_MAPPINGS` keys in `resolved` name and return mapped value.
        - Throw error if no mapping found.
    - If NOT in Gemini environment, map `opus` tier to `inherit` for backwards compatibility/GSD standards.

### 2. `tests/core.test.cjs`
- Update existing tests to reflect new logic.
- Add test cases for:
    - Model already containing "gemini".
    - Error when no mapping found in Gemini environment.
    - Ensuring mapping works based on containment of keys.
