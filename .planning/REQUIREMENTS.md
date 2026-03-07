# Requirements: Gemini Model Integration

## v1 Requirements

### GEM-01: Model Tier Mapping
- [x] **GEM-01-01**: Map "opus" to "gemini-3.1-pro-preview" (or configurable stable version).
- [x] **GEM-01-02**: Map "sonnet" to "gemini-3-flash-preview" (or configurable stable version).
- [x] **GEM-01-03**: Map "haiku" to "gemini-2.5-flash-lite" (or configurable stable version).

### GEM-02: Environment Detection
- [x] **GEM-02-01**: Detect if `GEMINI_CLI=1` is set in the environment.
- [x] **GEM-02-02**: If `GEMINI_CLI=1`, default model resolution must prioritize Gemini mappings.

### GEM-03: Settings Management
- [ ] **GEM-03-01**: Automatically create `.gemini/settings.json` in the project root if it doesn't exist.
- [ ] **GEM-03-02**: Maintain a `modelConfigs.overrides` section in `.gemini/settings.json`.
- [ ] **GEM-03-03**: Ensure settings are merged correctly without overwriting user-defined non-GSD settings.

### GEM-04: Startup Synchronization (Hooks)
- [ ] **GEM-04-01**: Implement a `hooks/gsd-gemini-sync.js` script to handle Gemini CLI lifecycle events.
- [x] **GEM-04-02**: The hook must trigger a synchronization of GSD model profiles to `.gemini/settings.json`.
- [x] **GEM-04-03**: The hook must follow the Gemini CLI JSON protocol (stdin/stdout).

### GEM-05: Override Propagation
- [ ] **GEM-05-01**: Whenever a GSD agent's model is overridden (e.g., via `/gsd:set-profile` or `.planning/config.json`), update `.gemini/settings.json`.
- [ ] **GEM-05-02**: Map Claude-tier overrides to Gemini models during propagation.

### GEM-06: Custom Mapping Support
- [x] **GEM-06-01**: Allow users to define custom Opus/Sonnet/Haiku to Gemini model mappings in `.planning/config.json`.

### GEM-07: Safety & Reliability
- [x] **GEM-07-01**: Set Gemini safety settings to `BLOCK_NONE` by default for development agents to prevent false positive refusals.
- [x] **GEM-07-02**: Provide clear error messages if model mapping fails or `.gemini/settings.json` is unreadable.

## v2 Requirements (Deferred)
- [ ] **GEM-08**: Intelligent rate-limit handling and backoff for Gemini Free Tier (2 RPM).
- [ ] **GEM-09**: Automatic context caching optimization using Gemini-specific prefix stability.

## Out of Scope
- [ ] Support for Vertex AI vs AI Studio selection (start with AI Studio/API Key).
- [ ] Implementation of a full MCP server (out of scope for model profile sync).

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GEM-01-01 | Phase 1 | Completed |
| GEM-01-02 | Phase 1 | Completed |
| GEM-01-03 | Phase 1 | Completed |
| GEM-02-01 | Phase 1 | Completed |
| GEM-02-02 | Phase 1 | Completed |
| GEM-03-01 | Phase 2 | Pending |
| GEM-03-02 | Phase 2 | Pending |
| GEM-03-03 | Phase 2 | Pending |
| GEM-04-01 | Phase 3 | Pending |
| GEM-04-02 | Phase 3 | Complete |
| GEM-04-03 | Phase 3 | Complete |
| GEM-05-01 | Phase 2 | Pending |
| GEM-05-02 | Phase 2 | Pending |
| GEM-06-01 | Phase 1 | Completed |
| GEM-07-01 | Phase 1 | Completed |
| GEM-07-02 | Phase 1/3 | Partial |

---
*Last updated: 2026-03-05*
